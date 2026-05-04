export function normalize(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function gradeQuestion(question, answer) {
  if (question.type === "mcq") {
    const isCorrect = answer === question.correctOption;
    return {
      ...question,
      userAnswer: answer,
      score: isCorrect ? question.points : 0,
      maxScore: question.points,
      percentage: isCorrect ? 100 : 0,
      criterionResults: [],
      isCorrect
    };
  }

  const normalizedAnswer = normalize(answer);
  const criterionResults = question.criteria.map((criterion) => {
    const matched = criterion.evidenceSets.some((evidenceSet) =>
      evidenceSet.every((fragment) => normalizedAnswer.includes(normalize(fragment)))
    );

    return {
      ...criterion,
      matched
    };
  });

  const score = criterionResults.reduce(
    (total, criterion) => total + (criterion.matched ? criterion.points : 0),
    0
  );

  return {
    ...question,
    userAnswer: answer,
    score,
    maxScore: question.points,
    percentage: Math.round((score / question.points) * 100),
    criterionResults,
    isCorrect: score >= Math.ceil(question.points * 0.6)
  };
}

export function gradeExam(questions, answersById) {
  const gradedQuestions = questions.map((question) =>
    gradeQuestion(question, answersById[question.id] ?? (question.type === "mcq" ? null : ""))
  );

  const totalScore = gradedQuestions.reduce((total, question) => total + question.score, 0);
  const totalPoints = gradedQuestions.reduce((total, question) => total + question.maxScore, 0);
  const percentage = totalPoints === 0 ? 0 : Math.round((totalScore / totalPoints) * 100);

  return {
    feedbackMode: "fallback",
    gradedQuestions,
    totalScore,
    totalPoints,
    percentage,
    overallFeedback: {
      summary:
        "Correction locale basee sur les elements attendus du cours. Utilise cette correction comme filet de securite si la correction IA n'est pas disponible.",
      professorTone:
        "Le systeme a verifie les points essentiels, mais il ne remplace pas encore une evaluation nuancee d'un professeur.",
      languageOverview:
        "Aucune analyse de langue detaillee n'est disponible en mode local.",
      improvementPriorities: [
        "Relier plus explicitement les idees au cours et aux pratiques XP.",
        "Structurer les reponses avec these, justification et consequence.",
        "Verifier le vocabulaire technique et la precision des termes utilises."
      ],
      finalAdvice:
        "Refais les questions les plus faibles en essayant d'ecrire comme dans une copie d'examen corrigee."
    }
  };
}

export function sectionScores(gradedQuestions) {
  const sections = new Map();

  gradedQuestions.forEach((question) => {
    if (!sections.has(question.sectionId)) {
      sections.set(question.sectionId, {
        id: question.sectionId,
        title: question.sectionTitle,
        label: question.sectionLabel,
        accent: question.sectionAccent,
        score: 0,
        points: 0
      });
    }

    const section = sections.get(question.sectionId);
    section.score += question.score;
    section.points += question.maxScore;
  });

  return [...sections.values()].map((section) => ({
    ...section,
    percentage: section.points === 0 ? 0 : Math.round((section.score / section.points) * 100)
  }));
}

export function gradeLabel(percentage) {
  if (percentage >= 90) {
    return "Excellent";
  }
  if (percentage >= 75) {
    return "Tres bien";
  }
  if (percentage >= 60) {
    return "Passable";
  }
  return "A revoir";
}
