import assert from "node:assert/strict";
import test from "node:test";

import {
  createCourse,
  createCourseCatalog,
  isSupportedCourseDocumentFormat,
  resolveActiveCourse
} from "../src/utils/courseModel.js";

test("createCourse normalizes a reusable generic course model", () => {
  const course = createCourse({
    title: "Processus logiciel",
    courseCode: "GLO2003",
    description: "Cours de genie logiciel",
    sources: [
      {
        title: "Notes de cours",
        format: "md",
        filePath: "docs/cours.md"
      }
    ],
    pastExams: [
      {
        title: "Intra Hiver 2026",
        format: "pdf",
        filePath: "exams/intra-h26.pdf",
        session: "Hiver",
        year: 2026
      }
    ],
    createdAt: "2026-05-04T10:00:00.000Z",
    updatedAt: "2026-05-04T10:00:00.000Z"
  });

  assert.equal(course.id, "glo2003");
  assert.equal(course.title, "Processus logiciel");
  assert.equal(course.courseCode, "GLO2003");
  assert.equal(course.ingestionStatus, "draft");
  assert.equal(course.sources.length, 1);
  assert.equal(course.sources[0].kind, "courseDocument");
  assert.equal(course.sources[0].status, "uploaded");
  assert.equal(course.pastExams.length, 1);
  assert.equal(course.pastExams[0].kind, "pastExam");
  assert.equal(course.pastExams[0].session, "Hiver");
  assert.equal(course.pastExams[0].year, 2026);
});

test("createCourseCatalog keeps an explicit active course when it exists", () => {
  const first = createCourse({
    title: "Processus logiciel",
    courseCode: "GLO2003",
    createdAt: "2026-05-04T10:00:00.000Z",
    updatedAt: "2026-05-04T10:00:00.000Z"
  });
  const second = createCourse({
    title: "Analyse",
    courseCode: "IFT2004",
    createdAt: "2026-05-04T10:00:00.000Z",
    updatedAt: "2026-05-04T10:00:00.000Z"
  });

  const catalog = createCourseCatalog({
    courses: [first, second],
    activeCourseId: second.id
  });

  assert.equal(catalog.activeCourseId, second.id);
  assert.equal(resolveActiveCourse(catalog).courseCode, "IFT2004");
});

test("createCourseCatalog falls back to the first course when the active one is invalid", () => {
  const catalog = createCourseCatalog({
    courses: [
      createCourse({
        title: "Processus logiciel",
        courseCode: "GLO2003",
        createdAt: "2026-05-04T10:00:00.000Z",
        updatedAt: "2026-05-04T10:00:00.000Z"
      })
    ],
    activeCourseId: "missing-course"
  });

  assert.equal(catalog.activeCourseId, "glo2003");
});

test("createCourse rejects a course without title or course code", () => {
  assert.throws(
    () =>
      createCourse({
        title: "",
        courseCode: ""
      }),
    /title/i
  );
});

test("isSupportedCourseDocumentFormat accepts the MVP course document formats", () => {
  assert.equal(isSupportedCourseDocumentFormat("md"), true);
  assert.equal(isSupportedCourseDocumentFormat("txt"), true);
  assert.equal(isSupportedCourseDocumentFormat("pdf"), true);
  assert.equal(isSupportedCourseDocumentFormat("docx"), true);
  assert.equal(isSupportedCourseDocumentFormat("png"), false);
});
