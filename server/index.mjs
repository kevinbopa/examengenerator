import "dotenv/config";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import OpenAI from "openai";
import { examBlueprint, flattenQuestions } from "../src/data/examData.js";
import { gradeExam } from "../src/utils/grading.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const chapterFile = path.join(projectRoot, "H26_GLO2003_09_Agilite_XP.md");
const examplesFile = path.join(projectRoot, "examens.md");

export const app = express();
app.use(express.json({ limit: "3mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    chapter: examBlueprint.chapter
  });
});

app.post("/api/generate-exam", async (request, response) => {
  const chapterId = request.body?.chapterId || examBlueprint.chapter;

  if (!process.env.OPENAI_API_KEY) {
    response.json({
      exam: buildFallbackExam(),
      mode: "fallback",
      reason: "OPENAI_API_KEY manquante"
    });
    return;
  }

  try {
    const generatedExam = await generateExamWithAI(chapterId);
    response.json({
      exam: generatedExam,
      mode: "ai"
    });
  } catch (error) {
    console.error("AI exam generation failed:", error);
    response.json({
      exam: buildFallbackExam(),
      mode: "fallback",
      reason: "generation IA indisponible"
    });
  }
});

app.post("/api/evaluate-exam", async (request, response) => {
  const exam = request.body?.exam;
  const answersById = request.body?.answersById || {};

  if (!exam || !Array.isArray(exam.sections)) {
    response.status(400).json({
      error: "Exam invalide."
    });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.json({
      result: gradeExam(flattenQuestions(exam), answersById),
      mode: "fallback",
      reason: "OPENAI_API_KEY manquante"
    });
    return;
  }

  try {
    const aiResult = await evaluateExamWithAI(exam, answersById);
    response.json({
      result: aiResult,
      mode: "ai"
    });
  } catch (error) {
    console.error("AI exam evaluation failed:", error);
    response.json({
      result: gradeExam(flattenQuestions(exam), answersById),
      mode: "fallback",
      reason: "correction IA indisponible"
    });
  }
});

app.post("/writing-assistant/correct", async (request, response) => {
  const text = request.body?.text || "";
  const action = request.body?.action || "review";
  const selectionText = request.body?.selectionText || "";
  const selectionStart = request.body?.selectionStart;
  const selectionEnd = request.body?.selectionEnd;

  if (!text.trim()) {
    response.json({ suggestions: [] });
    return;
  }

  if ((action === "clarity" || action === "academic") && !selectionText.trim()) {
    response.json({ suggestions: [] });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.json({ suggestions: [] });
    return;
  }

  try {
    const suggestions = await runWritingAssistant({
      text,
      action,
      selectionText,
      selectionStart,
      selectionEnd
    });
    response.json({ suggestions });
  } catch (error) {
    console.error("Writing assistant failed:", error);
    response.json({ suggestions: [] });
  }
});

app.post("/api/generate-corrected-copy", async (request, response) => {
  const exam = request.body?.exam;
  const answersById = request.body?.answersById || {};

  if (!exam || !Array.isArray(exam.sections)) {
    response.status(400).json({
      error: "Exam invalide."
    });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.json({
      correctedCopy: buildFallbackCorrectedCopy(exam, answersById),
      mode: "fallback"
    });
    return;
  }

  try {
    const correctedCopy = await generateCorrectedCopyWithAI(exam, answersById);
    response.json({
      correctedCopy,
      mode: "ai"
    });
  } catch (error) {
    console.error("Corrected copy generation failed:", error);
    response.json({
      correctedCopy: buildFallbackCorrectedCopy(exam, answersById),
      mode: "fallback"
    });
  }
});

export function startServer(port = Number(process.env.EXAM_SERVER_PORT || 8787)) {
  return app.listen(port, () => {
    console.log(`Exam API listening on http://127.0.0.1:${port}`);
  });
}

function shouldAutoStartServer() {
  if (process.env.EXAM_SERVER_DISABLE_AUTOSTART === "1") {
    return false;
  }

  const currentModuleUrl = import.meta.url;
  const entryScript = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
  return currentModuleUrl === entryScript;
}

if (shouldAutoStartServer()) {
  startServer();
}

