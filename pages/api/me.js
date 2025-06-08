// pages/api/me.js
import { verifyToken } from "../../lib/auth";

export default function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return res.status(401).json({ user: null });

  const payload = verifyToken(match[1]);
  if (!payload) return res.status(401).json({ user: null });

  res.status(200).json({ user: payload });
}
