import React, { useState } from 'react';
import TestConfig from './components/TestConfig';
import ExecutionControl from './components/ExecutionControl';
import TestDashboard from './components/TestDashboard';
import './styles/styles.css';

function App() {
  const [status, setStatus] = useState('Idle');
  const [logs, setLogs] = useState([]);

  const handleRun = () => {
    setStatus('Running');
    setLogs(['Java Passed', 'Python Running']);
  };

  const handleStop = () => {
    setStatus('Stopped');
    setLogs([]);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Weathertop</h1>
      <div className="dashboard">
        <div className="column">
          <TestConfig />
          <ExecutionControl onRun={handleRun} onStop={handleStop} />
        </div>
        <div className="column">
          <TestDashboard status={status} logs={logs} />
        </div>
      </div>
    </div>
  );
}

export default App;
