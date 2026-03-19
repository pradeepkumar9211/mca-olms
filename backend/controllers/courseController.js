const { z } = require("zod");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getCoursesByInstructor,
  updateCourse,
  togglePublishCourse,
  deleteCourse,
  getCourseOwner,
} = require("../models/courseModel");

// -------------------------
// Zod Schemas
// -------------------------
const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(255),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  category_id: z.string().min(1, "Category is required"),
});

const updateCourseSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(255).optional(),
  price: z.number().min(0).optional(),
  thumbnail: z.string().url().optional(),
  category_id: z.string().optional(),
});

// -------------------------
// Get all courses
// Supports ?search= and ?category_id= query params
// -------------------------
async function getAllCoursesHandler(req, res) {
  try {
    const { search = "", category_id = null } = req.query;
    const courses = await getAllCourses(search, category_id);

    if (!courses || courses.length === 0) {
      return sendResponse(res, 404, "No courses found");
    }

    return sendResponse(res, 200, "Courses fetched successfully", courses);
  } catch (error) {
    console.error("getAllCourses error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Get course by ID
// -------------------------
async function getCourseByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);

    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    return sendResponse(res, 200, "Course fetched successfully", course);
  } catch (error) {
    console.error("getCourseById error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Get courses by category
// -------------------------
async function getCoursesByCategoryHandler(req, res) {
  try {
    const { id } = req.params;
    const courses = await getCoursesByCategory(id);

    if (!courses || courses.length === 0) {
      return sendResponse(res, 404, "No courses found for this category");
    }

    return sendResponse(res, 200, "Courses fetched successfully", courses);
  } catch (error) {
    console.error("getCoursesByCategory error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Get instructor's own courses
// -------------------------
async function getInstructorCoursesHandler(req, res) {
  try {
    const { user_id } = req.user;
    const courses = await getCoursesByInstructor(user_id);

    if (!courses || courses.length === 0) {
      return sendResponse(res, 404, "No courses found");
    }

    return sendResponse(res, 200, "Courses fetched successfully", courses);
  } catch (error) {
    console.error("getInstructorCourses error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Create a course — instructor only
// -------------------------
async function createCourseHandler(req, res) {
  try {
    const validation = createCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { title, description, price, thumbnail, category_id } =
      validation.data;
    const course_id = crypto.randomUUID();
    const instructor_id = req.user.user_id;

    await createCourse({
      course_id,
      title,
      description,
      instructor_id,
      price,
      thumbnail,
      category_id,
    });

    return sendResponse(res, 201, "Course created successfully", { course_id });
  } catch (error) {
    console.error("createCourse error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Update course — instructor (owner) only
// -------------------------
async function updateCourseHandler(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    // Ownership check
    const course = await getCourseOwner(id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }
    if (course.instructor_id !== user_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to update this course",
      );
    }

    const validation = updateCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const affected = await updateCourse(id, validation.data);
    if (!affected) {
      return sendResponse(res, 400, "Nothing to update");
    }

    return sendResponse(res, 200, "Course updated successfully");
  } catch (error) {
    console.error("updateCourse error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Toggle publish/unpublish — instructor (owner) only
// -------------------------
async function togglePublishCourseHandler(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    // Ownership check
    const course = await getCourseOwner(id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }
    if (course.instructor_id !== user_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to publish this course",
      );
    }

    await togglePublishCourse(id, course.is_published);

    const message = course.is_published
      ? "Course unpublished successfully"
      : "Course published successfully";

    return sendResponse(res, 200, message);
  } catch (error) {
    console.error("togglePublishCourse error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// -------------------------
// Delete course — instructor (owner) or admin
// -------------------------
async function deleteCourseHandler(req, res) {
  try {
    const { id } = req.params;
    const { user_id, role } = req.user;

    // Ownership check — skip for admin
    if (role === "instructor") {
      const course = await getCourseOwner(id);
      if (!course) {
        return sendResponse(res, 404, "Course not found");
      }
      if (course.instructor_id !== user_id) {
        return sendResponse(
          res,
          403,
          "You are not authorized to delete this course",
        );
      }
    }

    const affected = await deleteCourse(id);
    if (!affected) {
      return sendResponse(res, 404, "Course not found");
    }

    return sendResponse(res, 200, "Course deleted successfully");
  } catch (error) {
    console.error("deleteCourse error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  getAllCoursesHandler,
  getCourseByIdHandler,
  getCoursesByCategoryHandler,
  getInstructorCoursesHandler,
  createCourseHandler,
  updateCourseHandler,
  togglePublishCourseHandler,
  deleteCourseHandler,
};
