import { gradeLabel, sectionScores } from "../utils/grading";

export default function RightRail({
  activeCourse,
  exam,
  questions,
  answersById,
  phase,
  result,
  currentIndex,
  onStart
}) {
  const sectionProgress =
    phase === "results" && result
      ? sectionScores(result.gradedQuestions)
      : exam.sections.map((section) => {
          const answered = section.questions.filter((question) => {
            const value = answersById[question.id];
            return typeof value === "number" || (typeof value === "string" && value.trim().length > 0);
          }).length;
          return {
            id: section.id,
            title: section.title,
            label: section.label,
            accent: section.accent,
            percentage:
              section.questions.length === 0 ? 0 : Math.round((answered / section.questions.length) * 100),
            countLabel: `${section.questions.length} questions`
          };
        });

  const answeredCount = questions.filter((question) => {
    const value = answersById[question.id];
    return typeof value === "number" || (typeof value === "string" && value.trim().length > 0);
  }).length;
  const generatedExamCount = activeCourse?.generatedExams?.length || 0;

  return (
    <aside className="right-rail">
      <div className="utility-row">
        <button className="utility-icon" type="button">
          IA
        </button>
        <button className="utility-icon" type="button">
          EX
          <span className="utility-badge">{generatedExamCount}</span>
        </button>
      </div>

      <article className="rail-card">
        <h3>Sections de l'examen</h3>
        <div className="rail-section-list">
          {sectionProgress.map((section) => (
            <div className="rail-section-item" key={section.id}>
              <div className={`rail-icon accent-${section.accent}`}>{section.label.slice(0, 1)}</div>
              <div className="rail-section-copy">
                <strong>{section.label}</strong>
                <span>{section.title.replace("Partie ", "")}</span>
                <small>
                  {phase === "results"
                    ? `${section.score}/${section.points}`
                    : `${section.countLabel || `${section.points} points`} | ${exam.sections.find((entry) => entry.id === section.id)?.recommendedMinutes || "--"} min`}
                </small>
              </div>
              <div className="rail-progress-circle">{section.percentage}%</div>
            </div>
          ))}
        </div>
      </article>

      <article className="challenge-card">
        <div className="challenge-copy">
          <h3>Pret a relever le defi ?</h3>
          <p>
            Une simulation complete, chronometree et enrichie a partir du cours actif et de ses
            anciens examens.
          </p>
          <button className="dark-button" type="button" onClick={onStart}>
            {phase === "landing" ? "Generer maintenant" : "Relancer un examen"}
          </button>
        </div>
        <div className="rocket-art">GO</div>
      </article>

      <article className="rail-card stats-card">
        <h3>Statistiques rapides</h3>
        <div className="quick-stat-list">
          <div className="quick-stat-row">
            <span>Progression actuelle</span>
            <strong>
              {phase === "results" && result ? gradeLabel(result.percentage) : `${answeredCount}/${questions.length}`}
            </strong>
          </div>
          <div className="quick-stat-row">
            <span>Taux de reussite moyen</span>
            <strong>{phase === "results" && result ? `${result.percentage}%` : "87%"}</strong>
          </div>
          <div className="quick-stat-row">
            <span>Question en cours</span>
            <strong>{phase === "results" ? questions.length : currentIndex + 1}</strong>
          </div>
          <div className="quick-stat-row">
            <span>Examens gardes</span>
            <strong>{generatedExamCount}</strong>
          </div>
        </div>
        <button className="stats-button" type="button">
          Voir la bibliotheque
        </button>
      </article>
    </aside>
  );
}
