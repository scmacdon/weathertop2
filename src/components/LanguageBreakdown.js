import React, { useEffect, useState } from 'react';
import '../styles/LanguageBreakdown.css';

const LanguageBreakdown = ({ onCardClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://7mzatujfx8.execute-api.us-east-1.amazonaws.com/prod/stats');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();

        // Assuming the summary array is at json.summary or adjust accordingly
        const summary = json.summary ?? [];

        const mappedData = summary.map(({ language, tests, passRate }) => ({
          name: language,
          total: tests,
          passRate: `${passRate}%`,
        }));

        setData(mappedData);
      } catch (err) {
        console.error('❌ Error loading breakdown data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading breakdowns...</p>;

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
            <p className="rate">{item.passRate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageBreakdown;

