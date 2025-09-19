import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import LanguageBreakdown from "./LanguageBreakdown";
import SummaryCard from "./SummaryCard";
import RunRateModal from "./RunRateModal";
import ScheduleTaskForm from "./ScheduleTaskForm";
import InspectFargateTask from "./InspectFargateTask";

import "../styles/styles.css";

Modal.setAppElement("#root");

// === TestResultsDashboard Component ===
function TestResultsDashboard({
  summary,
  runId,
  loading,
  selectedLang,
  onModalToggle,
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

// === Main App Component ===
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

  const [isExecTestsModalOpen, setIsExecTestsModalOpen] = useState(false);
  const [taskArnMessage, setTaskArnMessage] = useState("");
  const [isInvoking, setIsInvoking] = useState(false);

  const [isTotalSummaryOpen, setIsTotalSummaryOpen] = useState(false);
  const [totalTestSummary, setTotalTestSummary] = useState({
    total: 0,
    averagePassRate: 0,
  });

  const [totalSummary, setTotalSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    services: 0,
  });

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

      setRunId(json?.runid ?? null);
      setSummaryData({ total: tests, passed, failed, duration, services });
    } catch (err) {
      console.error("❌ Error loading SDK summary:", err);
      setRunId(null);
      setSummaryData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTotalSummary({
      total: summaryData.total ?? 0,
      passed: summaryData.passed ?? 0,
      failed: summaryData.failed ?? 0,
      services: summaryData.services ?? 0,
    });
  }, [summaryData]);

  const handleScheduleTests = () => setIsScheduleModalOpen(true);
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

  const handleExecuteTests = async () => {
    const confirmed = window.confirm(
      "Do you want to invoke the tests? Click Cancel for No!"
    );
    if (!confirmed) return;

    setIsInvoking(true);
    try {
      const apiUrl = `https://z2403v9kpl.execute-api.us-east-1.amazonaws.com/prod/stats?language=${selectedLang}`;
      const res = await fetch(apiUrl);
      const json = await res.json();
      const data = json.body ? JSON.parse(json.body) : json;

      if (data.error) setTaskArnMessage(`Error: ${data.error}`);
      else if (data.taskArn)
        setTaskArnMessage(
          `Weathertop test run was invoked. The Task ARN is: ${data.taskArn}`
        );
      else
        setTaskArnMessage("Docker Test run invoked, but no Task ARN returned.");
    } catch (error) {
      setTaskArnMessage(`Failed to invoke Docker Test run: ${error.message}`);
    } finally {
      setIsInvoking(false);
      setIsExecTestsModalOpen(true);
    }
  };

  const handleClose = () => setIsModalOpen(false);

  const handleOpenTotalSummary = async () => {
    try {
      const res = await fetch(
        "https://7mzatujfx8.execute-api.us-east-1.amazonaws.com/prod/stats"
      );
      const json = await res.json();
      const summaryArr = json.summary ?? [];

      const totalTests = summaryArr.reduce((sum, item) => sum + item.tests, 0);
      const avgPassRate =
        summaryArr.reduce((sum, item) => sum + item.passRate, 0) /
        summaryArr.length;

      setTotalTestSummary({
        total: totalTests,
        averagePassRate: avgPassRate.toFixed(2),
      });

      setIsTotalSummaryOpen(true);
    } catch (err) {
      console.error("Failed to fetch total test summary:", err);
    }
  };

  const passRate =
    totalSummary.total > 0
      ? ((totalSummary.passed / totalSummary.total) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="app-wrapper">
      {/* === Total Test Summary Link === */}
      <div style={{ marginBottom: "1rem" }}>
        <span
          className="link-text"
          onClick={handleOpenTotalSummary}
          style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
        >
          Total Test Summary
        </span>
      </div>

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
              color: "#FFD700",
              fontSize: "1.8rem",
              fontWeight: "bold",
              fontFamily: "Yekka, sans-serif",
              userSelect: "none",
              textShadow: "1px 1px 3px black",
            }}
          >
            Invoking the Docker Test Runner for{" "}
            <strong>{selectedLang} ...</strong>
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

      {/* === TOTAL SUMMARY SIDE PANEL === */}
      <Modal
        isOpen={isTotalSummaryOpen}
        onRequestClose={() => setIsTotalSummaryOpen(false)}
        contentLabel="Total Test Summary"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="side-panel-modal"
        overlayClassName="side-panel-overlay"
      >
        <div className="side-panel-body">
          <h3>Total Test Summary</h3>
          <p>
            <strong>Total Tests:</strong> {totalTestSummary.total}
          </p>
          <p>
            <strong>Average Pass Rate:</strong> {totalTestSummary.averagePassRate}%
          </p>
          <button
            onClick={() => setIsTotalSummaryOpen(false)}
            className="modal-close-button"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}


