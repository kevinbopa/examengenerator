import SmartWritingEditor from "./SmartWritingEditor";

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

export default function QuestionRenderer({ question, answer, onAnswerChange }) {
  if (question.type === "mcq") {
    return (
      <div className="answer-block">
        <p className="answer-caption">Choisis une seule reponse.</p>
        <div className="mcq-grid">
          {question.options.map((option, index) => (
            <button
              type="button"
              key={option}
              className={`mcq-option ${answer === index ? "selected" : ""}`}
              onClick={() => onAnswerChange(question.id, index)}
            >
              <span className="mcq-badge">{optionLetter(index)}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {question.codeSnippet ? (
        <div className="code-shell">
          <div className="code-header">
            <span>Extrait fourni</span>
            <span>{question.language}</span>
          </div>
          <pre className="code-block">
            <code>{question.codeSnippet}</code>
          </pre>
        </div>
      ) : null}

      <SmartWritingEditor
        key={question.id}
        questionId={question.id}
        value={answer ?? ""}
        onChange={(nextValue) => onAnswerChange(question.id, nextValue)}
        placeholder="Redige ici une reponse structuree, justifiee et proche du style attendu dans une copie d'examen..."
        guidance={question.guidance}
        source={question.source}
      />
    </>
  );
}
