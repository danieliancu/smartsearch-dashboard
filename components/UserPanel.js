import { useState, useEffect } from "react";

export default function UserPanel({ onAuth }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
        if (onAuth) onAuth(data.user || null);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setForm({ email: "", password: "" });
      if (onAuth) onAuth(data.user);
    } else {
      const data = await res.json();
      setError(data.error || "Eroare autentificare");
      if (onAuth) onAuth(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    if (onAuth) onAuth(null);
  };

  if (loading) return null; // ascunde loaderul

  if (user) {
    // Nu mai afișa nimic dacă e logat, dashboard-ul va fi afișat de index.js
    return null;
  }

  return (
    <div style={{ maxWidth: 340, margin: "50px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 18px #d9e6f9", padding: 32 }}>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          required
          autoComplete="username"
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          style={{ padding: 12, borderRadius: 7, border: "1px solid #b5c6dd", fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={form.password}
          required
          autoComplete="current-password"
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          style={{ padding: 12, borderRadius: 7, border: "1px solid #b5c6dd", fontSize: 16 }}
        />
        <button
          type="submit"
          style={{ background: "#0070f3", color: "#fff", fontSize: 17, borderRadius: 8, padding: "10px 0", fontWeight: 600, marginTop: 10, border: "none" }}
          disabled={loading}
        >
          Login
        </button>
        {error && <div style={{ color: "red", marginTop: 5 }}>{error}</div>}
      </form>
    </div>
  );
}
