const { z } = require("zod");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getSuccessfulPayment,
  getPaymentsByStudent,
  getAllPayments,
} = require("../models/paymentModel");
const { getCourseById } = require("../models/courseModel");

// zod schemas
const initiatePaymentSchema = z.object({
  course_id: z.string().min(1, "course_id is required"),
});

const verifyPaymentSchema = z.object({
  payment_id: z.string().min(1, "payment_id is required"),
});

// POST /api/payments/initiate -- student only
// creates a pending payment record for a course
async function initiatePayment(req, res) {
  try {
    const validation = initiatePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { course_id } = validation.data;
    const student_id = req.user.user_id;

    // check course exists
    const course = await getCourseById(course_id);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // check student hasnt already paid for this course
    const alreadyPaid = await getSuccessfulPayment(student_id, course_id);
    if (alreadyPaid) {
      return sendResponse(res, 409, "You have already purchased this course");
    }

    // generate payment record
    const payment_id = crypto.randomUUID();
    const transaction_id = crypto.randomUUID(); // mock transaction id

    await createPayment({
      payment_id,
      course_id,
      student_id,
      amount: course.price,
      transaction_id,
    });

    // return payment_id so student can use it in /verify
    return sendResponse(res, 201, "Payment initiated successfully", {
      payment_id,
      transaction_id,
      amount: course.price,
    });
  } catch (error) {
    console.error("initiatePayment error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// POST /api/payments/verify -- student only
// simulates payment verification -- always succeeds in our case
async function verifyPayment(req, res) {
  try {
    const validation = verifyPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { payment_id } = validation.data;
    const student_id = req.user.user_id;

    // check payment exists
    const payment = await getPaymentById(payment_id);
    if (!payment) {
      return sendResponse(res, 404, "Payment not found");
    }

    // make sure this payment belongs to the student making the request
    if (payment.student_id !== student_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to verify this payment",
      );
    }

    // check payment isnt already verified
    if (payment.status === "success") {
      return sendResponse(res, 409, "Payment already verified");
    }

    // simulate payment -- flip status to success
    await updatePaymentStatus(payment_id, "success");

    return sendResponse(res, 200, "Payment verified successfully", {
      payment_id,
      course_id: payment.course_id,
      amount: payment.amount,
      status: "success",
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/payments/history -- student only
// returns all payments made by the logged in student
async function getPaymentHistory(req, res) {
  try {
    const student_id = req.user.user_id;

    const payments = await getPaymentsByStudent(student_id);
    if (!payments || payments.length === 0) {
      return sendResponse(res, 404, "No payment history found");
    }

    return sendResponse(
      res,
      200,
      "Payment history fetched successfully",
      payments,
    );
  } catch (error) {
    console.error("getPaymentHistory error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// GET /api/admin/payments -- admin only
// returns all transactions on the platform
async function getAllPaymentsHandler(req, res) {
  try {
    const payments = await getAllPayments();
    if (!payments || payments.length === 0) {
      return sendResponse(res, 404, "No payments found");
    }

    return sendResponse(
      res,
      200,
      "All payments fetched successfully",
      payments,
    );
  } catch (error) {
    console.error("getAllPayments error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
  getAllPaymentsHandler,
};
