const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  createReviewHandler,
  getReviewsHandler,
  updateReviewHandler,
  deleteReviewHandler,
} = require("../controllers/reviewController");

const ReviewRouter = Router();

// get all reviews for a course -- public
ReviewRouter.get("/:courseId", getReviewsHandler);

// submit a review -- student only, must be enrolled
ReviewRouter.post(
  "/:courseId",
  userAuth,
  roleMiddleware("student"),
  createReviewHandler,
);

// edit own review -- student only
ReviewRouter.put(
  "/:reviewId",
  userAuth,
  roleMiddleware("student"),
  updateReviewHandler,
);

// delete own review -- student only
ReviewRouter.delete(
  "/:reviewId",
  userAuth,
  roleMiddleware("student"),
  deleteReviewHandler,
);

module.exports = ReviewRouter;
