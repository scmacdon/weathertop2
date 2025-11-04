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

  // Subscribe form state
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  const handleRun = () => {
    setStatus("Running");
    setLogs(["Java Passed", "Python Running"]);
  };

  const handleStop = () => {
    setStatus("Stopped");
    setLogs([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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

      if (title === "SDK Stats") {
        // parse SDK Stats summary
        const totalTests = json.summary.reduce((acc, cur) => acc + cur.tests, 0);
        const totalPassed = json.summary.reduce((acc, cur) => acc + cur.passed, 0);
        const totalFailed = json.summary.reduce((acc, cur) => acc + cur.failed, 0);
        const totalIgnored = 0; // no ignored data provided
        const overallPassRate = totalTests ? ((totalPassed / totalTests) * 100).toFixed(2) : 0;

        setPanelData({
          summary: json.summary,
          totals: { totalTests, totalPassed, totalFailed, totalIgnored, overallPassRate },
        });
      } else if (title === "No SDK Tests") {
        // parse No Tests data
        // json is a mapping of language -> array of services with no tests
        setPanelData(json);
      } else {
        setPanelData(json);
      }
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

  const handleSubClick = () => {
    setSidePanelTitle("Subscribe");
    setPanelData(null);
    setShowSidePanel(true);
    setEmail("");
    setSubscriptionMessage("");
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);
    setSubscriptionMessage("");

    try {
      const apiUrl = `https://cevri06wc6.execute-api.us-east-1.amazonaws.com/prod/sns?email=${encodeURIComponent(email)}`;
      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const message = await response.text();
      setSubscriptionMessage(message || "✅ Subscription request sent! Check your email to confirm.");
      setEmail("");
    } catch (err) {
      console.error("Subscription failed:", err);
      setSubscriptionMessage("❌ Failed to subscribe. Please try again later.");
    } finally {
      setSubscribing(false);
    }
  };

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

  const sdkStatsStyle = { ...neonBase, backgroundColor: "#0d0d0d", color: "#39ff14", borderColor: "#39ff14", boxShadow: "0 0 4px #39ff14" };
  const noTestsStyle = { ...neonBase, backgroundColor: "#0d0d0d", color: "#00eaff", borderColor: "#00eaff", boxShadow: "0 0 4px #00eaff" };

  // === Pass Rate Color Helper ===
  const getPassRateStyle = (rate) => {
    if (rate >= 90) return { color: "#39ff14", fontWeight: "normal" };
    if (rate >= 80) return { color: "#ffa500", fontWeight: "bold" };
    return { color: "#ff1a1a", fontWeight: "bold" };
  };

  return (
    <div className={`app-container ${theme}`} style={{ background: "#121212", color: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "#39ff14", textShadow: "0 0 4px #39ff14", marginBottom: "10px" }}>Weathertop</h1>
      <h3 style={{ maxWidth: "800px", lineHeight: "1.4" }}>
        Weathertop is an integration test platform designed to test AWS Code examples.
      </h3>

      {/* Neon Buttons */}
      <div style={{ display: "flex", gap: "12px", margin: "20px 0" }}>
        <button onClick={handleSDKStatsClick} style={sdkStatsStyle}>
          {loadingPanelData && sidePanelTitle === "SDK Stats" ? <span>Loading...</span> : "SDK Stats"}
        </button>
        <button onClick={handleNoTestsClick} style={noTestsStyle}>
          {loadingPanelData && sidePanelTitle === "No SDK Tests" ? <span>Loading...</span> : "No Tests"}
        </button>
        <button onClick={handleSubClick} style={noTestsStyle}>Subscribe</button>
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="column">
          <TestDashboard status={status} logs={logs} />
        </div>
      </div>

      {/* Side Panel */}
      {showSidePanel && (
        <div className="side-panel" style={{ position: "fixed", top: 0, right: 0, width: "400px", height: "100%", backgroundColor: "#1e1e1e", color: "#f5f5f5", padding: "20px", overflowY: "auto", boxShadow: "-4px 0 8px rgba(0,0,0,0.5)", zIndex: 1000 }}>
          <h2 style={{ borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "15px" }}>{sidePanelTitle}</h2>

          {sidePanelTitle === "Subscribe" ? (
            <form onSubmit={handleSubscribeSubmit}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Enter your email to subscribe:</label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #555", backgroundColor: "#2b2b2b", color: "#fff", marginBottom: "12px" }}
              />
              <button type="submit" disabled={subscribing} style={{ width: "100%", padding: "12px 20px", backgroundColor: subscribing ? "#777" : "#39ff14", color: "#000", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: subscribing ? "not-allowed" : "pointer", boxShadow: "0 0 10px rgba(57,255,20,0.6)", marginBottom: "12px" }}>
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
              {subscriptionMessage && <p style={{ color: subscriptionMessage.startsWith("✅") ? "#39ff14" : "#ff5555", fontWeight: "bold" }}>{subscriptionMessage}</p>}
            </form>
          ) : loadingPanelData ? (
            <p style={{ color: "#ff0", fontWeight: "bold" }}>Loading...</p>
          ) : sidePanelTitle === "SDK Stats" && panelData ? (
            <div>
              <h3>Summary</h3>
              <p>Total Tests: {panelData.totals.totalTests}</p>
              <p>Total Passed: {panelData.totals.totalPassed}</p>
              <p>Total Failed: {panelData.totals.totalFailed}</p>
              <p>Ignored: {panelData.totals.totalIgnored}</p>
              <p>Overall Pass Rate: {panelData.totals.overallPassRate}%</p>

              <h3>Breakdown by Service</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "1px solid #555" }}>Service</th>
                    <th style={{ borderBottom: "1px solid #555" }}>Passed</th>
                    <th style={{ borderBottom: "1px solid #555" }}>Failed</th>
                    <th style={{ borderBottom: "1px solid #555" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {panelData.summary.map((svc) => (
                    <tr key={svc.language}>
                      <td>{svc.language}</td>
                      <td>{svc.passed}</td>
                      <td>{svc.failed}</td>
                      <td>{svc.tests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : sidePanelTitle === "No SDK Tests" && panelData ? (
            <div>
              <h3>No Tests by Language</h3>
              {Object.entries(panelData).map(([lang, services]) => (
                <div key={lang} style={{ marginBottom: "12px" }}>
                  <strong>{lang}</strong> ({services.length} services):
                  <ul>
                    {services.map((svc) => (
                      <li key={svc}>{svc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No data available</p>
          )}

          <button onClick={() => setShowSidePanel(false)} style={{ marginTop: "20px", padding: "12px 20px", backgroundColor: "#ff00ff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 0 10px rgba(255,0,255,0.6)" }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;




