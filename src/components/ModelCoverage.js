import React, { useEffect, useState, useRef } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#2ecc71", "#e74c3c"];
const LANGUAGE_COLORS = [
  "#e74c3c", "#3498db", "#f39c12", "#1abc9c",
  "#9b59b6", "#e67e22", "#2ecc71", "#34495e",
  "#16a085", "#8e44ad", "#d35400", "#2980b9"
];

function ModelCoverage() {
  const [language, setLanguage] = useState("Kotlin");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [filterLang, setFilterLang] = useState(null);

  const operationsRef = useRef(null);

  // Load JSON once for bar chart
  useEffect(() => {
    if (language !== "Kotlin") return;

    setLoading(true);
    fetch(`/kotlinref.json?_=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        const svcRows = Object.entries(json.services).map(([name, stats]) => ({
          serviceName: name,
          serviceCode: name,
          operations: stats.operations,
          examples: stats.examples,
          coveragePercent: stats.operations ? (stats.examples / stats.operations) * 100 : 0,
          names: stats.names || []
        }));
        setServices(svcRows);
      })
      .catch(err => console.error("Failed to load kotlinref.json", err))
      .finally(() => setLoading(false));
  }, [language]);

  // Scroll to operations table when a service is selected
  useEffect(() => {
    if (selectedService && operationsRef.current) {
      operationsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedService]);

  // Load service operations on bar click
const loadServiceOperations = async (serviceCode) => {
  console.log("IN LOAD METHOF");
  try {
    const res = await fetch(`/kotlinref.json?_=${Date.now()}`); // bypass cache
    const json = await res.json();
    
    // FIX: JSON has services at top-level, not under `services`
    const stats = json[serviceCode];
    if (!stats) return;

    const methods = (stats.names || []).map(n => ({
      name: n,
      found: true,
      languages: ["Kotlin"]
    }));

    console.log("Number of operations:", methods.length); // should match JSON names array

    setSelectedService({
      serviceName: serviceCode,
      serviceCode,
      operations: stats.operations,
      examples: stats.examples,
      coveragePercent: stats.operations ? (stats.examples / stats.operations) * 100 : 0,
      methods
    });
  } catch (err) {
    console.error("Failed to load service operations", err);
  }
};


  const badgeStyle = (bg) => ({
    display: "inline-block",
    padding: "6px 10px",
    margin: "0 6px 6px 0",
    backgroundColor: bg,
    color: "#000",
    fontWeight: "bold",
    borderRadius: 20,
    fontSize: "0.78rem",
    lineHeight: 1,
    boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.12)",
    textTransform: "none",
    whiteSpace: "nowrap"
  });

  const foundBadge = (ok) => ({
    display: "inline-block",
    background: ok ? "#2ecc71" : "#c0392b",
    color: "#fff",
    padding: "6px 8px",
    borderRadius: 6,
    fontSize: "0.9rem",
    lineHeight: 1,
    boxShadow: "inset 0 -2px rgba(0,0,0,0.15)"
  });

  if (loading) return <div style={{ color: "white", padding: 20 }}>Loading Kotlin model coverage…</div>;

  const totalOperations = services.reduce((sum, s) => sum + s.operations, 0);
  const totalExamples = services.reduce((sum, s) => sum + s.examples, 0);
  const totalServices = services.length;
  const missingExamples = totalOperations - totalExamples;

  const filteredServices = [...services].sort((a, b) => b.coveragePercent - a.coveragePercent);

  const displayedMethods = selectedService
    ? selectedService.methods
        .filter(m => (showMissingOnly ? !m.found : true))
        .filter(m => (filterLang ? m.languages.includes(filterLang) : true))
    : [];

  const allLanguages = Array.from(
    new Set((selectedService?.methods || []).flatMap(m => m.languages || []))
  );
  const langColorMap = {};
  allLanguages.forEach((lang, idx) => langColorMap[lang] = LANGUAGE_COLORS[idx % LANGUAGE_COLORS.length]);

  return (
    <div style={{ padding: 20, backgroundColor: "#121212", color: "#e0e0e0", fontFamily: "Inter, Arial, sans-serif", minHeight: "100vh" }}>
      <h1>AWS Model Code Coverage</h1>

      {/* GLOBAL SUMMARY */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
        <div style={{ flex: "1 1 320px", backgroundColor: "#1e1e1e", borderRadius: 8, padding: 16 }}>
          <h3>Global Model Coverage</h3>
          <div>Total Services: {totalServices}</div>
          <div>Total Operations: {totalOperations}</div>
          <div>Total Model Examples: {totalExamples}</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "With Examples", value: totalExamples },
                  { name: "No Examples", value: missingExamples }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                <Cell fill="#2ecc71" />
                <Cell fill="#e74c3c" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SERVICE COVERAGE BAR */}
      <div style={{ marginBottom: 24 }}>
        <h2>Coverage by Service (%)</h2>
        <div style={{ maxHeight: 420, overflowY: "auto", backgroundColor: "#1e1e1e", borderRadius: 8, padding: 8 }}>
          <ResponsiveContainer width="100%" height={Math.max(filteredServices.length * 40, 240)}>
            <BarChart layout="vertical" data={filteredServices} barSize={26}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#e0e0e0", fontSize: 12 }} />
              <YAxis type="category" dataKey="serviceName" width={180} tick={{ fill: "#e0e0e0", fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
              <Bar
                dataKey="coveragePercent"
                radius={[5, 5, 5, 5]}
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.payload) {
                    loadServiceOperations(data.payload.serviceCode);
                  }
                }}
              >
                {filteredServices.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={selectedService?.serviceCode === entry.serviceCode ? "#f39c12" : "#82ca9d"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OPERATIONS TABLE */}
      {selectedService && (
        <div ref={operationsRef} style={{ marginTop: 20 }}>
          <h3>Operations for {selectedService.serviceName}</h3>

          <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
            <span>Filter by Language:</span>
            {allLanguages.map(lang => (
              <button
                key={lang}
                style={{
                  padding: "6px 10px",
                  backgroundColor: filterLang === lang ? langColorMap[lang] : "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
                onClick={() => setFilterLang(filterLang === lang ? null : lang)}
              >
                {lang}
              </button>
            ))}
            <button
              style={{ padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", backgroundColor: showMissingOnly ? "#333" : "#4CAF50", color: "#fff" }}
              onClick={() => {
                setShowMissingOnly(!showMissingOnly);
                setFilterLang(null);
              }}
            >
              {showMissingOnly ? "Missing Only" : "Found / Missing"}
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#1e1e1e" }}>
            <thead style={{ backgroundColor: "#262626", position: "sticky", top: 0 }}>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>Operation Name</th>
                <th style={{ textAlign: "center", padding: 12 }}>Found</th>
                <th style={{ textAlign: "left", padding: 12 }}>Languages</th>
              </tr>
            </thead>
            <tbody>
              {displayedMethods.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: 16, textAlign: "center", color: "#aaa" }}>No operations match the filter.</td>
                </tr>
              )}
              {displayedMethods.map((m, idx) => (
                <tr key={m.name} style={{ backgroundColor: idx % 2 === 0 ? "#171717" : "#1d1d1d" }}>
                  <td style={{ padding: 12 }}>{m.name}</td>
                  <td style={{ textAlign: "center", padding: 12 }}><span style={foundBadge(m.found)}>{m.found ? "✅" : "❌"}</span></td>
                  <td style={{ padding: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {m.languages.map((lang, i) => <span key={i} style={badgeStyle(langColorMap[lang] || LANGUAGE_COLORS[i % LANGUAGE_COLORS.length])}>{lang}</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ModelCoverage;
