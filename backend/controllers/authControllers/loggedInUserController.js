const { findAdminById } = require("../../models/adminModel");
const { findInstructorById } = require("../../models/instructorModel");
const { findStudentById } = require("../../models/studentModel");
const sendResponse = require("../../utils/sendResponse");

async function getMe(req, res) {
  const { user_id, role } = req.user; // comes from JWT via authMiddleware
  console.log(req.user);

  try {
    let user;
    
    if (role === "student") {
        console.log("hh");
        user = await findStudentById(user_id);
    } else if (role === "instructor") {
      user = await findInstructorById(user_id);
    } else if (role === "admin") {
      user = await findAdminById(user_id);
    }
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // Removing password before sending user data for security
    delete user["password"];

    return sendResponse(res, 200, "User fetched successfully", {...user,role});
  } catch (err) {
    return sendResponse(res, 500, "Internal server error");
  }
}

module.exports = getMe;
