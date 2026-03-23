const db = require("../config/db");

// -------------------------
// Create course
// -------------------------
const createCourse = async (courseData) => {
  const {
    course_id,
    title,
    description,
    instructor_id,
    price,
    thumbnail,
    category_id,
  } = courseData;

  const [result] = await db.execute(
    `INSERT INTO Course (course_id, title, description, instructor_id, price, thumbnail, category_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      course_id,
      title,
      description,
      instructor_id,
      price,
      thumbnail,
      category_id,
    ],
  );
  return result;
};

// -------------------------
// Get all published courses with JOINs
// Supports optional search and category filter
// -------------------------
const getAllCourses = async (search = "", category_id = null) => {
  let sql = `
    SELECT 
      c.course_id, c.title, c.description, c.price, c.thumbnail, c.created_at,
      i.name        AS instructor_name,
      cat.name      AS category_name,
      cat.category_id,
      ROUND(AVG(r.rating), 1)   AS avg_rating,
      COUNT(DISTINCT r.review_id)      AS total_reviews,
      COUNT(DISTINCT e.enrollment_id)  AS total_enrollments
    FROM course c
    JOIN instructor i       ON c.instructor_id = i.instructor_id
    JOIN course_category cat ON c.category_id  = cat.category_id
    LEFT JOIN review r      ON c.course_id     = r.course_id
    LEFT JOIN enrollments e ON c.course_id     = e.course_id
    WHERE c.is_published = TRUE
  `;

  const params = [];

  if (search) {
    sql += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category_id) {
    sql += ` AND c.category_id = ?`;
    params.push(category_id);
  }

  sql += ` GROUP BY c.course_id ORDER BY c.created_at DESC`;

  const [rows] = await db.execute(sql, params);
  return rows;
};

// -------------------------
// Get single course by ID (full detail)
// Includes modules, instructor, category, ratings
// -------------------------
const getCourseById = async (course_id) => {
  // Main course info
  const [courseRows] = await db.execute(
    `SELECT 
      c.course_id, c.title, c.description, c.price, c.thumbnail, c.created_at, c.is_published,
      i.name          AS instructor_name,
      i.bio           AS instructor_bio,
      i.instructor_id,
      cat.name        AS category_name,
      cat.category_id,
      ROUND(AVG(r.rating), 1)          AS avg_rating,
      COUNT(DISTINCT r.review_id)      AS total_reviews,
      COUNT(DISTINCT e.enrollment_id)  AS total_enrollments
    FROM course c
    JOIN instructor i        ON c.instructor_id = i.instructor_id
    JOIN course_category cat ON c.category_id   = cat.category_id
    LEFT JOIN review r       ON c.course_id     = r.course_id
    LEFT JOIN enrollments e  ON c.course_id     = e.course_id
    WHERE c.course_id = ?
    GROUP BY c.course_id`,
    [course_id],
  );

  if (!courseRows || courseRows.length === 0) return null;

  // Get course modules separately
  const [modules] = await db.execute(
    `SELECT content_id, title, content_type, duration, content_order
     FROM Course_Modules
     WHERE course_id = ?
     ORDER BY content_order ASC`,
    [course_id],
  );

  return { ...courseRows[0], modules };
};

// -------------------------
// Get courses by category
// -------------------------
const getCoursesByCategory = async (category_id) => {
  const [rows] = await db.execute(
    `SELECT 
      c.course_id, c.title, c.description, c.price, c.thumbnail,
      i.name        AS instructor_name,
      cat.name      AS category_name,
      ROUND(AVG(r.rating), 1)  AS avg_rating,
      COUNT(DISTINCT e.enrollment_id) AS total_enrollments
    FROM course c
    JOIN instructor i        ON c.instructor_id = i.instructor_id
    JOIN course_category cat ON c.category_id   = cat.category_id
    LEFT JOIN review r       ON c.course_id     = r.course_id
    LEFT JOIN enrollments e  ON c.course_id     = e.course_id
    WHERE c.category_id = ? AND c.is_published = TRUE
    GROUP BY c.course_id
    ORDER BY c.created_at DESC`,
    [category_id],
  );
  return rows;
};

// -------------------------
// Get all courses by a specific instructor
// -------------------------
const getCoursesByInstructor = async (instructor_id) => {
  const [rows] = await db.execute(
    `SELECT 
      c.course_id, c.title, c.description, c.price, c.thumbnail, 
      c.is_published, c.created_at,
      cat.name      AS category_name,
      ROUND(AVG(r.rating), 1)          AS avg_rating,
      COUNT(DISTINCT e.enrollment_id)  AS total_enrollments
    FROM course c
    JOIN course_category cat ON c.category_id = cat.category_id
    LEFT JOIN review r       ON c.course_id   = r.course_id
    LEFT JOIN enrollments e  ON c.course_id   = e.course_id
    WHERE c.instructor_id = ?
    GROUP BY c.course_id
    ORDER BY c.created_at DESC`,
    [instructor_id],
  );
  return rows;
};

// -------------------------
// Update course
// -------------------------
const updateCourse = async (course_id, courseData) => {
  const { title, description, price, thumbnail, category_id } = courseData;

  const [result] = await db.execute(
    `UPDATE course 
     SET title = ?, description = ?, price = ?, thumbnail = ?, category_id = ?
     WHERE course_id = ?`,
    [title, description, price, thumbnail, category_id, course_id],
  );
  return result.affectedRows;
};

// -------------------------
// Toggle publish/unpublish
// -------------------------
const togglePublishCourse = async (course_id, currentStatus) => {
  const [result] = await db.execute(
    `UPDATE course SET is_published = ? WHERE course_id = ?`,
    [!currentStatus, course_id],
  );
  return result.affectedRows;
};

// -------------------------
// Delete course
// -------------------------
const deleteCourse = async (course_id) => {
  const [result] = await db.execute("DELETE FROM course WHERE course_id = ?", [
    course_id,
  ]);
  return result.affectedRows;
};

// -------------------------
// Check course ownership
// Used before update/delete to verify instructor owns the course
// -------------------------
const getCourseOwner = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT instructor_id, is_published FROM course WHERE course_id = ?`,
    [course_id],
  );
  return rows[0];
};

// admin version -- returns ALL courses including unpublished
const getAllCoursesAdmin = async () => {
  const [rows] = await db.execute(
    `SELECT
      c.course_id, c.title, c.price, c.thumbnail,
      c.is_published, c.created_at,
      i.name   AS instructor_name,
      cat.name AS category_name,
      COUNT(DISTINCT e.enrollment_id) AS total_enrollments
     FROM course c
     JOIN instructor i        ON c.instructor_id = i.instructor_id
     JOIN course_category cat ON c.category_id   = cat.category_id
     LEFT JOIN enrollments e  ON c.course_id     = e.course_id
     GROUP BY c.course_id
     ORDER BY c.created_at DESC`
  );
  return rows;
};

const toggleCourseApproval = async (course_id, status) => {
  const [result] = await db.execute(
    `UPDATE course SET is_published = ? WHERE course_id = ?`,
    [status, course_id]
  );
  return result.affectedRows;
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getCoursesByInstructor,
  updateCourse,
  togglePublishCourse,
  deleteCourse,
  getCourseOwner,
  getAllCoursesAdmin,
  toggleCourseApproval
};