async function generateExamWithAI(chapterId) {
  const [chapterText, examplesText] = await Promise.all([
    fs.readFile(chapterFile, "utf8"),
    fs.readFile(examplesFile, "utf8")
  ]);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "Tu es un professeur universitaire exigeant en processus logiciel. Ta mission est de generer un nouvel examen complet en francais pour le chapitre Agilite et Extreme Programming. Tu dois utiliser tout le chapitre, t'inspirer fortement de la tournure et de la densite des questions de examens.md, te rapprocher le plus possible du style d'un vrai examen reel, et rester severe pour pousser l'etudiant a etre excellent. Les questions doivent etre pertinentes, nettes, academiques, parfois piegeuses mais toujours justes. Tu ne dois pas recopier mot pour mot les questions sources. Tu dois varier les angles, couvrir l'ensemble du chapitre, et estimer un temps d'examen volontairement serre mais realiste afin de stimuler une preparation serieuse."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              `Chapitre cible: ${chapterId}`,
              `Structure imposee: ${JSON.stringify(sectionGenerationPlan(), null, 2)}`,
              `Banque locale actuelle d'exemple: ${JSON.stringify(seedBankForPrompt(), null, 2)}`,
              `Exemples historiques d'enonces (examens.md):\n${examplesText}`,
              `Contenu complet du cours du chapitre:\n${chapterText}`,
              "Contraintes obligatoires :",
              "- generer un examen nouveau a chaque fois",
              "- couvrir tout le chapitre et pas seulement les notions les plus evidentes",
              "- proposer une duree totale stricte mais defendable",
              "- ecrire des model answers concis mais tres solides",
              "- fournir des criteres de correction exploitables et fins",
              "- pour les questions de code, rester directement lie au chapitre et a ses pratiques",
              "- pour les QCM, eviter les distracteurs ridicules ; chaque mauvaise reponse doit sembler plausible a un etudiant mal prepare"
            ].join("\n\n")
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "generated_exam",
        strict: true,
        schema: examSchema()
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return sanitizeGeneratedExam(parsed);
}

async function evaluateExamWithAI(exam, answersById) {
  const [chapterText, examplesText] = await Promise.all([
    fs.readFile(chapterFile, "utf8"),
    fs.readFile(examplesFile, "utf8")
  ]);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const flatQuestions = flattenQuestions(exam).map((question) => ({
    ...question,
    userAnswer:
      answersById[question.id] ?? (question.type === "mcq" ? null : "")
  }));

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "Tu es un professeur universitaire severe mais juste. Tu corriges un examen de processus logiciel sur le chapitre Agilite et XP. Ta correction doit etre humaine, nuancee, exigeante et digne d'un vrai professeur. Tu distingues toujours le contenu et la langue. Pour le contenu, tu evalues la precision, la justesse, la profondeur, la structure et la pertinence. Pour la langue, tu proposes de petites corrections de type Word : fautes, accords, formulations maladroites, ponctuation ou clarte grammaticale. Tu ne dois jamais transformer ces remarques de langue en jugement sur le contenu. Si un etudiant a une idee partiellement juste mais incomplete, tu attribues un score partiel et tu l'expliques. Tu restes plus strict qu'un correcteur indulgent : le but est de pousser l'etudiant vers l'excellence. Pour les QCM, reste strict. Pour les reponses redigees, sois nuancé mais exigeant."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Contexte de correction :",
              `Exemples de style reel d'examen (examens.md):\n${examplesText}`,
              `Contenu complet du chapitre a utiliser comme reference officielle:\n${chapterText}`,
              `Sujet de l'examen a corriger:\n${JSON.stringify(exam, null, 2)}`,
              `Copies de l'etudiant:\n${JSON.stringify(flatQuestions, null, 2)}`,
              "Regles de notation :",
              "- respecte le bareme de chaque question",
              "- sois strict sur les oublis importants",
              "- valorise les idees justes meme si elles sont maladroitement formulees",
              "- separe clairement feedback de contenu et suggestions de langue",
              "- pour les corrections de langue, donne seulement de petites suggestions localisees",
              "- produis un verdict professoral credible, pas mecanique"
            ].join("\n\n")
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "evaluated_exam",
        strict: true,
        schema: evaluationSchema(flatQuestions)
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return sanitizeEvaluation(parsed, flatQuestions);
}

