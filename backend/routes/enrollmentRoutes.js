const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  enrollStudent,
  getStudentEnrollments,
  getEnrolledCourseModules,
} = require("../controllers/enrollmentController");

const EnrollmentRouter = Router();

// enroll in a course after payment -- student only
EnrollmentRouter.post(
  "/enroll",
  userAuth,
  roleMiddleware("student"),
  enrollStudent,
);

// get all enrolled courses -- student only
EnrollmentRouter.get(
  "/enrollments",
  userAuth,
  roleMiddleware("student"),
  getStudentEnrollments,
);

// get modules of an enrolled course -- student only
EnrollmentRouter.get(
  "/courses/:id/modules",
  userAuth,
  roleMiddleware("student"),
  getEnrolledCourseModules,
);

module.exports = EnrollmentRouter;
