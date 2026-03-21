const { z } = require("zod");
const sendResponse = require("../utils/sendResponse");
const {
  upsertProgress,
  getCourseProgress,
  getDetailedProgress,
} = require("../models/progressModel");
const { getEnrollment } = require("../models/enrollmentModel");
const { getModuleById } = require("../models/courseModuleModel");

// zod schema
const updateProgressSchema = z.object({
  course_id: z.string().min(1, "course_id is required"),
  content_id: z.string().min(1, "content_id is required"),
});

// POST /api/student/progress -- student only
// mark a lesson as watched
async function updateProgress(req, res) {
  try {
    const validation = updateProgressSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { course_id, content_id } = validation.data;
    const student_id = req.user.user_id;

    // check student is enrolled in this course
    const enrollment = await getEnrollment(student_id, course_id);
    if (!enrollment) {
      return sendResponse(res, 403, "You are not enrolled in this course");
    }

    // check module exists and belongs to this course
    const module = await getModuleById(content_id);
    if (!module) {
      return sendResponse(res, 404, "Module not found");
    }
    if (module.course_id !== course_id) {
      return sendResponse(
        res,
        400,
        "This module does not belong to this course",
      );
    }

    // upsert -- insert if new, update last_watched if already watched
    await upsertProgress(student_id, course_id, content_id);

    // return updated progress % for this course
    const progress = await getCourseProgress(student_id, course_id);

    return sendResponse(res, 200, "Progress updated successfully", {
      progress_percent: progress.progress_percent,
      watched_modules: progress.watched_modules,
      total_modules: progress.total_modules,
    });
  } catch (error) {
    console.error("updateProgress error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/student/progress/:courseId -- student only
// get progress summary + detailed module list for a course
async function getProgress(req, res) {
  try {
    const { courseId } = req.params;
    const student_id = req.user.user_id;

    // check student is enrolled in this course
    const enrollment = await getEnrollment(student_id, courseId);
    if (!enrollment) {
      return sendResponse(res, 403, "You are not enrolled in this course");
    }

    // get overall progress summary
    const summary = await getCourseProgress(student_id, courseId);

    // get per module watched status
    const modules = await getDetailedProgress(student_id, courseId);

    return sendResponse(res, 200, "Progress fetched successfully", {
      progress_percent: summary.progress_percent,
      watched_modules: summary.watched_modules,
      total_modules: summary.total_modules,
      last_watched: summary.last_watched,
      modules,
    });
  } catch (error) {
    console.error("getProgress error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  updateProgress,
  getProgress,
};
