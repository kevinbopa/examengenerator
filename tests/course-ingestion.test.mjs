import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanExtractedText,
  extractSegments,
  extractTextFromBuffer,
  summarizeCourseIngestion
} from "../server/courseIngestion.mjs";

test("cleanExtractedText normalizes noisy extracted text", () => {
  const cleaned = cleanExtractedText("  Titre\n\nContenu   important\tdu cours.  ");
  assert.equal(cleaned, "Titre\n\nContenu important du cours.");
});

test("extractSegments splits a cleaned text into usable chunks", () => {
  const segments = extractSegments(
    "Premier paragraphe utile.\nDeuxieme phrase.\n\nAutre bloc pertinent."
  );

  assert.equal(segments.length, 2);
  assert.match(segments[0], /Premier paragraphe/);
  assert.match(segments[1], /Autre bloc/);
});

test("extractTextFromBuffer extracts text for markdown and txt files", async () => {
  const result = await extractTextFromBuffer({
    buffer: Buffer.from("# Titre\nContenu du cours", "utf8"),
    format: "md"
  });

  assert.equal(result.status, "ready");
  assert.match(result.rawText, /Contenu du cours/);
  assert.ok(result.segments.length >= 1);
});

test("extractTextFromBuffer rejects corrupted binary-like content instead of exposing raw garbage", async () => {
  const result = await extractTextFromBuffer({
    buffer: Buffer.from([0, 159, 18, 255, 12, 0, 3, 4]),
    format: "pdf"
  });

  assert.equal(result.status, "failed");
  assert.ok(result.warnings.length >= 1);
  assert.equal(result.cleanedText, "");
});

test("extractTextFromBuffer rejects PDF marker garbage that should never reach generation", async () => {
  const result = await extractTextFromBuffer({
    buffer: Buffer.from("%PDF-1.4 obj endobj stream endstream xref trailer", "utf8"),
    format: "pdf"
  });

  assert.equal(result.status, "failed");
  assert.equal(result.cleanedText, "");
  assert.ok(result.warnings.some((warning) => /ignoree|exploitable/i.test(warning)));
});

test("summarizeCourseIngestion returns a compact course-level summary", () => {
  const summary = summarizeCourseIngestion({
    sources: [
      { status: "ready", segments: ["a", "b"], warnings: [] },
      { status: "failed", segments: [], warnings: ["unsupported"] }
    ],
    pastExams: [
      { status: "ready", segments: ["c"], warnings: [] }
    ]
  });

  assert.equal(summary.totalItems, 3);
  assert.equal(summary.readyItems, 2);
  assert.equal(summary.failedItems, 1);
  assert.equal(summary.totalSegments, 3);
});
