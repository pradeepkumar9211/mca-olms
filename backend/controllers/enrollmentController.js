const { z } = require("zod");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const {
  createEnrollment,
  getEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
} = require("../models/enrollmentModel");
const { getSuccessfulPayment } = require("../models/paymentModel");
const { getCourseOwner } = require("../models/courseModel");

// zod schema
const enrollSchema = z.object({
  course_id: z.string().min(1, "course_id is required"),
});

// POST /api/student/enroll -- student only
// enroll in a course after successful payment
async function enrollStudent(req, res) {
  try {
    const validation = enrollSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { course_id } = validation.data;
    const student_id = req.user.user_id;

    // check student isnt already enrolled
    const alreadyEnrolled = await getEnrollment(student_id, course_id);
    if (alreadyEnrolled) {
      return sendResponse(res, 409, "You are already enrolled in this course");
    }

    // check successful payment exists for this course
    // student must pay before enrolling
    const payment = await getSuccessfulPayment(student_id, course_id);
    if (!payment) {
      return sendResponse(res, 403, "Please complete payment before enrolling");
    }

    const enrollment_id = crypto.randomUUID();
    await createEnrollment(enrollment_id, student_id, course_id);

    return sendResponse(res, 201, "Enrolled successfully", { enrollment_id });
  } catch (error) {
    console.error("enrollStudent error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/student/enrollments -- student only
// get all courses the logged in student is enrolled in
async function getStudentEnrollments(req, res) {
  try {
    const student_id = req.user.user_id;

    const enrollments = await getEnrollmentsByStudent(student_id);
    if (!enrollments || enrollments.length === 0) {
      return sendResponse(res, 404, "No enrollments found");
    }

    return sendResponse(
      res,
      200,
      "Enrollments fetched successfully",
      enrollments,
    );
  } catch (error) {
    console.error("getStudentEnrollments error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/student/courses/:id/modules -- student only
// get modules of a course only if student is enrolled
async function getEnrolledCourseModules(req, res) {
  try {
    const { id: course_id } = req.params;
    const student_id = req.user.user_id;

    // check student is enrolled in this course
    const enrollment = await getEnrollment(student_id, course_id);
    if (!enrollment) {
      return sendResponse(res, 403, "You are not enrolled in this course");
    }

    // reuse getModulesByCourseId from courseModuleModel
    const { getModulesByCourseId } = require("../models/courseModuleModel");
    const modules = await getModulesByCourseId(course_id);
    if (!modules || modules.length === 0) {
      return sendResponse(res, 404, "No modules found for this course");
    }

    return sendResponse(res, 200, "Modules fetched successfully", modules);
  } catch (error) {
    console.error("getEnrolledCourseModules error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/instructor/courses/:id/enrollments -- instructor only
// get all students enrolled in instructor's course
async function getCourseEnrollments(req, res) {
  try {
    const { id: course_id } = req.params;
    const { user_id } = req.user;

    // check instructor owns this course
    const course = await getCourseOwner(course_id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }
    if (course.instructor_id !== user_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to view this course's enrollments",
      );
    }

    const enrollments = await getEnrollmentsByCourse(course_id);
    if (!enrollments || enrollments.length === 0) {
      return sendResponse(res, 404, "No enrollments found for this course");
    }

    return sendResponse(
      res,
      200,
      "Enrollments fetched successfully",
      enrollments,
    );
  } catch (error) {
    console.error("getCourseEnrollments error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  enrollStudent,
  getStudentEnrollments,
  getEnrolledCourseModules,
  getCourseEnrollments,
};
