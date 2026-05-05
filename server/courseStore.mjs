import fs from "node:fs/promises";
import path from "node:path";
import { extractTextFromBuffer, summarizeCourseIngestion } from "./courseIngestion.mjs";
import { buildPedagogicalIndex } from "./coursePedagogicalIndex.mjs";
import {
  createCourse,
  createCourseCatalog,
  isSupportedCourseDocumentFormat,
  isSupportedPastExamFormat,
  resolveActiveCourse
} from "../src/utils/courseModel.js";

export function getCourseCatalogFile(projectRoot) {
  return (
    process.env.COURSE_CATALOG_FILE ||
    path.join(projectRoot, "data", "courses", "catalog.local.json")
  );
}

export function getCourseStorageDir(projectRoot) {
  return (
    process.env.COURSE_STORAGE_DIR ||
    path.join(projectRoot, "data", "courses", "uploads")
  );
}

export async function loadCourseCatalog(projectRoot) {
  const catalogFile = getCourseCatalogFile(projectRoot);

  try {
    const raw = await fs.readFile(catalogFile, "utf8");
    return createCourseCatalog(JSON.parse(raw));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }

    return loadSeedCourseCatalog(projectRoot);
  }
}

export async function createLocalCourse(projectRoot, input, options = {}) {
  const catalog = await loadCourseCatalog(projectRoot);
  const course = createCourse(input);
  const nextCourses = [...catalog.courses.filter((entry) => entry.id !== course.id), course];
  const nextCatalog = createCourseCatalog({
    courses: nextCourses,
    activeCourseId: options.setActive === false ? catalog.activeCourseId : course.id
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course,
    catalog: nextCatalog
  };
}

export async function addCourseDocument(projectRoot, courseId, input) {
  const catalog = await loadCourseCatalog(projectRoot);
  const targetCourse = catalog.courses.find((course) => course.id === courseId);

  if (!targetCourse) {
    throw new Error("Course introuvable.");
  }

  const fileName = requiredString(input?.fileName, "fileName");
  const contentBase64 = requiredString(input?.contentBase64, "contentBase64");
  const format = normalizeFileFormat(fileName);

  if (!isSupportedCourseDocumentFormat(format)) {
    throw new Error("Format de document de cours non supporte.");
  }

  const relativeFilePath = buildStoredSourcePath(courseId, fileName, format);
  const storageRoot = getCourseStorageDir(projectRoot);
  const absoluteFilePath = path.join(storageRoot, relativeFilePath);

  await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
  await fs.writeFile(absoluteFilePath, Buffer.from(contentBase64, "base64"));

  const now = new Date().toISOString();
  const document = {
    id: slugify(`course-document-${fileName}-${Date.now()}`),
    kind: "courseDocument",
    title: readableTitleFromFileName(fileName),
    format,
    filePath: relativeFilePath,
    status: "uploaded",
    session: "",
    year: null
  };

  const updatedCourse = createCourse({
    ...targetCourse,
    sources: [...targetCourse.sources, document],
    updatedAt: now
  });
  const nextCatalog = createCourseCatalog({
    courses: catalog.courses.map((course) => (course.id === courseId ? updatedCourse : course)),
    activeCourseId: catalog.activeCourseId
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course: updatedCourse,
    document,
    catalog: nextCatalog
  };
}

export async function addPastExam(projectRoot, courseId, input) {
  const catalog = await loadCourseCatalog(projectRoot);
  const targetCourse = catalog.courses.find((course) => course.id === courseId);

  if (!targetCourse) {
    throw new Error("Course introuvable.");
  }

  const fileName = requiredString(input?.fileName, "fileName");
  const contentBase64 = requiredString(input?.contentBase64, "contentBase64");
  const session = requiredString(input?.session, "session");
  const sourceName = optionalString(input?.sourceName) || readableTitleFromFileName(fileName);
  const year = normalizeYear(input?.year);
  const format = normalizeFileFormat(fileName);

  if (!Number.isInteger(year)) {
    throw new Error("Invalid year.");
  }

  if (!isSupportedPastExamFormat(format)) {
    throw new Error("Format d'ancien examen non supporte.");
  }

  const relativeFilePath = buildStoredPastExamPath(courseId, fileName, format);
  const storageRoot = getCourseStorageDir(projectRoot);
  const absoluteFilePath = path.join(storageRoot, relativeFilePath);

  await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
  await fs.writeFile(absoluteFilePath, Buffer.from(contentBase64, "base64"));

  const now = new Date().toISOString();
  const pastExam = {
    id: slugify(`past-exam-${sourceName}-${Date.now()}`),
    kind: "pastExam",
    title: sourceName,
    format,
    filePath: relativeFilePath,
    status: "uploaded",
    session,
    year
  };

  const updatedCourse = createCourse({
    ...targetCourse,
    pastExams: [...targetCourse.pastExams, pastExam],
    updatedAt: now
  });
  const nextCatalog = createCourseCatalog({
    courses: catalog.courses.map((course) => (course.id === courseId ? updatedCourse : course)),
    activeCourseId: catalog.activeCourseId
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course: updatedCourse,
    pastExam,
    catalog: nextCatalog
  };
}

export async function removeCourseSource(projectRoot, courseId, sourceId, kind) {
  const catalog = await loadCourseCatalog(projectRoot);
  const targetCourse = catalog.courses.find((course) => course.id === courseId);

  if (!targetCourse) {
    throw new Error("Course introuvable.");
  }

  let updatedSources = targetCourse.sources;
  let updatedPastExams = targetCourse.pastExams;
  let removedItem = null;

  if (kind === "source") {
    removedItem = targetCourse.sources.find((s) => s.id === sourceId);
    if (!removedItem) throw new Error("Document introuvable.");
    updatedSources = targetCourse.sources.filter((s) => s.id !== sourceId);
  } else {
    removedItem = targetCourse.pastExams.find((s) => s.id === sourceId);
    if (!removedItem) throw new Error("Ancien examen introuvable.");
    updatedPastExams = targetCourse.pastExams.filter((s) => s.id !== sourceId);
  }

  // Try to delete the stored file (best-effort)
  if (removedItem.filePath) {
    try {
      const storageRoot = getCourseStorageDir(projectRoot);
      const absolutePath = path.join(storageRoot, removedItem.filePath);
      await fs.unlink(absolutePath);
    } catch {
      // File might not exist or already deleted — that's fine
    }
  }

  const updatedCourse = createCourse({
    ...targetCourse,
    sources: updatedSources,
    pastExams: updatedPastExams,
    updatedAt: new Date().toISOString()
  });

  const nextCatalog = createCourseCatalog({
    courses: catalog.courses.map((course) => (course.id === courseId ? updatedCourse : course)),
    activeCourseId: catalog.activeCourseId
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course: updatedCourse,
    catalog: nextCatalog
  };
}

export async function ingestCourse(projectRoot, courseId) {
  const catalog = await loadCourseCatalog(projectRoot);
  const targetCourse = catalog.courses.find((course) => course.id === courseId);

  if (!targetCourse) {
    throw new Error("Course introuvable.");
  }

  if (targetCourse.sources.length === 0 && targetCourse.pastExams.length === 0) {
    throw new Error("Aucune source a ingerer pour ce cours.");
  }

  const processedSources = await Promise.all(
    targetCourse.sources.map((source) => ingestStoredSource(projectRoot, source))
  );
  const processedPastExams = await Promise.all(
    targetCourse.pastExams.map((pastExam) => ingestStoredSource(projectRoot, pastExam))
  );

  const provisionalCourse = createCourse({
    ...targetCourse,
    sources: processedSources,
    pastExams: processedPastExams,
    ingestionStatus: computeCourseIngestionStatus([...processedSources, ...processedPastExams]),
    ingestionSummary: summarizeCourseIngestion({
      sources: processedSources,
      pastExams: processedPastExams
    }),
    updatedAt: new Date().toISOString()
  });

  const nextCatalog = createCourseCatalog({
    courses: catalog.courses.map((course) => (course.id === courseId ? provisionalCourse : course)),
    activeCourseId: catalog.activeCourseId
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course: provisionalCourse,
    summary: provisionalCourse.ingestionSummary,
    catalog: nextCatalog
  };
}

export async function indexCoursePedagogically(projectRoot, courseId) {
  const catalog = await loadCourseCatalog(projectRoot);
  const targetCourse = catalog.courses.find((course) => course.id === courseId);

  if (!targetCourse) {
    throw new Error("Course introuvable.");
  }

  const pedagogicalIndex = buildPedagogicalIndex(targetCourse);
  const updatedCourse = createCourse({
    ...targetCourse,
    pedagogicalIndex,
    updatedAt: new Date().toISOString()
  });

  const nextCatalog = createCourseCatalog({
    courses: catalog.courses.map((course) => (course.id === courseId ? updatedCourse : course)),
    activeCourseId: catalog.activeCourseId
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course: updatedCourse,
    pedagogicalIndex,
    catalog: nextCatalog
  };
}

export async function appendGeneratedExam(projectRoot, courseId, exam, sourceMode) {
  const catalog = await loadCourseCatalog(projectRoot);
  const targetCourse = catalog.courses.find((course) => course.id === courseId);

  if (!targetCourse) {
    throw new Error("Course introuvable.");
  }

  const generatedExam = {
    id: slugify(`generated-exam-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title: exam.title,
    generatedAt: exam.generatedAt || new Date().toISOString(),
    sourceMode,
    questionCount: exam.sections?.reduce((total, section) => total + (section.questions?.length || 0), 0) || 0,
    sectionCount: exam.sections?.length || 0,
    durationMinutes: exam.durationMinutes || 0,
    exam
  };

  const updatedCourse = createCourse({
    ...targetCourse,
    generatedExams: [...(targetCourse.generatedExams || []), generatedExam],
    updatedAt: new Date().toISOString()
  });

  const nextCatalog = createCourseCatalog({
    courses: catalog.courses.map((course) => (course.id === courseId ? updatedCourse : course)),
    activeCourseId: catalog.activeCourseId
  });

  await saveCourseCatalog(projectRoot, nextCatalog);

  return {
    course: updatedCourse,
    generatedExam,
    catalog: nextCatalog
  };
}

export function getActiveCourse(catalog, requestedCourseId) {
  return resolveActiveCourse(catalog, requestedCourseId);
}

async function saveCourseCatalog(projectRoot, catalog) {
  const catalogFile = getCourseCatalogFile(projectRoot);
  await fs.mkdir(path.dirname(catalogFile), { recursive: true });
  await fs.writeFile(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function normalizeFileFormat(fileName) {
  const extension = path.extname(fileName || "").replace(".", "").trim().toLowerCase();
  return extension;
}

function buildStoredSourcePath(courseId, fileName, format) {
  const baseName = slugify(path.basename(fileName, path.extname(fileName)));
  return path.join(courseId, "sources", `${Date.now()}-${baseName}.${format}`);
}

function buildStoredPastExamPath(courseId, fileName, format) {
  const baseName = slugify(path.basename(fileName, path.extname(fileName)));
  return path.join(courseId, "past-exams", `${Date.now()}-${baseName}.${format}`);
}

function readableTitleFromFileName(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, " ")
    .trim();
}

async function ingestStoredSource(projectRoot, source) {
  const absolutePath = await resolveStoredFile(projectRoot, source.filePath);
  const now = new Date().toISOString();

  try {
    const buffer = await fs.readFile(absolutePath);
    const extraction = await extractTextFromBuffer({
      buffer,
      format: source.format
    });

    return {
      ...source,
      status: extraction.status,
      rawText: extraction.rawText,
      cleanedText: extraction.cleanedText,
      segments: extraction.segments,
      warnings: extraction.warnings,
      ingestedAt: now
    };
  } catch (error) {
    return {
      ...source,
      status: "failed",
      rawText: "",
      cleanedText: "",
      segments: [],
      warnings: [`Lecture impossible: ${error.message}`],
      ingestedAt: now
    };
  }
}

async function resolveStoredFile(projectRoot, filePath) {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  const storageRoot = getCourseStorageDir(projectRoot);
  const candidateInStorage = path.join(storageRoot, filePath);
  const candidateInProject = path.join(projectRoot, filePath);

  try {
    await fs.access(candidateInStorage);
    return candidateInStorage;
  } catch {
    return candidateInProject;
  }
}

function computeCourseIngestionStatus(items) {
  if (items.length === 0) {
    return "draft";
  }

  if (items.every((item) => item.status === "ready")) {
    return "ready";
  }

  if (items.some((item) => item.status === "ready")) {
    return "processing";
  }

  return "failed";
}

function requiredString(value, fieldName) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return normalized;
}

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeYear(value) {
  if (Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isInteger(parsed) ? parsed : null;
  }

  return null;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createSeedCourseCatalog() {
  const seedTimestamp = "2026-05-04T00:00:00.000Z";
  const course = createCourse({
    id: "h26-glo2003-09-agilite-xp",
    title: "Agilite et Extreme Programming",
    courseCode: "H26_GLO2003_09_Agilite_XP",
    description:
      "Cours seed du projet, utilise comme reference initiale avant l'upload des vraies sources utilisateur.",
    sources: [
      {
        id: "chapter-agilite-xp",
        title: "Chapitre Agilite et XP",
        format: "md",
        filePath: "H26_GLO2003_09_Agilite_XP.md",
        status: "ready"
      }
    ],
    pastExams: [
      {
        id: "examens-seed",
        title: "Banque d'examens historiques",
        format: "md",
        filePath: "examens.md",
        session: "Seed",
        year: 2026,
        status: "ready"
      }
    ],
    ingestionStatus: "ready",
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp
  });

  return createCourseCatalog({
    courses: [course],
    activeCourseId: course.id
  });
}

async function loadSeedCourseCatalog(projectRoot) {
  const seedCatalogFile = path.join(projectRoot, "data", "courses", "catalog.json");

  try {
    const raw = await fs.readFile(seedCatalogFile, "utf8");
    return createCourseCatalog(JSON.parse(raw));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }

    return createSeedCourseCatalog();
  }
}
