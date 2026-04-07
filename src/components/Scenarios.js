import React, { useEffect, useMemo, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "./Scenario.css";

// Fallback Card components
const Card = ({ children, style }) => (
  <div
    style={{
      backgroundColor: "#1a1d2e",
      borderRadius: 16,
      border: "1px solid #2d3148",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
);

const CardContent = ({ children, style }) => (
  <div style={{ padding: 16, textAlign: "center", ...style }}>{children}</div>
);

const COLORS = {
  ".NET": "#4F46E5",
  "Python": "#06B6D4",
  "Java": "#F59E0B",
  "JavaScript": "#FACC15",
  "Go": "#10B981",
  "Ruby": "#EC4899",
  "C++": "#EF4444"
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/scenario.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load scenario.json:", err);
        setLoading(false);
      });
  }, []);

  const [selectedSDK, setSelectedSDK] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const scenarioTableRef = useRef(null);
  const barChartRef = useRef(null);

  const totalScenarios = data.length;
  const totalServices = new Set(data.map(d => d.service)).size;
  const totalSDKs = new Set(data.flatMap(d => d.sdk)).size;

  // Pie chart data for SDK coverage
  const sdkPieData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      d.sdk.forEach(s => {
        map[s] = (map[s] || 0) + 1;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Bar chart data with full scenario included
  const scenarioBarData = useMemo(() => {
    if (!selectedSDK) return [];
    return data
      .filter(d => d.sdk.includes(selectedSDK))
      .map(d => ({
        name: d.scenario,
        service: d.service.toUpperCase(),
        operations: d.operations.length,
        full: d
      }));
  }, [selectedSDK, data]);

  if (loading) {
    return (
      <div style={{ padding: 32, backgroundColor: "#0f1117", minHeight: "100vh", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading scenarios...
      </div>
    );
  }

  return (
    <div style={{ padding: 32, backgroundColor: "#0f1117", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* KPI */}
      <div style={{ display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
        {[{ label: "Scenarios", value: totalScenarios }, { label: "Services", value: totalServices }, { label: "SDKs", value: totalSDKs }].map((kpi, i) => (
          <Card key={i} style={{ flex: "1 1 0", minWidth: 140 }}>
            <CardContent>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#f9fafb" }}>{kpi.value}</div>
              <div style={{ fontSize: 14, color: "#9ca3af" }}>{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PIE CHART */}
      <Card>
        <CardContent style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, color: "#f3f4f6" }}>SDK Coverage</h2>
          <div style={{ width: "100%", height: 500 }}>
          <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={sdkPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={130}
              labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
              label={({ name, percent, x, y, midAngle }) => {
                const RADIAN = Math.PI / 180;
                const radius = 160;
                const cx2 = x + Math.cos(-midAngle * RADIAN) * 20;
                const cy2 = y + Math.sin(-midAngle * RADIAN) * 20;
                return (
                  <text x={cx2} y={cy2} fill="#e5e7eb" fontSize={13} textAnchor={cx2 > 0 ? "start" : "end"} dominantBaseline="central">
                    {name} ({(percent * 100).toFixed(0)}%)
                  </text>
                );
              }}
              onClick={(e) => {
                setSelectedSDK(e.name);
                setSelectedScenario(null);
                setTimeout(() => {
                  barChartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
            >
              {sdkPieData.map((_, i) => (
                <Cell key={i} fill={COLORS[_.name] || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#1a1d2e", border: "1px solid #2d3148", color: "#e5e7eb" }} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 24, color: "#e5e7eb", fontSize: 14 }}
            />
          </PieChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* HORIZONTAL BAR */}
      {selectedSDK && (
        <div ref={barChartRef}>
        <Card>
          <CardContent style={{ textAlign: "left" }}>
            <h2 style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, color: "#f3f4f6" }}>
              {selectedSDK} Scenarios by Service
            </h2>
            <div style={{ width: "100%", minHeight: Math.max(300, scenarioBarData.length * 80 + 60) }}>
              <ResponsiveContainer width="100%" height={Math.max(300, scenarioBarData.length * 80 + 60)}>
              <BarChart
                data={scenarioBarData}
                layout="vertical"
                margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
                barGap={16}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: "#9ca3af" }} 
                  label={{ value: "Operations", position: "insideBottomRight", offset: -10, fill: "#d1d5db" }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={200} 
                  tick={{ fontSize: 14, fill: "#e5e7eb" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ backgroundColor: "#1a1d2e", border: "1px solid #2d3148", borderRadius: 8, padding: "8px 12px", color: "#e5e7eb" }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.service}</div>
                        <div>{d.operations} operations</div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="operations"
                  barSize={36}
                  radius={[8, 8, 8, 8]}
                  label={{ position: "right", fill: "#e5e7eb", fontSize: 12 }}
                  onClick={(bar) => {
                    setSelectedScenario(bar.full);
                    setTimeout(() => {
                      scenarioTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                >
                  {scenarioBarData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[selectedSDK] || COLORS[index % Object.keys(COLORS).length]} />
                  ))}
                </Bar>
              </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* FULL SCENARIO TABLE WITH OPERATIONS */}
      {selectedScenario && (
        <div ref={scenarioTableRef}>
        <Card>
          <CardContent style={{ textAlign: "left" }}>
            {/* Scenario Info Table */}
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, borderRadius: 12, overflow: "hidden", border: "1px solid #2d3148", marginBottom: 24 }}>
              <thead style={{ backgroundColor: "#232740" }}>
                <tr>
                  <th style={{ textAlign: "left", padding: 12, color: "#d1d5db" }}>Title</th>
                  <th style={{ textAlign: "left", padding: 12, color: "#d1d5db" }}>AWS Service</th>
                  <th style={{ textAlign: "left", padding: 12, color: "#d1d5db" }}>Synopsis</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#1a1d2e" }}>
                  <td style={{ padding: 12, fontSize: 14, color: "#e5e7eb" }}>{selectedScenario.scenario}</td>
                  <td style={{ padding: 12, fontSize: 14, color: "#e5e7eb" }}>{selectedScenario.service.toUpperCase()}</td>
                  <td style={{ padding: 12 }}>
                    <ul style={{ margin: 0, paddingLeft: 16, listStyleType: "disc" }}>
                      {selectedScenario.synopsis_list.map((s, i) => (
                        <li key={i} style={{ fontSize: 14, marginBottom: 6 }}>{s}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Operations Table with SDK badges */}
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Operations</div>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, borderRadius: 12, overflow: "hidden", border: "1px solid #2d3148" }}>
              <thead style={{ backgroundColor: "#232740" }}>
                <tr>
                  <th style={{ textAlign: "left", padding: 12, color: "#d1d5db" }}>Operation</th>
                  <th style={{ textAlign: "left", padding: 12, color: "#d1d5db" }}>SDK</th>
                </tr>
              </thead>
              <tbody>
                {selectedScenario.operations.map((op, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#1a1d2e" : "#1f2235" }}>
                    <td style={{ padding: 14, fontSize: 16, color: "#e5e7eb" }}>{op}</td>
                    <td style={{ padding: 14 }}>
                      {selectedScenario.sdk.map((s, j) => (
                        <span
                          key={j}
                          style={{
                            display: "inline-block",
                            padding: "5px 12px",
                            borderRadius: 10,
                            backgroundColor: COLORS[s] || "#888",
                            color: "white",
                            fontSize: 14,
                            fontWeight: 600,
                            marginRight: 6,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}