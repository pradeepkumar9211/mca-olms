const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  updateProgress,
  getProgress,
} = require("../controllers/progressController");

const ProgressRouter = Router();

// mark a lesson as watched -- student only
ProgressRouter.post(
  "/progress",
  userAuth,
  roleMiddleware("student"),
  updateProgress,
);

// get progress for a course -- student only
ProgressRouter.get(
  "/progress/:courseId",
  userAuth,
  roleMiddleware("student"),
  getProgress,
);

module.exports = ProgressRouter;
