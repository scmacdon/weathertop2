import React, { useState, useEffect } from "react";
import TestDashboard from "./components/TestDashboard";
import "./styles/styles.css";

function App() {
  const [status, setStatus] = useState("Idle");
  const [logs, setLogs] = useState([]);
  const [theme, setTheme] = useState("dark");

  // Side panel state
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [sidePanelTitle, setSidePanelTitle] = useState("");
  const [loadingPanelData, setLoadingPanelData] = useState(false);
  const [panelData, setPanelData] = useState(null);

  const handleRun = () => {
    setStatus("Running");
    setLogs(["Java Passed", "Python Running"]);
  };

  const handleStop = () => {
    setStatus("Stopped");
    setLogs([]);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  // --- Fetch Data ---
  const fetchData = async (title, apiUrl) => {
    setSidePanelTitle(title);
    setPanelData(null);
    setShowSidePanel(true);
    setLoadingPanelData(true);

    try {
      const res = await fetch(apiUrl);
      const json = await res.json();
      setPanelData(json);
    } catch (err) {
      console.error(`Failed to fetch ${title}:`, err);
      setPanelData(null);
    } finally {
      setLoadingPanelData(false);
    }
  };

  const handleSDKStatsClick = () =>
    fetchData(
      "SDK Stats",
      "https://7mzatujfx8.execute-api.us-east-1.amazonaws.com/prod/stats"
    );

  const handleNoTestsClick = () =>
    fetchData(
      "No SDK Tests",
      "https://pab1amebbb.execute-api.us-east-1.amazonaws.com/prod/stats"
    );

  // === Neon Button Styles ===
  const neonBase = {
    fontFamily: "monospace",
    fontSize: "15px",
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "all 0.25s ease-in-out",
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const sdkStatsStyle = {
    ...neonBase,
    backgroundColor: "#0d0d0d",
    color: "#39ff14",
    borderColor: "#39ff14",
    boxShadow: "0 0 4px #39ff14",
  };

  const noTestsStyle = {
    ...neonBase,
    backgroundColor: "#0d0d0d",
    color: "#00eaff",
    borderColor: "#00eaff",
    boxShadow: "0 0 4px #00eaff",
  };

  return (
    <div
      className={`app-container ${theme}`}
      style={{
        background: "#121212",
        color: "#f5f5f5",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#39ff14", textShadow: "0 0 4px #39ff14", marginBottom: "10px" }}>
        Weathertop
      </h1>
      <h3 style={{ maxWidth: "800px", lineHeight: "1.4" }}>
        Weathertop is an integration test platform designed to test AWS Code examples.
      </h3>

      {/* Neon Buttons */}
      <div style={{ display: "flex", gap: "12px", margin: "20px 0" }}>
        <button onClick={handleSDKStatsClick} style={sdkStatsStyle}>
          {loadingPanelData && sidePanelTitle === "SDK Stats" ? (
            <span>Loading...</span>
          ) : (
            "SDK Stats"
          )}
        </button>

        <button onClick={handleNoTestsClick} style={noTestsStyle}>
          {loadingPanelData && sidePanelTitle === "No SDK Tests" ? (
            <span>Loading...</span>
          ) : (
            "No Tests"
          )}
        </button>
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="column">
          <TestDashboard status={status} logs={logs} />
        </div>
      </div>

      {/* Side Panel */}
      {showSidePanel && (
        <div
          className="side-panel"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100%",
            backgroundColor: "#1e1e1e",
            color: "#f5f5f5",
            padding: "20px",
            overflowY: "auto",
            boxShadow: "-4px 0 8px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <h2 style={{ borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "15px" }}>
            {sidePanelTitle}
          </h2>

          {loadingPanelData ? (
            <p style={{ color: "#ff0", fontWeight: "bold" }}>Loading...</p>
          ) : panelData ? (
            <div>
              {/* --- Totals for SDK Stats --- */}
              {sidePanelTitle === "SDK Stats" && panelData.summary && (() => {
                let totalTests = 0;
                let totalPassed = 0;
                let totalFailed = 0;
                panelData.summary.forEach(item => {
                  totalTests += item.tests;
                  totalPassed += item.passed;
                  totalFailed += item.failed;
                });
                const averagePassRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : "0";

                return (
                  <div style={{ marginBottom: "20px", borderBottom: "1px solid #444", paddingBottom: "10px" }}>
                    <p><strong>Total Tests:</strong> {totalTests}</p>
                    <p><strong>Total Passed:</strong> {totalPassed}</p>
                    <p><strong>Total Failed:</strong> {totalFailed}</p>
                    <p><strong>Average Pass Rate:</strong> {averagePassRate}%</p>
                  </div>
                );
              })()}

              {/* --- SDK Stats per language --- */}
              {sidePanelTitle === "SDK Stats" && panelData.summary && panelData.summary.map((item, idx) => (
                <div key={idx} style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#39ff14" }}>{item.language}</h3>
                  <p>
                    <strong>Tests:</strong> {item.tests} — <strong>Passed:</strong> {item.passed}, <strong>Failed:</strong> {item.failed}
                  </p>
                </div>
              ))}

              {/* --- No SDK Tests --- */}
              {sidePanelTitle === "No SDK Tests" &&
                Object.keys(panelData).map((sdk, idx) => (
                  <div key={idx} style={{ marginBottom: "20px" }}>
                    <h3 style={{ color: "#00eaff" }}>{sdk}</h3>
                    <ul>
                      {panelData[sdk].map((service, i) => (
                        <li key={i}>{service}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ) : (
            <p>No data available</p>
          )}

          <button
            onClick={() => setShowSidePanel(false)}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              backgroundColor: "#ff00ff",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(255,0,255,0.6)",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;







