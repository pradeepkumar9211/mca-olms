const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function userAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access Denied : No token Provided",
    });
  }

  const token = authHeader.replace("Bearer ", "");
  // console.log(`JWT TOKEN : ${token}`);
  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY);
    req.user = verified;
    // console.log(req.user);
    next();
  } catch (err) {
    return sendResponse(res,403,"Invalid or Expred Token")
  }
}

module.exports = userAuth;
