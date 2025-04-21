import React, { useState } from 'react';

function ExecutionControlCard() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [frequency, setFrequency] = useState('Weekly');
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('08:00');
  const [parallel, setParallel] = useState(1);
  const [languages, setLanguages] = useState([]);

  const handleSaveSchedule = () => {
    const payload = {
      scheduleEnabled,
      frequency,
      day,
      time,
      parallelExecution: parallel,
      selectedLanguages: languages
    };

    // Call backend API to save schedule
    console.log("Schedule saved:", payload);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* On-Demand Execution */}
      <div className="rounded-2xl shadow-md p-4 bg-white">
        <h2 className="text-xl font-semibold mb-2">▶️ On-Demand Execution</h2>
        <div>
          <label>Parallel Execution</label>
          <input type="number" value={parallel} onChange={e => setParallel(e.target.value)} className="input" />
          {/* Add test suite, languages etc. here */}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 mt-3 rounded" onClick={() => console.log("Run now!")}>
          Run Tests Now
        </button>
      </div>

      {/* Scheduled Execution */}
      <div className="rounded-2xl shadow-md p-4 bg-white">
        <h2 className="text-xl font-semibold mb-2">📆 Scheduled Execution</h2>
        <div>
          <label>
            <input type="checkbox" checked={scheduleEnabled} onChange={() => setScheduleEnabled(!scheduleEnabled)} />
            Enable Weekly Schedule
          </label>

          <div className="mt-2">
            <label>Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input">
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="mt-2">
            <label>Day of Week</label>
            <select value={day} onChange={e => setDay(e.target.value)} className="input">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="mt-2">
            <label>Time (24h format)</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input" />
          </div>

          <div className="mt-2">
            <label>Parallel Execution</label>
            <input type="number" value={parallel} onChange={e => setParallel(e.target.value)} className="input" />
          </div>

          {/* Add multi-select for languages if needed */}

          <button className="bg-green-600 text-white px-4 py-2 mt-3 rounded" onClick={handleSaveSchedule}>
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExecutionControlCard;

