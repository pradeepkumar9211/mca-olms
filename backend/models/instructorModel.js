const db = require("../config/db");

// register a new instructor
const createInstructor = async (
  instructor_id,
  name,
  email,
  hashedPassword,
  bio,
  skills,
  is_verified,
) => {
  const sql = `INSERT INTO instructor (instructor_id,name, email, password, bio,skills,is_verified) VALUES (?, ?, ?,?,?,?,?)`;
  const [result] = await db.execute(sql, [
    instructor_id,
    name,
    email,
    hashedPassword,
    bio,
    skills,
    is_verified,
  ]);
  return result;
};

// check if a instructor already exist using email id
const findInstructorByEmail = async (email) => {
  const sql = `SELECT * FROM instructor WHERE email = ?`;
  const [rows] = await db.execute(sql, [email]);
  return rows[0];
};

// get instructor details by id
const findInstructorById = async (id) => {
  const sql = `SELECT * FROM instructor WHERE instructor_id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

const changeInstructorPassword = async (id, newPassword) => {
  const sql = `UPDATE instructor SET password = ? WHERE instructor_id = ?`;
  const [rows] = await db.execute(sql, [newPassword, id]);
  return rows;
};

// get instructor dashboard stats
const getInstructorDashboardStats = async (instructor_id) => {
 // total courses created by instructor
  const [courses] = await db.execute(
    `SELECT COUNT(*) AS total FROM course WHERE instructor_id = ?`,
    [instructor_id]
  );

  // total enrollments across all instructor's courses
  const [enrollments] = await db.execute(
    `SELECT COUNT(e.enrollment_id) AS total
     FROM nrollments e
     JOIN course c ON e.course_id = c.course_id
     WHERE c.instructor_id = ?`,
    [instructor_id]
  );

  // avg rating across all instructor's courses
  const [rating] = await db.execute(
    `SELECT ROUND(AVG(r.rating), 1) AS avg_rating
     FROM review r
     JOIN course c ON r.course_id = c.course_id
     WHERE c.instructor_id = ?`,
    [instructor_id]
  );

  return {
    total_courses:     courses[0].total,
    total_enrollments: enrollments[0].total,
    avg_rating:        rating[0].avg_rating || 0,
  };
};

// update instructor profile
const updateInstructor = async (instructor_id, bio, skills) => {
  const [result] = await db.execute(
    `UPDATE instructor SET bio = ?, skills = ? WHERE instructor_id = ?`,
    [bio, skills, instructor_id],
  );
  return result.affectedRows;
};

const getAllInstructors = async () => {
  const [rows] = await db.execute(
    `SELECT instructor_id, name, email, bio, skills, is_verified, created_at 
     FROM instructor ORDER BY created_at DESC`
  );
  return rows;
};

const deleteInstructorById = async (instructor_id) => {
  const [result] = await db.execute(
    `DELETE FROM instructor WHERE instructor_id = ?`,
    [instructor_id]
  );
  return result.affectedRows;
};

const toggleInstructorVerification = async (instructor_id, status) => {
  const [result] = await db.execute(
    `UPDATE instructor SET is_verified = ? WHERE instructor_id = ?`,
    [status, instructor_id]
  );
  return result.affectedRows;
};

module.exports = {
  createInstructor,
  findInstructorByEmail,
  findInstructorById,
  changeInstructorPassword,
  getInstructorDashboardStats,
  updateInstructor,
  getAllInstructors,
  deleteInstructorById,
  toggleInstructorVerification
};
