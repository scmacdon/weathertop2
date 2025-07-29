import React, { useState } from "react";
import { Tooltip, TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ScheduleTaskForm = ({ selectedLang, onSuccess }) => {
  const [taskDef, setTaskDef] = useState(
    "arn:aws:ecs:us-east-1:814548047983:task-definition/WeathertopJava:18"
  );
  const [schedule, setSchedule] = useState("cron(59 23 ? * FRI *)");
  const [message, setMessage] = useState("");
  const [clusterName, setClusterName] = useState("MyJavaWeathertopCluster");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams({
        taskDefinitionArnVal: taskDef,
        clusterName,
        cron: schedule,
      });

      const url = `https://l6ptsgo6rh.execute-api.us-east-1.amazonaws.com/prod/stats?${params.toString()}`;
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) throw new Error("Network error");

      const text = await response.text();
      setMessage(text);
    } catch (err) {
      setMessage("❌ Failed to schedule task.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    onSuccess?.();
  };

  if (!modalOpen) return null;

  // Style
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "flex-start", // Align modal at top for fullscreen feel
    alignItems: "stretch", // Stretch overlay vertically
    zIndex: 9999,
    padding: 0,
  };

  const modalStyle = {
    position: "relative",
    backgroundColor: "#111827", // dark slate
    color: "#f1f5f9",
    borderRadius: 0,
    width: "100vw",
    height: "100vh",
    padding: "36px 48px",
    overflowY: "auto",
    fontFamily: "Segoe UI, Tahoma, sans-serif",
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  const titleStyle = {
    marginBottom: "32px",
    fontSize: "2.5rem",
    color: "#22d3ee",
    fontWeight: "bold",
    borderBottom: "2px solid #22d3ee", // subtle underline to highlight header
    paddingBottom: "8px",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "8px",
    display: "block",
    color: "#ccc",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "1.5px solid #444",
    backgroundColor: "#2a2a40",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: "24px",
    outline: "none",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    gap: "16px",
    marginTop: "24px",
  };

  const buttonStyle = {
    padding: "12px 24px",
    backgroundColor: "#007acc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    minWidth: "140px",
  };

  const closeButtonStyle = {
    padding: "12px 24px",
    backgroundColor: "#cc3344",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    minWidth: "140px",
  };

  const messageStyle = {
    marginTop: "18px",
    fontSize: "1.1rem",
    color: message.startsWith("❌") ? "#f87171" : "#34d399",
    fontWeight: "600",
  };

  const tooltipStyle = {
    backgroundColor: "#333",
    color: "#ddd",
    padding: "8px 12px",
    fontSize: "0.9rem",
    borderRadius: "6px",
  };

  const infoIconStyle = {
    color: "#888",
    cursor: "help",
    fontWeight: "bold",
    userSelect: "none",
    fontSize: "1.2rem",
    marginLeft: "6px",
  };

  return (
    <TooltipProvider>
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={titleStyle}>Schedule ECS Task</h2>

          <label htmlFor="taskDef" style={labelStyle}>
            Task Definition ARN
            <span
              data-tooltip-id="taskDefTip"
              tabIndex={0}
              style={infoIconStyle}
              aria-label="Info about Task Definition ARN"
            >
              ⓘ
            </span>
          </label>
          <input
            id="taskDef"
            value={taskDef}
            onChange={(e) => setTaskDef(e.target.value)}
            style={inputStyle}
            disabled={loading}
            placeholder="Task Definition ARN"
          />
          <Tooltip id="taskDefTip" place="right" style={tooltipStyle}>
            ARN of the ECS task definition to schedule.
          </Tooltip>

          <label htmlFor="clusterName" style={labelStyle}>
            ECS Cluster Name
            <span
              data-tooltip-id="clusterNameTip"
              tabIndex={0}
              style={infoIconStyle}
              aria-label="Info about ECS Cluster Name"
            >
              ⓘ
            </span>
          </label>
          <input
            id="clusterName"
            value={clusterName}
            onChange={(e) => setClusterName(e.target.value)}
            style={inputStyle}
            disabled={loading}
            placeholder="ECS Cluster Name"
          />
          <Tooltip id="clusterNameTip" place="right" style={tooltipStyle}>
            The name of the ECS cluster where the task will run.
          </Tooltip>

          <label htmlFor="schedule" style={labelStyle}>
            Schedule (rate or cron)
            <span
              data-tooltip-id="scheduleTip"
              tabIndex={0}
              style={infoIconStyle}
              aria-label="Info about schedule expression"
            >
              ⓘ
            </span>
          </label>
          <input
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            style={inputStyle}
            disabled={loading}
            placeholder="Schedule (rate or cron)"
          />
          <Tooltip id="scheduleTip" place="right" style={tooltipStyle}>
            Cron or rate expression for scheduling the task. Example: cron(59 23 ? * FRI *)
          </Tooltip>

          <div style={buttonContainerStyle}>
            <button onClick={handleSubmit} style={buttonStyle} disabled={loading}>
              Schedule Task
            </button>
            <button onClick={handleClose} style={closeButtonStyle} disabled={loading}>
              Close
            </button>
          </div>

          {message && <p style={messageStyle}>{message}</p>}

          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.85)",
                borderRadius: "16px",
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: "#facc15",
                  textShadow: "0 0 8px #facc15",
                }}
              >
                Setting Schedule...
              </span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ScheduleTaskForm;






