import { useMemo, useState } from "react";
import HeroVisual from "./HeroVisual";

export default function Hero({
  exam,
  activeCourse,
  questions,
  onStart,
  onOpenLastExam,
  aiConfigured,
  isGenerating
}) {
  const [previewChoice, setPreviewChoice] = useState(null);
  const previewQuestion = useMemo(
    () => questions.find((question) => question.type === "mcq") ?? questions[0],
    [questions]
  );

  const totalQuestions = questions.length;
  const heroCourseTitle = activeCourse?.title || exam.courseTitle || "Agilite et Extreme Programming";
  const heroCourseCode = activeCourse?.courseCode || exam.courseCode || "Processus logiciel";
  const generatedExamCount = activeCourse?.generatedExams?.length || 0;
  const latestGeneratedExam = activeCourse?.generatedExams?.[generatedExamCount - 1] || null;

  return (
    <section className="landing-stack">
      <article className="hero-card">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-badge">{heroCourseCode} | Cours actif</p>
            <h1>{heroCourseTitle} - espace d examens</h1>
            <p className="hero-copy">
              Une plateforme de revision structuree pour televerser plusieurs documents,
              conserver plusieurs examens generes et travailler une vraie bibliotheque de
              simulations plutot qu un seul modele ecrase a chaque fois.
            </p>

            <div className="hero-metrics">
              <div className="metric-chip">
                <strong>{generatedExamCount}</strong>
                <span>Examens gardes</span>
              </div>
              <div className="metric-chip">
                <strong>{activeCourse?.sources?.length || 0}</strong>
                <span>Documents cours</span>
              </div>
              <div className="metric-chip">
                <strong>{activeCourse?.pastExams?.length || 0}</strong>
                <span>Anciens examens</span>
              </div>
              <div className="metric-chip">
                <strong>{exam.durationMinutes} min</strong>
                <span>Duree du modele courant</span>
              </div>
            </div>

            <div className="hero-actions">
              <button className="primary-button hero-primary" onClick={onStart} disabled={isGenerating}>
                {isGenerating ? "Generation en cours..." : "Generer un nouvel examen"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => latestGeneratedExam && onOpenLastExam(latestGeneratedExam.id)}
                disabled={!latestGeneratedExam}
              >
                {latestGeneratedExam ? "Ouvrir le dernier examen" : "Aucun examen sauvegarde"}
              </button>
            </div>

            <div className={`hero-ai-banner ${aiConfigured ? "active" : ""}`}>
              <strong>{aiConfigured ? "Mode IA actif" : "Mode IA non configure"}</strong>
              <span>
                {aiConfigured
                  ? "Les prompts s appuient maintenant sur le cours actif, les anciens examens et l index pedagogique."
                  : "Le fallback local cree quand meme un examen contextualise a partir des sources importees."}
              </span>
            </div>

            <p className="hero-timing-note">
              <strong>Modele courant :</strong> {totalQuestions} questions sur {exam.sections.length} parties.{" "}
              {exam.timingRationale || "Estimation standard basee sur la banque actuelle."}
            </p>
          </div>

          <HeroVisual />
        </div>
      </article>

      <article className="question-preview-card">
        <div className="question-preview-top">
          <div className="preview-title-wrap">
            <span className="section-kicker">Apercu du modele courant</span>
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
          <p className="preview-help">Apercu du style de question present dans le modele actuellement ouvert.</p>

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
            Navigation verrouillee ici
          </button>
          <button className="primary-button" onClick={onStart} disabled={isGenerating}>
            {isGenerating ? "Generation..." : "Generer et commencer"}
          </button>
        </div>
      </article>
    </section>
  );
}
