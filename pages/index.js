import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/Dashboard.css";
import SinonimeVizuale from "../components/SinonimeVizuale";
import Modal from "../components/Modal";

function DashboardSidebar({ groups, active, onSelect, open, onLogout, user, onSave }) {
  return (
    <aside className={"dashboard-sidebar" + (open ? " open" : "")} style={{ position: "relative" }}>
      <span className="site-title">
        <span style={{ display: "inline-block", width: "100%" }}>smartsearch</span>
        <span className="site-title-sub">dashboard</span>
      </span>
      {groups.map((group) => (
        <div key={group}>
          <div
            className={"sidebar-group" + (active === group ? " active" : "")}
            onClick={() => {
              onSelect(group);
              if (window.innerWidth <= 900) document.body.click();
            }}
          >
            {group}
          </div>
          {/* Butonul Salvează apare DOAR sub fallback */}
          {group === "fallback" && (
            <>
              <div style={{
                textAlign: "left",
                color: "#0b214a",
                fontWeight: 500,
                borderTop: "1px solid #d9e6f9",
                width: "100%",
                padding: "10px 20px",
                left: 0,
                position: "absolute",
                bottom: 0
              }}>
              {user?.name && <div style={{ fontSize: 16 }}>{user.name}</div>}

              {user?.type && (
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: user.type === "superadmin" ? "#22c55e" : "#2563eb", // verde pentru superadmin, albastru pentru admin
                  background: user.type === "superadmin" ? "#ecfdf5" : "#dbeafe",
                  borderRadius: 7,
                  display: "inline-block",
                  textTransform: "uppercase"
                }}>
                  {user.type}
                </div>
              )}

              <div style={{ fontSize: 14, color: "#38517a", wordBreak: "break-all" }}>
                {user?.email}
              </div>

                <button
                className="add-btn"
                onClick={onSave}
                style={{
                  background: "#22c55e", // Tailwind green-500
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  margin: "18px auto 6px auto",
                  padding: "11px 0"
                }}
                >
                  Salvează
                </button>
                <button
                  className="add-btn"
                  onClick={onLogout}
                  style={{
                    background: "black",
                    color: "rgb(255, 255, 255)",
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: "0 auto 10px auto",
                    padding: "9px 0"
                  }}
                >
                Logout
                </button>

              </div>
            </>
          )}
        </div>
      ))}
    </aside>
  );
}

