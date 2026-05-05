import { useState } from "react";

const ACCEPTED_TYPES = ".md,.txt,.pdf,.docx";

export default function CourseDocumentUploadCard({ activeCourse, onUploadDocument }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const documentSources = activeCourse?.sources || [];

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile || !activeCourse) {
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const uploadedCourse = await onUploadDocument(selectedFile);
      setFeedback({
        type: "success",
        message: `Document ajoute au cours ${uploadedCourse.title}.`
      });
      setSelectedFile(null);
      event.currentTarget.reset();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Le televersement a echoue."
      });
    }

    setIsUploading(false);
  }

  return (
    <article className="course-upload-card">
      <div className="course-upload-head">
        <div>
          <p className="section-kicker">Sources du cours</p>
          <h3>{activeCourse?.title || "Aucun cours actif"}</h3>
          <p className="course-upload-copy">
            Ajoute les notes, resumes ou documents officiels du cours actif pour preparer
            une vraie generation basee sur tes sources.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{documentSources.length}</strong>
          <span>documents lies</span>
        </div>
      </div>

      <form className="course-upload-form" onSubmit={handleSubmit}>
        <label className="course-upload-field">
          <span>Televerser un document de cours</span>
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            disabled={!activeCourse || isUploading}
          />
        </label>

        <div className="course-upload-actions">
          <div className="course-upload-meta">
            <strong>{selectedFile ? selectedFile.name : "Aucun fichier selectionne"}</strong>
            <span>Formats acceptes : md, txt, pdf, docx</span>
          </div>
          <button
            className="primary-button"
            type="submit"
            disabled={!selectedFile || !activeCourse || isUploading}
          >
            {isUploading ? "Televersement..." : "Ajouter au cours"}
          </button>
        </div>
      </form>

      {feedback ? (
        <p className={`course-upload-feedback ${feedback.type}`}>{feedback.message}</p>
      ) : null}

      <div className="course-upload-list">
        {documentSources.map((source) => (
          <div className="course-upload-item" key={source.id}>
            <div>
              <strong>{source.title}</strong>
              <span>
                {source.format.toUpperCase()} | {source.status}
                {source.segments?.length ? ` | ${source.segments.length} segments` : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
