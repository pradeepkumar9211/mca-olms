const sendResponse = require("../utils/sendResponse");
const { findAdminById } = require("../models/adminModel");
const {
  getAllStudents,
  deleteStudentById,
  findStudentById,
} = require("../models/studentModel");
const {
  getAllInstructors,
  deleteInstructorById,
  findInstructorById,
  toggleInstructorVerification,
} = require("../models/instructorModel");
const {
  getAllCoursesAdmin,
  deleteCourse,
  getCourseById,
  toggleCourseApproval,
} = require("../models/courseModel");
const { getAllPayments } = require("../models/paymentModel");
const { getReviewById, deleteReview } = require("../models/reviewModel");

// ── Students ──────────────────────────────────────

// GET /api/admin/students -- get all students
async function getAllStudentsHandler(req, res) {
  try {
    const students = await getAllStudents();
    if (!students || students.length === 0) {
      return sendResponse(res, 404, "No students found");
    }
    return sendResponse(res, 200, "Students fetched successfully", students);
  } catch (error) {
    console.error("getAllStudents error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// DELETE /api/admin/students/:id -- remove a student
async function deleteStudentHandler(req, res) {
  try {
    const { id: student_id } = req.params;

    const student = await findStudentById(student_id);
    if (!student || student.length === 0) {
      return sendResponse(res, 404, "Student not found");
    }

    await deleteStudentById(student_id);
    return sendResponse(res, 200, "Student deleted successfully");
  } catch (error) {
    console.error("deleteStudent error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// ── Instructors ───────────────────────────────────

// GET /api/admin/instructors -- get all instructors
async function getAllInstructorsHandler(req, res) {
  try {
    const instructors = await getAllInstructors();
    if (!instructors || instructors.length === 0) {
      return sendResponse(res, 404, "No instructors found");
    }
    return sendResponse(
      res,
      200,
      "Instructors fetched successfully",
      instructors,
    );
  } catch (error) {
    console.error("getAllInstructors error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// PATCH /api/admin/instructors/:id/verify -- toggle instructor verification
async function toggleInstructorVerifyHandler(req, res) {
  try {
    const { id: instructor_id } = req.params;

    const instructor = await findInstructorById(instructor_id);
    if (!instructor) {
      return sendResponse(res, 404, "Instructor not found");
    }

    // toggle current verification status
    console.log(instructor)
    const currentStatus = instructor["is_verified"];
    console.log(currentStatus)
    await toggleInstructorVerification(instructor_id, !currentStatus);

    const message = currentStatus
      ? "Instructor verification revoked"
      : "Instructor verified successfully";

    return sendResponse(res, 200, message, {
      instructor_id,
      is_verified: !currentStatus,
    });
  } catch (error) {
    console.error("toggleInstructorVerify error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// DELETE /api/admin/instructors/:id -- remove an instructor
async function deleteInstructorHandler(req, res) {
  try {
    const { id: instructor_id } = req.params;

    const instructor = await findInstructorById(instructor_id);
    if (!instructor || instructor.length === 0) {
      return sendResponse(res, 404, "Instructor not found");
    }

    await deleteInstructorById(instructor_id);
    return sendResponse(res, 200, "Instructor deleted successfully");
  } catch (error) {
    console.error("deleteInstructor error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// ── Courses ───────────────────────────────────────

// GET /api/admin/courses -- get all courses published + unpublished
async function getAllCoursesHandler(req, res) {
  try {
    const courses = await getAllCoursesAdmin();
    if (!courses || courses.length === 0) {
      return sendResponse(res, 404, "No courses found");
    }
    return sendResponse(res, 200, "Courses fetched successfully", courses);
  } catch (error) {
    console.error("getAllCourses admin error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// PATCH /api/admin/courses/:id/approve -- approve or remove a course
async function toggleCourseApprovalHandler(req, res) {
  try {
    const { id: course_id } = req.params;

    const course = await getCourseById(course_id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    const currentStatus = course.is_published;
    await toggleCourseApproval(course_id, !currentStatus);

    const message = currentStatus
      ? "Course removed from platform"
      : "Course approved successfully";

    return sendResponse(res, 200, message, {
      course_id,
      is_published: !currentStatus,
    });
  } catch (error) {
    console.error("toggleCourseApproval error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// ── Payments ──────────────────────────────────────

// GET /api/admin/payments -- get all transactions
async function getAllPaymentsHandler(req, res) {
  try {
    const payments = await getAllPayments();
    if (!payments || payments.length === 0) {
      return sendResponse(res, 404, "No payments found");
    }
    return sendResponse(res, 200, "Payments fetched successfully", payments);
  } catch (error) {
    console.error("getAllPayments error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// ── Reviews ───────────────────────────────────────

// DELETE /api/admin/reviews/:id -- moderate a review
async function deleteReviewHandler(req, res) {
  try {
    const { id: review_id } = req.params;

    const review = await getReviewById(review_id);
    if (!review) {
      return sendResponse(res, 404, "Review not found");
    }

    await deleteReview(review_id);
    return sendResponse(res, 200, "Review deleted successfully");
  } catch (error) {
    console.error("deleteReview admin error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// ── Dashboard ─────────────────────────────────────

// GET /api/admin/dashboard -- platform overview stats
async function getAdminDashboard(req, res) {
  try {
    const admin_id = req.user.user_id;

    // verify admin exists
    const admin = await findAdminById(admin_id);
    if (!admin) {
      return sendResponse(res, 404, "Admin not found");
    }

    // get all stats separately -- simple and clean
    const [{ db }] = [{ db: require("../config/db") }];

    const [[students]] = await db.execute(
      `SELECT COUNT(*) AS total FROM Student`,
    );
    const [[instructors]] = await db.execute(
      `SELECT COUNT(*) AS total FROM Instructor`,
    );
    const [[courses]] = await db.execute(
      `SELECT COUNT(*) AS total FROM Course`,
    );
    const [[enrollments]] = await db.execute(
      `SELECT COUNT(*) AS total FROM Enrollments`,
    );
    const [[revenue]] = await db.execute(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM Payments WHERE status = 'success'`,
    );

    // remove password before sending
    delete admin["password"];

    return sendResponse(res, 200, "Admin dashboard fetched successfully", {
      admin: admin,
      total_students: students.total,
      total_instructors: instructors.total,
      total_courses: courses.total,
      total_enrollments: enrollments.total,
      total_revenue: revenue.total,
    });
  } catch (error) {
    console.error("getAdminDashboard error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  getAllStudentsHandler,
  deleteStudentHandler,
  getAllInstructorsHandler,
  toggleInstructorVerifyHandler,
  deleteInstructorHandler,
  getAllCoursesHandler,
  toggleCourseApprovalHandler,
  getAllPaymentsHandler,
  deleteReviewHandler,
  getAdminDashboard,
};
