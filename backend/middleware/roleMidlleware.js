const sendResponse = require("../utils/sendResponse");

function roleMiddleware(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, "Forbidden");
    }
    next();
  };
}

module.exports = roleMiddleware;
