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

// get student dashboard stats
const getStudentDashboardStats = async (student_id) => {
  console.log(student_id)
   // total enrollments
  const [enrollments] = await db.execute(
    `SELECT COUNT(*) AS total FROM Enrollments WHERE student_id = ?`,
    [student_id]
  );

  // total wishlist
  const [wishlist] = await db.execute(
    `SELECT COUNT(*) AS total FROM Wishlist WHERE student_id = ?`,
    [student_id]
  );

  // avg progress across all enrolled courses
  const [progress] = await db.execute(
    `SELECT
      ROUND(
        COUNT(DISTINCT p.content_id) / NULLIF(COUNT(DISTINCT cm.content_id), 0) * 100
      , 1) AS avg_progress
     FROM Enrollments e
     JOIN course_modules cm ON e.course_id  = cm.course_id
     LEFT JOIN progress p   ON cm.content_id = p.content_id
                           AND p.student_id  = ?
     WHERE e.student_id = ?`,
    [student_id, student_id]
  );

  return {
    total_enrollments: enrollments[0].total,
    total_wishlist:    wishlist[0].total,
    avg_progress:      progress[0].avg_progress || 0,
  };
};

// update student profile
const updateStudent = async (student_id, name, avatar) => {
  const [result] = await db.execute(
    `UPDATE student SET name = ?, avatar = ? WHERE student_id = ?`,
    [name, avatar, student_id],
  );
  return result.affectedRows;
};

module.exports = {
  createStudent,
  findStudentByEmail,
  findStudentById,
  changeStudentPassword,
  getStudentDashboardStats,
  updateStudent,
};
