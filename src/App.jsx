import { useEffect, useRef, useState } from "react";
import AppSidebar from "./components/AppSidebar";
import CourseAssetOverviewCard from "./components/CourseAssetOverviewCard";
import CourseDocumentUploadCard from "./components/CourseDocumentUploadCard";
import ExamGenerationControlCard from "./components/ExamGenerationControlCard";
import GeneratedExamLibraryCard from "./components/GeneratedExamLibraryCard";
import Hero from "./components/Hero";
import ExamWorkspace from "./components/ExamWorkspace";
import PastExamUploadCard from "./components/PastExamUploadCard";
import ResultsView from "./components/ResultsView";
import RightRail from "./components/RightRail";
import { examBlueprint, flattenQuestions } from "./data/examData";
import { gradeExam } from "./utils/grading";

export default function App() {
  const [activeExam, setActiveExam] = useState(() => structuredClone(examBlueprint));
  const [activeCourse, setActiveCourse] = useState(null);
  const [phase, setPhase] = useState("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersById, setAnswersById] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(examBlueprint.durationMinutes * 60);
  const [result, setResult] = useState(null);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [generationMode, setGenerationMode] = useState("fallback");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [correctedCopy, setCorrectedCopy] = useState(null);
  const [isGeneratingCorrectedCopy, setIsGeneratingCorrectedCopy] = useState(false);

  const answersRef = useRef(answersById);
  const activeExamRef = useRef(activeExam);
  const questions = flattenQuestions(activeExam);
  const totalExamSeconds = activeExam.durationMinutes * 60;

  useEffect(() => {
    answersRef.current = answersById;
  }, [answersById]);

  useEffect(() => {
    activeExamRef.current = activeExam;
  }, [activeExam]);

  useEffect(() => {
    loadHealth();
  }, []);

  useEffect(() => {
    if (phase !== "exam") {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timerId);
          void finishExam(answersRef.current, activeExamRef.current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [phase]);

  async function loadHealth() {
    try {
      const response = await fetch("/api/health");
      const payload = await response.json();
      setAiConfigured(Boolean(payload.aiConfigured));
      setActiveCourse(payload.activeCourse || null);
    } catch {
      setAiConfigured(false);
      setActiveCourse(null);
    }
  }

  async function startExam() {
    return generateExams({
      count: 1,
      openAfterGenerate: true
    });
  }

  async function generateExams({ count = 1, openAfterGenerate = count === 1 } = {}) {
    setIsGenerating(true);

    let generatedExam = null;
    let generatedMode = "fallback";
    let generatedCourse = activeCourse;
    let generatedExams = [];

    try {
      const response = await fetch("/api/generate-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chapterId: examBlueprint.chapter,
          courseId: activeCourse?.id,
          count
        })
      });
      const payload = await response.json();
      generatedExam = payload?.exam || null;
      generatedMode = payload?.mode || "fallback";
      generatedCourse = payload?.course || activeCourse;
      generatedExams = payload?.exams || (payload?.exam ? [payload.exam] : []);
    } catch {
      generatedExam = structuredClone(examBlueprint);
      generatedMode = "fallback";
      generatedExams = [generatedExam];
    }

    if (generatedCourse) {
      setActiveCourse(generatedCourse);
    }

    if (openAfterGenerate && generatedExam) {
      setActiveExam(generatedExam);
      setGenerationMode(generatedMode);
      setAnswersById({});
      setCurrentIndex(0);
      setTimeRemaining(generatedExam.durationMinutes * 60);
      setResult(null);
      setCorrectedCopy(null);
      setPhase("exam");
    } else {
      setPhase("landing");
    }

    setIsGenerating(false);

    return {
      exam: generatedExam,
      exams: generatedExams,
      mode: generatedMode,
      course: generatedCourse
    };
  }

  function openGeneratedExam(examId) {
    const generatedExam = activeCourse?.generatedExams?.find((entry) => entry.id === examId);
    if (!generatedExam?.exam) {
      return;
    }

    setActiveExam(generatedExam.exam);
    setGenerationMode(generatedExam.sourceMode || "fallback");
    setAnswersById({});
    setCurrentIndex(0);
    setTimeRemaining((generatedExam.exam.durationMinutes || examBlueprint.durationMinutes) * 60);
    setResult(null);
    setCorrectedCopy(null);
    setPhase("exam");
  }

  async function handleUploadCourseDocuments(files) {
    if (!activeCourse) {
      throw new Error("Aucun cours actif disponible.");
    }

    let nextCourse = activeCourse;

    for (const file of files) {
      const contentBase64 = await fileToBase64(file);
      const response = await fetch(`/api/courses/${nextCourse.id}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          contentBase64
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Le televersement a echoue.");
      }

      nextCourse = payload.course;
    }

    setActiveCourse(nextCourse);
    return nextCourse;
  }

  async function handleUploadPastExams({ files, session, year }) {
    if (!activeCourse) {
      throw new Error("Aucun cours actif disponible.");
    }

    let nextCourse = activeCourse;

    for (const file of files) {
      const contentBase64 = await fileToBase64(file);
      const response = await fetch(`/api/courses/${nextCourse.id}/past-exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          contentBase64,
          session,
          year: Number.parseInt(year, 10)
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Le televersement a echoue.");
      }

      nextCourse = payload.course;
    }

    setActiveCourse(nextCourse);
    return nextCourse;
  }

  async function finishExam(finalAnswers = answersById, finalExam = activeExam) {
    setIsEvaluating(true);
    setPhase("evaluating");

    try {
      const response = await fetch("/api/evaluate-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          exam: finalExam,
          answersById: finalAnswers
        })
      });
      const payload = await response.json();
      if (payload?.result) {
        setResult(payload.result);
      } else {
        setResult(gradeExam(flattenQuestions(finalExam), finalAnswers));
      }
    } catch {
      setResult(gradeExam(flattenQuestions(finalExam), finalAnswers));
    }

    setIsEvaluating(false);
    setPhase("results");
  }

  function handleAnswerChange(questionId, value) {
    setAnswersById((current) => ({
      ...current,
      [questionId]: value
    }));
  }

  async function handleGenerateCorrectedCopy() {
    setIsGeneratingCorrectedCopy(true);

    try {
      const response = await fetch("/api/generate-corrected-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          exam: activeExam,
          answersById
        })
      });
      const payload = await response.json();
      setCorrectedCopy(payload?.correctedCopy || null);
    } catch {
      setCorrectedCopy(null);
    }

    setIsGeneratingCorrectedCopy(false);
  }

  function goToNext() {
    if (currentIndex === questions.length - 1) {
      void finishExam();
      return;
    }
    setCurrentIndex((value) => value + 1);
  }

  function goToPrevious() {
    setCurrentIndex((value) => Math.max(0, value - 1));
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="dashboard-layout">
        <AppSidebar aiConfigured={aiConfigured} />

        <section className="dashboard-main">
          {phase === "landing" ? (
            <>
              <Hero
                exam={activeExam}
                activeCourse={activeCourse}
                onStart={startExam}
                onOpenLastExam={openGeneratedExam}
                aiConfigured={aiConfigured}
                isGenerating={isGenerating}
              />

              <section className="setup-grid">
                <div className="setup-column setup-column-main">
                  <CourseDocumentUploadCard
                    activeCourse={activeCourse}
                    onUploadDocuments={handleUploadCourseDocuments}
                  />
                  <PastExamUploadCard
                    activeCourse={activeCourse}
                    onUploadPastExams={handleUploadPastExams}
                  />
                  <ExamGenerationControlCard
                    activeCourse={activeCourse}
                    onGenerateExams={generateExams}
                    onOpenGeneratedExam={openGeneratedExam}
                    isGenerating={isGenerating}
                  />
                </div>

                <div className="setup-column setup-column-side">
                  <GeneratedExamLibraryCard
                    activeCourse={activeCourse}
                    onOpenGeneratedExam={openGeneratedExam}
                  />
                  <CourseAssetOverviewCard activeCourse={activeCourse} />
                </div>
              </section>
            </>
          ) : null}

          {phase === "exam" ? (
            <ExamWorkspace
              questions={questions}
              currentQuestion={questions[currentIndex]}
              currentIndex={currentIndex}
              answersById={answersById}
              timeRemaining={timeRemaining}
              onAnswerChange={handleAnswerChange}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onFinish={finishExam}
            />
          ) : null}

          {phase === "evaluating" ? (
            <section className="results-layout">
              <article className="results-banner">
                <div>
                  <p className="eyebrow">Correction en cours</p>
                  <h2>Le professeur IA corrige ta copie</h2>
                  <p className="results-summary">
                    Analyse du contenu, evaluation plus humaine, suggestions de langue et notation
                    plus severe en cours de preparation.
                  </p>
                </div>
                <div className="score-orb">
                  <span>Etat</span>
                  <strong>{isEvaluating ? "..." : "OK"}</strong>
                  <small>Patiente quelques secondes</small>
                </div>
              </article>
            </section>
          ) : null}

          {phase === "results" && result ? (
            <ResultsView
              exam={activeExam}
              result={result}
              elapsedSeconds={totalExamSeconds - timeRemaining}
              onRestart={startExam}
              onGenerateCorrectedCopy={handleGenerateCorrectedCopy}
              correctedCopy={correctedCopy}
              isGeneratingCorrectedCopy={isGeneratingCorrectedCopy}
              generationMode={generationMode}
            />
          ) : null}
        </section>

        <RightRail
          activeCourse={activeCourse}
          exam={activeExam}
          questions={questions}
          answersById={answersById}
          phase={phase}
          result={result}
          currentIndex={currentIndex}
          onStart={startExam}
        />
      </main>
    </div>
  );
}

async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return window.btoa(binary);
}
