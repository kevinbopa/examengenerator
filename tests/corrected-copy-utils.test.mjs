import assert from "node:assert/strict";
import test from "node:test";

import { examBlueprint } from "../src/data/examData.js";
import {
  buildCorrectedCopyView,
  normalizeCorrectedCopyPayload
} from "../src/utils/correctedCopy.js";

test("normalizeCorrectedCopyPayload keeps only answered written questions in exam order", () => {
  const answersById = {
    "semi-2": "Reponse deux",
    "semi-1": "Reponse un",
    "qcm-1": 1,
    "dev-1": "Reponse dev"
  };

  const normalized = normalizeCorrectedCopyPayload(examBlueprint, answersById, {
    summary: "Resume IA",
    entries: [
      {
        questionId: "dev-1",
        topic: "Sujet faux",
        original: "Texte invente",
        corrected: "Texte corrige dev",
        note: "Note dev"
      },
      {
        questionId: "qcm-1",
        topic: "QCM",
        original: "Doit disparaitre",
        corrected: "Doit disparaitre",
        note: "Ne doit pas exister"
      },
      {
        questionId: "semi-1",
        topic: "Sujet semi 1",
        original: "Autre texte",
        corrected: "Texte corrige semi 1",
        note: "Note semi 1"
      }
    ]
  });

  assert.equal(normalized.summary, "Resume IA");
  assert.deepEqual(
    normalized.entries.map((entry) => entry.questionId),
    ["semi-1", "semi-2", "dev-1"]
  );
  assert.equal(normalized.entries[0].original, "Reponse un");
  assert.equal(normalized.entries[1].original, "Reponse deux");
  assert.equal(normalized.entries[2].original, "Reponse dev");
});

test("normalizeCorrectedCopyPayload falls back to original text and default note when corrected text is missing", () => {
  const answersById = {
    "semi-3": "Texte avec fautes"
  };

  const normalized = normalizeCorrectedCopyPayload(examBlueprint, answersById, {
    summary: "",
    entries: [
      {
        questionId: "semi-3",
        topic: "",
        original: "",
        corrected: "   ",
        note: ""
      }
    ]
  });

  assert.match(normalized.summary, /copie corrigee/i);
  assert.equal(normalized.entries.length, 1);
  assert.equal(normalized.entries[0].original, "Texte avec fautes");
  assert.equal(normalized.entries[0].corrected, "Texte avec fautes");
  assert.ok(normalized.entries[0].note.length > 0);
  assert.ok(normalized.entries[0].prompt.length > 0);
});

test("buildCorrectedCopyView exposes a clear and ordered UI model", () => {
  const view = buildCorrectedCopyView({
    summary: "Resume de correction",
    entries: [
      {
        questionId: "semi-1",
        sectionLabel: "Semi-developpement",
        topic: "Principe agile",
        prompt: "Explique le principe agile",
        original: "Texte brut",
        corrected: "Texte corrige",
        note: "Accords corriges"
      }
    ]
  });

  assert.equal(view.hasEntries, true);
  assert.equal(view.entryCount, 1);
  assert.equal(view.entries[0].sectionLabel, "Semi-developpement");
  assert.equal(view.entries[0].formBadge, "Forme corrigee");
  assert.equal(view.entries[0].meaningBadge, "Fond preserve");
});