async function runWritingAssistant({
  text,
  action,
  selectionText,
  selectionStart,
  selectionEnd
}) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const actionDirective =
    action === "clarity"
      ? "Tu dois uniquement proposer une reformulation plus claire du passage selectionne, sans changer les idees."
      : action === "academic"
        ? "Tu dois uniquement proposer une formulation plus academique du passage selectionne, sans ajouter d'idees."
        : "Tu dois uniquement detecter et corriger les problemes de langue dans le texte fourni.";

  const reviewTarget =
    action === "review"
      ? `Texte complet a analyser:\n${text}`
      : `Passage selectionne a travailler:\n${selectionText}\n\nTexte complet pour contexte:\n${text}`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "Tu es un assistant linguistique discret pour une plateforme d'examen. Ta mission est uniquement d'ameliorer la langue d'un texte redige par un etudiant. Tu ne dois jamais ajouter de nouvelles idees, repondre a la question a sa place, enrichir artificiellement le contenu, ou changer le fond. Tu dois conserver le sens original. Tu corriges seulement l'orthographe, la grammaire, la syntaxe, la ponctuation, la clarte et la formulation academique. Si le texte est deja correct, retourne une liste vide. Les suggestions doivent etre courtes, localisees et justifiees."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              actionDirective,
              reviewTarget,
              "Regles strictes :",
              "- ne touche jamais au fond",
              "- ne cree pas de nouvelles idees",
              "- conserve le sens original",
              "- prefere des corrections phrase par phrase",
              "- si tu proposes une reformulation, elle doit rester tres proche du texte initial",
              "- retourne au maximum 6 suggestions en mode review et 1 suggestion en mode targeted"
            ].join("\n\n")
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "writing_assistant_suggestions",
        strict: true,
        schema: writingAssistantSchema(action)
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return attachSuggestionPositions({
    text,
    selectionText,
    selectionStart,
    selectionEnd,
    suggestions: parsed.suggestions
  });
}

async function generateCorrectedCopyWithAI(exam, answersById) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const flatQuestions = flattenQuestions(exam)
    .filter((question) => question.type !== "mcq")
    .map((question) => ({
      id: question.id,
      topic: question.topic,
      prompt: question.prompt,
      answer: answersById[question.id] || ""
    }))
    .filter((question) => question.answer.trim());

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "Tu es un assistant de revision linguistique pour une plateforme d'examen. Tu dois produire une copie corrigee qui améliore uniquement la langue des reponses de l'etudiant : orthographe, accords, ponctuation, syntaxe, clarte et style academique leger. Tu ne dois jamais ajouter de nouvelles idees, enrichir le contenu, modifier le fond ou repondre a la place de l'etudiant. Le sens initial doit rester intact."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Produis une version corrigee de chaque reponse redigee, strictement sur la forme linguistique.",
              `Questions et reponses:\n${JSON.stringify(flatQuestions, null, 2)}`,
              "Contraintes :",
              "- ne change pas le fond",
              "- ne rajoute aucune idee",
              "- reste proche de la formulation de l'etudiant",
              "- donne aussi une courte note sur le type d'amelioration de langue effectue"
            ].join("\n\n")
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "corrected_copy",
        strict: true,
        schema: correctedCopySchema(flatQuestions)
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return parsed;
}

function buildFallbackExam() {
  const cloned = structuredClone(examBlueprint);
  cloned.title = `${examBlueprint.title} - Banque locale`;
  cloned.generatedBy = "fallback";
  cloned.generatedAt = new Date().toISOString();
  cloned.aiMode = false;
  cloned.timingRationale =
    "Duree locale par defaut basee sur la banque initiale. L'estimation IA n'etait pas disponible.";
  cloned.sections = cloned.sections.map((section) => ({
    ...section,
    recommendedMinutes: defaultSectionMinutes(section.id),
    questions: shuffle(section.questions)
  }));
  return cloned;
}

function buildFallbackCorrectedCopy(exam, answersById) {
  const entries = flattenQuestions(exam)
    .filter((question) => question.type !== "mcq")
    .map((question) => ({
      questionId: question.id,
      topic: question.topic,
      original: answersById[question.id] || "",
      corrected: answersById[question.id] || "",
      note:
        "Copie corrigee indisponible sans IA. Le texte original est conserve tel quel."
    }))
    .filter((entry) => entry.original.trim());

  return {
    summary:
      "Version de secours : aucune reformulation linguistique n'a pu etre generee automatiquement.",
    entries
  };
}

