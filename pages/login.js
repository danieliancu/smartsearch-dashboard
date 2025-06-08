import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  // Dacă există deja sesiune, redirecționează direct pe dashboard (sau /)
  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => { if (data.user) router.replace("/"); });
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      router.replace("/"); // sau "/dashboard" dacă vrei să folosești altă rută
    } else {
      const data = await res.json();
      setError(data.error || "Eroare autentificare");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f7fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ marginTop: 80, color: "#0b214a", fontSize: 23, fontWeight: 600 }}>
        Autentifică-te pentru acces la dashboard.
      </div>
      <form
        onSubmit={handleLogin}
        style={{
          marginTop: 30,
          width: 340,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 18px #d9e6f9",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
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
          style={{
            background: "#0070f3",
            color: "#fff",
            fontSize: 17,
            borderRadius: 8,
            padding: "10px 0",
            fontWeight: 600,
            marginTop: 10,
            border: "none"
          }}
        >
          Login
        </button>
        {error && <div style={{ color: "red", marginTop: 5 }}>{error}</div>}
      </form>
    </div>
  );
}
