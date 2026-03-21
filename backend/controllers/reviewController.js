const { z } = require("zod");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const {
  createReview,
  getReviewByStudentAndCourse,
  getReviewById,
  getReviewsByCourse,
  getAvgRating,
  updateReview,
  deleteReview,
} = require("../models/reviewModel");
const { getEnrollment } = require("../models/enrollmentModel");
const { getCourseById } = require("../models/courseModel");

// zod schemas
const createReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review_text: z
    .string()
    .min(5, "Review must be at least 5 characters")
    .max(255),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  review_text: z.string().min(5).max(255).optional(),
});

// POST /api/reviews/:courseId -- student only
// submit a rating and review for a course
async function createReviewHandler(req, res) {
  try {
    const { courseId: course_id } = req.params;
    const student_id = req.user.user_id;

    // check course exists
    const course = await getCourseById(course_id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // student must be enrolled to review
    const enrollment = await getEnrollment(student_id, course_id);
    if (!enrollment) {
      return sendResponse(
        res,
        403,
        "You must be enrolled in this course to review it",
      );
    }

    // one review per student per course
    const existingReview = await getReviewByStudentAndCourse(
      student_id,
      course_id,
    );
    if (existingReview) {
      return sendResponse(res, 409, "You have already reviewed this course");
    }

    // validate input
    const validation = createReviewSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { rating, review_text } = validation.data;
    const review_id = crypto.randomUUID();

    await createReview(review_id, student_id, course_id, rating, review_text);

    return sendResponse(res, 201, "Review submitted successfully", {
      review_id,
    });
  } catch (error) {
    console.error("createReview error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/reviews/:courseId -- public
// get all reviews and avg rating for a course
async function getReviewsHandler(req, res) {
  try {
    const { courseId: course_id } = req.params;

    // check course exists
    const course = await getCourseById(course_id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    const reviews = await getReviewsByCourse(course_id);
    const ratingInfo = await getAvgRating(course_id);

    return sendResponse(res, 200, "Reviews fetched successfully", {
      avg_rating: ratingInfo.avg_rating,
      total_reviews: ratingInfo.total_reviews,
      reviews,
    });
  } catch (error) {
    console.error("getReviews error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// PUT /api/reviews/:reviewId -- student only
// edit own review
async function updateReviewHandler(req, res) {
  try {
    const { reviewId: review_id } = req.params;
    const student_id = req.user.user_id;

    // check review exists
    const review = await getReviewById(review_id);
    if (!review) {
      return sendResponse(res, 404, "Review not found");
    }

    // student can only edit their own review
    if (review.student_id !== student_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to edit this review",
      );
    }

    // validate input
    const validation = updateReviewSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    // merge existing data with updates
    const updatedRating = validation.data.rating ?? review.rating;
    const updatedReviewText = validation.data.review_text ?? review.review_text;

    const affected = await updateReview(
      review_id,
      updatedRating,
      updatedReviewText,
    );
    if (!affected) {
      return sendResponse(res, 400, "Nothing to update");
    }

    return sendResponse(res, 200, "Review updated successfully");
  } catch (error) {
    console.error("updateReview error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// DELETE /api/reviews/:reviewId -- student only
// delete own review
async function deleteReviewHandler(req, res) {
  try {
    const { reviewId: review_id } = req.params;
    const student_id = req.user.user_id;

    // check review exists
    const review = await getReviewById(review_id);
    if (!review) {
      return sendResponse(res, 404, "Review not found");
    }

    // student can only delete their own review
    if (review.student_id !== student_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to delete this review",
      );
    }

    const affected = await deleteReview(review_id);
    if (!affected) {
      return sendResponse(res, 404, "Review not found");
    }

    return sendResponse(res, 200, "Review deleted successfully");
  } catch (error) {
    console.error("deleteReview error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  createReviewHandler,
  getReviewsHandler,
  updateReviewHandler,
  deleteReviewHandler,
};
