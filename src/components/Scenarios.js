import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import "./Scenario.css";

// Fallback Card components
const Card = ({ children, style }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: 16,
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      ...style,
    }}
  >
    {children}
  </div>
);

const CardContent = ({ children, style }) => (
  <div style={{ padding: 16, textAlign: "center", ...style }}>{children}</div>
);

// Sample Data
const data = [
  {
    id: "dynamodb_Scenario_GettingStartedMovies",
    service: "dynamodb",
    scenario: "Getting started with movies",
    sdk: [".NET", "Python", "Java"],
    operations: ["CreateTable", "PutItem", "GetItem", "DeleteTable"],
    synopsis_list: [
      "Create a table that can hold movie data.",
      "Put, get, and update a single movie in the table.",
      "Write movie data to the table from a sample JSON file.",
      "Query for movies that were released in a given year.",
      "Scan for movies that were released in a range of years.",
      "Delete a movie from the table, then delete the table."
    ]
  },
  {
    id: "ec2_Scenario_GetStartedInstances",
    service: "ec2",
    scenario: "Get started with EC2 instances",
    sdk: ["Java", "Python"],
    operations: ["RunInstances", "StopInstances", "TerminateInstances"],
    synopsis_list: [
      "Create a key pair and security group.",
      "Select an AMI and compatible instance type, then create an instance.",
      "Stop and restart the instance.",
      "Associate an Elastic IP address with your instance.",
      "Connect to your instance with SSH, then clean up resources."
    ]
  },
  {
    id: "glue_Scenario_GetStartedCrawlersJobs",
    service: "glue",
    scenario: "Glue crawlers and jobs",
    sdk: ["Python", "JavaScript"],
    operations: ["CreateJob", "StartJobRun", "DeleteJob"],
    synopsis_list: [
      "Create a crawler that crawls a public S3 bucket and generates a database of CSV-formatted metadata.",
      "List information about databases and tables.",
      "Create a job to extract CSV data, transform it, and load JSON output into another S3 bucket.",
      "List job runs, view transformed data, and clean up resources."
    ]
  }
];

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
  const [selectedSDK, setSelectedSDK] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

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
  }, []);

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
  }, [selectedSDK]);

  return (
    <div style={{ padding: 32, backgroundColor: "#f9fafb", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* KPI */}
      <div style={{ display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
        {[{ label: "Scenarios", value: totalScenarios }, { label: "Services", value: totalServices }, { label: "SDKs", value: totalSDKs }].map((kpi, i) => (
          <Card key={i} style={{ flex: "1 1 0", minWidth: 140 }}>
            <CardContent>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937" }}>{kpi.value}</div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PIE CHART */}
      <Card>
        <CardContent style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>SDK Coverage</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={sdkPieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              onClick={(e) => {
                setSelectedSDK(e.name);
                setSelectedScenario(null);
              }}
            >
              {sdkPieData.map((_, i) => (
                <Cell key={i} fill={COLORS[_.name] || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>

      {/* HORIZONTAL BAR */}
      {selectedSDK && (
        <Card>
          <CardContent>
            <h2 style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
              {selectedSDK} Scenarios by Service
            </h2>
            <div style={{ maxHeight: 450, overflowY: "auto" }}>
              <BarChart
                width={720}
                height={scenarioBarData.length * 60}
                data={scenarioBarData}
                layout="vertical"
                margin={{ top: 20, right: 60, left: 200, bottom: 20 }}
                barGap={12}
                barCategoryGap="40%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: "#374151" }} 
                  label={{ value: "Operations", position: "insideBottomRight", offset: -10, fill: "#111827" }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={220} 
                  tick={{ fontSize: 14, fill: "#1f2937" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  formatter={(value, name, props) => [`${value} ops`, props.payload.name]}
                />
                <Bar
                  dataKey="operations"
                  barSize={28}
                  radius={[8, 8, 8, 8]}
                  label={{ position: "right", fill: "#1f2937", fontSize: 12 }}
                  onClick={(bar) => setSelectedScenario(bar.full)}
                >
                  {scenarioBarData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[selectedSDK] || COLORS[index % Object.keys(COLORS).length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OPERATIONS TABLE WITH SDK BADGES */}
      {selectedScenario && (
        <Card>
          <CardContent style={{ textAlign: "left" }}>
            {/* Synopsis */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Synopsis</div>
              <ul style={{ marginLeft: 16, marginTop: 0, listStyleType: "disc" }}>
                {selectedScenario.synopsis_list.map((s, i) => (
                  <li key={i} style={{ fontSize: 14, marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Operations Table */}
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Operations</div>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  <th style={{ textAlign: "left", padding: 12 }}>Operation</th>
                  <th style={{ textAlign: "left", padding: 12 }}>SDK</th>
                </tr>
              </thead>
              <tbody>
                {selectedScenario.operations.map((op, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: 12, fontSize: 14 }}>{op}</td>
                    <td style={{ padding: 12 }}>
                      {selectedScenario.sdk.map((s, j) => (
                        <span
                          key={j}
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 8,
                            backgroundColor: COLORS[s] || "#888",
                            color: "white",
                            fontSize: 12,
                            fontWeight: 600,
                            marginRight: 4,
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
      )}
    </div>
  );
}