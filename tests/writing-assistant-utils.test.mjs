import assert from "node:assert/strict";
import test from "node:test";

import {
  applySuggestionToText,
  buildSuggestionId,
  getNonOverlappingSuggestions,
  mergeSuggestionRewrite,
  pruneIgnoredIds
} from "../src/utils/writingAssistant.js";

test("buildSuggestionId creates a stable position-based identifier", () => {
  const id = buildSuggestionId({
    startIndex: 5,
    endIndex: 12,
    type: "grammaire"
  }, 2);

  assert.equal(id, "5-12-grammaire-2");
});

test("getNonOverlappingSuggestions removes invalid and overlapping ranges", () => {
  const filtered = getNonOverlappingSuggestions([
    { id: "a", startIndex: 2, endIndex: 8 },
    { id: "b", startIndex: 4, endIndex: 10 },
    { id: "c", startIndex: -1, endIndex: 3 },
    { id: "d", startIndex: 12, endIndex: 17 }
  ]);

  assert.deepEqual(
    filtered.map((suggestion) => suggestion.id),
    ["a", "d"]
  );
});

test("pruneIgnoredIds keeps only ids still present in the next suggestions", () => {
  const ignoredIds = ["keep", "drop"];
  const nextSuggestions = [{ id: "keep" }, { id: "new" }];

  assert.deepEqual(pruneIgnoredIds(ignoredIds, nextSuggestions), ["keep"]);
});

test("mergeSuggestionRewrite preserves id and positions when the rewrite omits them", () => {
  const merged = mergeSuggestionRewrite(
    {
      id: "10-20-style-0",
      original: "texte fautif",
      corrected: "texte corrige",
      startIndex: 10,
      endIndex: 20,
      type: "style",
      explanation: "Initiale"
    },
    {
      original: "texte fautif",
      corrected: "texte plus clair",
      type: "clarte",
      explanation: "Nouvelle proposition"
    }
  );

  assert.equal(merged.id, "10-20-style-0");
  assert.equal(merged.startIndex, 10);
  assert.equal(merged.endIndex, 20);
  assert.equal(merged.corrected, "texte plus clair");
  assert.equal(merged.explanation, "Nouvelle proposition");
});

test("applySuggestionToText replaces the direct indexed match", () => {
  const result = applySuggestionToText("Bonjourr tout le monde", {
    original: "Bonjourr",
    corrected: "Bonjour",
    startIndex: 0,
    endIndex: 8
  });

  assert.equal(result, "Bonjour tout le monde");
});

test("applySuggestionToText falls back to the first textual match when indexes are stale", () => {
  const result = applySuggestionToText("Le clientt est present", {
    original: "clientt",
    corrected: "client",
    startIndex: 0,
    endIndex: 3
  });

  assert.equal(result, "Le client est present");
});
