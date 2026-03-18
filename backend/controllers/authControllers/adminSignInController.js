const { z } = require("zod");
const bcrypt = require("bcrypt");
const { findAdminByEmail } = require("../../models/adminModel");
const sendResponse = require("../../utils/sendResponse");
const generateToken = require("../../utils/generateToken");

const schema = z.object({
  email: z.string().email("Invalid email format").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(30),
});

async function adminSignIn(req, res) {
  try {
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { email, password } = validation.data;

    const admin = await findAdminByEmail(email);
    if (!admin || admin.length === 0) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin[0].password);
    if (!isMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken(admin[0].admin_id, "admin");
    return sendResponse(res, 200, "Sign in successful", { token });

  } catch (err) {
    console.error("Admin signin error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}

module.exports = adminSignIn;