function DashboardGroupPanel({ group, config, onConfig, saved }) {
  if (group === "products") {
    const sw = config.products.similarWords;
    return (
      <div>
        <div className="config-section">
          <label>Endpoint API:</label>
          <input
            type="text"
            value={config.products.endpoint}
            onChange={e => onConfig("products", "endpoint", e.target.value)}
          />
        </div>
        <div className="config-section">
          <SinonimeVizuale
            initialValue={sw}
            onSave={newValue => onConfig("products", "similarWords", newValue)}
          />
        </div>
        <div className="config-section">
          <label>Limită rezultate:</label>
          <input
            type="number"
            value={config.products.resultLimit}
            onChange={e => onConfig("products", "resultLimit", Number(e.target.value))}
          />
        </div>
        <div className="config-section">
          <label>Timeout (ms):</label>
          <input
            type="number"
            value={config.products.defaultTimeout}
            onChange={e => onConfig("products", "defaultTimeout", Number(e.target.value))}
          />
        </div>
      </div>
    );
  }

  if (group === "ai") {
    return (
      <div>
        <div className="config-section">
          <label>Model principal:</label>
          <input
            type="text"
            value={config.ai.model}
            onChange={e => onConfig("ai", "model", e.target.value)}
          />
        </div>
        <div className="config-section">
          <label>Model explicație:</label>
          <input
            type="text"
            value={config.ai.explanationModel}
            onChange={e => onConfig("ai", "explanationModel", e.target.value)}
          />
        </div>
        <div className="config-section">
          <label>System Prompt:</label>
          <textarea
            value={config.ai.systemPrompt}
            onChange={e => onConfig("ai", "systemPrompt", e.target.value)}
            style={{ minHeight: 90 }}
          />
        </div>
        <div className="config-section">
          <label>Prompt explicație:</label>
          <textarea
            value={config.ai.explanationPrompt}
            onChange={e => onConfig("ai", "explanationPrompt", e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>
      </div>
    );
  }

  if (group === "ui") {
    return (
      <div>
        <div className="config-section">
          <label>Titlu aplicație:</label>
          <input
            type="text"
            value={config.ui.appTitle}
            onChange={e => onConfig("ui", "appTitle", e.target.value)}
          />
        </div>
        <div className="config-section">
          <label>Placeholder input:</label>
          <input
            type="text"
            value={config.ui.inputPlaceholder}
            onChange={e => onConfig("ui", "inputPlaceholder", e.target.value)}
          />
        </div>
        <div className="config-section">
          <label>Text buton:</label>
          <input
            type="text"
            value={config.ui.sendButtonText}
            onChange={e => onConfig("ui", "sendButtonText", e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (group === "templates") {
    return (
      <div>
        <div className="config-section">
          <label>Card produs (HTML Mustache):</label>
          <textarea
            style={{ minHeight: 200 }}
            value={config.templates.productCard.template}
            onChange={e =>
              onConfig(
                "templates",
                "productCard",
                { ...config.templates.productCard, template: e.target.value }
              )
            }
          />
        </div>
        <div className="config-section">
          <label>Stiluri card (JSON):</label>
          <textarea
            style={{ minHeight: 140 }}
            value={JSON.stringify(config.templates.productCard.styles, null, 2)}
            onChange={e => {
              let value = e.target.value;
              try {
                onConfig(
                  "templates",
                  "productCard",
                  { ...config.templates.productCard, styles: JSON.parse(value) }
                );
              } catch {}
            }}
          />
        </div>
      </div>
    );
  }

  if (group === "fallback") {
    return (
      <div>
        <div className="config-section">
          <label>Mesaj lipsă rezultate:</label>
          <input
            type="text"
            value={config.fallback.notFound}
            onChange={e => onConfig("fallback", "notFound", e.target.value)}
          />
        </div>
        <div className="config-section">
          <label>Mesaj lipsă rezultate (singular):</label>
          <input
            type="text"
            value={config.fallback.notFoundSingle}
            onChange={e => onConfig("fallback", "notFoundSingle", e.target.value)}
          />
        </div>
        <div className="config-section">
          <label>Mesaj eroare:</label>
          <input
            type="text"
            value={config.fallback.error}
            onChange={e => onConfig("fallback", "error", e.target.value)}
          />
        </div>
      </div>
    );
  }

  return <div>Selectează un grup din stânga.</div>;
}

export default function Dashboard() {
  const [config, setConfig] = useState(null);
  const [activeGroup, setActiveGroup] = useState("products");
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({}); // {type, title, content, onOk}
  const router = useRouter();

  useEffect(() => {
    import("../config/chatConfig").then((mod) => setConfig(mod.default));
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setChecking(false);
        if (!data.user) router.replace("/login");
      })
      .catch(() => {
        setChecking(false);
        router.replace("/login");
      });
  }, [router]);

  if (checking || !config)
    return <div className="dashboard-container">Loading...</div>;

  if (!user) return null;

  const groups = ["products", "ai", "ui", "templates", "fallback"];

  const handleConfigChange = (section, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setSaved(false);
  };

  const handleTemplateChange = (section, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setSaved(false);
  };

  // Când se apasă "Salvează configurarea"
  const handleSave = () => {
    setSaved(true);
    setModalConfig({
      type: "save",
      title: "Succes",
      content: "Configurarea a fost salvată.",
      onOk: () => { setModalOpen(false); }
    });
    setModalOpen(true);
    // TODO: Salvezi în backend aici (de implementat)
  };

  const handleOverlay = () => setSidebarOpen(false);

  // Când se apasă "Logout"
  const handleLogout = () => {
    setModalConfig({
      type: "logout",
      title: "Delogare",
      content: "Ești sigur că vrei să te deloghezi?",
      onOk: async () => {
        setModalOpen(false);
        await fetch("/api/logout", { method: "POST" });
        router.replace("/login");
      }
    });
    setModalOpen(true);
  };

  return (
    <div className="dashboard-main">
      <Modal
        open={modalOpen}
        title={modalConfig.title}
        onClose={() => setModalOpen(false)}
        actions={
          modalConfig.type === "logout" ? (
            <>
              <button
                className="add-btn"
                style={{
                  background: "rgb(0, 112, 243)",
                  color: "#fff",
                  fontWeight: 700,
                  padding: "7px 22px",
                  borderRadius: 6
                }}
                onClick={modalConfig.onOk}
              >
                OK
              </button>
              <button
                className="add-btn"
                style={{
                  background: "black",
                  color: "white",
                  fontWeight: 600,
                  padding: "7px 22px",
                  borderRadius: 6,
                  border: "1px solid #bbb"
                }}
                onClick={() => setModalOpen(false)}
              >
                Anulează
              </button>
            </>
          ) : (
            <button
              className="add-btn"
              style={{
                background: "#22c55e",
                color: "#fff",
                fontWeight: 700,
                padding: "7px 22px",
                borderRadius: 6
              }}
              onClick={modalConfig.onOk}
            >
              OK
            </button>
          )
        }
      >
        {modalConfig.content}
      </Modal>

      <div
        className={
          "dashboard-overlay" + (sidebarOpen ? " visible" : "")
        }
        onClick={handleOverlay}
        aria-label="Închide meniul"
      />
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Închide meniul" : "Deschide meniul"}
      >
        {sidebarOpen ? "×" : "☰"}
      </button>
      <DashboardSidebar
        groups={groups}
        active={activeGroup}
        onSelect={setActiveGroup}
        open={sidebarOpen}
        onLogout={handleLogout}
        user={user}
        onSave={handleSave}
      />
      <div className="dashboard-content">
        <div className="dashboard-title">
          {activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)}
        </div>
        <DashboardGroupPanel
          group={activeGroup}
          config={config}
          onConfig={
            activeGroup === "templates"
              ? handleTemplateChange
              : handleConfigChange
          }
          saved={saved}
        />
      </div>
    </div>
  );
}
