import fs from "node:fs/promises";
import path from "node:path";
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
    path.join(projectRoot, "data", "courses", "catalog.json")
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

    return createSeedCourseCatalog();
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
  const sourceName = requiredString(input?.sourceName, "sourceName");
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

function requiredString(value, fieldName) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return normalized;
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
