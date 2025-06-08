// lib/db.js
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartsearch-dashboard",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
