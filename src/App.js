import React, { useState } from "react";
import TestDashboard from "./components/TestDashboard";
import Stats from "./components/Stats";
import Coverage from "./components/Coverage";
import ModelCoverage from "./components/ModelCoverage";
import GettingStarted from "./components/GettingStarted";
import Management from "./components/Management";
import "./styles/styles.css";

export default function App() {
  const [activePage, setActivePage] = useState("gettingStarted");
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div
      className={`app-container ${theme}`}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#121212",
        color: "#f5f5f5",
      }}
    >
      <nav
        style={{
          width: "240px",
          backgroundColor: "#1e1e1e",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            color: "#009999",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Weathertop
        </h1>

        <button
          style={menuButtonStyle(activePage === "gettingStarted")}
          onClick={() => setActivePage("gettingStarted")}
        >
          Getting Started
        </button>

        <button
          style={menuButtonStyle(activePage === "codeTesting")}
          onClick={() => setActivePage("codeTesting")}
        >
          Code Testing
        </button>

        <button
          style={menuButtonStyle(activePage === "coverage")}
          onClick={() => setActivePage("coverage")}
        >
          Coverage Dashboard
        </button>

        <button
          style={menuButtonStyle(activePage === "modelCoverage")}
          onClick={() => setActivePage("modelCoverage")}
        >
          Model-Driven Examples
        </button>

        <button
          style={menuButtonStyle(activePage === "management")}
          onClick={() => setActivePage("management")}
        >
          Task Management
        </button>

        <button
          onClick={toggleTheme}
          style={{
            marginTop: "auto",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#333",
            color: "#fff",
          }}
        >
          Toggle Theme
        </button>
      </nav>

      <main style={{ flex: 1, overflowY: "auto" }}>
        {activePage === "gettingStarted" && <GettingStarted />}

        {activePage === "codeTesting" && (
          <div style={{ padding: "20px" }}>
            <Stats />
            <div style={{ marginTop: "20px" }}>
              <TestDashboard status="Idle" logs={[]} />
            </div>
          </div>
        )}

        {activePage === "coverage" && <Coverage />}

        {activePage === "modelCoverage" && <ModelCoverage />}

        {activePage === "management" && <Management />}
      </main>
    </div>
  );
}

const menuButtonStyle = (isActive) => ({
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: isActive ? "#009999" : "#333",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
});
