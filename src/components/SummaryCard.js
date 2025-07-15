import React from 'react';
import './SummaryCard.css';

export default function SummaryCard({
  sdkName,
  runId,
  total,
  passed,
  failed,
  passRate,
  duration,
  services = 0, // default to 0 if not provided
}) {
  // Capitalize first letter of sdkName if present
  const displayName = sdkName
    ? sdkName.charAt(0).toUpperCase() + sdkName.slice(1)
    : null;

  return (
    <div className="summary-wrapper">
      <h2 className="summary-heading">
        📊 {displayName ? `${displayName} Test Summary Stats` : 'Test Summary Stats'}
      </h2>
      <h4 className="run-id">🆔 Run ID: {runId}</h4>

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
