const VALID_SOURCE_KINDS = new Set(["courseDocument", "pastExam"]);
const VALID_INGESTION_STATUSES = new Set(["draft", "ready", "processing", "failed"]);
const VALID_SOURCE_STATUSES = new Set(["uploaded", "ready", "missing", "failed"]);
const SUPPORTED_COURSE_DOCUMENT_FORMATS = new Set(["pdf", "md", "txt", "docx"]);

export function createCourse(input) {
  const title = requiredString(input?.title, "title");
  const courseCode = requiredString(input?.courseCode, "courseCode");
  const createdAt = isoTimestamp(input?.createdAt);
  const updatedAt = isoTimestamp(input?.updatedAt ?? createdAt);

  return {
    id: slugify(input?.id || courseCode),
    title,
    courseCode,
    description: optionalString(input?.description),
    sources: normalizeSourceList(input?.sources, "courseDocument"),
    pastExams: normalizeSourceList(input?.pastExams, "pastExam"),
    ingestionStatus: normalizeEnum(
      input?.ingestionStatus,
      VALID_INGESTION_STATUSES,
      "draft"
    ),
    createdAt,
    updatedAt
  };
}

export function createCourseCatalog(input) {
  const courses = (input?.courses || []).map((course) => createCourse(course));

  if (courses.length === 0) {
    throw new Error("A course catalog requires at least one course.");
  }

  const activeCourseId = courses.some((course) => course.id === input?.activeCourseId)
    ? input.activeCourseId
    : courses[0].id;

  return {
    courses,
    activeCourseId
  };
}

export function resolveActiveCourse(catalog, requestedCourseId) {
  const normalizedCatalog = createCourseCatalog(catalog);
  const requestedCourse = normalizedCatalog.courses.find(
    (course) => course.id === requestedCourseId
  );

  if (requestedCourse) {
    return requestedCourse;
  }

  return (
    normalizedCatalog.courses.find((course) => course.id === normalizedCatalog.activeCourseId) ||
    normalizedCatalog.courses[0]
  );
}

export function isSupportedCourseDocumentFormat(format) {
  return SUPPORTED_COURSE_DOCUMENT_FORMATS.has(String(format || "").trim().toLowerCase());
}

function normalizeSourceList(entries, fallbackKind) {
  return (entries || []).map((entry, index) => createCourseSource(entry, fallbackKind, index));
}

function createCourseSource(input, fallbackKind, index) {
  const title = requiredString(input?.title, "source.title");
  const kind = normalizeEnum(input?.kind, VALID_SOURCE_KINDS, fallbackKind);
  const format = requiredString(input?.format, "source.format").toLowerCase();
  const filePath = requiredString(input?.filePath, "source.filePath");

  return {
    id: slugify(input?.id || `${kind}-${title}-${index + 1}`),
    kind,
    title,
    format,
    filePath,
    status: normalizeEnum(input?.status, VALID_SOURCE_STATUSES, "uploaded"),
    session: optionalString(input?.session),
    year: Number.isInteger(input?.year) ? input.year : null
  };
}

function requiredString(value, fieldName) {
  const normalized = optionalString(value);
  if (!normalized) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return normalized;
}

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEnum(value, allowedValues, fallbackValue) {
  if (typeof value === "string" && allowedValues.has(value)) {
    return value;
  }
  return fallbackValue;
}

function isoTimestamp(value) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  return new Date().toISOString();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
