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
  // console.log(rows[0]["password"]);
  return rows[0];
};

// get student details by id
const findStudentById = async (id) => {
  const sql = `SELECT student_id, name, email, password FROM student WHERE student_id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};
const changeStudentPassword = async (id, newPassword) => {
  const sql = `UPDATE student SET password = ? WHERE student_id = ?`;
  const [rows] = await db.execute(sql, [newPassword, id]);
  return rows;
};

module.exports = {
  createStudent,
  findStudentByEmail,
  findStudentById,
  changeStudentPassword,
};
