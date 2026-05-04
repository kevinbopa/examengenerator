import { useMemo, useState } from "react";
import HeroVisual from "./HeroVisual";

export default function Hero({ exam, questions, onStart, aiConfigured, isGenerating }) {
  const [previewChoice, setPreviewChoice] = useState(null);
  const previewQuestion = useMemo(
    () => questions.find((question) => question.type === "mcq") ?? questions[0],
    [questions]
  );

  const totalQuestions = questions.length;

  return (
    <section className="landing-stack">
      <article className="hero-card">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-badge">Processus logiciel • Chapitre agilite &amp; XP</p>
            <h1>Examen complet Agilite et Extreme Programming</h1>
            <p className="hero-copy">
              Un vrai examen de revision, pense comme une plateforme de travail evolutive :
              QCM, questions semi-developpement, questions de developpement et questions liees
              au code.
            </p>

            <div className="hero-metrics">
              <div className="metric-chip">
                <strong>{exam.durationMinutes} min</strong>
                <span>Duree totale</span>
              </div>
              <div className="metric-chip">
                <strong>{totalQuestions}</strong>
                <span>Questions</span>
              </div>
              <div className="metric-chip">
                <strong>{exam.sections.length}</strong>
                <span>Formats</span>
              </div>
              <div className="metric-chip">
                <strong>100%</strong>
                <span>Correction detaillee</span>
              </div>
            </div>

            <div className="hero-actions">
              <button className="primary-button hero-primary" onClick={onStart} disabled={isGenerating}>
                {isGenerating ? "Generation en cours..." : "Commencer l'examen"}
              </button>
              <button className="secondary-button">Apercu du chapitre</button>
            </div>

            <div className={`hero-ai-banner ${aiConfigured ? "active" : ""}`}>
              <strong>{aiConfigured ? "Mode IA actif" : "Mode IA non configure"}</strong>
              <span>
                {aiConfigured
                  ? "Des questions sont generees intelligemment a partir du chapitre et de la banque actuelle."
                  : "La plateforme utilise pour le moment la banque locale de revision."}
              </span>
            </div>

            <p className="hero-timing-note">
              <strong>Temps propose :</strong> {exam.timingRationale || "Estimation standard basee sur la banque actuelle."}
            </p>
          </div>

          <HeroVisual />
        </div>
      </article>

      <article className="question-preview-card">
        <div className="question-preview-top">
          <div className="preview-title-wrap">
            <span className="section-kicker">Partie 1 - QCM</span>
            <div className="section-progress-line">
              <span className="section-progress-fill" />
            </div>
          </div>
          <div className="preview-meta">
            <span>Question 1 / {totalQuestions}</span>
            <span className="points-pill">{previewQuestion.points} points</span>
          </div>
        </div>

        <div className="preview-body">
          <h3>{previewQuestion.prompt}</h3>
          <p className="preview-help">Choisissez une seule reponse.</p>

          <div className="preview-options">
            {previewQuestion.options?.map((option, index) => (
              <button
                type="button"
                key={option}
                className={`preview-option ${previewChoice === index ? "selected" : ""}`}
                onClick={() => setPreviewChoice(index)}
              >
                <span className="preview-option-letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="preview-actions">
          <button className="ghost-button" disabled>
            Question precedente
          </button>
          <button className="primary-button" onClick={onStart} disabled={isGenerating}>
            {isGenerating ? "Generation..." : "Question suivante"}
          </button>
        </div>
      </article>
    </section>
  );
}
