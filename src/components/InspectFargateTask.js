import React from "react";

const InspectFargateTask = ({ onClose }) => {
  // Hardcoded data matching your provided content
  const data = {
    latestFamily: "WeathertopJava",
    latestTaskDefArn: "arn:aws:ecs:us-east-1:814548047983:task-definition/WeathertopJava:12",
    taskDefinitionMetadata: {
      taskRoleArn: "arn:aws:iam::814548047983:role/ecsTaskRole",
      executionRoleArn: "arn:aws:iam::814548047983:role/ecsTaskExecutionRole",
      networkMode: "awsvpc",
      cpu: "256",
      memory: "512",
    },
    ecsClusterArn: "arn:aws:ecs:us-east-1:814548047983:cluster/MyJavaWeathertopCluster",
    ecsTasksFound: false,
    javaTargetSetup: {
      taskDefArn: "arn:aws:ecs:us-east-1:814548047983:task-definition/WeathertopJava:12",
      clusterArn: "arn:aws:ecs:us-east-1:814548047983:cluster/MyJavaWeathertopCluster",
    },
    eventBridgeRule: {
      ruleName: "ecs-java-schedule",
      scheduleExpr: "cron(0 0 ? * 1 *)",
      state: "ENABLED",
      desc: "null",
      scheduleText: "Every Sunday at 12:00 AM UTC",
      targetId: "ecs-task-target",
      targetArn: "arn:aws:ecs:us-east-1:814548047983:cluster/MyJavaWeathertopCluster",
      taskDefArn: "arn:aws:ecs:us-east-1:814548047983:task-definition/WeathertopJava:12",
      launchType: "FARGATE",
      subnets: "[subnet-03c28397a3a7cd314, subnet-06dde61595900f899]",
      secGroups: "[sg-0e357c99b6b13bf62]",
      assignPubIp: "ENABLED",
    },
  };

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

  return (
    <div
      style={{
        padding: "28px",
        backgroundColor: "#1e1e2f",
        color: "#f1f5f9",
        borderRadius: "12px",
        fontSize: "20px",  // increased font size here
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          fontSize: "28px",
          color: "#f1f5f9",
          cursor: "pointer",
          fontWeight: "bold",
          lineHeight: 1,
        }}
        aria-label="Close modal"
      >
        &times;
      </button>

      {/* Header */}
      <h2 style={{ color: "#22d3ee", marginBottom: "24px" }}>🔍 Fargate Task Inspection</h2>

      {/* Finding latest task definition */}
      <p>
        <span style={labelStyle}>🔍 Finding latest task definition under family:</span>
        <span style={valueStyle}>{data.latestFamily}</span>
      </p>
      <p>
        <span style={labelStyle}>✅ Latest task definition:</span>
        <span style={{ ...valueStyle, color: "#34d399" }}>{data.latestTaskDefArn}</span>
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

      {/* ECS Cluster */}
      <p style={{ marginTop: "24px" }}>
        <span style={labelStyle}>🔗 ECS Cluster ARN:</span>
        <span style={valueStyle}>{data.ecsClusterArn}</span>
      </p>

      {/* ECS tasks found or not */}
      {!data.ecsTasksFound && (
        <p style={{ color: "#f87171", fontWeight: "600" }}>❌ No ECS tasks found.</p>
      )}

      {/* Java Target Setup */}
      <div style={sectionTitleStyle}>✅ Values for Java Target setup</div>
      <p>
        <span style={labelStyle}>Task Definition ARN:</span>
        <span style={valueStyle}>{data.javaTargetSetup.taskDefArn}</span>
      </p>
      <p>
        <span style={labelStyle}>Cluster ARN:</span>
        <span style={valueStyle}>{data.javaTargetSetup.clusterArn}</span>
      </p>

      {/* EventBridge Rule */}
      <div style={sectionTitleStyle}>🔔 EventBridge Rules matching 'ecs-java-schedule'</div>
      <p>
        <span style={labelStyle}>Rule Name:</span>
        <span style={valueStyle}>{data.eventBridgeRule.ruleName}</span>
      </p>
      <p>
        <span style={labelStyle}>Schedule Expr:</span>
        <span style={valueStyle}>{data.eventBridgeRule.scheduleExpr}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, color: "#34d399" }}>State:</span>
        <span style={{ ...valueStyle, color: "#34d399" }}>{data.eventBridgeRule.state}</span>
      </p>
      <p>
        <span style={labelStyle}>Desc:</span>
        <span style={valueStyle}>{data.eventBridgeRule.desc}</span>
      </p>
      <p>
        <span style={labelStyle}>→</span>
        <span style={{ ...valueStyle, color: "#60a5fa" }}>{data.eventBridgeRule.scheduleText}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "18px" }}>Target ID:</span>
        <span style={valueStyle}>{data.eventBridgeRule.targetId}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "18px" }}>Target ARN:</span>
        <span style={valueStyle}>{data.eventBridgeRule.targetArn}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "36px" }}>TaskDef ARN:</span>
        <span style={valueStyle}>{data.eventBridgeRule.taskDefArn}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "36px" }}>Launch Type:</span>
        <span style={valueStyle}>{data.eventBridgeRule.launchType}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "36px" }}>Subnets:</span>
        <span style={valueStyle}>{data.eventBridgeRule.subnets}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "36px" }}>SecGroups:</span>
        <span style={valueStyle}>{data.eventBridgeRule.secGroups}</span>
      </p>
      <p>
        <span style={{ ...labelStyle, paddingLeft: "36px" }}>AssignPubIp:</span>
        <span style={valueStyle}>{data.eventBridgeRule.assignPubIp}</span>
      </p>
    </div>
  );
};

export default InspectFargateTask;





