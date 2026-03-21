const db = require("../config/db");

// create a new review for a course
const createReview = async (review_id, student_id, course_id, rating, review_text) => {
  const [result] = await db.execute(
    `INSERT INTO review (review_id, student_id, course_id, rating, review_text)
     VALUES (?, ?, ?, ?, ?)`,
    [review_id, student_id, course_id, rating, review_text]
  );
  return result;
};

// check if student already reviewed this course
// only one review per student per course allowed
const getReviewByStudentAndCourse = async (student_id, course_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM review
     WHERE student_id = ? AND course_id = ?`,
    [student_id, course_id]
  );
  return rows[0];
};

// get a single review by review_id
// used for update/delete ownership check
const getReviewById = async (review_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM review WHERE review_id = ?`,
    [review_id]
  );
  return rows[0];
};

// get all reviews for a course with avg rating
const getReviewsByCourse = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT
      r.review_id, r.rating, r.review_text, r.review_date,
      s.student_id, s.name AS student_name, s.avatar
     FROM review r
     JOIN student s ON r.student_id = s.student_id
     WHERE r.course_id = ?
     ORDER BY r.review_date DESC`,
    [course_id]
  );
  return rows;
};

// get avg rating for a course
// kept separate so it can be used independently
const getAvgRating = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT
      ROUND(AVG(rating), 1) AS avg_rating,
      COUNT(*)              AS total_reviews
     FROM review
     WHERE course_id = ?`,
    [course_id]
  );
  return rows[0];
};

// update a review -- student can only edit their own
const updateReview = async (review_id, rating, review_text) => {
  const [result] = await db.execute(
    `UPDATE review
     SET rating = ?, review_text = ?
     WHERE review_id = ?`,
    [rating, review_text, review_id]
  );
  return result.affectedRows;
};

// delete a review by review_id
const deleteReview = async (review_id) => {
  const [result] = await db.execute(
    `DELETE FROM review WHERE review_id = ?`,
    [review_id]
  );
  return result.affectedRows;
};

module.exports = {
  createReview,
  getReviewByStudentAndCourse,
  getReviewById,
  getReviewsByCourse,
  getAvgRating,
  updateReview,
  deleteReview,
};