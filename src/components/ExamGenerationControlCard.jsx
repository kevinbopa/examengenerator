import { useMemo, useState } from "react";

const GENERATION_OPTIONS = [1, 2, 3, 5];

export default function ExamGenerationControlCard({
  activeCourse,
  onGenerateExams,
  onOpenGeneratedExam,
  isGenerating
}) {
  const [selectedCount, setSelectedCount] = useState(1);
  const [feedback, setFeedback] = useState(null);

  const latestGeneratedExam = useMemo(() => {
    const generatedExams = activeCourse?.generatedExams || [];
    return generatedExams[generatedExams.length - 1] || null;
  }, [activeCourse]);

  async function handleGenerate(openAfterGenerate) {
    setFeedback(null);

    try {
      const result = await onGenerateExams({
        count: selectedCount,
        openAfterGenerate
      });

      if (!openAfterGenerate) {
        setFeedback({
          type: "success",
          message: `${result.exams.length} examen${result.exams.length > 1 ? "s" : ""} ajoute${
            result.exams.length > 1 ? "s" : ""
          } a la bibliotheque.`
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "La generation des examens a echoue."
      });
    }
  }

  return (
    <article className="course-upload-card generation-card">
      <div className="course-upload-head">
        <div>
          <p className="section-kicker">Generation</p>
          <h3>Choisis combien d examens generer</h3>
          <p className="course-upload-copy">
            Le systeme prepare automatiquement le cours, puis genere la quantite de simulations
            que tu veux. Tu peux en lancer une seule ou constituer une petite serie.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{activeCourse?.generatedExams?.length || 0}</strong>
          <span>deja en bibliotheque</span>
        </div>
      </div>

      <div className="generation-option-row">
        {GENERATION_OPTIONS.map((count) => (
          <button
            key={count}
            type="button"
            className={`generation-option ${selectedCount === count ? "selected" : ""}`}
            onClick={() => setSelectedCount(count)}
          >
            {count}
          </button>
        ))}
      </div>

      <div className="course-upload-actions">
        <div className="course-upload-meta">
          <strong>{selectedCount} examen{selectedCount > 1 ? "s" : ""} a generer</strong>
          <span>
            Si tu choisis plus d un examen, ils seront ajoutes a la bibliotheque sans te sortir du
            tableau de bord.
          </span>
        </div>

        <div className="generation-action-group">
          <button
            className="secondary-button compact-secondary"
            type="button"
            disabled={!latestGeneratedExam || isGenerating}
            onClick={() => latestGeneratedExam && onOpenGeneratedExam(latestGeneratedExam.id)}
          >
            Ouvrir le dernier
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate(selectedCount === 1)}
          >
            {isGenerating
              ? "Generation..."
              : selectedCount === 1
                ? "Generer et commencer"
                : "Generer la serie"}
          </button>
        </div>
      </div>

      {feedback ? (
        <p className={`course-upload-feedback ${feedback.type}`}>{feedback.message}</p>
      ) : null}
    </article>
  );
}
