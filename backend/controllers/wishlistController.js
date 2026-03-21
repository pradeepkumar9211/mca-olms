const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const { z } = require("zod");
const {
  addToWishlist,
  getWishlistItem,
  getWishlistByStudent,
  removeFromWishlist,
} = require("../models/wishlistModel");
const { getCourseById } = require("../models/courseModel");
const { getEnrollment } = require("../models/enrollmentModel");

// zod schema
const wishlistSchema = z.object({
  course_id: z.string().min(1, "course_id is required"),
});

// POST /api/student/wishlist -- student only
// add a course to wishlist
async function addToWishlistHandler(req, res) {
  try {
    const validation = wishlistSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { course_id } = validation.data;
    const student_id = req.user.user_id;

    // check course exists
    const course = await getCourseById(course_id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // no point adding to wishlist if already enrolled
    const alreadyEnrolled = await getEnrollment(student_id, course_id);
    if (alreadyEnrolled) {
      return sendResponse(res, 409, "You are already enrolled in this course");
    }

    // check course isnt already in wishlist
    const alreadyInWishlist = await getWishlistItem(student_id, course_id);
    if (alreadyInWishlist) {
      return sendResponse(res, 409, "Course is already in your wishlist");
    }

    const wishlist_id = crypto.randomUUID();
    await addToWishlist(wishlist_id, student_id, course_id);

    return sendResponse(res, 201, "Course added to wishlist successfully", {
      wishlist_id,
    });
  } catch (error) {
    console.error("addToWishlist error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/student/wishlist -- student only
// get all courses in student's wishlist
async function getWishlistHandler(req, res) {
  try {
    const student_id = req.user.user_id;

    const wishlist = await getWishlistByStudent(student_id);
    if (!wishlist || wishlist.length === 0) {
      return sendResponse(res, 404, "Your wishlist is empty");
    }

    return sendResponse(res, 200, "Wishlist fetched successfully", wishlist);
  } catch (error) {
    console.error("getWishlist error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// DELETE /api/student/wishlist/:courseId -- student only
// remove a course from wishlist
async function removeFromWishlistHandler(req, res) {
  try {
    const { courseId: course_id } = req.params;
    const student_id = req.user.user_id;

    // check course is actually in wishlist
    const wishlistItem = await getWishlistItem(student_id, course_id);
    if (!wishlistItem) {
      return sendResponse(res, 404, "Course not found in your wishlist");
    }

    await removeFromWishlist(student_id, course_id);

    return sendResponse(res, 200, "Course removed from wishlist successfully");
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  addToWishlistHandler,
  getWishlistHandler,
  removeFromWishlistHandler,
};
