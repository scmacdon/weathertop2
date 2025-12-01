import React, { useEffect, useState, useRef } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";

// Improved palette for readability with white text
const COLORS = ["#0088FE", "#FF8042"];
const LANGUAGE_COLORS = [
  "#e74c3c", "#3498db", "#f39c12", "#1abc9c",
  "#9b59b6", "#e67e22", "#2ecc71", "#34495e",
  "#16a085", "#8e44ad", "#d35400", "#2980b9"
];

function Coverage() {
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [filterLang, setFilterLang] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingService, setLoadingService] = useState(false);
  const [highlightHeader, setHighlightHeader] = useState(false);

  const methodsRef = useRef(null);

  // Scroll and highlight effect when a new service is selected
  useEffect(() => {
    if (selectedService && methodsRef.current) {
      methodsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightHeader(true);
      const timer = setTimeout(() => setHighlightHeader(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedService]);

  useEffect(() => {
    fetch("https://tiu7fhhnl1.execute-api.us-east-1.amazonaws.com/prod/summary")
      .then(res => res.json())
      .then(summary => {
        const services = summary.services.map(s => ({ ...s, methods: [] }));
        setData(services);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        color: "yellow",
        fontSize: "2rem",
        fontWeight: "bold"
      }}>
        Loading Summary Data...
      </div>
    );
  }

  if (loadingService) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "yellow",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        zIndex: 9999
      }}>
        Loading AWS Coverage Data...
      </div>
    );
  }

  const totalMethods = data.reduce((sum, s) => sum + (s.methodCount || 0), 0);
  const totalFound = data.reduce((sum, s) => sum + (s.foundCount || 0), 0);
  const totalMissing = totalMethods - totalFound;
  const totalServices = data.length;
  const totalServiceOperations = totalMethods;
  const totalDocumentedOperations = totalFound;

  const sortedMethods = selectedService
    ? [...selectedService.methods].sort((a, b) => {
      if (sortBy === "found") return a.found === b.found ? 0 : a.found ? -1 : 1;
      if (sortBy === "languageCount") return (b.languages?.length || 0) - (a.languages?.length || 0);
      return 0;
    })
    : [];

  const displayedMethods = sortedMethods
    .filter(m => (showMissingOnly ? !m.found : true))
    .filter(m => (filterLang ? m.languages?.includes(filterLang) : true));

  const allLanguages = Array.from(
    new Set((selectedService?.methods || []).flatMap(m => m.languages || []))
  );
  const langColorMap = {};
  allLanguages.forEach((lang, idx) => {
    langColorMap[lang] = LANGUAGE_COLORS[idx % LANGUAGE_COLORS.length];
  });

  const filteredServices = data
    .filter(s => (s.serviceName || "").toLowerCase().includes(serviceFilter.toLowerCase()))
    .sort((a, b) => (b.coveragePercent || 0) - (a.coveragePercent || 0));

  const loadServiceOperations = (serviceCode) => {
    const apiUrl = `https://znlueeckt7.execute-api.us-east-1.amazonaws.com/prod/coverage?service=${encodeURIComponent(serviceCode)}`;
    setLoadingService(true);

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(serviceJson => {
        const svc = data.find(s => s.serviceCode === serviceCode);
        if (svc) {
          setSelectedService({ ...svc, methods: serviceJson.operations });
        } else {
          setSelectedService({
            serviceCode,
            serviceName: serviceCode,
            methods: serviceJson.operations
          });
        }
      })
      .catch(err => {
        console.error(`Error loading ${apiUrl}:`, err);
        setSelectedService(null);
      })
      .finally(() => setLoadingService(false));
  };

  const bgColor = "#121212";
  const panelBg = "#1e1e1e";
  const textColor = "#e0e0e0";
  const inputBg = "#2a2a2a";
  const inputColor = "#e0e0e0";
  const tableHeaderBg = "#262626";
  const tableRowBg = "#171717";
  const rowAltBg = "#1d1d1d";
  const borderColor = "rgba(255,255,255,0.06)";
  const buttonBg = "#333";
  const buttonHoverBg = "#4CAF50";
  const pieHeight = 300;

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

  return (
    <div style={{
      padding: "20px 20px 40px 20px",
      fontFamily: "Inter, Arial, sans-serif",
      backgroundColor: bgColor,
      color: textColor,
      minHeight: "100vh",
      position: "relative"
    }}>
      <h1 style={{ margin: 0, marginBottom: 14, fontSize: "1.6rem" }}>AWS Coverage Dashboard</h1>

      {/* ---- GLOBAL COVERAGE PIE + INFO ---- */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginBottom: "24px" }}>
        <div style={{ flex: "1 1 300px", minWidth: "300px", maxWidth: "480px", height: pieHeight, backgroundColor: panelBg, borderRadius: "8px", padding: "14px", border: `1px solid ${borderColor}` }}>
          <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Global Coverage</h2>
          <div style={{ marginBottom: "10px", fontSize: "0.92rem" }}>
            <div><strong>Total AWS Services:</strong> {totalServices}</div>
            <div><strong>Total Service Operations:</strong> {totalServiceOperations}</div>
            <div><strong>Total Documented Operations:</strong> {totalDocumentedOperations}</div>
          </div>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie
                data={[
                  { name: "Found", value: totalFound },
                  { name: "Missing", value: totalMissing }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={value => `${value} methods`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          flex: "1 1 220px",
          minWidth: "220px",
          maxWidth: "420px",
          backgroundColor: panelBg,
          borderRadius: "8px",
          padding: "14px",
          color: textColor,
          border: `1px solid ${borderColor}`
        }}>
          <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>About This Tool</h3>
          <p style={{ margin: 0, fontSize: "0.92rem" }}>
            This AWS Coverage Dashboard provides a clear overview of SDK code example coverage for all services.
          </p>
        </div>
      </div>

      {/* ---- COVERAGE BY SERVICE ---- */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: "1.1rem" }}>Coverage by Service (%)</h2>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Search service..."
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              width: "260px",
              backgroundColor: inputBg,
              color: inputColor,
              border: "1px solid #333",
              borderRadius: "6px",
              fontSize: "0.95rem"
            }}
          />
        </div>

        <div
          style={{
            maxHeight: "420px",
            overflowY: "auto",
            overflowX: "hidden",
            border: `1px solid ${borderColor}`,
            padding: "8px",
            backgroundColor: panelBg,
            borderRadius: "8px"
          }}
        >
          <div style={{ minHeight: Math.max(filteredServices.length * 46, 240), width: "100%" }}>
            <ResponsiveContainer width="100%" height={Math.max(filteredServices.length * 46, 240)}>
              <BarChart
                layout="vertical"
                data={filteredServices}
                margin={{ top: 6, right: 8, bottom: 6, left: 8 }}
                barSize={26}
                onClick={(e) => {
                  if (e && e.activeTooltipIndex != null) {
                    const service = filteredServices[e.activeTooltipIndex];
                    loadServiceOperations(service.serviceCode);
                  }
                }}
              >
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: textColor }} />
                <YAxis type="category" dataKey="serviceName" width={180} tick={{ fontSize: 12, fill: textColor }} />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Bar
                  dataKey="coveragePercent"
                  radius={[5, 5, 5, 5]}
                  cursor="pointer"
                  onMouseLeave={() => setHoverIndex(null)}
                  onMouseEnter={(_, index) => setHoverIndex(index)}
                >
                  {filteredServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#82ca9d" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---- SELECTED SERVICE METHODS ---- */}
      {selectedService && (
        <div ref={methodsRef} style={{ marginTop: 6 }}>
          <h3 style={{ marginBottom: 10, fontSize: "1.05rem" }}>Methods for {selectedService.serviceName}</h3>

          <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.95rem" }}>Filter by Language:</span>
            {allLanguages.map(lang => (
              <button
                key={lang}
                style={{
                  margin: 0,
                  padding: "6px 10px",
                  backgroundColor: filterLang === lang ? (langColorMap[lang] || "#666") : buttonBg,
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
                onClick={() => setFilterLang(filterLang === lang ? null : lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <button
              style={{
                margin: "0 6px 6px 0",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: showMissingOnly ? "#333" : buttonHoverBg,
                color: "#fff",
                fontSize: "0.95rem"
              }}
              onClick={() => {
                setShowMissingOnly(!showMissingOnly);
                setFilterLang(null);
              }}
            >
              {showMissingOnly ? "Missing Only" : "Found / Missing"}
            </button>
          </div>

          <div style={{
            borderRadius: 8,
            overflow: "hidden",
            border: `1px solid ${borderColor}`,
            backgroundColor: "transparent"
          }}>
            <table
              border="0"
              cellPadding="8"
              style={{
                borderCollapse: "separate",
                width: "100%",
                backgroundColor: panelBg,
                color: textColor,
                tableLayout: "fixed",
                fontSize: "0.98rem"
              }}
            >
              <thead style={{
                backgroundColor: highlightHeader ? "#444" : tableHeaderBg,
                transition: "background-color 0.5s ease",
                position: "sticky",
                top: 0,
                zIndex: 2,
                boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.03)"
              }}>
                <tr>
                  <th style={{
                    width: "30%",
                    maxWidth: 380,
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    borderBottom: `1px solid ${borderColor}`
                  }}>
                    Method Name
                  </th>
                  <th style={{
                    width: 92,
                    textAlign: "center",
                    padding: "12px",
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    borderBottom: `1px solid ${borderColor}`
                  }}>
                    Found
                  </th>
                  <th style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    borderBottom: `1px solid ${borderColor}`
                  }}>
                    Languages
                  </th>
                </tr>
              </thead>

              <tbody>
                {displayedMethods.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: "16px", textAlign: "center", color: "#aaa" }}>
                      No methods match the current filters.
                    </td>
                  </tr>
                )}

                {displayedMethods.map((m, idx) => (
                  <tr key={m.name}
                      style={{
                        backgroundColor: idx % 2 === 0 ? tableRowBg : rowAltBg,
                        transition: "background-color 0.12s ease"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = (idx % 2 === 0 ? tableRowBg : rowAltBg)}
                  >
                    <td style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      maxWidth: 380,
                      padding: "12px",
                      verticalAlign: "middle"
                    }}>
                      <div style={{ fontSize: "1rem", lineHeight: 1.15 }}>{m.name}</div>
                    </td>

                    <td style={{
                      width: 92,
                      textAlign: "center",
                      verticalAlign: "middle",
                      padding: "12px"
                    }}>
                      <span style={foundBadge(!!m.found)}>
                        {m.found ? "✅" : "❌"}
                      </span>
                    </td>

                    <td style={{ padding: "12px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
                        {m.languages?.map((lang, i) => {
                          const bg = langColorMap[lang] || LANGUAGE_COLORS[i % LANGUAGE_COLORS.length];
                          return (
                            <span key={lang} style={badgeStyle(bg)}>
                              {lang}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}

export default Coverage;






