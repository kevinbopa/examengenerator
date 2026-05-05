export function buildExamGenerationPrompt({
  courseTitle,
  chapterId,
  sectionPlan,
  seedBank,
  chapterText,
  examplesText,
  pedagogicalIndex
}) {
  return {
    system: {
      role: "system",
      text:
        `Tu es un professeur universitaire exigeant en processus logiciel. Ta mission est de generer un nouvel examen complet en francais pour le cours ${courseTitle || chapterId}. Tu dois utiliser tout le chapitre ou bloc de matiere fourni, t'inspirer fortement de la tournure et de la densite des questions de examens.md, te rapprocher le plus possible du style d'un vrai examen reel, et rester severe pour pousser l'etudiant a etre excellent. Les questions doivent etre pertinentes, nettes, academiques, parfois piegeuses mais toujours justes. Tu ne dois pas recopier mot pour mot les questions sources. Tu dois varier les angles, couvrir l'ensemble du chapitre, et estimer un temps d'examen volontairement serre mais realiste afin de stimuler une preparation serieuse.`
    },
    userText: [
      `Cours cible: ${courseTitle || chapterId}`,
      `Chapitre ou bloc cible: ${chapterId}`,
      `Structure imposee: ${JSON.stringify(sectionPlan, null, 2)}`,
      `Banque locale actuelle d'exemple: ${JSON.stringify(seedBank, null, 2)}`,
      `Index pedagogique du cours:\n${serializePedagogicalIndex(pedagogicalIndex)}`,
      `Exemples historiques d'enonces (examens.md):\n${examplesText}`,
      `Contenu complet du cours du chapitre:\n${chapterText}`,
      "Contraintes obligatoires :",
      "- generer un examen nouveau a chaque fois",
      "- couvrir tout le chapitre et pas seulement les notions les plus evidentes",
      "- contextualiser chaque question avec le vocabulaire, les tensions, les pratiques et les concepts reellement presents dans les sources importees",
      "- pour les questions de semi-developpement, developpement et code, exiger de la reflexion : comparaison, justification, analyse critique, transfert a une situation, nuance ou prise de decision",
      "- eviter les questions de simple definition si elles ne servent pas un raisonnement academique plus riche",
      "- proposer une duree totale stricte mais defendable",
      "- ecrire des model answers concis mais tres solides",
      "- fournir des criteres de correction exploitables et fins",
      "- pour les questions de code, rester directement lie au chapitre et a ses pratiques",
      "- pour les QCM, eviter les distracteurs ridicules ; chaque mauvaise reponse doit sembler plausible a un etudiant mal prepare"
    ].join("\n\n")
  };
}

export function buildExamEvaluationPrompt({
  courseTitle,
  exam,
  flatQuestions,
  chapterText,
  examplesText,
  pedagogicalIndex
}) {
  return {
    system: {
      role: "system",
      text:
        `Tu es un professeur universitaire severe mais juste. Tu corriges un examen de processus logiciel pour le cours ${courseTitle || exam?.courseCode || "cible"}. Ta correction doit etre humaine, nuancee, exigeante et digne d'un vrai professeur. Tu distingues toujours le contenu et la langue. Pour le contenu, tu evalues la precision, la justesse, la profondeur, la structure et la pertinence. Pour la langue, tu proposes de petites corrections de type Word : fautes, accords, formulations maladroites, ponctuation ou clarte grammaticale. Tu ne dois jamais transformer ces remarques de langue en jugement sur le contenu. Si un etudiant a une idee partiellement juste mais incomplete, tu attribues un score partiel et tu l'expliques. Tu restes plus strict qu'un correcteur indulgent : le but est de pousser l'etudiant vers l'excellence. Pour les QCM, reste strict. Pour les reponses redigees, sois nuance mais exigeant.`
    },
    userText: [
      "Contexte de correction :",
      `Index pedagogique du cours:\n${serializePedagogicalIndex(pedagogicalIndex)}`,
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
  };
}

export function buildWritingAssistantPrompt({
  text,
  action,
  selectionText
}) {
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

  return {
    system: {
      role: "system",
      text:
        "Tu es un assistant linguistique discret pour une plateforme d'examen. Ta mission est uniquement d'ameliorer la langue d'un texte redige par un etudiant. Tu ne dois jamais ajouter de nouvelles idees, repondre a la question a sa place, enrichir artificiellement le contenu, ou changer le fond. Tu dois conserver le sens original. Tu corriges seulement l'orthographe, la grammaire, la syntaxe, la ponctuation, la clarte et la formulation academique. Si le texte est deja correct, retourne une liste vide. Les suggestions doivent etre courtes, localisees et justifiees."
    },
    userText: [
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
  };
}

export function buildCorrectedCopyPrompt({ flatQuestions }) {
  return {
    system: {
      role: "system",
      text:
        "Tu es un assistant de revision linguistique pour une plateforme d'examen. Tu dois produire une copie corrigee qui ameliore uniquement la langue des reponses de l'etudiant : orthographe, accords, ponctuation, syntaxe, clarte et style academique leger. Tu ne dois jamais ajouter de nouvelles idees, enrichir le contenu, modifier le fond ou repondre a la place de l'etudiant. Le sens initial doit rester intact."
    },
    userText: [
      "Produis une version corrigee de chaque reponse redigee, strictement sur la forme linguistique.",
      `Questions et reponses:\n${JSON.stringify(flatQuestions, null, 2)}`,
      "Contraintes :",
      "- ne change pas le fond",
      "- ne rajoute aucune idee",
      "- reste proche de la formulation de l'etudiant",
      "- donne aussi une courte note sur le type d'amelioration de langue effectue"
    ].join("\n\n")
  };
}

function serializePedagogicalIndex(index) {
  if (!index || typeof index !== "object") {
    return "Aucun index pedagogique disponible.";
  }

  return JSON.stringify(
    {
      status: index.status || "draft",
      concepts: (index.concepts || []).slice(0, 8),
      themes: (index.themes || []).slice(0, 5),
      styleSignals: (index.styleSignals || []).slice(0, 5),
      warnings: index.warnings || []
    },
    null,
    2
  );
}
