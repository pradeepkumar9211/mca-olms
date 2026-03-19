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


const {
  getModulesHandler,
  createModuleHandler,
  updateModuleHandler,
  deleteModuleHandler,
} = require("../controllers/courseModuleController");

const CourseRouter = Router();

// public routes -- no auth needed here
// anyone can browse courses without logging in

// get all courses -- also supports ?search= and ?category_id= filters
CourseRouter.get("/", getAllCoursesHandler);

// get courses by category -- kept above /:id so "category" isnt treated as a course id
CourseRouter.get("/category/:id", getCoursesByCategoryHandler);

// instructor routes -- need auth + instructor role
// also kept above /:id for same reason as category route

// get all courses that belong to the logged in instructor
CourseRouter.get(
  "/instructor/my-courses",
  userAuth,
  roleMiddleware("instructor"),
  getInstructorCoursesHandler,
);

// create a new course -- only instructors can do this
CourseRouter.post(
  "/",
  userAuth,
  roleMiddleware("instructor"),
  createCourseHandler,
);

// dynamic routes below -- all use :id
// important -- static routes must always be above these
// otherwise express will confuse words like "category" or "instructor" as a course id

// get full info of a course by its id -- modules, ratings etc included
CourseRouter.get("/:id", getCourseByIdHandler);

// get all lessons/modules of a course -- public, no auth needed
CourseRouter.get("/:id/modules", getModulesHandler);

// add a new lesson to a course -- instructor only, also checks ownership inside controller
CourseRouter.post(
  "/:id/modules",
  userAuth,
  roleMiddleware("instructor"),
  createModuleHandler,
);

// update course details like title, price etc -- instructor must own the course
CourseRouter.put(
  "/:id",
  userAuth,
  roleMiddleware("instructor"),
  updateCourseHandler,
);

// update a specific lesson -- instructor must own the course
CourseRouter.put(
  "/:id/modules/:contentId",
  userAuth,
  roleMiddleware("instructor"),
  updateModuleHandler,
);

// publish or unpublish a course -- only the owner instructor can do this
CourseRouter.patch(
  "/:id/publish",
  userAuth,
  roleMiddleware("instructor"),
  togglePublishCourseHandler,
);

// delete a course -- both instructor (owner) and admin can delete
CourseRouter.delete(
  "/:id",
  userAuth,
  roleMiddleware("instructor", "admin"),
  deleteCourseHandler,
);

// delete a specific lesson from a course -- instructor only
CourseRouter.delete(
  "/:id/modules/:contentId",
  userAuth,
  roleMiddleware("instructor"),
  deleteModuleHandler,
);

module.exports = CourseRouter;
