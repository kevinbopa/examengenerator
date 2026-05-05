import { useState } from "react";

const EMPTY_INDEX = {
  status: "draft",
  coverage: {
    readySourceCount: 0,
    totalSegmentCount: 0
  },
  concepts: [],
  themes: [],
  styleSignals: [],
  warnings: []
};

export default function CoursePedagogicalIndexCard({
  activeCourse,
  onBuildPedagogicalIndex
}) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const index = activeCourse?.pedagogicalIndex || EMPTY_INDEX;

  async function handleBuild() {
    if (!activeCourse) {
      return;
    }

    setIsBuilding(true);
    setFeedback(null);

    try {
      const nextCourse = await onBuildPedagogicalIndex();
      setFeedback({
        type: "success",
        message: `Index pedagogique genere pour ${nextCourse.title}.`
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "La construction de l index a echoue."
      });
    }

    setIsBuilding(false);
  }

  return (
    <article className="course-upload-card">
      <div className="course-upload-head">
        <div>
          <p className="section-kicker">Index pedagogique</p>
          <h3>{activeCourse?.title || "Aucun cours actif"}</h3>
          <p className="course-upload-copy">
            Construit une representation stable du cours pour guider la generation et la
            correction: concepts, themes et signaux de style d examen.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{index.concepts.length}</strong>
          <span>concepts cles</span>
        </div>
      </div>

      <div className="ingestion-stats-grid">
        <div className="ingestion-stat">
          <strong>{index.coverage.readySourceCount}</strong>
          <span>sources exploitees</span>
        </div>
        <div className="ingestion-stat">
          <strong>{index.coverage.totalSegmentCount}</strong>
          <span>segments lus</span>
        </div>
        <div className="ingestion-stat">
          <strong>{index.themes.length}</strong>
          <span>themes extraits</span>
        </div>
        <div className="ingestion-stat">
          <strong>{index.styleSignals.length}</strong>
          <span>signaux de style</span>
        </div>
      </div>

      <div className="course-upload-actions">
        <div className="course-upload-meta">
          <strong>Statut de l index : {index.status || "draft"}</strong>
          <span>Construit l index apres ingestion pour preparer le futur examen d exemple.</span>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={handleBuild}
          disabled={!activeCourse || isBuilding}
        >
          {isBuilding ? "Construction..." : "Construire l index"}
        </button>
      </div>

      {feedback ? (
        <p className={`course-upload-feedback ${feedback.type}`}>{feedback.message}</p>
      ) : null}

      <div className="pedagogical-index-grid">
        <div className="pedagogical-index-panel">
          <strong>Concepts cles</strong>
          <div className="pedagogical-chip-list">
            {index.concepts.slice(0, 6).map((concept) => (
              <span className="pedagogical-chip" key={concept.label}>
                {concept.label}
              </span>
            ))}
            {index.concepts.length === 0 ? <span className="pedagogical-empty">Aucun concept pour l instant.</span> : null}
          </div>
        </div>

        <div className="pedagogical-index-panel">
          <strong>Themes dominants</strong>
          <div className="pedagogical-card-list">
            {index.themes.slice(0, 3).map((theme) => (
              <div className="pedagogical-mini-card" key={theme.label}>
                <span>{theme.label}</span>
                <small>{theme.keyConceptLabels?.join(", ") || "Theme en construction"}</small>
              </div>
            ))}
            {index.themes.length === 0 ? <span className="pedagogical-empty">Aucun theme pour l instant.</span> : null}
          </div>
        </div>

        <div className="pedagogical-index-panel">
          <strong>Style des examens</strong>
          <div className="pedagogical-card-list">
            {index.styleSignals.slice(0, 3).map((signal) => (
              <div className="pedagogical-mini-card" key={signal.label}>
                <span>{signal.label}</span>
                <small>{signal.evidenceCount} indices detectes</small>
              </div>
            ))}
            {index.styleSignals.length === 0 ? <span className="pedagogical-empty">Aucun signal de style pour l instant.</span> : null}
          </div>
        </div>
      </div>

      {index.warnings?.length ? (
        <div className="pedagogical-warning-list">
          {index.warnings.map((warning) => (
            <p className="course-upload-feedback error" key={warning}>
              {warning}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
