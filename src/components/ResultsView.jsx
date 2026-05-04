import { gradeLabel, sectionScores } from "../utils/grading";
import { buildCorrectedCopyView } from "../utils/correctedCopy";

export default function ResultsView({
  exam,
  result,
  elapsedSeconds,
  onRestart,
  onGenerateCorrectedCopy,
  correctedCopy,
  isGeneratingCorrectedCopy,
  generationMode
}) {
  const sections = sectionScores(result.gradedQuestions);
  const strongQuestions = result.gradedQuestions.filter((question) => question.percentage >= 70).length;
  const weakQuestions = result.gradedQuestions.length - strongQuestions;
  const overall = result.overallFeedback || {};
  const correctedCopyView = buildCorrectedCopyView(correctedCopy);

  return (
    <section className="results-layout">
      <header className="results-banner">
        <div>
          <p className="eyebrow">Correction finale</p>
          <h2>Resultat de l'examen</h2>
          <p className="results-summary">
            Source des questions : {generationMode === "ai" ? "generation IA dynamique" : "banque locale de secours"}.
          </p>
          <p className="results-summary">
            Mode de correction : {result.feedbackMode === "ai" ? "correction professorale IA" : "correction locale de secours"}.
          </p>
          <p className="results-summary">
            <strong>Lecture du professeur :</strong> {overall.summary}
          </p>
        </div>
        <div className="score-orb">
          <span>Note globale</span>
          <strong>{result.percentage}%</strong>
          <small>
            {gradeLabel(result.percentage)} • {result.totalScore}/{result.totalPoints}
          </small>
        </div>
      </header>

      <div className="results-grid">
        <article className="stats-panel">
          <strong>{strongQuestions}</strong>
          <span>reponses solides</span>
        </article>
        <article className="stats-panel">
          <strong>{weakQuestions}</strong>
          <span>reponses a revoir</span>
        </article>
        <article className="stats-panel">
          <strong>{formatTime(elapsedSeconds)}</strong>
          <span>temps utilise</span>
        </article>
      </div>

      <section className="section-performance">
        <div className="section-header">
          <p className="eyebrow">Regard du professeur</p>
          <h3>Bilan general</h3>
        </div>

        <div className="professor-feedback-grid">
          <article className="feedback-note-card">
            <h4>Tonalite de correction</h4>
            <p>{overall.professorTone || "Evaluation rigoureuse basee sur le chapitre et le bareme."}</p>
          </article>
          <article className="feedback-note-card">
            <h4>Analyse de langue</h4>
            <p>{overall.languageOverview || "Pas de commentaire global de langue disponible."}</p>
          </article>
          <article className="feedback-note-card full-span">
            <h4>Priorites d'amelioration</h4>
            <ul className="priority-list">
              {(overall.improvementPriorities || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="feedback-note-card full-span timing-card">
            <h4>Repere de temps</h4>
            <p>
              <strong>Duree cible de cet examen :</strong> {exam.durationMinutes} min
            </p>
            <p>{exam.timingRationale || "Estimation standard du temps d'epreuve."}</p>
          </article>
        </div>
      </section>

      <section className="section-performance">
        <div className="section-header">
          <p className="eyebrow">Par partie</p>
          <h3>Performance par type de question</h3>
        </div>
        <div className="performance-grid">
          {sections.map((section) => (
            <article className={`performance-card accent-${section.accent}`} key={section.id}>
              <div>
                <p>{section.label}</p>
                <h4>{section.title}</h4>
              </div>
              <strong>{section.percentage}%</strong>
              <span>
                {section.score}/{section.points}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="review-section">
        <div className="section-header">
          <p className="eyebrow">Question par question</p>
          <h3>Correction detaillee</h3>
        </div>
        <div className="review-stack">
          {result.gradedQuestions.map((question, index) => (
            <article
              key={question.id}
              className={`review-card ${question.isCorrect ? "review-pass" : "review-fail"}`}
            >
              <div className="review-head">
                <div>
                  <p>
                    Question {index + 1} • {question.sectionLabel}
                  </p>
                  <h4>{question.topic}</h4>
                </div>
                <strong>
                  {question.score}/{question.maxScore}
                </strong>
              </div>

              <p className="review-prompt">{question.prompt}</p>

              {question.codeSnippet ? (
                <pre className="review-code">
                  <code>{question.codeSnippet}</code>
                </pre>
              ) : null}

              {question.type === "mcq" ? (
                <>
                  <p className="review-line">
                    <strong>Ta reponse :</strong>{" "}
                    {typeof question.userAnswer === "number"
                      ? question.options[question.userAnswer]
                      : "Aucune reponse"}
                  </p>
                  <p className="review-line">
                    <strong>Bonne reponse :</strong> {question.options[question.correctOption]}
                  </p>
                  <p className="review-text">{question.professorFeedback || question.explanation}</p>
                </>
              ) : (
                <>
                  <p className="review-line">
                    <strong>Ta reponse :</strong> {question.userAnswer?.trim() ? question.userAnswer : "Aucune reponse"}
                  </p>
                  <p className="review-line">
                    <strong>Correction modele :</strong> {question.modelAnswer}
                  </p>
                  <p className="review-text">
                    <strong>Commentaire du professeur :</strong> {question.professorFeedback || "Aucun commentaire detaille disponible."}
                  </p>

                  {question.strengths?.length ? (
                    <div className="feedback-subgroup">
                      <h5>Points reussis</h5>
                      <ul className="criteria-checklist neutral-list">
                        {question.strengths.map((item) => (
                          <li key={item} className="criterion-hit">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {question.missingElements?.length ? (
                    <div className="feedback-subgroup">
                      <h5>Ce qui manque encore</h5>
                      <ul className="criteria-checklist">
                        {question.missingElements.map((item) => (
                          <li key={item} className="criterion-miss">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {question.criterionResults?.length ? (
                    <div className="feedback-subgroup">
                      <h5>Lecture par criteres</h5>
                      <ul className="criteria-checklist">
                        {question.criterionResults.map((criterion) => (
                          <li
                            key={criterion.label}
                            className={criterion.matched ? "criterion-hit" : "criterion-miss"}
                          >
                            {criterion.matched ? "Valide" : "Manque"} • {criterion.label} ({criterion.points} pts)
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="feedback-subgroup">
                    <h5>Langue et clarte</h5>
                    <p className="review-text">
                      {question.languageComment || "Aucune remarque de langue particuliere."}
                    </p>
                    {question.languageCorrections?.length ? (
                      <ul className="language-correction-list">
                        {question.languageCorrections.map((correction, correctionIndex) => (
                          <li key={`${question.id}-lang-${correctionIndex}`}>
                            <strong>{correction.excerpt}</strong>
                            <span>{correction.suggestion}</span>
                            <small>{correction.reason}</small>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </>
              )}

              <p className="review-source">
                <strong>Source :</strong> {question.source}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-performance">
        <div className="section-header">
          <p className="eyebrow">Conseil final</p>
          <h3>Pour la prochaine tentative</h3>
        </div>
        <article className="feedback-note-card full-span">
          <p>{overall.finalAdvice || "Refais l'examen en visant des reponses plus precises, mieux structurees et plus proches du vocabulaire du chapitre."}</p>
        </article>
      </section>

      <section className="section-performance">
        <div className="section-header">
          <p className="eyebrow">Copie corrigee</p>
          <h3>Version linguistiquement corrigee</h3>
        </div>
        <div className="corrected-copy-toolbar">
          <p className="results-summary">
            Cette option corrige uniquement la langue de ta copie sans changer le fond.
          </p>
          <button
            className="primary-button"
            onClick={onGenerateCorrectedCopy}
            disabled={isGeneratingCorrectedCopy}
          >
            {isGeneratingCorrectedCopy ? "Generation en cours..." : "Avoir ma copie corrigee"}
          </button>
        </div>

        {correctedCopy ? (
          <div className="corrected-copy-stack">
            <article className="feedback-note-card full-span">
              <p>{correctedCopyView.summary}</p>
            </article>
            {correctedCopyView.hasEntries ? correctedCopyView.entries.map((entry, index) => (
              <article className="corrected-copy-card" key={`${entry.questionId}-${index}`}>
                <div className="corrected-copy-head">
                  <div>
                    <p>{entry.sectionLabel || "Question liee"}</p>
                    <h4>{entry.topic}</h4>
                  </div>
                </div>
                <p className="review-prompt">{entry.prompt}</p>
                <div className="corrected-copy-grid">
                  <div>
                    <strong>Version originale</strong>
                    <small>{entry.meaningBadge}</small>
                    <p>{entry.original}</p>
                  </div>
                  <div>
                    <strong>Version corrigee</strong>
                    <small>{entry.formBadge}</small>
                    <p>{entry.corrected}</p>
                  </div>
                </div>
                <p className="results-summary">
                  <strong>Note :</strong> {entry.note}
                </p>
              </article>
            )) : (
              <article className="feedback-note-card full-span">
                <p>Aucune reponse redigee n'etait disponible pour produire une copie corrigee.</p>
              </article>
            )}
          </div>
        ) : null}
      </section>

      <div className="results-actions">
        <button className="primary-button" onClick={onRestart}>
          Refaire l'examen
        </button>
      </div>
    </section>
  );
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
