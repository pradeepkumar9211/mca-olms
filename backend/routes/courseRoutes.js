const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  getAllCoursesHandler,
  getCourseByIdHandler,
  getCoursesByCategoryHandler,
  getInstructorCoursesHandler,
  createCourseHandler,
  updateCourseHandler,
  togglePublishCourseHandler,
  deleteCourseHandler,
} = require("../controllers/courseController");

const CourseRouter = Router();

// Public routes
// ✅✅✅✅✅ - get all published courses
CourseRouter.get("/", getAllCoursesHandler);
// ✅✅✅✅✅ - get all published courses by category id
CourseRouter.get("/category/:id", getCoursesByCategoryHandler);

// ✅✅✅✅✅ - get course by id
CourseRouter.get("/:id", getCourseByIdHandler);

// Instructor only
// ✅✅✅✅✅ - instructor specific courses
CourseRouter.get(
  "/instructor/my-courses",
  userAuth,
  roleMiddleware("instructor"),
  getInstructorCoursesHandler,
);

// ✅✅✅✅✅ - create course
CourseRouter.post(
  "/",
  userAuth,
  roleMiddleware("instructor"),
  createCourseHandler,
);

// ✅✅✅✅✅ - update course
CourseRouter.put(
  "/:id",
  userAuth,
  roleMiddleware("instructor"),
  updateCourseHandler,
);
// ✅✅✅✅✅ - toggle publish and unpublish
CourseRouter.patch(
  "/:id/publish",
  userAuth,
  roleMiddleware("instructor"),
  togglePublishCourseHandler,
);

// Instructor or admin
// ✅✅✅✅✅ - delete courses
CourseRouter.delete(
  "/:id",
  userAuth,
  roleMiddleware("instructor", "admin"),
  deleteCourseHandler,
);

module.exports = CourseRouter;
