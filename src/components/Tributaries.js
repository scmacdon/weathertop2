import React, { useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#2ecc71", "#e74c3c"];

function Tributaries() {
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Placeholder summary data
  const totalRepos = 5;
  const totalExamples = 42;
  const missingExamples = 18;

  // Placeholder repo data
  const repos = [
    { name: "Community Repo A", examples: 12 },
    { name: "Community Repo B", examples: 8 },
    { name: "Community Repo C", examples: 10 },
    { name: "Community Repo D", examples: 6 },
    { name: "Community Repo E", examples: 6 }
  ];

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
      <h1>AWS Tributary Examples</h1>

      <div
        style={{
          marginBottom: 16,
          padding: 12,
          backgroundColor: "#1e1e1e",
          borderRadius: 6,
          color: "#bbb",
          lineHeight: 1.6
        }}
      >
        Placeholder: Tributary examples are sourced from additional GitHub
        repositories outside the core AWS Code Examples Library. These
        repositories demonstrate extended, specialized, and
        community-driven AWS use cases.
      </div>

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
          <h3>Tributary Overview</h3>
          <div>Total Repositories: {totalRepos}</div>
          <div>Total Examples: {totalExamples}</div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "Documented", value: totalExamples },
                  { name: "Placeholder Gap", value: missingExamples }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {COLORS.map((c, i) => (
                  <Cell key={i} fill={c} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2>Examples by Repository (Placeholder)</h2>
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: 8,
            padding: 8
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={repos}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#e0e0e0", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#e0e0e0", fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="examples"
                radius={[5, 5, 0, 0]}
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.payload) {
                    setSelectedRepo(data.payload);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedRepo && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: "#1e1e1e",
            borderRadius: 8
          }}
        >
          <h3>{selectedRepo.name}</h3>
          <p>
            Placeholder: This repository currently contains{" "}
            <strong>{selectedRepo.examples}</strong> tributary
            examples. Future enhancements will include detailed
            breakdowns, service mappings, and contribution insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default Tributaries;