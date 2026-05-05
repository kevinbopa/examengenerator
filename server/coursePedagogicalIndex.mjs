const FRENCH_STOP_WORDS = new Set([
  "alors",
  "aussi",
  "avec",
  "avoir",
  "celle",
  "celles",
  "celui",
  "cependant",
  "chaque",
  "comme",
  "comment",
  "dans",
  "depuis",
  "deux",
  "doit",
  "donc",
  "dont",
  "elle",
  "elles",
  "entre",
  "etre",
  "faire",
  "faut",
  "leurs",
  "mais",
  "meme",
  "moins",
  "notre",
  "nous",
  "pour",
  "pourquoi",
  "plus",
  "quand",
  "quel",
  "quelle",
  "quelles",
  "quels",
  "sans",
  "sont",
  "sous",
  "sur",
  "tout",
  "tous",
  "tres",
  "une",
  "utilise",
  "vous",
  "votre"
]);

const STYLE_SIGNAL_PATTERNS = [
  {
    label: "explication conceptuelle",
    description: "Les anciens examens demandent souvent d expliquer une notion de cours avec precision.",
    regex: /\b(expliquez|expliquer|decrivez|presentez)\b/gi
  },
  {
    label: "comparaison de pratiques",
    description: "Les enonces poussent a comparer des approches, pratiques ou options de conception.",
    regex: /\b(comparez|comparer|distinguez|difference|differenciez)\b/gi
  },
  {
    label: "justification academique",
    description: "Le style d evaluation attend des justifications explicites et argumentees.",
    regex: /\b(justifiez|justifier|argumentez|motivez)\b/gi
  },
  {
    label: "analyse critique",
    description: "Les examens favorisent une analyse critique, nuancee et discutee.",
    regex: /\b(analysez|analyser|discutez|discute|evaluez|evaluer)\b/gi
  },
  {
    label: "questions liees au code",
    description: "Le style d evaluation inclut des questions ancrees dans le code ou l implementation.",
    regex: /\b(code|refactor|test|implementation|snippet|fonction)\b/gi
  }
];

export function buildPedagogicalIndex(course) {
  const readySources = [...(course.sources || []), ...(course.pastExams || [])].filter(
    (source) => source.status === "ready" && source.segments?.length
  );
  const courseDocuments = (course.sources || []).filter(
    (source) => source.status === "ready" && source.segments?.length
  );
  const pastExams = (course.pastExams || []).filter(
    (source) => source.status === "ready" && source.segments?.length
  );
  const warnings = [];

  if (readySources.length === 0) {
    return {
      status: "failed",
      generatedAt: new Date().toISOString(),
      coverage: {
        readySourceCount: 0,
        totalSourceCount: (course.sources || []).length + (course.pastExams || []).length,
        totalSegmentCount: 0
      },
      concepts: [],
      themes: [],
      styleSignals: [],
      warnings: ["Aucune source prete ne contient encore de segments exploitables."]
    };
  }

  const concepts = buildConceptIndex(courseDocuments);
  const themes = buildThemeIndex(courseDocuments, concepts);
  const styleSignals = buildStyleSignals(pastExams);

  if (courseDocuments.length === 0) {
    warnings.push("Aucun document de cours pret n est disponible pour extraire les concepts.");
  }

  if (pastExams.length === 0) {
    warnings.push("Aucun ancien examen pret n est disponible pour extraire des signaux de style.");
  }

  if (themes.length === 0) {
    warnings.push("Le cours ne contient pas encore assez de structure pour produire des themes solides.");
  }

  if (styleSignals.length === 0) {
    warnings.push("Les signaux de style d examen restent incomplets pour l instant.");
  }

  return {
    status:
      concepts.length >= 2 && themes.length >= 1 && styleSignals.length >= 1 ? "ready" : "partial",
    generatedAt: new Date().toISOString(),
    coverage: {
      readySourceCount: readySources.length,
      totalSourceCount: (course.sources || []).length + (course.pastExams || []).length,
      totalSegmentCount: readySources.reduce(
        (total, source) => total + (source.segments?.length || 0),
        0
      )
    },
    concepts,
    themes,
    styleSignals,
    warnings
  };
}

