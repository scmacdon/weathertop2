import React, { useState } from "react";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

// ===== Cognito Client Configuration (same as Login) =====
const client = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

export default function SignUp({ onSignUpSuccess }) {
  const [username, setUsername] = useState(""); // use email as username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Optional client-side domain check
    if (!username.endsWith("@amazon.com")) {
      setError("Only @amazon.com emails are allowed.");
      setLoading(false);
      return;
    }

    try {
      const command = new SignUpCommand({
        ClientId: "6ap5tij574efq67rippetbe0so", // same as Login
        Username: username,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: username }
        ]
      });

      const response = await client.send(command);
      console.log("SignUp response:", response);

      setMessage("Sign-up successful! Check your email to confirm.");
      setUsername("");
      setPassword("");

      if (onSignUpSuccess) onSignUpSuccess(username);
    } catch (err) {
      console.error("SignUp error:", err);
      const msg = err?.name === "UsernameExistsException"
        ? "User already exists."
        : err?.message || "Sign-up failed.";
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
      onSubmit={handleSignUp}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>

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

      {message && (
        <div
          style={{
            color: "#4caf50",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          {message}
        </div>
      )}

      <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
      <input
        type="email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter email"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "none"
        }}
        required
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
        required
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}