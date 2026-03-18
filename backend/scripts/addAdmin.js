require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db");
// to add admin manually
async function addAdmin() {
  const id = crypto.randomUUID();
  const hashed = await bcrypt.hash("admin@123", 10);
  
  const sql = "INSERT INTO admin (admin_id, name, email, password) VALUES (?, ?, ?, ?)";
  const result = await db.execute(sql, [id, "Admin", "admin@gmail.com", hashed]);
  console.log(result);

}

addAdmin();
