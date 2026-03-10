const db = require("../config/db");

// register a new student
const createStudent = async (
  student_id,
  name,
  email,
  hashedPassword,
  avatar,
) => {
  const sql = `INSERT INTO student (student_id,name, email, password, avatar) VALUES (?, ?, ?,?,?)`;
  const [result] = await db.execute(sql, [
    student_id,
    name,
    email,
    hashedPassword,
    avatar,
  ]);
  return result;
};

// check if a student already exist using email id
const findStudentByEmail = async (email) => {
  const sql = `SELECT * FROM student WHERE email = ?`;
  const [rows] = await db.execute(sql, [email]);
  console.log(rows[0]["password"]);
  return rows[0];
};

// get student details by id
const findStudentById = async (id) => {
  const sql = `SELECT id, name, email FROM student WHERE id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

module.exports = { createStudent, findStudentByEmail, findStudentById };
