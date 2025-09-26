import React, { useEffect, useState } from 'react';
import '../styles/LanguageBreakdown.css';

const LanguageBreakdown = ({ onCardClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper for pass rate color
  const getPassRateStyle = (rate) => {
    if (rate >= 90) return { color: "#39ff14", fontWeight: "normal" }; // green
    if (rate >= 80) return { color: "#ffa500", fontWeight: "bold" };   // orange
    return { color: "#ff1a1a", fontWeight: "bold" };                   // deep red
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://7mzatujfx8.execute-api.us-east-1.amazonaws.com/prod/stats');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();

        const summary = json.summary ?? [];

        const mappedData = summary.map(({ language, tests, passed }) => {
          const totalTests = Number(tests ?? 0);
          const passedTests = Number(passed ?? 0);
          const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

          return {
            name: language,
            total: totalTests,
            passRate: passRate.toFixed(2), // numeric value for display
          };
        });

        setData(mappedData);
      } catch (err) {
        console.error('❌ Error loading breakdown data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          color: '#facc15',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: '600',
          zIndex: 9999,
          userSelect: 'none',
        }}
      >
        ⏳ Loading AWS SDK Test Results Data...
      </div>
    );

  return (
    <div className="breakdown-wrapper">
      <h2 className="section-title">🧪 AWS SDK Test Coverage Overview</h2>
      <h4 className="text-gray-600">
        Aggregated test results for each SDK language. Click a card to view detailed run summary.
      </h4>

      <div className="breakdown-container">
        {data.map((item) => (
          <div
            className="card"
            key={item.name}
            onClick={() => onCardClick(item.name.toLowerCase())}
            style={{ cursor: 'pointer' }}
          >
            <h3>{item.name}</h3>
            <p>{item.total} tests</p>
            <p className="label">Pass Rate</p>
            <p className="rate" style={getPassRateStyle(Number(item.passRate))}>
              {item.passRate}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageBreakdown;
