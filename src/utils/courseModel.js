const VALID_SOURCE_KINDS = new Set(["courseDocument", "pastExam"]);
const VALID_INGESTION_STATUSES = new Set(["draft", "ready", "processing", "failed"]);
const VALID_SOURCE_STATUSES = new Set(["uploaded", "ready", "missing", "failed"]);
const VALID_INDEX_STATUSES = new Set(["draft", "ready", "partial", "failed"]);
const SUPPORTED_COURSE_DOCUMENT_FORMATS = new Set(["pdf", "md", "txt", "docx"]);
const SUPPORTED_PAST_EXAM_FORMATS = new Set(["pdf", "md", "txt", "docx"]);

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
    ingestionSummary: normalizeIngestionSummary(input?.ingestionSummary),
    pedagogicalIndex: normalizePedagogicalIndex(input?.pedagogicalIndex),
    generatedExams: normalizeGeneratedExams(input?.generatedExams),
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

export function isSupportedPastExamFormat(format) {
  return SUPPORTED_PAST_EXAM_FORMATS.has(String(format || "").trim().toLowerCase());
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
    year: Number.isInteger(input?.year) ? input.year : null,
    rawText: optionalString(input?.rawText),
    cleanedText: optionalString(input?.cleanedText),
    segments: Array.isArray(input?.segments) ? input.segments.filter(Boolean) : [],
    warnings: Array.isArray(input?.warnings) ? input.warnings.filter(Boolean) : [],
    ingestedAt: optionalString(input?.ingestedAt)
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

function normalizeIngestionSummary(summary) {
  if (!summary || typeof summary !== "object") {
    return {
      totalItems: 0,
      readyItems: 0,
      failedItems: 0,
      warningCount: 0,
      totalSegments: 0
    };
  }

  return {
    totalItems: Number(summary.totalItems) || 0,
    readyItems: Number(summary.readyItems) || 0,
    failedItems: Number(summary.failedItems) || 0,
    warningCount: Number(summary.warningCount) || 0,
    totalSegments: Number(summary.totalSegments) || 0
  };
}

function normalizePedagogicalIndex(index) {
  if (!index || typeof index !== "object") {
    return emptyPedagogicalIndex();
  }

  return {
    status: normalizeEnum(index.status, VALID_INDEX_STATUSES, "draft"),
    generatedAt: optionalString(index.generatedAt),
    coverage: {
      readySourceCount: Number(index.coverage?.readySourceCount) || 0,
      totalSourceCount: Number(index.coverage?.totalSourceCount) || 0,
      totalSegmentCount: Number(index.coverage?.totalSegmentCount) || 0
    },
    concepts: Array.isArray(index.concepts)
      ? index.concepts.map((concept) => ({
          label: optionalString(concept.label),
          occurrenceCount: Number(concept.occurrenceCount) || 0,
          sourceIds: Array.isArray(concept.sourceIds) ? concept.sourceIds.filter(Boolean) : [],
          sampleContext: optionalString(concept.sampleContext)
        })).filter((concept) => concept.label)
      : [],
    themes: Array.isArray(index.themes)
      ? index.themes.map((theme) => ({
          label: optionalString(theme.label),
          sourceIds: Array.isArray(theme.sourceIds) ? theme.sourceIds.filter(Boolean) : [],
          segmentCount: Number(theme.segmentCount) || 0,
          summary: optionalString(theme.summary),
          keyConceptLabels: Array.isArray(theme.keyConceptLabels) ? theme.keyConceptLabels.filter(Boolean) : []
        })).filter((theme) => theme.label)
      : [],
    styleSignals: Array.isArray(index.styleSignals)
      ? index.styleSignals.map((signal) => ({
          label: optionalString(signal.label),
          description: optionalString(signal.description),
          evidenceCount: Number(signal.evidenceCount) || 0,
          sourceIds: Array.isArray(signal.sourceIds) ? signal.sourceIds.filter(Boolean) : []
        })).filter((signal) => signal.label)
      : [],
    warnings: Array.isArray(index.warnings) ? index.warnings.filter(Boolean) : []
  };
}

function emptyPedagogicalIndex() {
  return {
    status: "draft",
    generatedAt: "",
    coverage: {
      readySourceCount: 0,
      totalSourceCount: 0,
      totalSegmentCount: 0
    },
    concepts: [],
    themes: [],
    styleSignals: [],
    warnings: []
  };
}

function normalizeGeneratedExams(entries) {
  return Array.isArray(entries)
    ? entries
        .map((entry, index) => ({
          id: optionalString(entry?.id) || slugify(`generated-exam-${index + 1}`),
          title: optionalString(entry?.title) || "Examen genere",
          generatedAt: optionalString(entry?.generatedAt) || new Date().toISOString(),
          sourceMode: optionalString(entry?.sourceMode) || "fallback",
          questionCount: Number(entry?.questionCount) || 0,
          sectionCount: Number(entry?.sectionCount) || 0,
          durationMinutes: Number(entry?.durationMinutes) || 0,
          exam: entry?.exam && typeof entry.exam === "object" ? entry.exam : null
        }))
        .filter((entry) => entry.exam)
    : [];
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
