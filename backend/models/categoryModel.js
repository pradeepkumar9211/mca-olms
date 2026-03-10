const db = require("../config/db");

async function createCategory(id, name) {
  const sql = "INSERT INTO course_category (category_id,name) VALUES (?, ?)";
  const [rows] = await db.execute(sql, [id, name]);
  return rows;
}

async function getAllCategories() {
  const sql = "SELECT * FROM course_category";
  const [rows] = await db.execute(sql);
  return rows;
}

async function getCategoryById(id) {
  const sql = "SELECT * FROM course_category WHERE category_id = ?";
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
}

async function getCategoryByName(name) {
  const sql = "SELECT * FROM course_category WHERE name = ?";
  const [rows] = await db.execute(sql, [name]);
  return rows[0];
}

async function updateCategory(id, name) {
  console.log(name);
  const sql = "UPDATE course_category SET name = ? WHERE category_id = ?";
  const [rows] = await db.execute(sql, [name, id]);
  console.log(rows);
  return rows;
}

async function deleteCategory(id) {
  const sql = "DELETE FROM course_category WHERE category_id = ?";
  const [rows] = await db.execute(sql, [id]);
  return rows;
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryByName,
};
