import QuestionRenderer from "./QuestionRenderer";

export default function ExamWorkspace({
  currentQuestion,
  currentIndex,
  questions,
  answersById,
  timeRemaining,
  onAnswerChange,
  onPrevious,
  onNext,
  onFinish
}) {
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <section className="exam-stack">
      <article className="exam-header-card">
        <div className="exam-header-copy">
          <p className="hero-badge">Examen en cours • progression guidée</p>
          <h1>{currentQuestion.sectionTitle}</h1>
          <p className="hero-copy">
            Avance question par question avec une interface claire, un chronomètre visible et des
            repères de progression pour réduire la charge mentale.
          </p>
        </div>

        <div className="exam-summary-strip">
          <div className="metric-chip compact">
            <strong>{formatTime(timeRemaining)}</strong>
            <span>Temps restant</span>
          </div>
          <div className="metric-chip compact">
            <strong>
              {currentIndex + 1}/{questions.length}
            </strong>
            <span>Question</span>
          </div>
          <div className="metric-chip compact">
            <strong>{currentQuestion.points}</strong>
            <span>Points</span>
          </div>
        </div>
      </article>

      <article className="question-preview-card exam-mode-card">
        <div className="question-preview-top">
          <div className="preview-title-wrap">
            <span className="section-kicker">{currentQuestion.sectionTitle}</span>
            <div className="section-progress-line">
              <span className="section-progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
          <div className="preview-meta">
            <span>
              Question {currentIndex + 1} / {questions.length}
            </span>
            <span className="points-pill">{currentQuestion.points} points</span>
          </div>
        </div>

        <div className="preview-body">
          <h3>{currentQuestion.prompt}</h3>
          <QuestionRenderer
            question={currentQuestion}
            answer={answersById[currentQuestion.id]}
            onAnswerChange={onAnswerChange}
          />
        </div>

        <div className="preview-actions">
          <button className="ghost-button" onClick={onPrevious} disabled={currentIndex === 0}>
            Question precedente
          </button>
          <div className="exam-cta-group">
            <button className="ghost-button" onClick={onFinish}>
              Corriger maintenant
            </button>
            <button className="primary-button" onClick={onNext}>
              {currentIndex === questions.length - 1 ? "Terminer l'examen" : "Question suivante"}
            </button>
          </div>
        </div>
      </article>
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
