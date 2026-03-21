const db = require("../config/db");

// enroll a student in a course
const createEnrollment = async (enrollment_id, student_id, course_id) => {
  const [result] = await db.execute(
    `INSERT INTO enrollments (enrollment_id, student_id, course_id)
     VALUES (?, ?, ?)`,
    [enrollment_id, student_id, course_id],
  );
  return result;
};

// check if student is already enrolled in a course
// used before creating enrollment to prevent duplicates
const getEnrollment = async (student_id, course_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM enrollments 
     WHERE student_id = ? AND course_id = ?`,
    [student_id, course_id],
  );
  return rows[0];
};

// get all courses a student is enrolled in
// includes progress % per course
const getEnrollmentsByStudent = async (student_id) => {
  const [rows] = await db.execute(
    `SELECT 
      e.enrollment_id, e.enrollment_date,
      c.course_id, c.title, c.thumbnail, c.price,
      i.name                          AS instructor_name,
      cat.name                        AS category_name,
      ROUND(AVG(r.rating), 1)         AS avg_rating,
      COUNT(DISTINCT cm.content_id)   AS total_modules,
      COUNT(DISTINCT p.content_id)    AS watched_modules,
      ROUND(
        COUNT(DISTINCT p.content_id) / NULLIF(COUNT(DISTINCT cm.content_id), 0) * 100
      , 1)                            AS progress_percent
     FROM enrollments e
     JOIN course c          ON e.course_id     = c.course_id
     JOIN instructor i      ON c.instructor_id = i.instructor_id
     JOIN course_category cat ON c.category_id = cat.category_id
     LEFT JOIN review r     ON c.course_id     = r.course_id
     LEFT JOIN course_modules cm ON c.course_id = cm.course_id
     LEFT JOIN progress p   ON cm.content_id   = p.content_id
                           AND p.student_id    = e.student_id
     WHERE e.student_id = ?
     GROUP BY e.enrollment_id
     ORDER BY e.enrollment_date DESC`,
    [student_id],
  );
  return rows;
};

// get all students enrolled in a specific course
// used by instructor to see who enrolled in their course
const getEnrollmentsByCourse = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT 
      e.enrollment_id, e.enrollment_date,
      s.student_id, s.name AS student_name, s.email, s.avatar,
      ROUND(
        COUNT(DISTINCT p.content_id) / NULLIF(COUNT(DISTINCT cm.content_id), 0) * 100
      , 1)                 AS progress_percent
     FROM enrollments e
     JOIN student s        ON e.student_id  = s.student_id
     LEFT JOIN course_modules cm ON e.course_id = cm.course_id
     LEFT JOIN progress p  ON cm.content_id = p.content_id
                          AND p.student_id  = e.student_id
     WHERE e.course_id = ?
     GROUP BY e.enrollment_id
     ORDER BY e.enrollment_date DESC`,
    [course_id],
  );
  return rows;
};

// get total enrollment count for a course
// used in dashboard stats
const getEnrollmentCountByCourse = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total FROM enrollments WHERE course_id = ?`,
    [course_id],
  );
  return rows[0].total;
};

// get total enrollment count for an instructor across all their courses
// used in instructor dashboard
const getEnrollmentCountByInstructor = async (instructor_id) => {
  const [rows] = await db.execute(
    `SELECT COUNT(e.enrollment_id) AS total
     FROM enrollments e
     JOIN course c ON e.course_id = c.course_id
     WHERE c.instructor_id = ?`,
    [instructor_id],
  );
  return rows[0].total;
};

module.exports = {
  createEnrollment,
  getEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  getEnrollmentCountByCourse,
  getEnrollmentCountByInstructor,
};
