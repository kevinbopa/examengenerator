export function extractTextFromBuffer({ buffer, format }) {
  const rawText = decodeBuffer(buffer);
  const cleanedText = cleanExtractedText(rawText);
  const segments = extractSegments(cleanedText);
  const warnings = [];

  if (!cleanedText || segments.length === 0) {
    warnings.push(`Aucun texte exploitable detecte pour le format ${format}.`);
    return {
      status: "failed",
      rawText,
      cleanedText: "",
      segments: [],
      warnings
    };
  }

  if (format === "pdf" || format === "docx") {
    warnings.push(
      "Extraction MVP best-effort pour un format binaire ; un parseur specialise sera preferable."
    );
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
    .filter((segment) => segment.length >= 20);
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

function decodeBuffer(buffer) {
  const utf8Text = Buffer.from(buffer).toString("utf8");
  const visibleChars = utf8Text.replace(/\s/g, "").length;
  const mostlyPrintable = utf8Text.replace(/[ -~\n\r\tÀ-ÿ]/g, "").length < Math.max(8, visibleChars * 0.15);

  if (mostlyPrintable) {
    return utf8Text;
  }

  return Buffer.from(buffer).toString("latin1");
}
