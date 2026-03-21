const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  getStudentDashboard,
  getInstructorDashboard,
  updateStudentProfile,
  updateInstructorProfile,
} = require("../controllers/dashboardController");

const DashboardRouter = Router();

// student dashboard and profile
DashboardRouter.get(
  "/student/dashboard",
  userAuth,
  roleMiddleware("student"),
  getStudentDashboard,
);
DashboardRouter.put(
  "/student/profile",
  userAuth,
  roleMiddleware("student"),
  updateStudentProfile,
);

// instructor dashboard and profile
DashboardRouter.get(
  "/instructor/dashboard",
  userAuth,
  roleMiddleware("instructor"),
  getInstructorDashboard,
);
DashboardRouter.put(
  "/instructor/profile",
  userAuth,
  roleMiddleware("instructor"),
  updateInstructorProfile,
);

module.exports = DashboardRouter;