function seedBankForPrompt() {
  return examBlueprint.sections.map((section) => ({
    id: section.id,
    title: section.title,
    instructions: section.instructions,
    sampleQuestions: section.questions.slice(0, 2).map((question) => ({
      type: question.type,
      topic: question.topic,
      prompt: question.prompt
    }))
  }));
}

function sectionGenerationPlan() {
  return examBlueprint.sections.map((section) => ({
    id: section.id,
    label: section.label,
    title: section.title,
    accent: section.accent,
    questionCount: section.questions.length,
    recommendedMinutes: defaultSectionMinutes(section.id),
    questionType:
      section.id === "qcm"
        ? "mcq"
        : section.id === "code"
          ? "code"
          : "written",
    writtenStyle:
      section.id === "semi" ? "semi" : section.id === "dev" ? "essay" : section.id === "code" ? "code" : null
  }));
}

function sanitizeGeneratedExam(exam) {
  const sectionMeta = new Map(examBlueprint.sections.map((section) => [section.id, section]));

  return {
    title: exam.title || examBlueprint.title,
    chapter: examBlueprint.chapter,
    durationMinutes: Number(exam.durationMinutes) || examBlueprint.durationMinutes,
    timingRationale:
      exam.timingRationale ||
      "Estimation IA basee sur la densite des questions, le type de reponse attendu et un niveau d'exigence volontairement serre.",
    description: exam.description || examBlueprint.description,
    generatedBy: "openai",
    generatedAt: new Date().toISOString(),
    aiMode: true,
    sections: exam.sections.map((section) => {
      const base = sectionMeta.get(section.id);
      return {
        id: base.id,
        label: base.label,
        title: section.title || base.title,
        accent: base.accent,
        instructions: section.instructions || base.instructions,
        recommendedMinutes: Number(section.recommendedMinutes) || defaultSectionMinutes(base.id),
        questions: section.questions.map((question, index) => ({
          ...question,
          id: `${section.id}-${index + 1}-${slugify(question.topic || "question")}`,
          points: Number(question.points) || 2,
          source: question.source || "Generation IA a partir du cours et des exemples d'examens."
        }))
      };
    })
  };
}

function sanitizeEvaluation(parsed, flatQuestions) {
  const questionMap = new Map(flatQuestions.map((question) => [question.id, question]));
  const gradedQuestions = parsed.questionEvaluations.map((evaluation) => {
    const question = questionMap.get(evaluation.questionId);
    const boundedScore = Math.max(0, Math.min(question.points, Number(evaluation.score) || 0));

    return {
      ...question,
      userAnswer: question.userAnswer,
      score: boundedScore,
      maxScore: question.points,
      percentage: Math.round((boundedScore / question.points) * 100),
      isCorrect: boundedScore >= Math.ceil(question.points * 0.6),
      criterionResults:
        question.criteria?.map((criterion) => ({
          ...criterion,
          matched: (evaluation.matchedCriteriaLabels || []).includes(criterion.label)
        })) || [],
      professorFeedback: evaluation.professorFeedback,
      strengths: evaluation.strengths,
      missingElements: evaluation.missingElements,
      languageCorrections: evaluation.languageCorrections,
      languageComment: evaluation.languageComment,
      verdict: evaluation.verdict
    };
  });

  const totalScore = gradedQuestions.reduce((sum, question) => sum + question.score, 0);
  const totalPoints = gradedQuestions.reduce((sum, question) => sum + question.maxScore, 0);
  const percentage = totalPoints === 0 ? 0 : Math.round((totalScore / totalPoints) * 100);

  return {
    feedbackMode: "ai",
    gradedQuestions,
    totalScore,
    totalPoints,
    percentage,
    overallFeedback: parsed.overallFeedback
  };
}

