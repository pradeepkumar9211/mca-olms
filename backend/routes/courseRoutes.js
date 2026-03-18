const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const CourseRouter = Router();

// Getting all the courses  -- not fully working as of now as join queries will be used after creating required tables
CourseRouter.get("/", getAllCourses);

// Getting  course info by Id   -- not fully working as of now as join queries will be used after creating required tables
CourseRouter.get("/:id", getCourseById);

// Creating a course - by Instructor only
CourseRouter.post("/", userAuth, roleMiddleware("instructor"), createCourse);

// Updating a course - by Instructor (owner) only Optional - Admin
CourseRouter.put(
  "/:id",
  userAuth,
  roleMiddleware("instructor", "admin"),
  updateCourse,
);

// Deleting a course - by Instructor (owner) and admin
CourseRouter.delete(
  "/:id",
  userAuth,
  roleMiddleware("instructor", "admin"),
  deleteCourse,
);

module.exports = CourseRouter;
