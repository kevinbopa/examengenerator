import assert from "node:assert/strict";
import test from "node:test";

import { examBlueprint } from "../src/data/examData.js";
import {
  buildCorrectedCopyPrompt,
  buildExamGenerationPrompt,
  buildExamEvaluationPrompt,
  buildWritingAssistantPrompt
} from "../src/utils/promptBuilders.js";

test("buildExamGenerationPrompt formalizes the severe academic generation rules", () => {
  const prompt = buildExamGenerationPrompt({
    chapterId: examBlueprint.chapter,
    sectionPlan: [{ id: "qcm", questionCount: 6 }],
    seedBank: [{ id: "qcm", title: "QCM" }],
    chapterText: "Contenu du chapitre",
    examplesText: "Questions historiques"
  });

  assert.equal(prompt.system.role, "system");
  assert.match(prompt.system.text, /professeur universitaire exigeant/i);
  assert.match(prompt.system.text, /vrai examen reel/i);
  assert.match(prompt.system.text, /severe pour pousser l'etudiant a etre excellent/i);
  assert.match(prompt.userText, /Chapitre cible/i);
  assert.match(prompt.userText, /Structure imposee/i);
  assert.match(prompt.userText, /generer un examen nouveau a chaque fois/i);
  assert.match(prompt.userText, /criteres de correction exploitables et fins/i);
});

test("buildExamEvaluationPrompt separates content and language while remaining severe", () => {
  const prompt = buildExamEvaluationPrompt({
    exam: { title: "Examen" },
    flatQuestions: [{ id: "semi-1", prompt: "Question", userAnswer: "Reponse" }],
    chapterText: "Cours",
    examplesText: "Exemples"
  });

  assert.match(prompt.system.text, /severe mais juste/i);
  assert.match(prompt.system.text, /distingues toujours le contenu et la langue/i);
  assert.match(prompt.system.text, /type Word/i);
  assert.match(prompt.userText, /Regles de notation/i);
  assert.match(prompt.userText, /separe clairement feedback de contenu et suggestions de langue/i);
});

test("buildWritingAssistantPrompt formalizes review mode constraints", () => {
  const prompt = buildWritingAssistantPrompt({
    text: "Texte a relire",
    action: "review",
    selectionText: "",
    selectionStart: undefined,
    selectionEnd: undefined
  });

  assert.match(prompt.system.text, /assistant linguistique discret/i);
  assert.match(prompt.system.text, /tu ne dois jamais ajouter de nouvelles idees/i);
  assert.match(prompt.userText, /Texte complet a analyser/i);
  assert.match(prompt.userText, /retourne au maximum 6 suggestions/i);
});

test("buildWritingAssistantPrompt adapts targeted rewrite instructions", () => {
  const prompt = buildWritingAssistantPrompt({
    text: "Texte complet",
    action: "academic",
    selectionText: "phrase a retravailler",
    selectionStart: 3,
    selectionEnd: 24
  });

  assert.match(prompt.userText, /formulation plus academique/i);
  assert.match(prompt.userText, /Passage selectionne a travailler/i);
  assert.match(prompt.userText, /retourne au maximum 6 suggestions en mode review et 1 suggestion en mode targeted/i);
});

test("buildCorrectedCopyPrompt keeps the scope on linguistic form only", () => {
  const prompt = buildCorrectedCopyPrompt({
    flatQuestions: [
      {
        id: "semi-1",
        topic: "Sujet",
        prompt: "Question",
        answer: "Reponse"
      }
    ]
  });

  assert.match(prompt.system.text, /revision linguistique/i);
  assert.match(prompt.system.text, /uniquement la langue/i);
  assert.match(prompt.system.text, /Le sens initial doit rester intact/i);
  assert.match(prompt.userText, /strictement sur la forme linguistique/i);
  assert.match(prompt.userText, /ne change pas le fond/i);
  assert.match(prompt.userText, /ne rajoute aucune idee/i);
});
