// pages/api/login.js
import { pool } from "../../lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Lipsesc date" });

  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (!users.length) return res.status(401).json({ error: "User sau parolă incorectă" });

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "User sau parolă incorectă" });

  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type      // <-- aici!
  });

  res.setHeader(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=7200`
  );
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type     // <-- aici!
    }
  });
}
