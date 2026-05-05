import fs from "node:fs/promises";
import path from "node:path";
import { createCourse, createCourseCatalog, resolveActiveCourse } from "../src/utils/courseModel.js";

export function getCourseCatalogFile(projectRoot) {
  return (
    process.env.COURSE_CATALOG_FILE ||
    path.join(projectRoot, "data", "courses", "catalog.json")
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

export function getActiveCourse(catalog, requestedCourseId) {
  return resolveActiveCourse(catalog, requestedCourseId);
}

async function saveCourseCatalog(projectRoot, catalog) {
  const catalogFile = getCourseCatalogFile(projectRoot);
  await fs.mkdir(path.dirname(catalogFile), { recursive: true });
  await fs.writeFile(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
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
