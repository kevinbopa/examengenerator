import { examBlueprint } from "../src/data/examData.js";
import { buildPedagogicalIndex } from "./coursePedagogicalIndex.mjs";

export function prepareCourseForGeneration(course) {
  if (!course) {
    return course;
  }

  const readySources = [...(course.sources || []), ...(course.pastExams || [])].filter(
    (source) => source.status === "ready" && source.segments?.length
  );

  if (
    readySources.length > 0 &&
    (!course.pedagogicalIndex || course.pedagogicalIndex.status === "draft")
  ) {
    return {
      ...course,
      pedagogicalIndex: buildPedagogicalIndex(course)
    };
  }

  return course;
}

export function buildSourceDrivenFallbackExam(course) {
  const preparedCourse = prepareCourseForGeneration(course);
  const context = buildQuestionContext(preparedCourse);

  return {
    title: `Examen d'exemple - ${preparedCourse.title}`,
    courseId: preparedCourse.id,
    courseCode: preparedCourse.courseCode,
    courseTitle: preparedCourse.title,
    chapter: preparedCourse.courseCode,
    durationMinutes: 70,
    description:
      `Examen de revision genere localement a partir des documents et anciens examens importes pour ${preparedCourse.title}. ` +
      "Il sert de premier exemple exploitable meme lorsque l IA n est pas disponible.",
    generatedBy: "fallback-course",
    generatedAt: new Date().toISOString(),
    aiMode: false,
    timingRationale:
      `Duree locale estimee a partir de ${context.coverage.readySourceCount} sources prêtes et ${context.coverage.totalSegmentCount} segments utiles du cours.`,
    sections: [
      buildQcmSection(context),
      buildSemiSection(context),
      buildEssaySection(context),
      buildCodeSection(context)
    ]
  };
}

function buildQuestionContext(course) {
  const pedagogicalIndex = course.pedagogicalIndex || buildPedagogicalIndex(course);
  const concepts = pedagogicalIndex.concepts?.length
    ? pedagogicalIndex.concepts
    : fallbackConceptsFromCourse(course);
  const themes = pedagogicalIndex.themes?.length
    ? pedagogicalIndex.themes
    : fallbackThemesFromCourse(course);
  const styleSignals = pedagogicalIndex.styleSignals?.length
    ? pedagogicalIndex.styleSignals
    : [
        { label: "explication conceptuelle", description: "", evidenceCount: 1, sourceIds: [] },
        { label: "comparaison de pratiques", description: "", evidenceCount: 1, sourceIds: [] },
        { label: "justification academique", description: "", evidenceCount: 1, sourceIds: [] }
      ];

  return {
    course,
    pedagogicalIndex,
    concepts,
    themes,
    styleSignals,
    coverage: pedagogicalIndex.coverage || {
      readySourceCount: 0,
      totalSegmentCount: 0
    }
  };
}

function buildQcmSection(context) {
  const base = baseSection("qcm");
  const questions = Array.from({ length: 6 }, (_, index) => buildQcmQuestion(context, index));
  return {
    ...base,
    title: "Partie 1 - QCM contextualises",
    instructions:
      "Choisis la meilleure reponse selon les documents du cours et le style observe dans les anciens examens.",
    recommendedMinutes: 12,
    questions
  };
}

function buildSemiSection(context) {
  const base = baseSection("semi");
  const questions = Array.from({ length: 4 }, (_, index) => buildSemiQuestion(context, index));
  return {
    ...base,
    title: "Partie 2 - Questions semi-developpement",
    instructions:
      "Reponds de facon breve mais precise. Appuie chaque reponse sur les notions dominantes du cours importe.",
    recommendedMinutes: 18,
    questions
  };
}

function buildEssaySection(context) {
  const base = baseSection("dev");
  const questions = Array.from({ length: 3 }, (_, index) => buildEssayQuestion(context, index));
  return {
    ...base,
    title: "Partie 3 - Questions de developpement",
    instructions:
      "Construit une reponse argumentee, severe et structuree, dans l esprit des anciens examens importes.",
    recommendedMinutes: 24,
    questions
  };
}

function buildCodeSection(context) {
  const base = baseSection("code");
  const questions = Array.from({ length: 3 }, (_, index) => buildCodeQuestion(context, index));
  return {
    ...base,
    title: "Partie 4 - Questions liees au code",
    instructions:
      "Analyse les extraits proposes et rattache ton raisonnement aux concepts du cours importe.",
    recommendedMinutes: 16,
    questions
  };
}

