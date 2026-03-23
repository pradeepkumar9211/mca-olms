const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
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
} = require("../controllers/adminController");

const AdminRouter = Router();

// all admin routes are protected -- auth + admin role required
AdminRouter.use(userAuth, roleMiddleware("admin"));

// dashboard
AdminRouter.get("/dashboard", getAdminDashboard);

// students
AdminRouter.get("/students", getAllStudentsHandler);
AdminRouter.delete("/students/:id", deleteStudentHandler);

// instructors
AdminRouter.get("/instructors", getAllInstructorsHandler);
AdminRouter.patch("/instructors/:id/verify", toggleInstructorVerifyHandler);
AdminRouter.delete("/instructors/:id", deleteInstructorHandler);

// courses
AdminRouter.get("/courses", getAllCoursesHandler);
AdminRouter.patch("/courses/:id/approve", toggleCourseApprovalHandler);

// payments
AdminRouter.get("/payments", getAllPaymentsHandler);

// reviews
AdminRouter.delete("/reviews/:id", deleteReviewHandler);

module.exports = AdminRouter;
