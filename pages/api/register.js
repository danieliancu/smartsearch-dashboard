// pages/api/register.js
import bcrypt from "bcryptjs";
import { pool } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email și parolă obligatorii" });

  // Verifică să nu existe deja
  const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (users.length) return res.status(409).json({ error: "User deja există" });

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, hash, name || null]
  );
  res.status(201).json({ ok: true });
}
