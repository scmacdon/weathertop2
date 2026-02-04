import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensure accessibility

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

const cardTitleStyle = {
  fontSize: "1.25rem",
  marginBottom: "0.5rem",
};

const cardDescStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.45",
  color: "#bbb",
};

const buttonStyle = {
  backgroundColor: "#00cfcf",
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  margin: "0.5rem 0.5rem 0 0",
  border: "none",
  color: "#121212",
  cursor: "pointer",
  transition: "background-color 0.25s ease",
};

export default function Management() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [maskVisible, setMaskVisible] = useState(false);

  const fetchTaskInfo = async (endpoint) => {
    setLoading(true);
    setError(null);
    setApiData(null);
    setMaskVisible(true);

    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setApiData(json);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch task information. Check your network.");
    } finally {
      setLoading(false);
      setMaskVisible(false);
      setModalOpen(true);
    }
  };

  const cards = [
    [
      "Data Ingestion",
      "Inject data into your system using our streamlined process.",
      "https://bkuj0vm303.execute-api.us-east-1.amazonaws.com/prod/stats?language=import",
    ],
    [
      "Look up Service",
      "Quickly find the service you need with our look-up tool.",
      "https://bkuj0vm303.execute-api.us-east-1.amazonaws.com/prod/stats?language=lookup",
    ],
    [
      "Create Summary",
      "Generate summaries of your data with just a few clicks.",
      "https://bkuj0vm303.execute-api.us-east-1.amazonaws.com/prod/stats?language=summary",
    ],
  ];

  return (
    <div style={{ padding: "3rem 0", backgroundColor: "#0b0b0b", minHeight: "100vh" }}>
      <h2 style={sectionHeadingStyle}>Weathertop Task Management</h2>
      <p style={subtitleStyle}>
        Explore the AWS ECS Tasks for Data Ingestion, Lookup Service, and Summary generation.
      </p>

      <div style={cardContainerStyle}>
        {cards.map(([title, desc, endpoint]) => (
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
            <h3 style={cardTitleStyle}>{title}</h3>
            <p style={cardDescStyle}>{desc}</p>

            <button
              style={buttonStyle}
              onClick={() => fetchTaskInfo(endpoint)}
            >
              Task Information
            </button>

            <button style={buttonStyle}>Invoke Task</button>
          </div>
        ))}
      </div>

      {/* Fullscreen mask */}
      {maskVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              color: "#FFD700",
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🔄 Loading Task Information...
          </div>
        </div>
      )}

      {/* Modal for API Data */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Task Information"
        style={{
          content: {
            backgroundColor: "#1e1e2f",
            color: "#f1f5f9",
            borderRadius: "12px",
            maxWidth: "900px",
            margin: "2rem auto",
            padding: "2rem",
            maxHeight: "80vh",
            overflowY: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1000,
          },
        }}
      >
        <h2 style={{ color: "#22d3ee", marginBottom: "1rem" }}>
          📦 Task Info
        </h2>

        {error && <p style={{ color: "#f87171" }}>❌ {error}</p>}

        {apiData && (
          <pre
            style={{
              backgroundColor: "#121212",
              padding: "1rem",
              borderRadius: "8px",
              fontFamily: "monospace",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(apiData, null, 2)}
          </pre>
        )}

        <button
          style={{ ...buttonStyle, marginTop: "1rem" }}
          onClick={() => setModalOpen(false)}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}



