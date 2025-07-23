import React, { useState } from "react";
import { Tooltip, TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ScheduleTaskForm = ({ selectedLang, onSuccess }) => {
  const [taskDef, setTaskDef] = useState("arn:aws:ecs:us-east-1:814548047983:task-definition/WeathertopJava:12");
  const [schedule, setSchedule] = useState("cron(0 0 ? * 7 *)"); // Default: midnight Saturday
  const [message, setMessage] = useState("");
  const [clusterName, setClusterName] = useState("MyJavaWeathertopCluster");

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://your-api-id.execute-api.region.amazonaws.com/prod/schedule-task",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskDefinition: taskDef,
            cluster: clusterName,
            scheduleExpression: schedule,
            language: selectedLang, // optional
          }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      setMessage("✅ Task scheduled successfully!");
      onSuccess(); // Notify parent to close modal
    } catch (err) {
      setMessage("❌ Failed to schedule task.");
      console.error(err);
    }
  };

  // Bigger styles for easier reading
  const inputStyle = {
    width: "100%",
    marginBottom: "20px",
    padding: "14px 12px",
    borderRadius: "6px",
    border: "1.5px solid #555",
    backgroundColor: "#222",
    color: "#eee",
    fontSize: "1.2rem",
    outline: "none",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    color: "#ccc",
    fontWeight: "700",
    fontSize: "1.1rem",
  };

  const infoIconStyle = {
    color: "#888",
    cursor: "help",
    fontWeight: "bold",
    userSelect: "none",
    fontSize: "1.2rem",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "14px 28px",
    backgroundColor: "#007acc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "1.25rem",
    cursor: "pointer",
  };

  const messageStyle = {
    marginTop: "20px",
    fontSize: "1.1rem",
    color: message.includes("❌") ? "#ff6b6b" : "#6bcf6b",
  };

  return (
    <TooltipProvider>
      <div style={{ color: "#eee", fontFamily: "Arial, sans-serif", fontSize: "1.15rem" }}>
        <h2 style={{ marginBottom: "30px", fontSize: "2rem" }}>Schedule ECS Task</h2>

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
          placeholder="Task Definition ARN"
          value={taskDef}
          onChange={(e) => setTaskDef(e.target.value)}
          style={inputStyle}
        />
        <Tooltip
          id="taskDefTip"
          place="right"
          style={{
            backgroundColor: "#333",
            color: "#ddd",
            padding: "8px 14px",
            fontSize: "1rem",
            borderRadius: "6px",
          }}
        >
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
          placeholder="ECS Cluster Name"
          value={clusterName}
          onChange={(e) => setClusterName(e.target.value)}
          style={inputStyle}
        />
        <Tooltip
          id="clusterNameTip"
          place="right"
          style={{
            backgroundColor: "#333",
            color: "#ddd",
            padding: "8px 14px",
            fontSize: "1rem",
            borderRadius: "6px",
          }}
        >
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
          placeholder="Schedule (rate or cron)"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          style={inputStyle}
        />
        <Tooltip
          id="scheduleTip"
          place="right"
          style={{
            backgroundColor: "#333",
            color: "#ddd",
            padding: "8px 14px",
            fontSize: "1rem",
            borderRadius: "6px",
          }}
        >
          Cron or rate expression for scheduling the task. Example: cron(0 0 ? * 7 *)
        </Tooltip>

        <button onClick={handleSubmit} style={buttonStyle}>
          Schedule Task
        </button>

        <p style={messageStyle}>{message}</p>
      </div>
    </TooltipProvider>
  );
};

export default ScheduleTaskForm;






