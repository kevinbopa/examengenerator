import { useState } from "react";

const ACCEPTED_TYPES = ".md,.txt,.pdf,.docx";

export default function PastExamUploadCard({ activeCourse, onUploadPastExams }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [session, setSession] = useState("Hiver");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const pastExams = activeCourse?.pastExams || [];

  async function handleSubmit(event) {
    event.preventDefault();

    if (selectedFiles.length === 0 || !activeCourse) {
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const uploadedCourse = await onUploadPastExams({
        files: selectedFiles,
        session,
        year
      });
      setFeedback({
        type: "success",
        message: `${selectedFiles.length} ancien examen${
          selectedFiles.length > 1 ? "s" : ""
        } ajoute${selectedFiles.length > 1 ? "s" : ""} au cours ${uploadedCourse.title}.`
      });
      setSelectedFiles([]);
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
          <p className="section-kicker">Anciens examens</p>
          <h3>{activeCourse?.title || "Aucun cours actif"}</h3>
          <p className="course-upload-copy">
            Ajoute de vrais examens passes pour rapprocher la tournure, le niveau et le style
            de la generation future.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{pastExams.length}</strong>
          <span>examens lies</span>
        </div>
      </div>

      <form className="course-upload-form" onSubmit={handleSubmit}>
        <label className="course-upload-field">
          <span>Joindre un ou plusieurs anciens examens</span>
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
            disabled={!activeCourse || isUploading}
          />
        </label>

        <div className="course-upload-grid">
          <label className="course-upload-field">
            <span>Session</span>
            <select value={session} onChange={(event) => setSession(event.target.value)} disabled={isUploading}>
              <option value="Hiver">Hiver</option>
              <option value="Ete">Ete</option>
              <option value="Automne">Automne</option>
            </select>
          </label>

          <label className="course-upload-field">
            <span>Annee</span>
            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="course-upload-actions">
          <div className="course-upload-meta">
            <strong>
              {selectedFiles.length > 0
                ? `${selectedFiles.length} fichier${selectedFiles.length > 1 ? "s" : ""} selectionne${
                    selectedFiles.length > 1 ? "s" : ""
                  }`
                : "Aucun fichier selectionne"}
            </strong>
            <span>La session et l annee seront appliquees a tous les fichiers choisis.</span>
          </div>
          <button
            className="primary-button"
            type="submit"
            disabled={selectedFiles.length === 0 || !activeCourse || !year.trim() || isUploading}
          >
            {isUploading ? "Televersement..." : "Ajouter les anciens examens"}
          </button>
        </div>
      </form>

      {feedback ? (
        <p className={`course-upload-feedback ${feedback.type}`}>{feedback.message}</p>
      ) : null}

      <div className="course-upload-list">
        {pastExams.map((pastExam) => (
          <div className="course-upload-item" key={pastExam.id}>
            <div>
              <strong>{pastExam.title}</strong>
              <span>
                {pastExam.session} {pastExam.year} | {pastExam.format.toUpperCase()} | {pastExam.status}
                {pastExam.segments?.length ? ` | ${pastExam.segments.length} segments` : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
