import { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import SinonimeVizuale from "../components/SinonimeVizuale";


function DashboardSidebar({ groups, active, onSelect, open }) {
  return (
    <aside className={"dashboard-sidebar" + (open ? " open" : "")}>
          <span className="site-title">
            <span style={{ display:"inline-block", width:"100%" }}>smartsearch</span>
            <span className="site-title-sub">dashboard</span>
          </span>      
      {groups.map((group) => (
        <div
          key={group}
          className={
            "sidebar-group" + (active === group ? " active" : "")
          }
          onClick={() => {
            onSelect(group);
            if (window.innerWidth <= 900) document.body.click();
          }}
        >
          {group}
        </div>
      ))}
      <div className="user">User</div>
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
            onChange={e =>
              onConfig("products", "endpoint", e.target.value)
            }
          />
        </div>

        <div className="config-section">
          <SinonimeVizuale
            initialValue={sw}
            onChange={newValue => onConfig("products", "similarWords", newValue)}
          />
        </div>


        <div className="config-section">
          <label>Limită rezultate:</label>
          <input
            type="number"
            value={config.products.resultLimit}
            onChange={e =>
              onConfig("products", "resultLimit", Number(e.target.value))
            }
          />
        </div>
        <div className="config-section">
          <label>Timeout (ms):</label>
          <input
            type="number"
            value={config.products.defaultTimeout}
            onChange={e =>
              onConfig("products", "defaultTimeout", Number(e.target.value))
            }
          />
        </div>
        {saved && <div style={{color: "green", marginTop: 10}}>Salvat!</div>}
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
        {saved && <div style={{color: "green", marginTop: 10}}>Salvat!</div>}
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
        {saved && <div style={{color: "green", marginTop: 10}}>Salvat!</div>}
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
        {saved && <div style={{color: "green", marginTop: 10}}>Salvat!</div>}
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
        {saved && <div style={{color: "green", marginTop: 10}}>Salvat!</div>}
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

  useEffect(() => {
    import("../config/chatConfig").then((mod) => setConfig(mod.default));
  }, []);

  if (!config)
    return (
      <div className="dashboard-container">Loading...</div>
    );

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

  const handleSave = () => {
    setSaved(true);
    // Salvezi în backend aici
  };

  const handleOverlay = () => setSidebarOpen(false);

  return (
    <div className="dashboard-main">
      {/* Overlay mobil/tabletă */}
      <div
        className={
          "dashboard-overlay" + (sidebarOpen ? " visible" : "")
        }
        onClick={handleOverlay}
        aria-label="Închide meniul"
      />
      {/* Un singur buton – se schimbă ☰/× în funcție de stare */}
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
        <button className="save-btn" onClick={handleSave}>
          Salvează configurarea
        </button>
      </div>
    </div>
  );
}
