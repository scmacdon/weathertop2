import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";

// Pie chart colors
const COLORS = ["#0088FE", "#FF8042"];
const LANGUAGE_COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#E7E9ED", "#8B0000", "#00FF00", "#FFD700",
  "#FF1493", "#1E90FF"
];

function Coverage() {
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [filterLang, setFilterLang] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    fetch("/summary.json")
      .then(res => res.json())
      .then(summary => {
        const services = summary.services.map(s => ({
          ...s,
          methods: []
        }));
        setData(services);
      })
      .catch(console.error);
  }, []);

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
    new Set(selectedService?.methods.flatMap(m => m.languages || []))
  );
  const langColorMap = {};
  allLanguages.forEach((lang, idx) => {
    langColorMap[lang] = LANGUAGE_COLORS[idx % LANGUAGE_COLORS.length];
  });

  const filteredServices = data
    .filter(s => (s.serviceName || "").toLowerCase().includes(serviceFilter.toLowerCase()))
    .sort((a, b) => (b.coveragePercent || 0) - (a.coveragePercent || 0));

  const loadServiceOperations = (serviceCode) => {
    const coverageFile = `/${serviceCode}.coverage.json`;
    fetch(coverageFile)
      .then(res => res.json())
      .then(serviceJson => {
        const svc = data.find(s => s.serviceCode === serviceCode);
        if (svc) {
          setSelectedService({
            ...svc,
            serviceName: svc.serviceName,
            methods: serviceJson.operations
          });
        }
      })
      .catch(err => {
        console.error(`Error loading ${coverageFile}:`, err);
        setSelectedService(null);
      });
  };

  const bgColor = "#121212";
  const panelBg = "#1e1e1e";
  const textColor = "#e0e0e0";
  const inputBg = "#2a2a2a";
  const inputColor = "#e0e0e0";
  const tableHeaderBg = "#2a2a2a";
  const tableRowBg = "#1e1e1e";
  const buttonBg = "#333";
  const buttonHoverBg = "#4CAF50";

  // Dynamically calculate heights
  const pieHeight = 300;
  const barChartMinHeight = 400;
  const barChartDynamicHeight = Math.max(filteredServices.length * 50, barChartMinHeight);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: bgColor, color: textColor, minHeight: "100vh" }}>
      <h1>AWS Coverage Dashboard</h1>

      {/* Global Coverage Pie */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
        <div style={{ flex: "1 1 300px", minWidth: "300px", maxWidth: "500px", height: pieHeight, backgroundColor: panelBg, borderRadius: "8px", padding: "15px" }}>
          <h2>Global Coverage</h2>

          {/* Stats */}
          <div style={{ marginBottom: "15px" }}>
            <p><strong>Total AWS Services:</strong> {totalServices}</p>
            <p><strong>Total Service Operations:</strong> {totalServiceOperations}</p>
            <p><strong>Total Documented Operations:</strong> {totalDocumentedOperations}</p>
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
          flex: "1 1 200px",
          minWidth: "200px",
          maxWidth: "400px",
          backgroundColor: panelBg,
          borderRadius: "8px",
          padding: "15px",
          color: textColor
        }}>
          <h3>About This Tool</h3>
          <p>
            This AWS Coverage Dashboard provides a clear overview of SDK code example coverage for all services.
          </p>
        </div>
      </div>

      {/* Coverage by Service */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Coverage by Service (%)</h2>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search service..."
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            style={{ padding: "5px 10px", width: "200px", backgroundColor: inputBg, color: inputColor, border: "1px solid #555", borderRadius: "4px" }}
          />
        </div>

        {/* Scrollable BarChart */}
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            overflowX: "hidden",
            border: "1px solid #555",
            padding: "10px",
            backgroundColor: panelBg,
            borderRadius: "8px"
          }}
        >
          <div style={{ minHeight: Math.max(filteredServices.length * 50, 400), width: "100%" }}>
            <ResponsiveContainer width="100%" height={Math.max(filteredServices.length * 50, 400)}>
              <BarChart
                layout="vertical"
                data={filteredServices}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                barSize={30}
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
                    <Cell
                      key={`cell-${index}`}
                      fill="#82ca9d"
                      style={{ transition: "fill 0.2s", outline: "none" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Selected service methods */}
      {selectedService && (
        <div style={{ marginTop: "20px" }}>
          <h3>Methods for {selectedService.serviceName}</h3>

          {/* Language Filter Buttons */}
          <div style={{ marginBottom: "10px" }}>
            <span>Filter by Language: </span>
            {allLanguages.map(lang => (
              <button
                key={lang}
                style={{
                  margin: "0 5px",
                  padding: "3px 8px",
                  backgroundColor: filterLang === lang ? langColorMap[lang] : buttonBg,
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={() => setFilterLang(filterLang === lang ? null : lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Found / Missing Toggle */}
          <div style={{ marginBottom: "10px" }}>
            <button
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: showMissingOnly ? "#333" : buttonHoverBg,
                color: "#fff"
              }}
              onClick={() => {
                setShowMissingOnly(!showMissingOnly);
                setFilterLang(null);
              }}
            >
              {showMissingOnly ? "Missing Only" : "Found / Missing"}
            </button>
          </div>

          {/* Methods Table */}
          <table
            border="1"
            cellPadding="5"
            style={{ borderCollapse: "collapse", width: "100%", backgroundColor: panelBg, color: textColor }}
          >
            <thead style={{ backgroundColor: tableHeaderBg }}>
              <tr>
                <th>Method Name</th>
                <th>Found</th>
                <th>Languages</th>
              </tr>
            </thead>
            <tbody>
              {displayedMethods.map(m => (
                <tr key={m.name} style={{ backgroundColor: tableRowBg }}>
                  <td>{m.name}</td>
                  <td>{m.found ? "✅" : "❌"}</td>
                  <td>
                    {m.languages?.map(lang => (
                      <span
                        key={lang}
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          margin: "0 3px 3px 0",
                          backgroundColor: langColorMap[lang],
                          color: "#fff",
                          borderRadius: "10px",
                          fontSize: "0.8em"
                        }}
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
    </div>
  );
}

export default Coverage;