function buildQcmQuestion(context, index) {
  const concept = pick(context.concepts, index);
  const alternateConcept = pick(context.concepts, index + 1);
  const theme = pick(context.themes, index);
  const shortSummary = compactSummary(theme.summary || concept.sampleContext || "");
  const source = buildSourceReference(context, theme, concept);

  const options = [
    `Il renvoie a ${shortSummary}.`,
    `Il signifie que ${alternateConcept.label} elimine tout besoin de justification ou de comparaison.`,
    `Il impose d ignorer les contraintes du cours pour privilegier une reponse purement intuitive.`,
    `Il decrit uniquement une formalite administrative sans lien avec les choix techniques ou conceptuels.`
  ];

  return {
    id: `qcm-${index + 1}`,
    type: "mcq",
    topic: concept.label,
    points: 2,
    prompt: `Dans ${context.course.title}, quel enonce traduit le mieux le role de ${concept.label} ?`,
    options,
    correctOption: 0,
    explanation:
      `${capitalize(concept.label)} est relie a ${shortSummary}. La bonne reponse est donc celle qui reste la plus proche des documents importes.`,
    source
  };
}

function buildSemiQuestion(context, index) {
  const theme = pick(context.themes, index);
  const conceptA = pick(context.concepts, index);
  const conceptB = pick(context.concepts, index + 1);
  const styleSignal = pick(context.styleSignals, index);
  const summary = compactSummary(theme.summary || conceptA.sampleContext || "");

  return {
    id: `semi-${index + 1}`,
    type: "written",
    responseStyle: "semi",
    topic: theme.label,
    points: 6,
    guidance:
      "Attendu : 4 a 6 lignes. Nomme la notion, relie-la au cours et formule une justification concise.",
    prompt:
      `Explique le role de ${theme.label} dans ${context.course.title}. ` +
      `Relie ta reponse a ${conceptA.label} et ${conceptB.label}, puis ${instructionFromStyle(styleSignal)}.`,
    source: buildSourceReference(context, theme, conceptA),
    criteria: [
      createCriterion(
        `Identifie clairement la place de ${theme.label} dans le cours.`,
        2,
        [theme.label]
      ),
      createCriterion(
        `Relie la reponse a ${conceptA.label}.`,
        2,
        [conceptA.label]
      ),
      createCriterion(
        `Relie la reponse a ${conceptB.label} ou a une consequence coherente.`,
        2,
        [conceptB.label, summary]
      )
    ],
    modelAnswer:
      `${capitalize(theme.label)} occupe une place importante dans ${context.course.title}. ` +
      `Le cours l associe a ${conceptA.label} et a ${conceptB.label}. ` +
      `Une bonne reponse doit montrer que ${summary} et justifier pourquoi cette notion oriente la comprehension du chapitre.`
  };
}

function buildEssayQuestion(context, index) {
  const theme = pick(context.themes, index);
  const conceptA = pick(context.concepts, index);
  const conceptB = pick(context.concepts, index + 1);
  const styleSignal = pick(context.styleSignals, index + 1);
  const summary = compactSummary(theme.summary || conceptA.sampleContext || "");

  return {
    id: `dev-${index + 1}`,
    type: "written",
    responseStyle: "essay",
    topic: `${theme.label} et ${conceptA.label}`,
    points: 10,
    guidance:
      "Attendu : 8 a 10 lignes. Structure la reponse avec these, comparaison ou nuance, puis conclusion.",
    prompt:
      `Developpe une reponse argumentee sur ${theme.label} dans ${context.course.title}. ` +
      `Compare ${conceptA.label} et ${conceptB.label}, puis ${instructionFromStyle(styleSignal)}.`,
    source: buildSourceReference(context, theme, conceptA),
    criteria: [
      createCriterion(
        `Explique avec precision le theme ${theme.label}.`,
        3,
        [theme.label, summary]
      ),
      createCriterion(
        `Compare explicitement ${conceptA.label} et ${conceptB.label}.`,
        3,
        [conceptA.label, conceptB.label]
      ),
      createCriterion(
        "Appuie la reponse par une justification ou une consequence credible.",
        2,
        [styleSignal.label, "justif"]
      ),
      createCriterion(
        "Conclut en reliant la reponse au contexte du cours.",
        2,
        [context.course.courseCode, context.course.title]
      )
    ],
    modelAnswer:
      `${capitalize(theme.label)} doit etre explique a partir des documents du cours. ` +
      `${capitalize(conceptA.label)} et ${conceptB.label} ne jouent pas exactement le meme role et une bonne copie doit le comparer clairement. ` +
      `L etudiant doit ensuite justifier son analyse a partir de l idee suivante : ${summary}.`
  };
}

