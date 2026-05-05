export default function CourseAssetOverviewCard({ activeCourse }) {
  const sources = activeCourse?.sources || [];
  const pastExams = activeCourse?.pastExams || [];

  return (
    <article className="course-upload-card asset-overview-card">
      <div className="course-upload-head">
        <div>
          <p className="section-kicker">Bibliotheque de sources</p>
          <h3>Documents et examens importes</h3>
          <p className="course-upload-copy">
            Le cours actif peut contenir plusieurs documents et plusieurs anciens examens.
            Cette vue te permet de verifier rapidement ce qui alimente la generation.
          </p>
        </div>
        <div className="course-upload-summary">
          <strong>{sources.length + pastExams.length}</strong>
          <span>fichiers relies</span>
        </div>
      </div>

      <div className="asset-overview-grid">
        <section className="asset-overview-panel">
          <div className="asset-overview-head">
            <strong>Documents du cours</strong>
            <span>{sources.length}</span>
          </div>
          <div className="asset-overview-list">
            {sources.map((source) => (
              <div className="asset-overview-item" key={source.id}>
                <strong>{source.title}</strong>
                <span>
                  {source.format.toUpperCase()} | {source.status}
                  {source.segments?.length ? ` | ${source.segments.length} segments` : ""}
                </span>
              </div>
            ))}
            {sources.length === 0 ? <span className="pedagogical-empty">Aucun document ajoute pour l instant.</span> : null}
          </div>
        </section>

        <section className="asset-overview-panel">
          <div className="asset-overview-head">
            <strong>Anciens examens</strong>
            <span>{pastExams.length}</span>
          </div>
          <div className="asset-overview-list">
            {pastExams.map((pastExam) => (
              <div className="asset-overview-item" key={pastExam.id}>
                <strong>{pastExam.title}</strong>
                <span>
                  {pastExam.session} {pastExam.year} | {pastExam.format.toUpperCase()} | {pastExam.status}
                </span>
              </div>
            ))}
            {pastExams.length === 0 ? <span className="pedagogical-empty">Aucun ancien examen ajoute pour l instant.</span> : null}
          </div>
        </section>
      </div>
    </article>
  );
}
