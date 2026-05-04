import assert from "node:assert/strict";
import { after, before, test } from "node:test";

process.env.EXAM_SERVER_DISABLE_AUTOSTART = "1";
process.env.OPENAI_API_KEY = "";

const [{ app }, { examBlueprint, flattenQuestions }] = await Promise.all([
  import("../server/index.mjs"),
  import("../src/data/examData.js")
]);

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => {
    server.once("listening", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
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
});

test("GET /api/health exposes fallback-ready backend state", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.aiConfigured, false);
  assert.equal(payload.chapter, examBlueprint.chapter);
  assert.ok(payload.model);
});

test("POST /api/generate-exam returns the fallback exam when AI is disabled", async () => {
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

test("POST /api/evaluate-exam rejects an invalid exam payload", async () => {
  const response = await postJson("/api/evaluate-exam", {
    exam: { invalid: true },
    answersById: {}
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error, "Exam invalide.");
});

test("POST /api/evaluate-exam returns a graded fallback result", async () => {
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

test("POST /api/generate-corrected-copy returns a safe fallback corrected copy", async () => {
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
});

test("POST /writing-assistant/correct returns no suggestions when AI is disabled", async () => {
  const response = await postJson("/writing-assistant/correct", {
    text: "Cette reponse contient peut etre des fautes mais l IA est desactivee.",
    action: "review"
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload, { suggestions: [] });
});

async function postJson(route, body) {
  return fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}
