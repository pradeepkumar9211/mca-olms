const db = require("../config/db");

// create a pending payment record when student initiates payment
const createPayment = async (paymentData) => {
  const { payment_id, course_id, student_id, amount, transaction_id } =
    paymentData;

  const [result] = await db.execute(
    `INSERT INTO payments (payment_id, course_id, student_id, amount, transaction_id, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [payment_id, course_id, student_id, amount, transaction_id],
  );
  return result;
};

// flip payment status to success or failed
const updatePaymentStatus = async (payment_id, status) => {
  const [result] = await db.execute(
    `UPDATE payments SET status = ? WHERE payment_id = ?`,
    [status, payment_id],
  );
  return result.affectedRows;
};

// get a single payment by payment_id
// used in verify payment to check it exists and belongs to this student
const getPaymentById = async (payment_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM payments WHERE payment_id = ?`,
    [payment_id],
  );
  return rows[0];
};

// get payment by transaction_id
// used to prevent duplicate payments for same course
const getPaymentByTransactionId = async (transaction_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM payments WHERE transaction_id = ?`,
    [transaction_id],
  );
  return rows[0];
};

// check if student already has a successful payment for a course
// used before initiating a new payment
const getSuccessfulPayment = async (student_id, course_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM payments 
     WHERE student_id = ? AND course_id = ? AND status = 'success'`,
    [student_id, course_id],
  );
  return rows[0];
};

// get all payments made by a student -- for payment history
const getPaymentsByStudent = async (student_id) => {
  const [rows] = await db.execute(
    `SELECT 
      p.payment_id, p.amount, p.status, p.transaction_id, p.payment_date,
      c.title      AS course_title,
      c.thumbnail  AS course_thumbnail
     FROM payments p
     JOIN course c ON p.course_id = c.course_id
     WHERE p.student_id = ?
     ORDER BY p.payment_date DESC`,
    [student_id],
  );
  return rows;
};

// get all payments -- admin only
const getAllPayments = async () => {
  const [rows] = await db.execute(
    `SELECT 
      p.payment_id, p.amount, p.status, p.transaction_id, p.payment_date,
      c.title       AS course_title,
      s.name        AS student_name,
      s.email       AS student_email
     FROM payments p
     JOIN course c   ON p.course_id  = c.course_id
     JOIN student s  ON p.student_id = s.student_id
     ORDER BY p.payment_date DESC`,
  );
  return rows;
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPaymentByTransactionId,
  getSuccessfulPayment,
  getPaymentsByStudent,
  getAllPayments,
};
