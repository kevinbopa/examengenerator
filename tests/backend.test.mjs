import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, beforeEach, test } from "node:test";

process.env.EXAM_SERVER_DISABLE_AUTOSTART = "1";
process.env.OPENAI_API_KEY = "";
process.env.COURSE_CATALOG_FILE = buildCatalogFile("default");
process.env.COURSE_STORAGE_DIR = buildStorageDir("default");

const [{ app }, { examBlueprint, flattenQuestions }] = await Promise.all([
  import("../server/index.mjs"),
  import("../src/data/examData.js")
]);

let server;
let baseUrl;

before(async () => {
  await fs.rm(process.env.COURSE_CATALOG_FILE, { force: true });
  server = app.listen(0);
  await new Promise((resolve) => {
    server.once("listening", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async (context) => {
  const testSlug = slugify(context.name);
  process.env.COURSE_CATALOG_FILE = buildCatalogFile(testSlug);
  process.env.COURSE_STORAGE_DIR = buildStorageDir(testSlug);
  await fs.rm(process.env.COURSE_CATALOG_FILE, { force: true });
  await fs.rm(process.env.COURSE_STORAGE_DIR, { recursive: true, force: true });
});

after(async () => {
  if (!server) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  await fs.rm(process.env.COURSE_CATALOG_FILE, { force: true });
  await fs.rm(process.env.COURSE_STORAGE_DIR, { recursive: true, force: true });
});

test("GET /api/health exposes fallback-ready backend state", { concurrency: false }, async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.aiConfigured, false);
  assert.equal(payload.chapter, examBlueprint.chapter);
  assert.equal(payload.activeCourse.courseCode, examBlueprint.chapter);
  assert.ok(payload.model);
});

test(
  "GET /api/courses exposes the local course catalog and active course",
  { concurrency: false },
  async () => {
  const response = await fetch(`${baseUrl}/api/courses`);
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.ok(Array.isArray(payload.courses));
  assert.ok(payload.courses.length >= 1);
  assert.equal(payload.activeCourseId, payload.courses[0].id);
  }
);

test("POST /api/courses creates and persists a new local course", { concurrency: false }, async () => {
  const response = await postJson("/api/courses", {
    title: "Architecture logicielle",
    courseCode: "GLO4001",
    description: "Cours de conception et d'architecture"
  });

  assert.equal(response.status, 201);
  const payload = await response.json();

  assert.equal(payload.course.id, "glo4001");
  assert.equal(payload.course.ingestionStatus, "draft");
  assert.equal(payload.activeCourseId, "glo4001");

  const catalogResponse = await fetch(`${baseUrl}/api/courses`);
  const catalogPayload = await catalogResponse.json();
  assert.equal(catalogPayload.activeCourseId, "glo4001");
  assert.ok(catalogPayload.courses.some((course) => course.id === "glo4001"));
});

test(
  "POST /api/courses/:courseId/documents uploads and persists a valid course document",
  { concurrency: false },
  async () => {
    const createResponse = await postJson("/api/courses", {
      title: "Architecture logicielle",
      courseCode: "GLO4001",
      description: "Cours de conception et d'architecture"
    });
    const created = await createResponse.json();

    const uploadResponse = await postJson(`/api/courses/${created.course.id}/documents`, {
      fileName: "notes-cours.md",
      mimeType: "text/markdown",
      contentBase64: Buffer.from("# Notes\nContenu du cours", "utf8").toString("base64")
    });

    assert.equal(uploadResponse.status, 201);
    const payload = await uploadResponse.json();

    assert.equal(payload.course.id, "glo4001");
    assert.equal(payload.document.kind, "courseDocument");
    assert.equal(payload.document.format, "md");
    assert.equal(payload.document.status, "uploaded");

    const storedPath = path.join(process.env.COURSE_STORAGE_DIR, payload.document.filePath);
    const storedContent = await fs.readFile(storedPath, "utf8");
    assert.match(storedContent, /Contenu du cours/);

    const catalogResponse = await fetch(`${baseUrl}/api/courses`);
    const catalogPayload = await catalogResponse.json();
    const storedCourse = catalogPayload.courses.find((course) => course.id === "glo4001");
    assert.ok(storedCourse.sources.some((source) => source.id === payload.document.id));
  }
);

test(
  "POST /api/courses/:courseId/documents rejects an unsupported course document format",
  { concurrency: false },
  async () => {
    const createResponse = await postJson("/api/courses", {
      title: "Architecture logicielle",
      courseCode: "GLO4001"
    });
    const created = await createResponse.json();

    const uploadResponse = await postJson(`/api/courses/${created.course.id}/documents`, {
      fileName: "diagramme.png",
      mimeType: "image/png",
      contentBase64: Buffer.from("not an image", "utf8").toString("base64")
    });

    assert.equal(uploadResponse.status, 400);
    const payload = await uploadResponse.json();
    assert.match(payload.error, /format/i);
  }
);

test("POST /api/generate-exam returns the fallback exam when AI is disabled", { concurrency: false }, async () => {
  const response = await postJson("/api/generate-exam", {
    chapterId: examBlueprint.chapter
  });

  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.equal(payload.mode, "fallback");
  assert.match(payload.reason, /OPENAI_API_KEY/i);
  assert.equal(payload.exam.aiMode, false);
  assert.equal(payload.exam.sections.length, examBlueprint.sections.length);
  assert.ok(payload.exam.title.includes("Banque locale"));
});

test("POST /api/evaluate-exam rejects an invalid exam payload", { concurrency: false }, async () => {
  const response = await postJson("/api/evaluate-exam", {
    exam: { invalid: true },
    answersById: {}
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error, "Exam invalide.");
});

test("POST /api/evaluate-exam returns a graded fallback result", { concurrency: false }, async () => {
  const answersById = {
    "qcm-1": 1,
    "semi-1":
      "L agilite livre de la valeur rapidement et s adapte au changement. Les individus et interactions sont importants et la collaboration client aide aussi."
  };

  const response = await postJson("/api/evaluate-exam", {
    exam: examBlueprint,
    answersById
  });

  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.equal(payload.mode, "fallback");
  assert.equal(payload.result.feedbackMode, "fallback");
  assert.equal(payload.result.gradedQuestions.length, flattenQuestions(examBlueprint).length);
  assert.ok(payload.result.totalPoints > 0);
  assert.ok(payload.result.totalScore >= 0);
  assert.ok(Array.isArray(payload.result.overallFeedback.improvementPriorities));
});

test(
  "POST /api/generate-corrected-copy returns a safe fallback corrected copy",
  { concurrency: false },
  async () => {
  const answersById = {
    "semi-2":
      "Le client present permet de reduire plusieurs documents mais si il est absent il y a plus de malentendus."
  };

  const response = await postJson("/api/generate-corrected-copy", {
    exam: examBlueprint,
    answersById
  });

  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.equal(payload.mode, "fallback");
  assert.ok(payload.correctedCopy.summary);
  assert.equal(payload.correctedCopy.entries.length, 1);
  assert.equal(payload.correctedCopy.entries[0].original, answersById["semi-2"]);
  assert.equal(payload.correctedCopy.entries[0].corrected, answersById["semi-2"]);
  }
);

test(
  "POST /writing-assistant/correct returns no suggestions when AI is disabled",
  { concurrency: false },
  async () => {
  const response = await postJson("/writing-assistant/correct", {
    text: "Cette reponse contient peut etre des fautes mais l IA est desactivee.",
    action: "review"
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload, { suggestions: [] });
  }
);

async function postJson(route, body) {
  return fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

function buildCatalogFile(label) {
  return path.join(os.tmpdir(), `examengenerator-course-catalog-${process.pid}-${label}.json`);
}

function buildStorageDir(label) {
  return path.join(os.tmpdir(), `examengenerator-course-storage-${process.pid}-${label}`);
}

function slugify(value) {
  return String(value || "test")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
