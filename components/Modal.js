// components/Modal.js
import React from "react";

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", zIndex: 10000, left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(23,32,50,0.18)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        minWidth: 340,
        maxWidth: 380,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 30px #38517a20",
        padding: 28,
        textAlign: "center",
        position: "relative"
      }}>
        {title && <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 14 }}>{title}</div>}
        <div style={{ fontSize: 16, marginBottom: 22 }}>{children}</div>
        <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
          {actions}
        </div>
        <button
          aria-label="Inchide"
          onClick={onClose}
          style={{
            position: "absolute", right: 13, top: 11, border: "none",
            background: "transparent", fontWeight: 800, fontSize: 21, color: "#bbb", cursor: "pointer"
          }}
        >×</button>
      </div>
    </div>
  );
}
