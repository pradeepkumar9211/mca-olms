const mysql = require("mysql2/promise");

// Establishing Connection with MySQL using mysql2 package
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.mysql_password,
  database: "olms",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
