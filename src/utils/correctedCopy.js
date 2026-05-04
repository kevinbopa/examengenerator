import { flattenQuestions } from "../data/examData.js";

const DEFAULT_SUMMARY =
  "Cette copie corrigee reprend les reponses redigees et ajuste uniquement la forme linguistique.";

const DEFAULT_NOTE =
  "Correction de forme uniquement : orthographe, accords, ponctuation, clarte ou formulation academique.";

export function normalizeCorrectedCopyPayload(exam, answersById, correctedCopy) {
  const answeredWrittenQuestions = flattenQuestions(exam)
    .filter((question) => question.type !== "mcq")
    .map((question) => ({
      ...question,
      originalAnswer: typeof answersById[question.id] === "string" ? answersById[question.id].trim() : ""
    }))
    .filter((question) => question.originalAnswer);

  const entryMap = new Map(
    (correctedCopy?.entries || [])
      .filter((entry) => entry?.questionId)
      .map((entry) => [entry.questionId, entry])
  );

  return {
    summary: correctedCopy?.summary?.trim() || DEFAULT_SUMMARY,
    entries: answeredWrittenQuestions.map((question) => {
      const incomingEntry = entryMap.get(question.id) || {};
      const corrected = incomingEntry.corrected?.trim() || question.originalAnswer;

      return {
        questionId: question.id,
        sectionLabel: question.sectionLabel,
        topic: question.topic,
        prompt: question.prompt,
        original: question.originalAnswer,
        corrected,
        note: incomingEntry.note?.trim() || DEFAULT_NOTE
      };
    })
  };
}

export function buildCorrectedCopyView(correctedCopy) {
  const entries = (correctedCopy?.entries || []).map((entry) => ({
    ...entry,
    formBadge: "Forme corrigee",
    meaningBadge: "Fond preserve"
  }));

  return {
    summary: correctedCopy?.summary || DEFAULT_SUMMARY,
    hasEntries: entries.length > 0,
    entryCount: entries.length,
    entries
  };
}

