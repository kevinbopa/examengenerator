import { useState } from "react";

export default function CourseIngestionCard({ activeCourse, onIngestCourse }) {
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const summary = activeCourse?.ingestionSummary || {
    totalItems: 0,
    readyItems: 0,
    failedItems: 0,
    warningCount: 0,
    totalSegments: 0
  };

  async function handleRun() {
    if (!activeCourse) {
      return;
    }

    setIsRunning(true);
    setFeedback(null);

    try {
      const nextCourse = await onIngestCourse();
      setFeedback({
        type: "success",
        message: `Ingestion terminee pour ${nextCourse.title}.`
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "L ingestion a echoue."
      });
    }

    setIsRunning(false);
  }

  return (
    <article className="course-upload-card">
      <div className="course-upload-head">
        <div>
          <p className="section-kicker">Ingestion MVP</p>
          <h3>{activeCourse?.title || "Aucun cours actif"}</h3>
          <p className="course-upload-copy">
            Nettoie et segmente les sources du cours pour preparer la generation d un premier
            examen d exemple.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{summary.totalSegments}</strong>
          <span>segments utiles</span>
        </div>
      </div>

      <div className="ingestion-stats-grid">
        <div className="ingestion-stat">
          <strong>{summary.totalItems}</strong>
          <span>sources total</span>
        </div>
        <div className="ingestion-stat">
          <strong>{summary.readyItems}</strong>
          <span>sources pretes</span>
        </div>
        <div className="ingestion-stat">
          <strong>{summary.failedItems}</strong>
          <span>sources en echec</span>
        </div>
        <div className="ingestion-stat">
          <strong>{summary.warningCount}</strong>
          <span>warnings</span>
        </div>
      </div>

      <div className="course-upload-actions">
        <div className="course-upload-meta">
          <strong>Statut du cours : {activeCourse?.ingestionStatus || "draft"}</strong>
          <span>Lance l ingestion apres avoir ajoute les sources minimales du cours.</span>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={handleRun}
          disabled={!activeCourse || isRunning}
        >
          {isRunning ? "Ingestion..." : "Lancer l ingestion"}
        </button>
      </div>

      {feedback ? (
        <p className={`course-upload-feedback ${feedback.type}`}>{feedback.message}</p>
      ) : null}
    </article>
  );
}
