import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import LanguageBreakdown from './LanguageBreakdown';
import SummaryCard from './SummaryCard';
import RunRateModal from './RunRateModal';
import '../styles/styles.css';

Modal.setAppElement('#root');

function TestResultsDashboard({ summary, runId, onModalToggle, loading, selectedLang, onShowRunRate }) {
  const {
    total = 0,
    passed = 0,
    failed = 0,
    duration = '—',
    services = 0,
  } = summary || {};

  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

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
          <button onClick={onModalToggle} className="test-summary-button secondary">
            View Fail Information
          </button>

          <button onClick={onShowRunRate} className="test-summary-button">
            ⏳ View Run Rate
          </button>

          <button onClick={() => alert("Echo Tests")} className="test-summary-button">
            🚀 Execute Tests
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

  const runRateData = [
    { date: '2025-07-13', passRate: 97.5 },
    { date: '2025-07-14', passRate: 98.2 },
    { date: '2025-07-15', passRate: 99.1 },
  ];

  const fetchSummary = async (lang) => {
    setLoading(true);
    try {
      const apiUrl = `https://2j5064gkt0.execute-api.us-east-1.amazonaws.com/prod/stats?language=${lang}`;
      const res = await fetch(apiUrl);
      const json = await res.json();
      const summary = json?.results?.summary;

      if (!summary) throw new Error('Summary data missing');

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

      setRunId(`${lang}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`);
      setSummaryData({ total: tests, passed, failed, duration, services });

    } catch (err) {
      console.error('❌ Error loading SDK summary:', err);
      setRunId(null);
      setSummaryData({});
    } finally {
      setLoading(false);
    }
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
      console.error('Failed to fetch failure details:', err);
      setFailInfo([]);
      setIsModalOpen(true);
    } finally {
      setFailLoading(false);
    }
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

    <LanguageBreakdown onCardClick={handleCardClick} />

    <TestResultsDashboard
      summary={summaryData}
      runId={runId}
      loading={loading}
      onModalToggle={handleModalToggle}
      selectedLang={selectedLang}
      onShowRunRate={() => setIsRunRateModalOpen(true)}
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
                <p className="fail-info-message"><strong>AWS Service:</strong> {item.message}</p>
                {item.log && <pre className="fail-info-log">{item.log}</pre>}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setIsModalOpen(false)} className="modal-close-button">
          Close
        </button>
      </div>
    </Modal>

    <RunRateModal
      isOpen={isRunRateModalOpen}
      onClose={() => setIsRunRateModalOpen(false)}
      language={selectedLang}
    />
  </div>
);
}