function buildCodeQuestion(context, index) {
  const conceptA = pick(context.concepts, index);
  const conceptB = pick(context.concepts, index + 1);
  const theme = pick(context.themes, index);
  const signal = pick(context.styleSignals, index);
  const codeSnippet = buildCodeSnippet(conceptA, conceptB, index);

  return {
    id: `code-${index + 1}`,
    type: "code",
    responseStyle: "code",
    topic: `${conceptA.label} dans le code`,
    points: 8,
    language: index === 2 ? "yaml" : "javascript",
    codeSnippet,
    guidance:
      "Attendu : 5 a 7 lignes. Identifie le probleme principal, justifie-le et propose une correction realiste.",
    prompt:
      `Analyse l extrait ci-dessus en te basant sur ${conceptA.label} et ${theme.label}. ` +
      `${instructionFromStyle(signal)} et relie aussi ta reponse a ${conceptB.label}.`,
    source: buildSourceReference(context, theme, conceptA),
    criteria: [
      createCriterion(
        `Identifie un probleme lie a ${conceptA.label}.`,
        3,
        [conceptA.label]
      ),
      createCriterion(
        `Relie l analyse a ${conceptB.label} ou a ${theme.label}.`,
        3,
        [conceptB.label, theme.label]
      ),
      createCriterion(
        "Propose une correction concrete et justifiee.",
        2,
        ["corrig", "justif"]
      )
    ],
    modelAnswer:
      `Une bonne reponse doit montrer que le code ne respecte pas suffisamment ${conceptA.label}. ` +
      `Elle doit aussi relier le probleme a ${conceptB.label} ou a ${theme.label}, puis proposer une correction simple, explicite et justifiee.`
  };
}

function buildCodeSnippet(conceptA, conceptB, index) {
  if (index === 0) {
    return [
      "function buildDecisionPlan(stories) {",
      "  stories.sort((left, right) => right.priority - left.priority);",
      "  return stories.map((story) => ({",
      `    concept: "${conceptA.label}",`,
      `    compareWith: "${conceptB.label}",`,
      "    estimateDays: story.priority > 80 ? 1 : 7",
      "  }));",
      "}"
    ].join("\n");
  }

  if (index === 1) {
    return [
      "function computeCourseScore(student) {",
      "  let total = 0;",
      `  if (student.tags.includes("${conceptA.label}")) total += 12;`,
      `  if (student.tags.includes("${conceptA.label}")) total += 4;`,
      `  if (student.tags.includes("${conceptB.label}")) total += 6;`,
      "  return total;",
      "}"
    ].join("\n");
  }

  return [
    "name: exam-flow",
    "on: [push]",
    "jobs:",
    "  release:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: ./deploy.sh",
    `      - run: echo "verify ${conceptA.label} and ${conceptB.label}"`,
    "      - run: npm test"
  ].join("\n");
}

function createCriterion(label, points, fragments) {
  return {
    label,
    points,
    evidenceSets: [
      fragments
        .flatMap((fragment) => extractFragments(fragment))
        .filter(Boolean)
        .slice(0, 4)
    ]
  };
}

function extractFragments(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/g)
    .filter((fragment) => fragment.length >= 4)
    .slice(0, 2);
}

function instructionFromStyle(styleSignal) {
  if (styleSignal.label.includes("compar")) {
    return "compare clairement les options retenues";
  }
  if (styleSignal.label.includes("anal")) {
    return "analyse les limites et les consequences de cette notion";
  }
  if (styleSignal.label.includes("code")) {
    return "justifie en quoi cette notion influence le code ou l implementation";
  }
  return "justifie ta reponse avec rigueur";
}

function buildSourceReference(context, theme, concept) {
  const conceptSources = concept?.sourceIds?.length ? concept.sourceIds.length : 0;
  const themeSources = theme?.sourceIds?.length ? theme.sourceIds.length : 0;
  return `Generation locale a partir du cours ${context.course.courseCode}, theme ${theme.label}, ${conceptSources + themeSources} source(s) reliee(s).`;
}

function fallbackConceptsFromCourse(course) {
  const label = course.title || course.courseCode || "cours";
  return [
    { label: slugifyWords(label)[0] || "analyse", occurrenceCount: 1, sourceIds: [], sampleContext: label },
    { label: slugifyWords(label)[1] || "structure", occurrenceCount: 1, sourceIds: [], sampleContext: label },
    { label: "justification", occurrenceCount: 1, sourceIds: [], sampleContext: label }
  ];
}

function fallbackThemesFromCourse(course) {
  return [
    {
      label: course.title,
      sourceIds: [],
      segmentCount: 1,
      summary: course.description || `Theme central du cours ${course.title}.`,
      keyConceptLabels: slugifyWords(course.title).slice(0, 2)
    }
  ];
}

function baseSection(id) {
  const section = examBlueprint.sections.find((entry) => entry.id === id);
  return {
    id: section.id,
    label: section.label,
    title: section.title,
    accent: section.accent
  };
}

function pick(list, index) {
  if (!list || list.length === 0) {
    return { label: "concept", summary: "", sampleContext: "", sourceIds: [] };
  }
  return list[index % list.length];
}

function compactSummary(text) {
  const normalized = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "une idee importante du cours";
  }

  return normalized.slice(0, 100);
}

function slugifyWords(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

function capitalize(text) {
  const value = String(text || "").trim();
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : "";
}
