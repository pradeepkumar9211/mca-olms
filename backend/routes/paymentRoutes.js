const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");

const PaymentRouter = Router();

// initiate a payment for a course -- student only
PaymentRouter.post(
  "/initiate",
  userAuth,
  roleMiddleware("student"),
  initiatePayment,
);

// verify and confirm the payment -- student only
PaymentRouter.post(
  "/verify",
  userAuth,
  roleMiddleware("student"),
  verifyPayment,
);

// get logged in student's payment history
PaymentRouter.get(
  "/history",
  userAuth,
  roleMiddleware("student"),
  getPaymentHistory,
);

module.exports = PaymentRouter;
