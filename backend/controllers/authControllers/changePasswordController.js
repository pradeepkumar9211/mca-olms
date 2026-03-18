const bcrypt = require("bcrypt");
const { findAdminById, changeAdminPassword } = require("../../models/adminModel");
const { findInstructorById, changeInstructorPassword } = require("../../models/instructorModel");
const { findStudentById, changeStudentPassword } = require("../../models/studentModel");
const sendResponse = require("../../utils/sendResponse");

// Function to get user and password-change function based on role
function getRoleDependencies(role) {
  switch (role) {
    case "student":
      return { findById: findStudentById, changePassword: changeStudentPassword };
    case "instructor":
      return { findById: findInstructorById, changePassword: changeInstructorPassword };
    case "admin":
      return { findById: findAdminById, changePassword: changeAdminPassword };
    default:
      return null;
  }
}

// changing password
async function changePassword(req, res) {
  const { user_id, role } = req.user;
  const { oldPassword, newPassword } = req.body;

  // Basic input check
  if (!oldPassword || !newPassword) {
    return sendResponse(res, 400, "Old password and new password are required");
  }

  if (oldPassword === newPassword) {
    return sendResponse(res, 400, "New password must be different from old password");
  }

  const deps = getRoleDependencies(role);
  if (!deps) {
    return sendResponse(res, 403, "Invalid role");
  }

  try {
    const user = await deps.findById(user_id);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user["password"]);
    if (!isMatch) {
      return sendResponse(res, 401, "Old password is incorrect");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await deps.changePassword(user_id, newHashedPassword);

    return sendResponse(res, 200, "Password changed successfully");

  } catch (err) {
    console.error("Change password error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}

module.exports = changePassword;