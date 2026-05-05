function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("fr-CA", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value || "Date inconnue";
  }
}

export default function GeneratedExamLibraryCard({
  activeCourse,
  onOpenGeneratedExam
}) {
  const generatedExams = activeCourse?.generatedExams || [];
  const reversedExams = [...generatedExams].reverse();

  return (
    <article className="course-upload-card exam-library-card">
      <div className="course-upload-head">
        <div>
          <p className="section-kicker">Bibliotheque d examens</p>
          <h3>Examens generes pour {activeCourse?.title || "le cours actif"}</h3>
          <p className="course-upload-copy">
            Chaque generation est conservee. Tu peux donc creer plusieurs examens d exemple,
            les comparer, puis relancer exactement celui que tu veux travailler.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{generatedExams.length}</strong>
          <span>examens gardes</span>
        </div>
      </div>

      <div className="course-upload-actions">
        <div className="course-upload-meta">
          <strong>{generatedExams.length > 0 ? "Historique disponible" : "Aucun examen genere pour l instant"}</strong>
          <span>La plateforme conserve chaque generation au lieu d ecraser la precedente.</span>
        </div>
      </div>

      <div className="exam-library-list">
        {reversedExams.map((generatedExam) => (
          <article className="exam-library-item" key={generatedExam.id}>
            <div className="exam-library-copy">
              <div className="exam-library-head">
                <strong>{generatedExam.title}</strong>
                <span className={`exam-mode-pill ${generatedExam.sourceMode}`}>
                  {generatedExam.sourceMode === "ai" ? "IA" : "Local"}
                </span>
              </div>
              <span>
                {generatedExam.questionCount} questions | {generatedExam.sectionCount} parties | {generatedExam.durationMinutes} min
              </span>
              <small>{formatDate(generatedExam.generatedAt)}</small>
            </div>
            <button
              className="secondary-button compact-secondary"
              type="button"
              onClick={() => onOpenGeneratedExam(generatedExam.id)}
            >
              Ouvrir
            </button>
          </article>
        ))}
        {reversedExams.length === 0 ? (
          <div className="exam-library-empty">
            <strong>Aucun examen enregistre.</strong>
            <span>Genere un premier examen pour commencer ta collection de simulations.</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
