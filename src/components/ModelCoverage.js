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
  const [message, setMessage] = useState("");

  const operationsRef = useRef(null);

  useEffect(() => {
    setServices([]);
    setSelectedService(null);
    setLoading(false);
    setMessage("");

    if (language === "Java") {
      setMessage("Java has no model-driven examples");
      return;
    }

    if (
      language === "Kotlin" ||
      language === "NetV3" ||
      language === "NetV4" ||
      language === "Python" ||
      language === "PHP"
    ) {
      setLoading(true);

      let url;

      if (language === "Kotlin") {
        url = `/kotlinref2.json?_=${Date.now()}`;
      } else if (language === "NetV3") {
        url = `/csharp.json?_=${Date.now()}`;
      } else if (language === "NetV4") {
        url = `/csharp4.json?_=${Date.now()}`;
      } else if (language === "Python") {
        url = `/python.json?_=${Date.now()}`;
      } else if (language === "PHP") {
        url = `/PHP.json?_=${Date.now()}`;
      }

      fetch(url)
        .then(res => res.json())
        .then(json => {
          const svcRows = Array.isArray(json) ? json : [json];

          const mappedServices = svcRows.map(svc => ({
            serviceName: svc.service,
            serviceCode: svc.service,
            operations: Number(svc.operations) || 0,
            examples: Number(svc.examples) || 0,
            coveragePercent: svc.operations
              ? (svc.examples / svc.operations) * 100
              : 0,
            names: Array.isArray(svc.names) ? svc.names : []
          }));

          setServices(mappedServices);
        })
        .catch(err => console.error("Failed to load JSON", err))
        .finally(() => setLoading(false));

      return;
    }

    setServices([]);
  }, [language]);

  useEffect(() => {
    if (selectedService && operationsRef.current) {
      operationsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedService]);

  const loadServiceOperations = (serviceCode) => {
    const svc = services.find(s => s.serviceCode === serviceCode);
    if (!svc) return;

    const methods = (svc.names || []).map(n => ({
      name: n,
      found: true,
      languages: [
        language === "NetV3"
          ? ".NET v3"
          : language === "NetV4"
          ? ".NET v4"
          : language === "Kotlin"
          ? "Kotlin"
          : language === "Python"
          ? "Python"
          : "PHP"
      ]
    }));

    setSelectedService({
      ...svc,
      methods
    });
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

  if (loading)
    return (
      <div style={{ color: "white", padding: 20 }}>
        Loading model coverage…
      </div>
    );

  const totalOperations = services.reduce((sum, s) => sum + s.operations, 0);
  const totalExamples = services.reduce((sum, s) => sum + s.examples, 0);
  const totalServices = services.length;
  const missingExamples = totalOperations - totalExamples;

  const filteredServices = [...services].sort(
    (a, b) => b.coveragePercent - a.coveragePercent
  );

  const displayedMethods = selectedService
    ? selectedService.methods
        .filter(m => (showMissingOnly ? !m.found : true))
        .filter(m => (filterLang ? m.languages.includes(filterLang) : true))
    : [];

  const allLanguages = Array.from(
    new Set((selectedService?.methods || []).flatMap(m => m.languages || []))
  );

  const langColorMap = {};
  allLanguages.forEach(
    (lang, idx) =>
      (langColorMap[lang] = LANGUAGE_COLORS[idx % LANGUAGE_COLORS.length])
  );

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "#121212",
        color: "#e0e0e0",
        fontFamily: "Inter, Arial, sans-serif",
        minHeight: "100vh"
      }}
    >
      <h1>AWS Model Code Coverage</h1>

      <div style={{ marginBottom: 24 }}>
        <label style={{ marginRight: 12 }}>
          Select SDK Language:
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            backgroundColor: "#333",
            color: "#fff"
          }}
        >
          <option value="Kotlin">Kotlin</option>
          <option value="Java">Java</option>
          <option value="NetV3">.NET v3</option>
          <option value="NetV4">.NET v4</option>
          <option value="Python">Python</option>
          <option value="PHP">PHP</option>
        </select>
      </div>

      {message && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            backgroundColor: "#333",
            borderRadius: 6,
            color: "#f39c12",
            fontWeight: "bold"
          }}
        >
          {message}
        </div>
      )}

      {(language === "Kotlin" ||
        language === "NetV3" ||
        language === "NetV4" ||
        language === "Python" ||
        language === "PHP") && (
        <>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 24
            }}
          >
            <div
              style={{
                flex: "1 1 320px",
                backgroundColor: "#1e1e1e",
                borderRadius: 8,
                padding: 16
              }}
            >
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
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    <Cell fill="#2ecc71" />
                    <Cell fill="#e74c3c" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h2>Coverage by Service (%)</h2>
            <div
              style={{
                maxHeight: 420,
                overflowY: "auto",
                backgroundColor: "#1e1e1e",
                borderRadius: 8,
                padding: 8
              }}
            >
              <ResponsiveContainer
                width="100%"
                height={Math.max(filteredServices.length * 40, 240)}
              >
                <BarChart
                  layout="vertical"
                  data={filteredServices}
                  barSize={26}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "#e0e0e0", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="serviceName"
                    width={180}
                    tick={{ fill: "#e0e0e0", fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
                  <Bar
                    dataKey="coveragePercent"
                    radius={[5, 5, 5, 5]}
                    cursor="pointer"
                    onClick={(data) => {
                      if (data && data.payload)
                        loadServiceOperations(data.payload.serviceCode);
                    }}
                  >
                    {filteredServices.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          selectedService?.serviceCode ===
                          entry.serviceCode
                            ? "#f39c12"
                            : "#82ca9d"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {selectedService && (
            <div ref={operationsRef} style={{ marginTop: 20 }}>
              <h3>
                Operations for {selectedService.serviceName}
              </h3>

              <div
                style={{
                  marginBottom: 12,
                  display: "flex",
                  gap: 8
                }}
              >
                <span>Filter by Language:</span>

                {allLanguages.map(lang => (
                  <button
                    key={lang}
                    style={{
                      padding: "6px 10px",
                      backgroundColor:
                        filterLang === lang
                          ? langColorMap[lang]
                          : "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      setFilterLang(
                        filterLang === lang ? null : lang
                      )
                    }
                  >
                    {lang}
                  </button>
                ))}

                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: showMissingOnly
                      ? "#333"
                      : "#4CAF50",
                    color: "#fff"
                  }}
                  onClick={() => {
                    setShowMissingOnly(!showMissingOnly);
                    setFilterLang(null);
                  }}
                >
                  {showMissingOnly
                    ? "Missing Only"
                    : "Found / Missing"}
                </button>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#1e1e1e"
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#262626",
                    position: "sticky",
                    top: 0
                  }}
                >
                  <tr>
                    <th style={{ textAlign: "left", padding: 12 }}>
                      Operation Name
                    </th>
                    <th style={{ textAlign: "center", padding: 12 }}>
                      Found
                    </th>
                    <th style={{ textAlign: "left", padding: 12 }}>
                      Languages
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedMethods.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#aaa"
                        }}
                      >
                        No operations match the filter.
                      </td>
                    </tr>
                  )}

                  {displayedMethods.map((m, idx) => (
                    <tr
                      key={m.name}
                      style={{
                        backgroundColor:
                          idx % 2 === 0
                            ? "#171717"
                            : "#1d1d1d"
                      }}
                    >
                      <td style={{ padding: 12 }}>
                        {m.name}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: 12
                        }}
                      >
                        <span style={foundBadge(m.found)}>
                          {m.found ? "✅" : "❌"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: 12,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4
                        }}
                      >
                        {m.languages.map((lang, i) => (
                          <span
                            key={i}
                            style={badgeStyle(
                              langColorMap[lang] ||
                                LANGUAGE_COLORS[
                                  i % LANGUAGE_COLORS.length
                                ]
                            )}
                          >
                            {lang}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ModelCoverage;

