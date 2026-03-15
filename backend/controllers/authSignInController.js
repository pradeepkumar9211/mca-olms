const z = require("zod");
const bcrypt = require("bcrypt");

const { findStudentByEmail } = require("../models/studentModel");
const { findInstructorByEmail } = require("../models/instructorModel");
const sendResponse = require("../utils/sendResponse");
const generateToken = require("../utils/generateToken");

// SigIn Handler
async function signIn(req, res) {
  const { role } = req.body;

  // Validate role explicitly
  if (role !== "student" && role !== "instructor") {
    return sendResponse(res, 422, "Invalid role");
  }

  const schema = z.object({
    email: z.email("Invalid email format").max(100),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30),
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return sendResponse(res, 422, "Invalid input", {
      errors: validation.error.flatten(),
    });
  }
  const { email, password } = validation.data;
  // -------------------------
  // Student or Instructor SignIn
  // -------------------------
  if (role === "student") {
    return studentSignIn(res, email, password, role);
  } else {
    return instructorSign(res, email, password, role);
  }
}

// Student SignIn Handler
async function studentSignIn(res, email, password, role) {
  try {
    const student = await findStudentByEmail(email);
    if (!student || student.length === 0) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const validPassword = await bcrypt.compare(password, student["password"]);
    if (!validPassword) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = generateToken(student["student_id"], role);
    return sendResponse(res, 200, "Sign in successful", { token });
  } catch (err) {
    console.error("Signin error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}
// Instructor SignIn Handler
async function instructorSign(res, email, password, role) {
  try {
    const instructor = await findInstructorByEmail(email);
    if (!instructor || instructor.length === 0) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const validPassword = await bcrypt.compare(
      password,
      instructor["password"],
    );
    if (!validPassword) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = generateToken(instructor["instructor_id"], role);

    return sendResponse(res, 200, "Sign in successful", { token });
  } catch (err) {
    console.error("Signin error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}

module.exports = signIn;
