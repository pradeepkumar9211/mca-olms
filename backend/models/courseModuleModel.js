const db = require("../config/db");

// -------------------------
// Add a module to a course
// -------------------------
const createModule = async (moduleData) => {
  const {
    content_id,
    course_id,
    title,
    content_type,
    video_url,
    file_url,
    duration,
    content_order,
  } = moduleData;

  const [result] = await db.execute(
    `INSERT INTO course_modules 
     (content_id, course_id, title, content_type, video_url, file_url, duration, content_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      content_id,
      course_id,
      title,
      content_type,
      video_url,
      file_url,
      duration,
      content_order,
    ],
  );
  return result;
};

// -------------------------
// Get all modules of a course
// Ordered by content_order
// -------------------------
const getModulesByCourseId = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT 
      content_id, course_id, title, content_type,
      video_url, file_url, duration, content_order
     FROM course_modules
     WHERE course_id = ?
     ORDER BY content_order ASC`,
    [course_id],
  );
  return rows;
};

// -------------------------
// Get single module by ID
// Used for update/delete ownership check
// -------------------------
const getModuleById = async (content_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM course_modules WHERE content_id = ?`,
    [content_id],
  );
  return rows[0];
};

// -------------------------
// Get last content_order in a course
// Used to auto-assign order when adding new module
// -------------------------
const getLastModuleOrder = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT MAX(content_order) AS last_order 
     FROM course_modules 
     WHERE course_id = ?`,
    [course_id],
  );
  return rows[0].last_order || 0;
};

// -------------------------
// Update a module
// -------------------------
const updateModule = async (content_id, moduleData) => {
  const { title, content_type, video_url, file_url, duration, content_order } =
    moduleData;

  const [result] = await db.execute(
    `UPDATE course_modules
     SET title = ?, content_type = ?, video_url = ?, 
         file_url = ?, duration = ?, content_order = ?
     WHERE content_id = ?`,
    [
      title,
      content_type,
      video_url,
      file_url,
      duration,
      content_order,
      content_id,
    ],
  );
  return result.affectedRows;
};

// -------------------------
// Delete a module
// -------------------------
const deleteModule = async (content_id) => {
  const [result] = await db.execute(
    `DELETE FROM course_modules WHERE content_id = ?`,
    [content_id],
  );
  return result.affectedRows;
};

// -------------------------
// Get total module count of a course
// Used for progress % calculation
// -------------------------
const getModuleCountByCourseId = async (course_id) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total FROM course_modules WHERE course_id = ?`,
    [course_id],
  );
  return rows[0].total;
};

module.exports = {
  createModule,
  getModulesByCourseId,
  getModuleById,
  getLastModuleOrder,
  updateModule,
  deleteModule,
  getModuleCountByCourseId,
};
