import fs from "node:fs/promises";
import path from "node:path";

export async function buildAiSourceContext({
  openai,
  course,
  examplesText,
  pedagogicalIndex
}) {
  const compactCourseDocuments = buildCompactCourseDocumentCorpus(course);
  const compactExamStyles = buildCompactExamStyleCorpus(course);

  if (!compactCourseDocuments) {
    return null;
  }

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "Tu es un assistant pedagogique qui prepare un professeur a creer un examen universitaire. Tu lis les fichiers du cours et tu produis une synthese structuree orientee evaluation. Tu dois faire ressortir les concepts, les points de tension, les erreurs d'etudiants probables, les occasions de questions de reflexion et les situations ou une figure pedagogique serait utile. Tu ne rediges pas l'examen ici : tu prepares seulement le contexte de generation."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              `Cours: ${course.title} (${course.courseCode})`,
              `Index pedagogique disponible:\n${JSON.stringify(pedagogicalIndex || {}, null, 2)}`,
              `Extraits utiles des documents de cours (source de verite du contenu):\n${compactCourseDocuments}`,
              `Exemples historiques d'examens (style et formulation seulement):\n${trimLargeText(compactExamStyles || examplesText, 7000)}`,
              "Produis une synthese qui aidera ensuite a generer des questions beaucoup plus pertinentes et reflexives.",
              "Important : le contenu des futures questions doit venir des documents de cours. Les anciens examens servent uniquement a capturer le style, la formulation, le niveau d'exigence et les types de questions."
            ].join("\n\n")
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "ai_course_source_context",
        strict: true,
        schema: aiCourseSourceContextSchema()
      }
    }
  });

  return JSON.parse(response.output_text);
}

export async function attachGeneratedQuestionFigures({
  openai,
  exam,
  course,
  projectRoot
}) {
  let remainingFigureBudget = 2;
  const sections = [];

  for (const section of exam.sections) {
    const questions = [];

    for (const question of section.questions) {
      if (!question.figureRequest || remainingFigureBudget <= 0) {
        questions.push(question);
        continue;
      }

      try {
        const figure = await generateQuestionFigure({
          openai,
          course,
          question,
          section,
          projectRoot
        });

        if (figure) {
          questions.push({
            ...question,
            figure
          });
          remainingFigureBudget -= 1;
          continue;
        }
      } catch (error) {
        console.error("[ExamenIA] Question figure generation failed:", error.message || error);
      }

      questions.push(question);
    }

    sections.push({
      ...section,
      questions
    });
  }

  return {
    ...exam,
    sections
  };
}

function buildCompactCourseDocumentCorpus(course) {
  const items = (course.sources || [])
    .filter((source) => source.status === "ready" && source.segments?.length)
    .slice(0, 8)
    .map((source) => {
      const segmentPreview = source.segments
        .slice(0, 5)
        .map((segment) => trimLargeText(segment, 500))
        .join("\n\n");

      return [
        `Source: ${source.title}`,
        `Type: ${source.kind}`,
        `Format: ${source.format}`,
        `Segments utiles:\n${segmentPreview}`
      ].join("\n");
    });

  return items.join("\n\n---\n\n");
}

function buildCompactExamStyleCorpus(course) {
  const items = (course.pastExams || [])
    .filter((source) => source.status === "ready" && source.segments?.length)
    .slice(0, 6)
    .map((source) => {
      const segmentPreview = source.segments
        .slice(0, 4)
        .map((segment) => trimLargeText(segment, 420))
        .join("\n\n");

      return [
        `Ancien examen: ${source.title}`,
        `Session: ${source.session || "n/a"} ${source.year || ""}`.trim(),
        `Extraits de formulation:\n${segmentPreview}`
      ].join("\n");
    });

  return items.join("\n\n---\n\n");
}

async function generateQuestionFigure({
  openai,
  course,
  question,
  section,
  projectRoot
}) {
  const prompt = [
    "Genere un schema pedagogique propre, lisible et minimaliste pour un contexte d'examen universitaire.",
    `Cours: ${course.title} (${course.courseCode})`,
    `Section d'examen: ${section.title}`,
    `Question: ${question.prompt}`,
    `Objectif pedagogique de la figure: ${question.figureRequest.pedagogicalUse}`,
    `Description attendue: ${question.figureRequest.prompt}`,
    "Contraintes visuelles:",
    "- fond blanc ou tres clair",
    "- style schema de cours, pas illustration decorative",
    "- legible, structure, sobre",
    "- aucune information hors sujet",
    "- texte court, si necessaire seulement pour etiqueter les elements"
  ].join("\n");

  const response = await openai.images.generate({
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
    prompt,
    size: "1024x1024",
    quality: "low",
    output_format: "png",
    background: "opaque"
  });

  const imageBase64 = response.data?.[0]?.b64_json;

  if (!imageBase64) {
    return null;
  }

  const fileBuffer = Buffer.from(imageBase64, "base64");
  const assetDir = path.join(projectRoot, "data", "courses", "generated-assets", course.id);
  const fileName = `${Date.now()}-${slugify(question.topic || question.id)}.png`;
  const absolutePath = path.join(assetDir, fileName);

  await fs.mkdir(assetDir, { recursive: true });
  await fs.writeFile(absolutePath, fileBuffer);

  return {
    assetUrl: `/generated-assets/${course.id}/${fileName}`,
    alt: question.figureRequest.alt,
    caption: question.figureRequest.caption,
    pedagogicalUse: question.figureRequest.pedagogicalUse
  };
}

function trimLargeText(text, maxLength) {
  const value = String(text || "").trim();

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function aiCourseSourceContextSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "courseNarrative",
      "highValueConcepts",
      "reasoningAngles",
      "commonStudentPitfalls",
      "visualOpportunities"
    ],
    properties: {
      courseNarrative: { type: "string" },
      highValueConcepts: {
        type: "array",
        minItems: 3,
        maxItems: 8,
        items: { type: "string" }
      },
      reasoningAngles: {
        type: "array",
        minItems: 3,
        maxItems: 8,
        items: { type: "string" }
      },
      commonStudentPitfalls: {
        type: "array",
        minItems: 2,
        maxItems: 8,
        items: { type: "string" }
      },
      visualOpportunities: {
        type: "array",
        minItems: 0,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["topic", "whyUseful", "diagramHint"],
          properties: {
            topic: { type: "string" },
            whyUseful: { type: "string" },
            diagramHint: { type: "string" }
          }
        }
      }
    }
  };
}
