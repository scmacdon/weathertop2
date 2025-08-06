import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import LanguageBreakdown from "./LanguageBreakdown";
import SummaryCard from "./SummaryCard";
import RunRateModal from "./RunRateModal";
import ScheduleTaskForm from "./ScheduleTaskForm";
import InspectFargateTask from "./InspectFargateTask";

import "../styles/styles.css";

Modal.setAppElement("#root");

function TestResultsDashboard({
  summary,
  runId,
  onModalToggle,
  loading,
  selectedLang,
  onShowRunRate,
  onExecuteTests,
  onScheduleTests,
   onInspectTask,
}) {
  const {
    total = 0,
    passed = 0,
    failed = 0,
    duration = "—",
    services = 0,
  } = summary || {};

  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : "0.00";

  if (!runId) return null;

  return (
    <div className="dashboard-container">
      <div className="summary-panel">
        <SummaryCard
          sdkName={selectedLang}
          runId={runId}
          total={total}
          passed={passed}
          failed={failed}
          passRate={passRate}
          duration={duration}
          services={services}
        />

        <div className="button-group">
          <button
            onClick={onModalToggle}
            className="test-summary-button secondary"
          >
            View Fail Information
          </button>

          <button onClick={onShowRunRate} className="test-summary-button">
            ⏳ View Run Rate
          </button>

          <button onClick={onExecuteTests} className="test-summary-button">
            🚀 Execute SDK Tests
          </button>

          <button onClick={onScheduleTests} className="test-summary-button">
            📅 Schedule Tests
          </button>
          <button onClick={onInspectTask} className="test-summary-button">
            🔍 Inspect Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedLang, setSelectedLang] = useState(null);
  const [summaryData, setSummaryData] = useState({});
  const [runId, setRunId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failInfo, setFailInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failLoading, setFailLoading] = useState(false);
  const [isRunRateModalOpen, setIsRunRateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // NEW: Execute Tests Modal state and message
  const [isExecTestsModalOpen, setIsExecTestsModalOpen] = useState(false);
  const [taskArnMessage, setTaskArnMessage] = useState("");

  // NEW: Invoking mask state
  const [isInvoking, setIsInvoking] = useState(false);

  const runRateData = [
    { date: "2025-07-13", passRate: 97.5 },
    { date: "2025-07-14", passRate: 98.2 },
    { date: "2025-07-15", passRate: 99.1 },
  ];


  // MAKES A CALL TO API Gateway to retrieve stats for given lang
 const fetchSummary = async (lang) => {
  setLoading(true);
  try {
    const apiUrl = `https://2j5064gkt0.execute-api.us-east-1.amazonaws.com/prod/stats?language=${lang}`;
    const res = await fetch(apiUrl);
    const json = await res.json();
    const summary = json?.results?.summary;

    if (!summary) throw new Error("Summary data missing");

    const services = Number(summary.services ?? 0);
    const tests = Number(summary.tests ?? 0);
    const passed = Number(summary.passed ?? 0);
    const failed = Number(summary.failed ?? 0);
    const startTime = summary.start_time ?? 0;
    const stopTime = summary.stop_time ?? 0;
    const durationMs = stopTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours} hours ${minutes} minutes`;

    setRunId(json?.runid ?? null); // ✅ FIXED
    setSummaryData({ total: tests, passed, failed, duration, services });
  } catch (err) {
    console.error("❌ Error loading SDK summary:", err);
    setRunId(null);
    setSummaryData({});
  } finally {
    setLoading(false);
  }
};


  const handleScheduleTests = () => {
    setIsScheduleModalOpen(true);
  };

  const handleCardClick = (lang) => {
    setSelectedLang(lang);
    fetchSummary(lang);
  };

  

  const handleModalToggle = async () => {
    try {
      if (!runId) return;

      setFailLoading(true);
      const apiUrl = `https://krs0zv3z9j.execute-api.us-east-1.amazonaws.com/prod/stats?language=${selectedLang}`;
      const res = await fetch(apiUrl);
      const json = await res.json();
      setFailInfo(json ?? []);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch failure details:", err);
      setFailInfo([]);
      setIsModalOpen(true);
    } finally {
      setFailLoading(false);
    }
  };


  // NEW: Execute Tests handler to call Docker run API, parse taskArn, show modal
  const handleExecuteTests = async () => {
  setIsInvoking(true); // Show mask
  try {
    const apiUrl = `https://z2403v9kpl.execute-api.us-east-1.amazonaws.com/prod/stats?language=${selectedLang}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    // If Lambda returns stringified JSON in body, parse it
    const data = json.body ? JSON.parse(json.body) : json;

    // ✅ Check if there's an error
    if (data.error) {
      setTaskArnMessage(`Error: ${data.error}`);
    } else if (data.taskArn) {
      setTaskArnMessage(
        `Weathertop test run was invoked. The Task ARN is: ${data.taskArn}`
      );
    } else {
      setTaskArnMessage("Docker Test run invoked, but no Task ARN returned.");
    }
  } catch (error) {
    setTaskArnMessage(`Failed to invoke Docker Test run: ${error.message}`);
  } finally {
    setIsInvoking(false); // Hide mask
    setIsExecTestsModalOpen(true);
  }
};


  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-wrapper">
      {failLoading && (
        <div className="loading-overlay-fullscreen">
          <div className="loading-text yellow-text">Loading data...</div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay-fullscreen">
          <div className="loading-text">Loading data, please wait...</div>
        </div>
      )}

      {/* NEW: Fullscreen mask for invoking Docker Test Runner */}
      {isInvoking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              color: "#FFD700", // same yellow
              fontSize: "1.8rem",
              fontWeight: "bold",
              fontFamily: "Yekka, sans-serif", // assuming you use Yekka
              userSelect: "none",
              textShadow: "1px 1px 3px black",
            }}
          >
          Invoking the Docker Test Runner for  <strong>{selectedLang} ...</strong>
          </div>
        </div>
      )}

      <LanguageBreakdown onCardClick={handleCardClick} />

      <TestResultsDashboard
        summary={summaryData}
        runId={runId}
        loading={loading}
        onModalToggle={handleModalToggle}
        selectedLang={selectedLang}
        onShowRunRate={() => setIsRunRateModalOpen(true)}
        onExecuteTests={handleExecuteTests}
        onScheduleTests={handleScheduleTests}
        onInspectTask={() => setIsInspectModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Fail Information"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <div className="modal-body">
          <h3 className="modal-title">Fail Information</h3>
          {failLoading ? (
            <div className="modal-message">Loading fail data...</div>
          ) : failInfo.length === 0 ? (
            <div className="modal-message">No fail information available.</div>
          ) : (
            <div className="fail-info-list">
              {failInfo.map((item, index) => (
                <div key={index} className="fail-info-row">
                  <h4 className="fail-info-title">🔧 {item.name}</h4>
                  <p className="fail-info-message">
                    <strong>AWS Service:</strong> {item.message}
                  </p>
                  {item.log && <pre className="fail-info-log">{item.log}</pre>}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(false)}
            className="modal-close-button"
          >
            Close
          </button>
        </div>
      </Modal>

      <RunRateModal
        isOpen={isRunRateModalOpen}
        onClose={() => setIsRunRateModalOpen(false)}
        language={selectedLang}
      />

      <Modal
        isOpen={isInspectModalOpen}
        onRequestClose={() => setIsInspectModalOpen(false)}
        contentLabel="Inspect Fargate Task"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="custom-modal dark-theme-modal"
        overlayClassName="custom-overlay"
      >
       <InspectFargateTask onClose={handleClose} language={selectedLang} />
        <button
          onClick={() => setIsInspectModalOpen(false)}
          className="modal-close-button"
        >
          Close
        </button>
      </Modal>

      <Modal
        isOpen={isScheduleModalOpen}
        onRequestClose={() => setIsScheduleModalOpen(false)}
        contentLabel="Schedule ECS Task"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <div className="modal-body">
          <h3 className="modal-title">Schedule ECS Task</h3>

          {/* ✅ Pass in the props! */}
          <ScheduleTaskForm
            selectedLang={selectedLang}
            onSuccess={() => setIsScheduleModalOpen(false)}
          />

          <button
            onClick={() => setIsScheduleModalOpen(false)}
            className="modal-close-button"
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isExecTestsModalOpen}
        onRequestClose={() => setIsExecTestsModalOpen(false)}
        contentLabel="Execute Tests"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <div className="modal-body">
          <h3 className="modal-title">Execute Tests Result</h3>
          <p>{taskArnMessage}</p>
          <button
            onClick={() => setIsExecTestsModalOpen(false)}
            className="modal-close-button"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
