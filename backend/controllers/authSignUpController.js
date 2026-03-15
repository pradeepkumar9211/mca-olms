// signupController.js

/**
 * Signup Controller for Students and Instructors
 * -----------------------------------------------
 * This file handles:
 * 1. Input validation using Zod
 * 2. Password hashing using bcrypt
 * 3. Unique ID generation for each user
 * 4. Signup logic for students and instructors separately
 * 5. Consistent API responses
 */

const { z } = require("zod");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // For generating unique IDs

// Import student and instructor models
const student = require("../models/studentModel");
const instructor = require("../models/instructorModel");
const sendResponse = require("../utils/sendResponse");

// -------------------------
// Helper function: Send consistent API responses
// -------------------------
// -------------------------
// Zod Schemas for Input Validation
// -------------------------

// Base schema shared by both students and instructors
const baseUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(30),
  email: z.string().email("Invalid email format").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(30),
});

// Student-specific schema
const studentSchema = baseUserSchema.extend({
  avatar: z.string().min(3, "Avatar must be at least 3 characters").max(30),
});

// Instructor-specific schema
const instructorSchema = baseUserSchema.extend({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(255),
  skills: z.string().min(3, "Skills must be at least 3 characters").max(255),
});

// -------------------------
// Main Signup Controller
// -------------------------
async function signUp(req, res) {
  const { role } = req.body;

  // Validate role explicitly
  if (role !== "student" && role !== "instructor") {
    return sendResponse(res, 422, "Invalid role");
  }

  // -------------------------
  // Student Signup
  // -------------------------
  if (role === "student") {
    const validation = studentSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { name, email, password, avatar } = validation.data;

    // Generate unique ID and hash password
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    return studentSignup(res, id, name, email, hashedPassword, avatar);
  }

  // -------------------------
  // Instructor Signup
  // -------------------------
  const validation = instructorSchema.safeParse(req.body);
  if (!validation.success) {
    return sendResponse(res, 422, "Invalid input", {
      errors: validation.error.flatten(),
    });
  }

  const { name, email, password, bio, skills } = validation.data;
  const id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(password, 10);

  return instructorSignup(res, id, name, email, hashedPassword, bio, skills);
}

// -------------------------
// Student Signup Function
// -------------------------
async function studentSignup(res, id, name, email, hashedPassword, avatar) {
  try {
    // Check if email already exists
    const existingStudent = await student.findStudentByEmail(email);
    if (existingStudent) {
      return sendResponse(res, 409, "Email already in use");
    }

    // Create student in DB
    const result = await student.createStudent(
      id,
      name,
      email,
      hashedPassword,
      avatar,
    );

    return sendResponse(res, 201, "User signed up successfully");
  } catch (err) {
    console.error("Student signup error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}

// -------------------------
// Instructor Signup Function
// -------------------------
async function instructorSignup(
  res,
  id,
  name,
  email,
  hashedPassword,
  bio,
  skills,
) {
  try {
    // Check if email already exists
    const existingInstructor = await instructor.findInstructorByEmail(email);
    if (existingInstructor) {
      return sendResponse(res, 409, "Email already in use");
    }

    // Create instructor in DB (default is_verified = false)
    const result = await instructor.createInstructor(
      id,
      name,
      email,
      hashedPassword,
      bio,
      skills,
      false,
    );

    return sendResponse(res, 201, "User signed up successfully");
  } catch (err) {
    console.error("Instructor signup error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}

// Export the main signup function for routing
module.exports = signUp;
