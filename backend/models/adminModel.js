const db = require("../config/db");

async function findAdminByEmail(email) {
  const sql = `SELECT * FROM admin WHERE email = ?`;
  const [rows] = await db.execute(sql, [email]);
  return rows[0];
}

module.exports = { findAdminByEmail };
