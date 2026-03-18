const db = require("../config/db");

async function findAdminByEmail(email) {
  const sql = `SELECT * FROM admin WHERE email = ?`;
  const [rows] = await db.execute(sql, [email]);
  return rows[0];
}

async function findAdminById(id) {
  const sql = "SELECT * FROM admin WHERE admin_id = ?";
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
}

const changeAdminPassword = async (id, newPassword) => {
  const sql = `UPDATE admin SET password = ? WHERE admin_id = ?`;
  const [rows] = await db.execute(sql, [newPassword, id]);
  return rows;
};
module.exports = { findAdminByEmail, findAdminById, changeAdminPassword };