function buildConceptIndex(sources) {
  const conceptMap = new Map();

  for (const source of sources) {
    for (const segment of source.segments || []) {
      const tokens = new Set(tokenize(segment).filter((token) => token.length >= 5));
      for (const token of tokens) {
        const entry = conceptMap.get(token) || {
          label: token,
          occurrenceCount: 0,
          sourceIds: new Set(),
          sampleContext: segment.slice(0, 180)
        };
        entry.occurrenceCount += 1;
        entry.sourceIds.add(source.id);
        if (!entry.sampleContext) {
          entry.sampleContext = segment.slice(0, 180);
        }
        conceptMap.set(token, entry);
      }
    }
  }

  return [...conceptMap.values()]
    .sort(
      (left, right) =>
        right.occurrenceCount - left.occurrenceCount ||
        right.sourceIds.size - left.sourceIds.size ||
        left.label.localeCompare(right.label)
    )
    .slice(0, 8)
    .map((concept) => ({
      label: concept.label,
      occurrenceCount: concept.occurrenceCount,
      sourceIds: [...concept.sourceIds],
      sampleContext: concept.sampleContext
    }));
}

function buildThemeIndex(sources, concepts) {
  const themeEntries = [];

  for (const source of sources) {
    const headingThemes = extractHeadingThemes(source, concepts);
    if (headingThemes.length > 0) {
      themeEntries.push(...headingThemes);
      continue;
    }

    const topConcepts = concepts
      .filter((concept) => concept.sourceIds.includes(source.id))
      .slice(0, 3)
      .map((concept) => concept.label);

    themeEntries.push({
      label: source.title,
      sourceIds: [source.id],
      segmentCount: source.segments?.length || 0,
      summary: (source.cleanedText || source.segments?.[0] || "").slice(0, 180),
      keyConceptLabels: topConcepts
    });
  }

  return themeEntries
    .filter((theme) => theme.label && theme.summary)
    .slice(0, 5);
}

function extractHeadingThemes(source, concepts) {
  const matches = [...String(source.cleanedText || "").matchAll(/^#{1,6}\s+(.+)$/gm)];
  if (matches.length === 0) {
    return [];
  }

  return matches.slice(0, 4).map((match, index) => {
    const heading = match[1].trim();
    const start = match.index ?? 0;
    const next = matches[index + 1];
    const end = next?.index ?? String(source.cleanedText || "").length;
    const block = String(source.cleanedText || "")
      .slice(start, end)
      .replace(/^#{1,6}\s+.+$/m, "")
      .trim();
    const keyConceptLabels = concepts
      .filter((concept) => concept.sourceIds.includes(source.id) && block.toLowerCase().includes(concept.label))
      .slice(0, 3)
      .map((concept) => concept.label);

    return {
      label: heading,
      sourceIds: [source.id],
      segmentCount: Math.max(1, (block.match(/\n\s*\n/g) || []).length + 1),
      summary: block.slice(0, 180),
      keyConceptLabels
    };
  });
}

function buildStyleSignals(pastExams) {
  const signalMap = new Map();

  for (const pastExam of pastExams) {
    const text = `${pastExam.cleanedText || ""}\n${(pastExam.segments || []).join("\n")}`;
    for (const pattern of STYLE_SIGNAL_PATTERNS) {
      const matches = text.match(pattern.regex) || [];
      if (matches.length === 0) {
        continue;
      }

      const entry = signalMap.get(pattern.label) || {
        label: pattern.label,
        description: pattern.description,
        evidenceCount: 0,
        sourceIds: new Set()
      };
      entry.evidenceCount += matches.length;
      entry.sourceIds.add(pastExam.id);
      signalMap.set(pattern.label, entry);
    }
  }

  return [...signalMap.values()]
    .sort(
      (left, right) =>
        right.evidenceCount - left.evidenceCount || left.label.localeCompare(right.label)
    )
    .map((signal) => ({
      label: signal.label,
      description: signal.description,
      evidenceCount: signal.evidenceCount,
      sourceIds: [...signal.sourceIds]
    }));
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/g)
    .filter((token) => token && !FRENCH_STOP_WORDS.has(token));
}
