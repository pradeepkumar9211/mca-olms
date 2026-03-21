const db = require("../config/db");

// add a course to student's wishlist
const addToWishlist = async (wishlist_id, student_id, course_id) => {
  const [result] = await db.execute(
    `INSERT INTO wishlist (wishlist_id, student_id, course_id)
     VALUES (?, ?, ?)`,
    [wishlist_id, student_id, course_id],
  );
  return result;
};

// check if course is already in student's wishlist
// used before adding to prevent duplicates
const getWishlistItem = async (student_id, course_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM wishlist
     WHERE student_id = ? AND course_id = ?`,
    [student_id, course_id],
  );
  return rows[0];
};

// get all wishlist courses of a student
// includes course details so frontend doesnt need extra calls
const getWishlistByStudent = async (student_id) => {
  const [rows] = await db.execute(
    `SELECT
      w.wishlist_id, w.created_at,
      c.course_id, c.title, c.thumbnail, c.price,
      i.name                  AS instructor_name,
      cat.name                AS category_name,
      ROUND(AVG(r.rating), 1) AS avg_rating
     FROM wishlist w
     JOIN course c          ON w.course_id     = c.course_id
     JOIN instructor i      ON c.instructor_id = i.instructor_id
     JOIN course_category cat ON c.category_id = cat.category_id
     LEFT JOIN review r     ON c.course_id     = r.course_id
     WHERE w.student_id = ?
     GROUP BY w.wishlist_id
     ORDER BY w.created_at DESC`,
    [student_id],
  );
  return rows;
};

// remove a course from wishlist
const removeFromWishlist = async (student_id, course_id) => {
  const [result] = await db.execute(
    `DELETE FROM wishlist
     WHERE student_id = ? AND course_id = ?`,
    [student_id, course_id],
  );
  return result.affectedRows;
};

// get wishlist count for a student
// used in student dashboard
const getWishlistCount = async (student_id) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total FROM wishlist WHERE student_id = ?`,
    [student_id],
  );
  return rows[0].total;
};

module.exports = {
  addToWishlist,
  getWishlistItem,
  getWishlistByStudent,
  removeFromWishlist,
  getWishlistCount,
};
