const db = require("../config/db");

// Create course
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
    `INSERT INTO course 
     (course_id,title, description, instructor_id, price, thumbnail, category_id) 
     VALUES (?,?, ?, ?, ?, ?, ?)`,
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

// Get all courses-- Instructor and categoryid must be converted into names
const getAllCourses = async () => {
  const sql = "SELECT * FROM course";
  const [rows] = await db.execute(sql);
  return rows;
};

// Get course by ID-- Instructor and categoryid must be converted into names -- course modules as well because we need full info about course -- you can add count column as well to get the course enrolls -- ratings and reviews as well
const getCourseById = async (course_id) => {
  const sql = `
    SELECT c.course_id,c.title,c.price,c.thumbnail,c.description,i.name AS instructor_name,  cat.name AS category_name FROM course c JOIN instructor i ON c.instructor_id = i.instructor_id JOIN course_category cat ON c.category_id = cat.category_id WHERE c.course_id = ?  `;
  const [rows] = await db.execute(sql, [course_id]);
  return rows[0];
};

// Update course
// const updateCourse = async (id, courseData) => {
//   const { title, description, price, duration, level } = courseData;
//   const sql = `UPDATE course SET title=?, description=?, price=?, duration=?, level=? WHERE id=?`;
//   const [result] = await db.execute(sql, [
//     title,
//     description,
//     price,
//     duration,
//     level,
//     id,
//   ]);

//   return result;
// };

// Delete course
const deleteCourse = async (course_id) => {
  const sql = "DELETE FROM course WHERE course_id = ?";
  const [result] = await db.execute(sql, [course_id]);
  return result.affectedRows;
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  // updateCourse,
  deleteCourse,
};
