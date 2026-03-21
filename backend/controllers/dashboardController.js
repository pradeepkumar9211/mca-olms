const { z } = require("zod");
const sendResponse = require("../utils/sendResponse");
const {
  findStudentById,
  getStudentDashboardStats,
  updateStudent,
} = require("../models/studentModel");
const {
  findInstructorById,
  getInstructorDashboardStats,
  updateInstructor,
} = require("../models/instructorModel");
const { getEnrollmentsByStudent } = require("../models/enrollmentModel");

// zod schemas
const updateStudentSchema = z.object({
  name: z.string().min(3).max(30).optional(),
  avatar: z.string().min(3).max(255).optional(),
});

const updateInstructorSchema = z.object({
  bio: z.string().min(10).max(255).optional(),
  skills: z.string().min(3).max(255).optional(),
});

// GET /api/student/dashboard -- student only
async function getStudentDashboard(req, res) {
  try {
    const student_id = req.user.user_id;
    // get student info
    const student = await findStudentById(student_id);
    if (!student) {
      return sendResponse(res, 404, "Student not found");
    }
    console.log(student)
    // get stats
    const stats = await getStudentDashboardStats(student_id);

    // get recently enrolled courses
    const enrollments = await getEnrollmentsByStudent(student_id);

    // remove password before sending
    delete student["password"];

    return sendResponse(res, 200, "Dashboard fetched successfully", {
      student: student,
      total_enrollments: stats.total_enrollments,
      total_wishlist: stats.total_wishlist,
      avg_progress: stats.avg_progress,
      recent_courses: enrollments.slice(0, 5), // last 5 enrolled courses
    });
  } catch (error) {
    console.error("getStudentDashboard error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/instructor/dashboard -- instructor only
async function getInstructorDashboard(req, res) {
  try {
    const instructor_id = req.user.user_id;

    // get instructor info
    const instructor = await findInstructorById(instructor_id);
    if (!instructor) {
      return sendResponse(res, 404, "Instructor not found");
    }

    // get stats
    const stats = await getInstructorDashboardStats(instructor_id);

    // remove password before sending
    delete instructor["password"];

    return sendResponse(res, 200, "Dashboard fetched successfully", {
      instructor: instructor,
      total_courses: stats.total_courses,
      total_enrollments: stats.total_enrollments,
      avg_rating: stats.avg_rating,
    });
  } catch (error) {
    console.error("getInstructorDashboard error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// PUT /api/student/profile -- student only
async function updateStudentProfile(req, res) {
  try {
    const student_id = req.user.user_id;

    const validation = updateStudentSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    // get existing student data for merge
    const student = await findStudentById(student_id);
    if (!student) {
      return sendResponse(res, 404, "Student not found");
    }

    const updatedName = validation.data.name ?? student["name"];
    const updatedAvatar = validation.data.avatar ?? student["avatar"];

    const affected = await updateStudent(
      student_id,
      updatedName,
      updatedAvatar,
    );
    if (!affected) {
      return sendResponse(res, 400, "Nothing to update");
    }

    return sendResponse(res, 200, "Profile updated successfully");
  } catch (error) {
    console.error("updateStudentProfile error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// PUT /api/instructor/profile -- instructor only
async function updateInstructorProfile(req, res) {
  try {
    const instructor_id = req.user.user_id;

    const validation = updateInstructorSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    // get existing instructor data for merge
    const instructor = await findInstructorById(instructor_id);
    if (!instructor) {
      return sendResponse(res, 404, "Instructor not found");
    }

    const updatedBio = validation.data.bio ?? instructor["bio"];
    const updatedSkills = validation.data.skills ?? instructor["skills"];

    const affected = await updateInstructor(
      instructor_id,
      updatedBio,
      updatedSkills,
    );
    if (!affected) {
      return sendResponse(res, 400, "Nothing to update");
    }

    return sendResponse(res, 200, "Profile updated successfully");
  } catch (error) {
    console.error("updateInstructorProfile error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  getStudentDashboard,
  getInstructorDashboard,
  updateStudentProfile,
  updateInstructorProfile,
};
