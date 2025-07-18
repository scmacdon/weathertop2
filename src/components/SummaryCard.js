import React from 'react';
import './SummaryCard.css';

export default function SummaryCard({
  sdkName,
  runId,        // FIXED: use this directly
  total,
  passed,
  failed,
  passRate,
  duration,
  services = 0,
}) {
  // Capitalize first letter of sdkName if present
  const displayName = sdkName
    ? sdkName.charAt(0).toUpperCase() + sdkName.slice(1)
    : null;

  // Extract timestamp from runId and convert to EST
  let localTimeDisplay = '';
  const match = runId?.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}$/);
  if (match) {
    const [datePart, timePart] = match[0].split('T');
    const [year, month, day] = datePart.split('-').map((val) => parseInt(val, 10));
    const [hour, minute] = timePart.split('-').map((val) => parseInt(val, 10));

    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    localTimeDisplay = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(utcDate);
  }

  return (
    <div className="summary-wrapper">
      <h2 className="summary-heading">
        📊 {displayName ? `${displayName} Test Summary Stats` : 'Test Summary Stats'}
      </h2>
      <h4 className="run-id">🆔 Run ID: {runId}</h4>
      {localTimeDisplay && (
        <div className="run-time-local">
          🕒 <b>Execution time</b>: {localTimeDisplay} (EST)
        </div>
      )}

      <div className="summary-grid">
        <div className="summary-tile">
          <span className="summary-icon">🔧</span>
          <div className="summary-value">{services}</div>
          <div className="summary-label">Services Tested</div>
        </div>
        <div className="summary-tile">
          <span className="summary-icon">🧪</span>
          <div className="summary-value">{total}</div>
          <div className="summary-label">Total Tests</div>
        </div>
        <div className="summary-tile">
          <span className="summary-icon">🟢</span>
          <div className="summary-value summary-pass">{passed}</div>
          <div className="summary-label">Passed</div>
        </div>
        <div className="summary-tile">
          <span className="summary-icon">🔴</span>
          <div className="summary-value summary-fail">{failed}</div>
          <div className="summary-label">Failed</div>
        </div>
        <div className="summary-tile">
          <span className="summary-icon">📈</span>
          <div className="summary-value summary-rate">{passRate}%</div>
          <div className="summary-label">Pass Rate</div>
        </div>
        <div className="summary-tile">
          <span className="summary-icon">⏱️</span>
          <div className="summary-value">{duration}</div>
          <div className="summary-label">Execution Time</div>
        </div>
      </div>
    </div>
  );
}
