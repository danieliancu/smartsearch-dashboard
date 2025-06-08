import React, { useState, useEffect } from "react";

const AddIcon = () => <span style={{ cursor: 'pointer', color: 'orange', fontWeight: 'bold', marginLeft: 6, fontSize: 12 }}>＋</span>;
const RemoveIcon = () => <span style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold', marginLeft: 6 }}>×</span>;
const genId = () => "_" + Math.random().toString(36).slice(2, 11);

const configToState = (config) =>
  Object.entries(config || {}).map(([main, subs]) => ({
    id: genId(),
    main,
    mainEdit: main,
    subs: (subs || []).map(s => ({ id: genId(), value: s }))
  }));

const stateToConfig = (stateArr) =>
  Object.fromEntries(
    stateArr.map(item => [item.main, item.subs.map(s => s.value).filter(Boolean)])
  );

export default function SinonimeVizuale({ initialValue = {}, onSave }) {
  const [data, setData] = useState(() => configToState(initialValue));
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setData(configToState(initialValue));
    setActiveIdx(0);
  }, [JSON.stringify(initialValue)]);

  // Adaugă cuvânt principal
  const addMain = () => {
    let idx = 1;
    let newKey = "";
    while (!newKey || data.some(item => item.main === newKey)) {
      newKey = `nou-cuvant-${idx++}`;
    }
    setData(d => [
      { id: genId(), main: newKey, mainEdit: newKey, subs: [] },
      ...d
    ]);
    setActiveIdx(0);
  };

  // Șterge cuvânt principal, fără alertă
  const removeMain = (id) => {
    setData(d => {
      const idx = d.findIndex(item => item.id === id);
      const newArr = d.filter(item => item.id !== id);

      // Asigurare index valid
      setActiveIdx(prev => {
        if (newArr.length === 0) return 0;
        if (prev > idx) return prev - 1;
        if (prev === idx) return Math.max(0, prev - 1);
        return prev;
      });

      return newArr;
    });
  };

  const onMainEdit = (id, val) => setData(d => d.map(item => item.id === id ? { ...item, mainEdit: val } : item));
  const onMainBlur = (id) => setData(d => {
    const item = d.find(i => i.id === id);
    if (!item) return d;
    let newKey = item.mainEdit.trim();
    if (!newKey || newKey === item.main) return d;
    if (d.some(i => i.main === newKey)) {
      alert("Cuvântul există deja!");
      return d.map(i => i.id === id ? { ...i, mainEdit: item.main } : i);
    }
    return d.map(i =>
      i.id === id
        ? { ...i, main: newKey, mainEdit: newKey }
        : i
    );
  });
  const onMainKeyDown = (id, e) => { if (e.key === "Enter") e.target.blur(); };

  const addSub = (id) => setData(d =>
    d.map(item => item.id === id
      ? { ...item, subs: [...item.subs, { id: genId(), value: "" }] }
      : item
    )
  );
  const editSub = (mainId, subId, value) => setData(d =>
    d.map(item => item.id !== mainId
      ? item
      : { ...item, subs: item.subs.map(s => s.id === subId ? { ...s, value } : s) }
    )
  );
  const removeSub = (mainId, subId) => setData(d =>
    d.map(item => item.id !== mainId
      ? item
      : { ...item, subs: item.subs.filter(s => s.id !== subId) }
    )
  );

  const handleSave = () => {
    if (onSave) onSave(stateToConfig(data));
  };

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, gap: 20
      }}>
        <label>Sinonime produse:</label>
        <div>
          <button className="add-btn" style={{ fontSize: 14 }} type="button" onClick={addMain}>
            <AddIcon /> Adaugă cuvânt principal
          </button>
          <button className="save-btn" style={{ padding: 8, fontSize: 13, background: "#0070f3", color: "#fff" }} onClick={handleSave}>
            Salvează modificările
          </button>
        </div>
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: data.length ? 22 : 8,
        minHeight: 32
      }}>
        {data.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: i === activeIdx ? "#0070f3" : "#f4f8fc",
              color: i === activeIdx ? "#fff" : "#222",
              borderRadius: 20,
              padding: "2px 14px 2px 12px",
              fontWeight: 600,
              fontSize: 15,
              border: i === activeIdx ? "2px solid #0070f3" : "1px solid #d3e4fa",
              transition: "all 0.15s",
              marginRight: 5,
              cursor: "default",
            }}
          >
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                outline: "none",
                padding: 0,
                marginRight: 3,
              }}
              onClick={() => setActiveIdx(i)}
              tabIndex={-1}
              aria-label={`Selectează cuvântul principal ${item.mainEdit}`}
            >
              <input
                type="text"
                value={item.mainEdit}
                style={{
                  background: "transparent",
                  border: "none",
                  color: i === activeIdx ? "#fff" : "#1a3262",
                  fontWeight: 600,
                  width: Math.max(item.mainEdit.length + 3) + "ch",
                  fontSize: 15,
                  outline: "none",
                  marginBottom: 0,
                }}
                onChange={e => onMainEdit(item.id, e.target.value)}
                onBlur={() => onMainBlur(item.id)}
                onKeyDown={e => onMainKeyDown(item.id, e)}
              />
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#ff8484",
                fontSize: 15,
                marginLeft: 2,
                cursor: "pointer",
                padding: 0
              }}
              type="button"
              title="Șterge cu totul"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                removeMain(item.id);
              }}
            >
              <RemoveIcon />
            </button>
          </div>
        ))}
      </div>
      <div>
        {data.length > 0 && data[activeIdx] &&
        <div style={{ padding: "18px 14px 8px 14px", border: "1px solid #e0e0e0", borderRadius: 11, background: "#f9faff" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
            {data[activeIdx].subs.map(sub => (
              <div key={sub.id} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={sub.value}
                  onChange={e => editSub(data[activeIdx].id, sub.id, e.target.value)}
                  placeholder="Sinonim"
                  style={{ width: 190, marginRight: 6, borderRadius: 7, border: "1px solid #cce3ff", padding: "7px 11px", fontSize: 15 }}
                />
                <button style={{ background: "none", border: "none", marginLeft: "-38px", marginTop: "-10px", fontSize: 20 }}
                  type="button"
                  onClick={() => removeSub(data[activeIdx].id, sub.id)}>
                  <RemoveIcon />
                </button>
              </div>
            ))}
          </div>
            <button className="add-btn" style={{ marginTop: 7, fontSize: 13 }} type="button" onClick={() => addSub(data[activeIdx].id)}>
              <AddIcon /> Adaugă sinonim
            </button>
        </div>
        }
        {data.length === 0 &&
          <div style={{ color: "#aaa", marginTop: 30, fontSize: 15 }}>
            Niciun cuvânt principal adăugat.
          </div>
        }
      </div>
    </div>
  );
}
