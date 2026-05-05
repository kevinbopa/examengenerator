import assert from "node:assert/strict";
import test from "node:test";

import { buildPedagogicalIndex } from "../server/coursePedagogicalIndex.mjs";

test("buildPedagogicalIndex extracts source-linked concepts themes and style signals", () => {
  const index = buildPedagogicalIndex({
    title: "Processus logiciel",
    courseCode: "GLO2003",
    sources: [
      {
        id: "cours-1",
        kind: "courseDocument",
        title: "Chapitre agilite",
        status: "ready",
        cleanedText:
          "# Recits utilisateur\nLes recits utilisateur priorisent la valeur et le feedback rapide.\n\n# Iterations\nLes iterations courtes reduisent le risque et renforcent le feedback.",
        segments: [
          "Les recits utilisateur priorisent la valeur et le feedback rapide.",
          "Les iterations courtes reduisent le risque et renforcent le feedback."
        ]
      }
    ],
    pastExams: [
      {
        id: "exam-1",
        kind: "pastExam",
        title: "Intra Hiver 2025",
        status: "ready",
        cleanedText:
          "Expliquez le role du feedback rapide. Comparez agile et cycle en V. Justifiez votre reponse.",
        segments: [
          "Expliquez le role du feedback rapide.",
          "Comparez agile et cycle en V. Justifiez votre reponse."
        ]
      }
    ]
  });

  assert.equal(index.status, "ready");
  assert.ok(index.generatedAt);
  assert.ok(index.concepts.length >= 2);
  assert.ok(index.concepts.some((concept) => concept.sourceIds.includes("cours-1")));
  assert.ok(index.themes.length >= 1);
  assert.ok(index.themes[0].sourceIds.includes("cours-1"));
  assert.ok(index.styleSignals.length >= 1);
  assert.ok(index.styleSignals.some((signal) => signal.sourceIds.includes("exam-1")));
  assert.equal(index.coverage.readySourceCount, 2);
});

test("buildPedagogicalIndex returns a partial index with warnings for an incomplete course", () => {
  const index = buildPedagogicalIndex({
    title: "Processus logiciel",
    courseCode: "GLO2003",
    sources: [
      {
        id: "cours-1",
        kind: "courseDocument",
        title: "Notes minimales",
        status: "ready",
        cleanedText: "Les iterations aident a mieux organiser le travail de l equipe.",
        segments: ["Les iterations aident a mieux organiser le travail de l equipe."]
      }
    ],
    pastExams: []
  });

  assert.equal(index.status, "partial");
  assert.ok(index.concepts.length >= 1);
  assert.equal(index.styleSignals.length, 0);
  assert.ok(index.warnings.length >= 1);
});
