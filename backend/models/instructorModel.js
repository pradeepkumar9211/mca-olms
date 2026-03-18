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
  const sql = `SELECT instructor_id, name, email, password FROM instructor WHERE instructor_id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

const changeInstructorPassword = async (id, newPassword) => {
  const sql = `UPDATE instructor SET password = ? WHERE instructor_id = ?`;
  const [rows] = await db.execute(sql, [newPassword, id]);
  return rows;
};

module.exports = {
  createInstructor,
  findInstructorByEmail,
  findInstructorById,
  changeInstructorPassword,
};
