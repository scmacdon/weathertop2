import React, { useState } from "react";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

// ===== Cognito Client Configuration =====
const client = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "6ap5tij574efq67rippetbe0so",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      });

      const response = await client.send(command);

      if (response.AuthenticationResult) {
        const { IdToken, AccessToken, RefreshToken, ExpiresIn } = response.AuthenticationResult;

        // Save tokens locally
        localStorage.setItem("id_token", IdToken);
        localStorage.setItem("access_token", AccessToken);
        localStorage.setItem("refresh_token", RefreshToken);
        localStorage.setItem("expires_in", ExpiresIn);
        localStorage.setItem("username", username); // Save username for header

        console.log("Login successful! Tokens saved.");

        // Pass username to App to show welcome message
        if (onLoginSuccess) onLoginSuccess(username);
      } else {
        console.error("Unexpected Cognito response:", response);
        setError("Unexpected authentication response.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.name === "NotAuthorizedException"
        ? "Incorrect username or password."
        : err?.message || "Login failed.";
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <form
      style={{
        backgroundColor: "#1e1e1e",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        width: "350px",
        color: "#ffffff"
      }}
      onSubmit={handleLogin}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          {error}
        </div>
      )}

      <label style={{ display: "block", marginBottom: "8px" }}>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "none"
        }}
      />

      <label style={{ display: "block", marginBottom: "8px" }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "none"
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: loading ? "#888" : "#4caf50",
          color: "#ffffff",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}