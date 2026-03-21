const crypto = require("crypto");
const db = require("../config/db");

// mark a lesson as watched / update last watched
// if record exists update it, if not create it
const upsertProgress = async (student_id, course_id, content_id) => {
  const progress_id = crypto.randomUUID();
  const [result] = await db.execute(
    `INSERT INTO progress (progress_id, content_id, course_id, student_id, last_watched, completed)
     VALUES (?, ?, ?, ?, NOW(), 100.00)
     ON DUPLICATE KEY UPDATE
       last_watched = NOW(),
       completed    = 100.00`,
    [progress_id, content_id, course_id, student_id]
  );
  return result;
};

// rest of the functions stay exactly the same
const getCourseProgress = async (student_id, course_id) => {
  const [rows] = await db.execute(
    `SELECT
      COUNT(DISTINCT cm.content_id)                                         AS total_modules,
      COUNT(DISTINCT p.content_id)                                          AS watched_modules,
      ROUND(
        COUNT(DISTINCT p.content_id) / NULLIF(COUNT(DISTINCT cm.content_id), 0) * 100
      , 1)                                                                  AS progress_percent,
      MAX(p.last_watched)                                                   AS last_watched
     FROM course_modules cm
     LEFT JOIN progress p ON cm.content_id = p.content_id
                         AND p.student_id  = ?
     WHERE cm.course_id = ?`,
    [student_id, course_id]
  );
  return rows[0];
};

const getModuleProgress = async (student_id, content_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM progress 
     WHERE student_id = ? AND content_id = ?`,
    [student_id, content_id]
  );
  return rows[0];
};

const getDetailedProgress = async (student_id, course_id) => {
  const [rows] = await db.execute(
    `SELECT
      cm.content_id, cm.title, cm.content_type,
      cm.duration,   cm.content_order,
      CASE WHEN p.content_id IS NOT NULL 
           THEN TRUE ELSE FALSE 
      END              AS is_watched,
      p.last_watched
     FROM course_modules cm
     LEFT JOIN progress p ON cm.content_id = p.content_id
                         AND p.student_id  = ?
     WHERE cm.course_id = ?
     ORDER BY cm.content_order ASC`,
    [student_id, course_id]
  );
  return rows;
};

module.exports = {
  upsertProgress,
  getCourseProgress,
  getModuleProgress,
  getDetailedProgress,
};