function slugify(value) {
  return (value || "question")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function defaultSectionMinutes(sectionId) {
  if (sectionId === "qcm") return 12;
  if (sectionId === "semi") return 18;
  if (sectionId === "dev") return 24;
  return 16;
}

function attachSuggestionPositions({
  text,
  selectionText,
  selectionStart,
  selectionEnd,
  suggestions
}) {
  const cursorByOriginal = new Map();

  return (suggestions || [])
    .filter((suggestion) => suggestion.original && suggestion.corrected && suggestion.original !== suggestion.corrected)
    .map((suggestion) => {
      let startIndex = -1;
      let endIndex = -1;

      if (
        selectionText &&
        suggestion.original === selectionText &&
        Number.isInteger(selectionStart) &&
        Number.isInteger(selectionEnd)
      ) {
        startIndex = selectionStart;
        endIndex = selectionEnd;
      } else {
        const searchFrom = cursorByOriginal.get(suggestion.original) || 0;
        startIndex = text.indexOf(suggestion.original, searchFrom);
        if (startIndex === -1) {
          startIndex = text.indexOf(suggestion.original);
        }
        if (startIndex === -1) {
          const normalizedMatch = findNormalizedRange(text, suggestion.original, searchFrom);
          startIndex = normalizedMatch.startIndex;
          endIndex = normalizedMatch.endIndex;
        }
        if (startIndex !== -1 && endIndex === -1) {
          endIndex = startIndex + suggestion.original.length;
        }
        if (startIndex !== -1 && endIndex !== -1) {
          cursorByOriginal.set(suggestion.original, endIndex);
        }
      }

      if (startIndex === -1 || endIndex === -1) {
        return null;
      }

      return {
        original: suggestion.original,
        corrected: suggestion.corrected,
        type: suggestion.type,
        explanation: suggestion.explanation,
        confidence: suggestion.confidence,
        startIndex,
        endIndex
      };
    })
    .filter(Boolean);
}

function examSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["title", "description", "durationMinutes", "timingRationale", "sections"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      durationMinutes: { type: "integer" },
      timingRationale: { type: "string" },
      sections: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "title", "instructions", "recommendedMinutes", "questions"],
          properties: {
            id: {
              type: "string",
              enum: ["qcm", "semi", "dev", "code"]
            },
            title: { type: "string" },
            instructions: { type: "string" },
            recommendedMinutes: { type: "integer" },
            questions: {
              type: "array",
              items: {
                anyOf: [mcqSchema(), writtenSchema("semi"), writtenSchema("essay"), codeSchema()]
              }
            }
          }
        }
      }
    }
  };
}

function evaluationSchema(flatQuestions) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["overallFeedback", "questionEvaluations"],
    properties: {
      overallFeedback: {
        type: "object",
        additionalProperties: false,
        required: [
          "summary",
          "professorTone",
          "languageOverview",
          "improvementPriorities",
          "finalAdvice"
        ],
        properties: {
          summary: { type: "string" },
          professorTone: { type: "string" },
          languageOverview: { type: "string" },
          improvementPriorities: {
            type: "array",
            minItems: 2,
            maxItems: 5,
            items: { type: "string" }
          },
          finalAdvice: { type: "string" }
        }
      },
      questionEvaluations: {
        type: "array",
        minItems: flatQuestions.length,
        maxItems: flatQuestions.length,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "questionId",
            "score",
            "verdict",
            "professorFeedback",
            "strengths",
            "missingElements",
            "matchedCriteriaLabels",
            "languageCorrections",
            "languageComment"
          ],
          properties: {
            questionId: {
              type: "string",
              enum: flatQuestions.map((question) => question.id)
            },
            score: { type: "number" },
            verdict: {
              type: "string",
              enum: ["excellent", "solide", "fragile", "insuffisant"]
            },
            professorFeedback: { type: "string" },
            strengths: {
              type: "array",
              minItems: 1,
              maxItems: 4,
              items: { type: "string" }
            },
            missingElements: {
              type: "array",
              minItems: 0,
              maxItems: 5,
              items: { type: "string" }
            },
            matchedCriteriaLabels: {
              type: "array",
              minItems: 0,
              maxItems: 5,
              items: { type: "string" }
            },
            languageCorrections: {
              type: "array",
              minItems: 0,
              maxItems: 4,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["excerpt", "suggestion", "reason"],
                properties: {
                  excerpt: { type: "string" },
                  suggestion: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            languageComment: { type: "string" }
          }
        }
      }
    }
  };
}

function mcqSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "type",
      "topic",
      "points",
      "prompt",
      "options",
      "correctOption",
      "explanation",
      "source"
    ],
    properties: {
      type: { type: "string", enum: ["mcq"] },
      topic: { type: "string" },
      points: { type: "integer" },
      prompt: { type: "string" },
      options: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: { type: "string" }
      },
      correctOption: { type: "integer", minimum: 0, maximum: 3 },
      explanation: { type: "string" },
      source: { type: "string" }
    }
  };
}

function writtenSchema(responseStyle) {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "type",
      "responseStyle",
      "topic",
      "points",
      "guidance",
      "prompt",
      "source",
      "criteria",
      "modelAnswer"
    ],
    properties: {
      type: { type: "string", enum: ["written"] },
      responseStyle: { type: "string", enum: [responseStyle] },
      topic: { type: "string" },
      points: { type: "integer" },
      guidance: { type: "string" },
      prompt: { type: "string" },
      source: { type: "string" },
      criteria: criteriaSchema(),
      modelAnswer: { type: "string" }
    }
  };
}

function codeSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "type",
      "responseStyle",
      "topic",
      "points",
      "language",
      "codeSnippet",
      "guidance",
      "prompt",
      "source",
      "criteria",
      "modelAnswer"
    ],
    properties: {
      type: { type: "string", enum: ["code"] },
      responseStyle: { type: "string", enum: ["code"] },
      topic: { type: "string" },
      points: { type: "integer" },
      language: { type: "string" },
      codeSnippet: { type: "string" },
      guidance: { type: "string" },
      prompt: { type: "string" },
      source: { type: "string" },
      criteria: criteriaSchema(),
      modelAnswer: { type: "string" }
    }
  };
}

function criteriaSchema() {
  return {
    type: "array",
    minItems: 2,
    maxItems: 5,
    items: {
      type: "object",
      additionalProperties: false,
      required: ["label", "points", "evidenceSets"],
      properties: {
        label: { type: "string" },
        points: { type: "integer" },
        evidenceSets: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: { type: "string" }
          }
        }
      }
    }
  };
}

function correctedCopySchema(flatQuestions) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["summary", "entries"],
    properties: {
      summary: { type: "string" },
      entries: {
        type: "array",
        minItems: 0,
        maxItems: flatQuestions.length,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["questionId", "topic", "original", "corrected", "note"],
          properties: {
            questionId: {
              type: "string",
              enum: flatQuestions.map((question) => question.id)
            },
            topic: { type: "string" },
            original: { type: "string" },
            corrected: { type: "string" },
            note: { type: "string" }
          }
        }
      }
    }
  };
}

function writingAssistantSchema(action) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["suggestions"],
    properties: {
      suggestions: {
        type: "array",
        minItems: 0,
        maxItems: action === "review" ? 6 : 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["original", "corrected", "type", "explanation", "confidence"],
          properties: {
            original: { type: "string" },
            corrected: { type: "string" },
            type: {
              type: "string",
              enum: ["orthographe", "grammaire", "syntaxe", "clarte", "style"]
            },
            explanation: { type: "string" },
            confidence: { type: "number" }
          }
        }
      }
    }
  };
}

function findNormalizedRange(text, originalFragment, fromIndex = 0) {
  const normalizedText = [];
  const indexMap = [];

  for (let index = 0; index < text.length; index += 1) {
    const normalizedChar = text[index]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    for (const char of normalizedChar) {
      if (/[a-z0-9\s]/.test(char)) {
        normalizedText.push(char);
        indexMap.push(index);
      }
    }
  }

  const normalizedFragment = originalFragment
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedFragment) {
    return { startIndex: -1, endIndex: -1 };
  }

  const normalizedSource = normalizedText.join("");
  const normalizedFrom = Math.max(
    0,
    indexMap.findIndex((index) => index >= fromIndex)
  );
  const foundIndex = normalizedSource.indexOf(normalizedFragment, normalizedFrom);

  if (foundIndex === -1) {
    return { startIndex: -1, endIndex: -1 };
  }

  const startIndex = indexMap[foundIndex];
  const endIndex = indexMap[foundIndex + normalizedFragment.length - 1] + 1;
  return { startIndex, endIndex };
}
