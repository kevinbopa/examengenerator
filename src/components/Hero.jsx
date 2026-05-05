import { useMemo, useState } from "react";
import HeroVisual from "./HeroVisual";

export default function Hero({
  exam,
  activeCourse,
  onStart,
  onOpenLastExam,
  aiConfigured,
  isGenerating
}) {
  const [previewChoice, setPreviewChoice] = useState(1);
  const generatedExamCount = activeCourse?.generatedExams?.length || 0;
  const latestGeneratedExam = activeCourse?.generatedExams?.[generatedExamCount - 1] || null;
  const documentsCount = activeCourse?.sources?.length || 0;
  const pastExamsCount = activeCourse?.pastExams?.length || 0;
  const readinessLabel = useMemo(() => {
    if (documentsCount === 0 && pastExamsCount === 0) {
      return "Commence par ajouter tes documents.";
    }

    if (documentsCount > 0 && pastExamsCount === 0) {
      return "Ajoute maintenant des anciens examens pour rapprocher le style.";
    }

    return "Le cours est pret pour generer une serie d examens.";
  }, [documentsCount, pastExamsCount]);
  const heroCourseTitle = activeCourse?.title || exam.courseTitle || "Agilite et Extreme Programming";
  const heroCourseCode = activeCourse?.courseCode || exam.courseCode || "Processus logiciel";

  return (
    <section className="landing-stack">
      <article className="hero-card">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-badge">{heroCourseCode} | Cours actif</p>
            <h1>{heroCourseTitle} - espace d examens</h1>
            <p className="hero-copy">
              Depose les chapitres du cours, ajoute les anciens examens, puis genere une ou
              plusieurs simulations dans une bibliotheque claire et reutilisable.
            </p>

            <div className="hero-metrics">
              <div className="metric-chip">
                <strong>{documentsCount}</strong>
                <span>Chapitres et notes</span>
              </div>
              <div className="metric-chip">
                <strong>{pastExamsCount}</strong>
                <span>Anciens examens</span>
              </div>
              <div className="metric-chip">
                <strong>{generatedExamCount}</strong>
                <span>Examens generes</span>
              </div>
              <div className="metric-chip">
                <strong>{exam.durationMinutes} min</strong>
                <span>Duree type</span>
              </div>
            </div>

            <div className="hero-actions">
              <button className="primary-button hero-primary" onClick={onStart} disabled={isGenerating}>
                {isGenerating ? "Generation en cours..." : "Generer 1 examen et commencer"}
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
                  ? "La generation se base sur tes sources de cours et sur tes anciens examens, avec preparation automatique en arriere-plan."
                  : "Le fallback local cree quand meme des examens contextualises a partir des sources importees."}
              </span>
            </div>

            <p className="hero-timing-note">
              <strong>Etat du cours :</strong> {readinessLabel}
            </p>
          </div>

          <HeroVisual />
        </div>
      </article>

      <article className="question-preview-card">
        <div className="question-preview-top">
          <div className="preview-title-wrap">
            <span className="section-kicker">Parcours simple</span>
            <div className="section-progress-line">
              <span className="section-progress-fill" />
            </div>
          </div>
          <div className="preview-meta">
            <span>3 etapes</span>
            <span className="points-pill">Flux simplifie</span>
          </div>
        </div>

        <div className="preview-body">
          <h3>Tout est organise pour comprendre tout de suite quoi faire.</h3>
          <p className="preview-help">
            Tu ajoutes d abord les documents d etude, puis les anciens examens, puis tu choisis
            combien de simulations tu veux generer.
          </p>

          <div className="preview-options flow-options">
            {[
              "Ajoute un ou plusieurs chapitres, resumes ou notes de cours.",
              "Ajoute un ou plusieurs anciens examens du meme cours.",
              "Choisis si tu veux generer 1, 2, 3 ou 5 examens."
            ].map((step, index) => (
              <button
                type="button"
                key={step}
                className={`preview-option ${previewChoice === index + 1 ? "selected" : ""}`}
                onClick={() => setPreviewChoice(index + 1)}
              >
                <span className="preview-option-letter">{index + 1}</span>
                <span>{step}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="preview-actions">
          <button className="ghost-button" disabled>
            La preparation se fait automatiquement
          </button>
          <button className="primary-button" onClick={onStart} disabled={isGenerating}>
            {isGenerating ? "Generation..." : "Commencer tout de suite"}
          </button>
        </div>
      </article>
    </section>
  );
}
