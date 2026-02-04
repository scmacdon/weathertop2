import React from "react";

const sectionHeadingStyle = {
  fontSize: "2rem",
  marginBottom: "1.5rem",
  color: "#00cfcf",
  textAlign: "center",
};

const subtitleStyle = {
  color: "#66cccc",
  fontSize: "1.1rem",
  textAlign: "center",
  marginBottom: "2rem",
  maxWidth: "800px",
  marginInline: "auto",
  lineHeight: 1.6,
};

const cardContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.25rem",
  padding: "0 1rem",
};

const cardStyle = {
  backgroundColor: "#121212",
  borderRadius: "14px",
  padding: "1.5rem",
  boxShadow: "0 0 1px #00cfcf, 0 0 3px #66cccc",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  cursor: "pointer",
  color: "#fff",
};

const iconStyle = {
  fontSize: "2rem",
  marginBottom: "0.75rem",
};

const cardTitleStyle = {
  fontSize: "1.25rem",
  marginBottom: "0.5rem",
};

const cardDescStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.45",
  color: "#bbb",
};

export default function GettingStarted() {
  const cards = [
    [
      "🧪",
      "Code Testing",
      "Explore Weathertop's powerful Code Testing features: view SDK test coverage, check which AWS services have full or partial tests, monitor pass/fail rates, and interactively analyze integration tests...",
    ],
    [
      "📊",
      "Code Coverage",
      "The Coverage Dashboard visualizes documentation coverage for all AWS services. Instantly identify missing code examples, method-level documentation gaps, and service-wide coverage percentages...",
    ],
    [
      "🗂️",
      "Task Management",
      "View AWS ECS Task information for Weathertop services, including Import Data, Lookup Data, and Create Summary. Inspect task status, execution details, and operational metadata in one place.",
    ],
  ];

  return (
    <div style={{ padding: "3rem 0", backgroundColor: "#0b0b0b", minHeight: "100vh" }}>
      <h2 style={sectionHeadingStyle}>Getting Started with Weathertop</h2>
      <p style={subtitleStyle}>
        Welcome to Weathertop! Explore Code Testing, Coverage Dashboard, and Task Management to understand SDK quality, documentation health, and ECS task execution.
      </p>

      <div style={cardContainerStyle}>
        {cards.map(([icon, title, desc]) => (
          <div
            key={title}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 2px #00cfcf, 0 0 5px #66cccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 1px #00cfcf, 0 0 3px #66cccc";
            }}
          >
            <div style={iconStyle}>{icon}</div>
            <h3 style={cardTitleStyle}>{title}</h3>
            <p style={cardDescStyle}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
