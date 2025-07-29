import React, { useEffect, useState } from "react";

const InspectFargateTask = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const labelStyle = {
    fontWeight: "bold",
    marginRight: "6px",
  };

  const valueStyle = {
    fontFamily: "monospace",
  };

  const sectionTitleStyle = {
    marginTop: "20px",
    marginBottom: "8px",
    fontWeight: "bold",
    fontSize: "1.3rem",
    borderBottom: "2px solid #888",
    paddingBottom: "4px",
  };

  useEffect(() => {
    fetch("https://bkuj0vm303.execute-api.us-east-1.amazonaws.com/prod/stats?language=java")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch ECS stats:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "28px",
          backgroundColor: "#1e1e2f",
          color: "#facc15", // bold yellow
          borderRadius: "12px",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        🔄 Fetching Data...
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          padding: "28px",
          backgroundColor: "#1e1e2f",
          color: "#f87171",
          borderRadius: "12px",
          fontSize: "20px",
        }}
      >
        ❌ Failed to load data.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "28px",
        backgroundColor: "#1e1e2f",
        color: "#f1f5f9",
        borderRadius: "12px",
        fontSize: "20px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Header */}
      <h2 style={{ color: "#22d3ee", marginBottom: "24px" }}>🔍 Fargate Task Inspection</h2>

      {/* Latest Task Definition ARN */}
      <p>
        <span style={labelStyle}>✅ Latest Task Definition ARN:</span>
        <span style={{ ...valueStyle, color: "#34d399" }}>
          {data.latestTaskDefinitionArn}
        </span>
      </p>

      {/* Task Definition Metadata */}
      <div style={sectionTitleStyle}>📦 Task Definition Metadata</div>
      <p>
        <span style={labelStyle}>Task Role ARN:</span>
        <span style={valueStyle}>{data.taskDefinitionMetadata.taskRoleArn}</span>
      </p>
      <p>
        <span style={labelStyle}>Execution Role ARN:</span>
        <span style={valueStyle}>{data.taskDefinitionMetadata.executionRoleArn}</span>
      </p>
      <p>
        <span style={labelStyle}>Network Mode:</span>
        <span style={valueStyle}>{data.taskDefinitionMetadata.networkMode}</span>
      </p>
      <p>
        <span style={labelStyle}>CPU:</span>
        <span style={valueStyle}>{data.taskDefinitionMetadata.cpu}</span>
      </p>
      <p>
        <span style={labelStyle}>Memory:</span>
        <span style={valueStyle}>{data.taskDefinitionMetadata.memory}</span>
      </p>

      {/* Cluster ARN */}
      <p style={{ marginTop: "24px" }}>
        <span style={labelStyle}>🔗 ECS Cluster ARN:</span>
        <span style={valueStyle}>{data.clusterArn}</span>
      </p>

      {/* Tasks */}
      <div style={sectionTitleStyle}>🛠 ECS Tasks</div>
      {data.tasks && data.tasks.length > 0 ? (
        <ul>
          {data.tasks.map((task) => (
            <li key={task.taskArn} style={{ marginBottom: "12px" }}>
              <p>
                <strong>Task ARN:</strong> {task.taskArn}
              </p>
              <p>
                <strong>Last Status:</strong> {task.lastStatus}
              </p>
              <p>
                <strong>Desired Status:</strong> {task.desiredStatus}
              </p>
              {task.startedAt && (
                <p>
                  <strong>Started At:</strong> {task.startedAt}
                </p>
              )}
              {task.stoppedAt && (
                <p>
                  <strong>Stopped At:</strong> {task.stoppedAt}
                </p>
              )}
              {task.networkInterface && (
                <div>
                  <p>
                    <strong>ENI ID:</strong> {task.networkInterface.eniId}
                  </p>
                  <p>
                    <strong>Subnet ID:</strong> {task.networkInterface.subnetId}
                  </p>
                  <p>
                    <strong>Security Groups:</strong>{" "}
                    {task.networkInterface.securityGroups?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>VPC ID:</strong> {task.networkInterface.vpcId}
                  </p>
                </div>
              )}
              {task.taskOrService && (
                <p>
                  <strong>Task or Service:</strong> {task.taskOrService}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#f87171", fontWeight: "600" }}>
          {data.message || "No tasks found."}
        </p>
      )}

      {/* EventBridge Rules */}
      <div style={sectionTitleStyle}>🔔 EventBridge Rules</div>
      {data.eventBridgeRules && data.eventBridgeRules.length > 0 ? (
        data.eventBridgeRules.map((rule) => (
          <div
            key={rule.name}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <p>
              <span style={labelStyle}>Name:</span>
              <span style={valueStyle}>{rule.name}</span>
            </p>
            <p>
              <span style={labelStyle}>Schedule Expression:</span>
              <span style={valueStyle}>{rule.scheduleExpression}</span>
            </p>
            <p>
              <span style={labelStyle}>Human-readable Schedule:</span>
              <span style={valueStyle}>
                {rule.humanReadableSchedule || "N/A"}
              </span>
            </p>
            <p>
              <span style={labelStyle}>State:</span>
              <span style={valueStyle}>{rule.state}</span>
            </p>
            <p>
              <span style={labelStyle}>Description:</span>
              <span style={valueStyle}>
                {rule.description || "No description"}
              </span>
            </p>

            <div style={{ marginTop: "12px" }}>
              <h5>Targets</h5>
              {rule.targets && rule.targets.length > 0 ? (
                <ul>
                  {rule.targets.map((target) => (
                    <li key={target.id} style={{ marginBottom: "0.5rem" }}>
                      <p>
                        <strong>ID:</strong> {target.id}
                      </p>
                      <p>
                        <strong>ARN:</strong> {target.arn}
                      </p>
                      {target.ecsParameters ? (
                        <div style={{ marginLeft: "1rem" }}>
                          <p>
                            <strong>Task Definition ARN:</strong>{" "}
                            {target.ecsParameters.taskDefinitionArn}
                          </p>
                          <p>
                            <strong>Launch Type:</strong>{" "}
                            {target.ecsParameters.launchType}
                          </p>
                          <p>
                            <strong>Subnets:</strong>{" "}
                            {target.ecsParameters.subnets?.join(", ") || "N/A"}
                          </p>
                          <p>
                            <strong>Security Groups:</strong>{" "}
                            {target.ecsParameters.securityGroups?.join(", ") || "N/A"}
                          </p>
                          <p>
                            <strong>Assign Public IP:</strong>{" "}
                            {target.ecsParameters.assignPublicIp}
                          </p>
                        </div>
                      ) : (
                        <p>No ECS parameters</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No targets found for this rule.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No EventBridge rules found.</p>
      )}
    </div>
  );
};

export default InspectFargateTask;
