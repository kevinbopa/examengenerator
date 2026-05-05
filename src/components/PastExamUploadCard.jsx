import { useState } from "react";

const ACCEPTED_TYPES = ".md,.txt,.pdf,.docx";

export default function PastExamUploadCard({ activeCourse, onUploadPastExam }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [session, setSession] = useState("Hiver");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [sourceName, setSourceName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const pastExams = activeCourse?.pastExams || [];

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile || !activeCourse) {
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const uploadedCourse = await onUploadPastExam({
        file: selectedFile,
        session,
        year,
        sourceName
      });
      setFeedback({
        type: "success",
        message: `Ancien examen ajoute au cours ${uploadedCourse.title}.`
      });
      setSelectedFile(null);
      setSourceName("");
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
          <span>Televerser un ancien examen</span>
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
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

        <label className="course-upload-field">
          <span>Nom de la source</span>
          <input
            type="text"
            placeholder="Ex. Intra Hiver 2025"
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
            disabled={isUploading}
          />
        </label>

        <div className="course-upload-actions">
          <div className="course-upload-meta">
            <strong>{selectedFile ? selectedFile.name : "Aucun fichier selectionne"}</strong>
            <span>Metadonnees requises : session, annee, nom de source</span>
          </div>
          <button
            className="primary-button"
            type="submit"
            disabled={!selectedFile || !activeCourse || !sourceName.trim() || !year.trim() || isUploading}
          >
            {isUploading ? "Televersement..." : "Ajouter l ancien examen"}
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
