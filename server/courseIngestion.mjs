import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function extractTextFromBuffer({ buffer, format }) {
  const warnings = [];
  let rawText = "";

  try {
    if (format === "pdf") {
      rawText = await extractPdfText(buffer, warnings);
    } else if (format === "docx") {
      rawText = await extractDocxText(buffer, warnings);
    } else if (format === "doc") {
      rawText = decodeBufferBestEffort(buffer);
      warnings.push(
        "Format .doc ancien : extraction best-effort seulement. Certains caracteres peuvent etre perdus."
      );
    } else {
      rawText = decodeBufferBestEffort(buffer);
    }
  } catch (error) {
    warnings.push(`Erreur de parsing (${format}): ${error.message}`);

    if (format === "pdf" || format === "docx") {
      return failedExtraction("", warnings, format);
    }

    rawText = decodeBufferBestEffort(buffer);
  }

  const cleanedText = cleanExtractedText(rawText);

  if (!cleanedText) {
    return failedExtraction(rawText, warnings, format);
  }

  if (looksCorruptedText(cleanedText, format)) {
    warnings.push(
      `Le contenu extrait du fichier ${format} semble corrompu ou binaire. La source est ignoree pour eviter de polluer la generation.`
    );
    return failedExtraction(rawText, warnings, format);
  }

  const segments = extractSegments(cleanedText);

  if (segments.length === 0) {
    warnings.push(`Aucun texte exploitable detecte pour le format ${format}.`);
    return failedExtraction(rawText, warnings, format);
  }

  return {
    status: "ready",
    rawText,
    cleanedText,
    segments,
    warnings
  };
}

export function cleanExtractedText(text) {
  return String(text || "")
    .replace(/\u0000/g, " ")
    .replace(/\r/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export function extractSegments(cleanedText) {
  return String(cleanedText || "")
    .split(/\n\s*\n/g)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length >= 20)
    .filter((segment) => !looksCorruptedText(segment));
}

export function summarizeCourseIngestion(course) {
  const items = [...(course.sources || []), ...(course.pastExams || [])];
  return {
    totalItems: items.length,
    readyItems: items.filter((item) => item.status === "ready").length,
    failedItems: items.filter((item) => item.status === "failed").length,
    warningCount: items.reduce((total, item) => total + ((item.warnings || []).length > 0 ? 1 : 0), 0),
    totalSegments: items.reduce((total, item) => total + ((item.segments || []).length || 0), 0)
  };
}

async function extractPdfText(buffer, warnings) {
  const result = await pdfParse(Buffer.from(buffer));
  const extracted = String(result?.text || "");

  if (result?.numpages) {
    warnings.push(`PDF parse : ${result.numpages} page(s) detectee(s).`);
  }

  return extracted;
}

async function extractDocxText(buffer, warnings) {
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });

  if (result.messages?.length) {
    for (const message of result.messages) {
      warnings.push(`mammoth: ${message.message}`);
    }
  }

  return String(result.value || "");
}

function failedExtraction(rawText, warnings, format) {
  if (!warnings.some((warning) => warning.includes("Aucun texte exploitable"))) {
    warnings.push(`Aucun texte exploitable detecte pour le format ${format}.`);
  }

  return {
    status: "failed",
    rawText,
    cleanedText: "",
    segments: [],
    warnings
  };
}

function decodeBufferBestEffort(buffer) {
  const buf = Buffer.from(buffer);
  const utf8Text = buf.toString("utf8");

  if (!looksCorruptedText(utf8Text)) {
    return utf8Text;
  }

  const latin1Text = buf.toString("latin1");
  return looksCorruptedText(latin1Text) ? "" : latin1Text;
}

function looksCorruptedText(text, format = "") {
  const value = String(text || "");

  if (!value.trim()) {
    return true;
  }

  const suspiciousChars = (value.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F�]/g) || []).length;
  const printableChars = (value.match(/[A-Za-z0-9À-ÿ .,;:!?'"()\-_\n/]/g) || []).length;
  const pdfMarkers = countPdfMarkers(value);

  if (suspiciousChars > Math.max(6, printableChars * 0.08)) {
    return true;
  }

  if ((format === "pdf" || pdfMarkers >= 4) && pdfMarkers >= 4) {
    return true;
  }

  return false;
}

function countPdfMarkers(text) {
  const normalized = String(text || "").toLowerCase();
  const markers = ["%pdf", "obj", "endobj", "stream", "endstream", "xref", "trailer"];

  return markers.reduce(
    (count, marker) => count + (normalized.includes(marker) ? 1 : 0),
    0
  );
}
