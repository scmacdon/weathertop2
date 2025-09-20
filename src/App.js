import React, { useState, useEffect } from 'react';
import TestDashboard from './components/TestDashboard';
import './styles/styles.css';

function App() {
  const [status, setStatus] = useState('Idle');
  const [logs, setLogs] = useState([]);
  const [theme, setTheme] = useState('dark'); // Default theme

  // Side panel state
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [loadingTotalInfo, setLoadingTotalInfo] = useState(false);
  const [totalTestInfo, setTotalTestInfo] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    avgPassRate: '0.00',
    summary: []
  });

  const handleRun = () => {
    setStatus('Running');
    setLogs(['Java Passed', 'Python Running']);
  };

  const handleStop = () => {
    setStatus('Stopped');
    setLogs([]);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Fetch total test info from API
  const handleTotalTestInfoClick = async (e) => {
    e.preventDefault();
    setLoadingTotalInfo(true);
    try {
      const apiUrl = 'https://7mzatujfx8.execute-api.us-east-1.amazonaws.com/prod/stats';
      const res = await fetch(apiUrl);
      const json = await res.json();
      const summaryArray = json?.summary || [];

      // Aggregate stats
      const totalTests = summaryArray.reduce((acc, item) => acc + (item.tests || 0), 0);
      const totalPassed = summaryArray.reduce((acc, item) => acc + (item.passed || 0), 0);
      const totalFailed = summaryArray.reduce((acc, item) => acc + (item.failed || 0), 0);

      const avgPassRate =
        totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : '0.00';

      setTotalTestInfo({ 
        total: totalTests, 
        passed: totalPassed, 
        failed: totalFailed, 
        avgPassRate, 
        summary: summaryArray 
      });
      setShowSidePanel(true);
    } catch (err) {
      console.error('Failed to fetch total test info:', err);
      setTotalTestInfo({ total: 0, passed: 0, failed: 0, avgPassRate: '0.00', summary: [] });
      setShowSidePanel(true);
    } finally {
      setLoadingTotalInfo(false);
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <h1 className="app-title">Weathertop</h1>
      <h3>
        Weathertop is an integration test platform designed to test AWS Code examples. 
        It ensures that the examples work as intended, helping to raise the quality and reliability of the code examples.
      </h3>

      {/* Yellow link under the paragraph */}
      <h4>
        <a
          href="#"
          onClick={handleTotalTestInfoClick}
          style={{ color: '#FFD700', fontWeight: 'bold' }}
        >
          Total Test Information
        </a>
      </h4>

      <div className="dashboard">
        <div className="column">
          <TestDashboard status={status} logs={logs} />
        </div>
      </div>

      {/* Side Panel */}
      {showSidePanel && (
        <div className="side-panel-overlay" onClick={() => setShowSidePanel(false)}>
          <div
            className="side-panel-modal"
            style={{ transform: showSidePanel ? 'translateX(0%)' : 'translateX(100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Total Test Information</h3>
            {loadingTotalInfo ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p><strong>Total Tests:</strong> {totalTestInfo.total}</p>
                <p><strong>Passed:</strong> {totalTestInfo.passed}</p>
                <p><strong>Failed:</strong> {totalTestInfo.failed}</p>
                <p><strong>Average Pass Rate:</strong> {totalTestInfo.avgPassRate}%</p>

                <h4>Breakdown by Language</h4>
                <ul>
                  {totalTestInfo.summary.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.language}:</strong> {item.tests} tests — {item.passed} passed, {item.failed} failed ({item.passRate.toFixed(2)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => setShowSidePanel(false)}
              className="modal-close-button"
              style={{ marginTop: 'auto', alignSelf: 'flex-end' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
