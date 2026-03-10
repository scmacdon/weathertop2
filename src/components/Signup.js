import React, { useState } from "react";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand
} from "@aws-sdk/client-cognito-identity-provider";

// ===== Cognito Client Configuration =====
const client = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

const CLIENT_ID = "6ap5tij574efq67rippetbe0so";

export default function SignUp({ onSignUpSuccess }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SIGN UP
  // =========================
  const handleSignUp = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    // client-side email validation
    if (!username.endsWith("@amazon.com")) {
      setError("Only @amazon.com emails are allowed.");
      setLoading(false);
      return;
    }

    try {

      const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: username }
        ]
      });

      const response = await client.send(command);

      console.log("SignUp response:", response);

      setAwaitingConfirmation(true);

      setMessage("Verification code sent to your Amazon email.");

    } catch (err) {

      console.error("SignUp error:", err);

      const msg =
        err?.name === "UsernameExistsException"
          ? "User already exists."
          : err?.message || "Sign-up failed.";

      setError(msg);

    }

    setLoading(false);
  };

  // =========================
  // CONFIRM SIGNUP
  // =========================
  const handleConfirm = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {

      const confirmCommand = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: username,
        ConfirmationCode: confirmationCode
      });

      await client.send(confirmCommand);

      // ====================================
      // Automatically log user in
      // ====================================

      const loginCommand = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      });

      const loginResponse = await client.send(loginCommand);

      console.log("Login response:", loginResponse);

      const tokens = loginResponse.AuthenticationResult;

      // Store tokens locally
      localStorage.setItem("accessToken", tokens.AccessToken);
      localStorage.setItem("idToken", tokens.IdToken);
      localStorage.setItem("refreshToken", tokens.RefreshToken);

      setMessage("Account verified. Logging you in...");

      if (onSignUpSuccess) {
        onSignUpSuccess(username);
      }

    } catch (err) {

      console.error("Confirmation error:", err);

      setError(err?.message || "Verification failed.");

    }

    setLoading(false);
  };

  // =========================
  // RESEND CODE
  // =========================
  const handleResendCode = async () => {

    setError("");
    setMessage("");

    try {

      const command = new ResendConfirmationCodeCommand({
        ClientId: CLIENT_ID,
        Username: username
      });

      await client.send(command);

      setMessage("Verification code resent to your email.");

    } catch (err) {

      console.error("Resend error:", err);

      setError(err?.message || "Unable to resend code.");

    }

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
      onSubmit={awaitingConfirmation ? handleConfirm : handleSignUp}
    >

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {awaitingConfirmation ? "Verify Your Email" : "Sign Up"}
      </h2>

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

      {!awaitingConfirmation && (
        <>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Email
          </label>

          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Amazon email"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "none"
            }}
            required
          />

          <label style={{ display: "block", marginBottom: "8px" }}>
            Password
          </label>

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
        </>
      )}

      {awaitingConfirmation && (
        <>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Verification Code
          </label>

          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Enter code from email"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "none"
            }}
            required
          />

          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              marginBottom: "15px",
              cursor: "pointer",
              color: "#4caf50"
            }}
            onClick={handleResendCode}
          >
            Resend verification code
          </div>
        </>
      )}

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
        {loading
          ? "Processing..."
          : awaitingConfirmation
          ? "Verify Account"
          : "Sign Up"}
      </button>

    </form>
  );
}

