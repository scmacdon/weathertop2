import React, { useState } from "react";
import TestDashboard from "./components/TestDashboard";
import Stats from "./components/Stats";
import Coverage from "./components/Coverage";
import Tributaries from "./components/Tributaries";
import ModelCoverage from "./components/ModelCoverage";
import GettingStarted from "./components/GettingStarted";
import Scenarios from "./components/Scenarios.js";
import Management from "./components/Management";
import Login from "./components/Login";
import SignUp from "./components/Signup"; // Added SignUp import
import "./styles/styles.css";

export default function App() {
  const [activePage, setActivePage] = useState("gettingStarted");
  const [theme, setTheme] = useState("dark");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("id_token")
  );
  const [userName, setUserName] = useState(localStorage.getItem("username") || "");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false); // Added state

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Called from Login component on success
  const handleLoginSuccess = (username = "") => {
    setIsLoggedIn(true);
    setUserName(username);
    if (username) localStorage.setItem("username", username);
    setShowLoginModal(false);
  };

  // Called from SignUp component on success
  const handleSignUpSuccess = (username = "") => {
    setShowSignUpModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUserName("");
    setActivePage("gettingStarted");
  };

  // Disable all menu items except "Getting Started" if not logged in
  const isMenuDisabled = (page) => !isLoggedIn && page !== "gettingStarted";

  return (
    <div
      className={`app-container ${theme}`}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#121212",
        color: "#f5f5f5",
        position: "relative",
      }}
    >
      {/* ===== LEFT MENU ===== */}
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

        {[
          { label: "Getting Started", key: "gettingStarted" },
          { label: "Code Testing", key: "codeTesting" },
          { label: "Coverage Dashboard", key: "coverage" },
          { label: "Model-Driven Examples", key: "modelCoverage" },
          { label: "Tributary Examples", key: "tributaries" },
          { label: "Scenario Examples", key: "scenarios" },
          { label: "Task Management", key: "management" },
        ].map((item) => (
          <button
            key={item.key}
            style={menuButtonStyle(
              activePage === item.key,
              isMenuDisabled(item.key)
            )}
            onClick={() => !isMenuDisabled(item.key) && setActivePage(item.key)}
            disabled={isMenuDisabled(item.key)}
          >
            {item.label}
          </button>
        ))}

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

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {/* ===== HEADER LOGIN/LOGOUT + WELCOME ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "#1b1b1b",
            borderBottom: "1px solid #333",
            color: "#fff",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            {isLoggedIn && userName
              ? `Welcome ${userName} to Weathertop`
              : "Welcome to Weathertop"}
          </div>

          {/* ===== LOGIN / SIGNUP BUTTONS ===== */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {isLoggedIn ? (
              <button onClick={handleLogout} style={loginButtonStyle}>
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  style={loginButtonStyle}
                >
                  Login
                </button>

                <button
                  onClick={() => setShowSignUpModal(true)}
                  style={{
                    ...loginButtonStyle,
                    background: "#4caf50",
                    color: "#fff",
                    opacity: isLoggedIn ? 0.5 : 1,
                    cursor: isLoggedIn ? "not-allowed" : "pointer",
                  }}
                  disabled={isLoggedIn}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* ===== PAGE CONTENT ===== */}
        {activePage === "gettingStarted" && (
          <GettingStarted
            isLoggedIn={isLoggedIn}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

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
        {activePage === "tributaries" && <Tributaries />}
        {activePage === "scenarios" && <Scenarios />}
        {activePage === "management" && <Management />}

        {/* ===== LOGIN MODAL ===== */}
        {showLoginModal && !isLoggedIn && (
          <div
            onClick={() => setShowLoginModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(5px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}

        {/* ===== SIGN UP MODAL ===== */}
        {showSignUpModal && !isLoggedIn && (
          <div
            onClick={() => setShowSignUpModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(5px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <SignUp onSignUpSuccess={handleSignUpSuccess} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Menu button style with disabled state
const menuButtonStyle = (isActive, disabled = false) => ({
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: isActive ? "#009999" : "#333",
  color: disabled ? "#888" : "#fff",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: disabled ? "not-allowed" : "pointer",
  textAlign: "left",
});

const loginButtonStyle = {
  padding: "10px 22px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  background:
    "linear-gradient(135deg, #00cfcf 0%, #66cccc 100%)",
  color: "#0b0b0b",
};