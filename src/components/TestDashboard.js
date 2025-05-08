import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

function TestResultsDashboard({ summary, allBreakdowns, loading }) {
  const {
    runId = '—',
    total = 0,
    passed = 0,
    failed = 0,
    duration = '—',
    servicesTested = '—', // New field for Total Services Tested
  } = summary || {};

  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const failInfo = [
    {
      serviceName: 'bedrock-agents-runtime',
      errorSummary:
        'software.amazon.awssdk.core.exception.SdkClientException: Unable to marshall request to JSON: flowAliasIdentifier cannot be empty.',
    },
    {
      serviceName: 'ecr',
      errorSummary:
        'java.util.concurrent.CompletionException: javax.ws.rs.ProcessingException: java.net.SocketException: No such file or directory',
    },
    {
      serviceName: 'glacier',
      errorSummary: 'java.nio.file.NoSuchFileException: ./ReadME.MD',
    },
    {
      serviceName: 'rds',
      errorSummary:
        'java.lang.NullPointerException: Cannot invoke "software.amazon.awssdk.services.rds.model.Endpoint.address()" because the return value of "software.amazon.awssdk.services.rds.model.DBInstance.endpoint()" is null',
    },
    {
      serviceName: 's3',
      errorSummary:
        '[ERROR] TransferManagerTest.s3DirectoriesDownloadWorks -- Time elapsed: 1.664 s <<< FAILURE!',
    },
    {
      serviceName: 'sns',
      errorSummary:
        '[ERROR] com.example.sns.PriceUpdateExampleTest.publishPriceUpdateTest -- Time elapsed: 3.630 s <<< ERROR!',
    },
    {
      serviceName: 'ssm',
      errorSummary:
        'java.util.concurrent.CompletionException: software.amazon.awssdk.services.ssm.model.ResourceLimitExceededException: Window limit exceeded. (Service: Ssm, Status Code: 400, Request ID: c413e487-6da6-439d-ac8f-0589a41b5e73)',
    },
    {
      serviceName: 'transcribe-streaming',
      errorSummary:
        '[ERROR] TranscribeTest.BidirectionalStreaming -- Time elapsed: 0.033 s <<< ERROR!',
    },
  ];

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Test Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
          📊 Test Summary
        </h2>
        <div className="grid gap-4 text-gray-700 text-lg">
          <div className="flex justify-between">
            <span>🆔 <strong>Run Id: </strong></span>
            <span>{runId}</span>
          </div>
          <div className="flex justify-between">
            <span>🔧 <strong>Total Services Tested: </strong></span>
            <span>{servicesTested}</span>
          </div>
          <div className="flex justify-between">
            <span>✅ <strong>Total Tests Run: </strong></span>
            <span>{total}</span>
          </div>
          <div className="flex justify-between">
            <span>🟢 <strong>Passed: </strong></span>
            <span>{passed}</span>
          </div>
          <div className="flex justify-between">
            <span>🔴 <strong>Failed: </strong></span>
            <span>{failed}</span>
          </div>
          <div className="flex justify-between">
            <span>📈 <strong>Pass Rate: </strong></span>
            <span>{passRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>⏱️ <strong>Execution Time: </strong></span>
            <span>{duration}</span>
          </div>
          <button
            onClick={handleModalToggle}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            View Fail Information
          </button>
        </div>
      </div>

      {/* Language Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
          🧪 Test Breakdown by Language
        </h2>
        {allBreakdowns.length > 0 ? (
          <ul className="space-y-3 text-lg text-gray-700">
            {allBreakdowns.map((lang, idx) => (
              <li key={idx} className="flex justify-between border-b pb-1">
                <span>{lang.name}</span>
                <span>
                  {lang.total} tests – {lang.passRate}% pass
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No language data available.</p>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalToggle}
        contentLabel="Fail Information"
        className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-6 w-11/12 max-w-2xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Fail Information</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(failInfo, null, 2)}
          </pre>
          <button
            onClick={handleModalToggle}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  const [selectedLang, setSelectedLang] = useState('Java');
  const [summaryData, setSummaryData] = useState({});
  const [allBreakdowns, setAllBreakdowns] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (lang) => {
    setLoading(true);
    setSummaryData({});
    setAllBreakdowns([]);
  
    try {
      const url = `https://4mjmf7v6c2.execute-api.us-east-1.amazonaws.com/Weathertopstage/mydata?lang=${lang}`;
      const res = await fetch(url);
  
      if (!res.ok) {
        throw new Error('API request failed');
      }
  
      const outerJson = await res.json(); // First parse
      console.log('🌐 Outer JSON:', outerJson);
  
      const innerJson = JSON.parse(outerJson.body); // Second parse
      console.log('✅ Parsed Summary Data:', innerJson);
  
      const runId = innerJson?.RunId || '—';
      const passed = Number(innerJson?.TotalPassed ?? 0);
      const failed = Number(innerJson?.TotalFailed ?? 0);
      const total = passed + failed; // Total tests is passed + failed tests
      const duration = innerJson?.TotalTime || '—';
      const servicesTested = innerJson?.ServicesTested || '—';  // Parsing ServicesTested
  
      console.log('Total:', total);
      console.log('Passed:', passed);
      console.log('Failed:', failed);
  
      // Correct pass rate formula (calculate pass rate by dividing passed tests by total tests)
      const calculatedPassRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
      console.log('Calculated Pass Rate:', calculatedPassRate);
  
      const passRate = `${calculatedPassRate}%`;  // Make it a percentage string
  
      // Final check of pass rate and other data before updating state
      console.log('Pass Rate:', passRate);
  
      setSummaryData({
        runId,
        total,
        passed,
        failed,
        duration,
        servicesTested, // Add ServicesTested to summary data
        passRate: passRate, // Store passRate as a string with "%" symbol
      });
  
      setAllBreakdowns([{
        name: lang,
        total,
        passRate,
      }]);
    } catch (err) {
      console.error('❌ Error parsing summary data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedLang);
  }, [selectedLang]);

  const handleChange = (e) => {
    setSelectedLang(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <label htmlFor="language-select" className="text-lg font-medium text-gray-700 mr-2">
          Select Language:
        </label>
        <select
          id="language-select"
          value={selectedLang}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="Java">Java</option>
          <option value="Kotlin">Kotlin</option>
        </select>
      </div>

      <TestResultsDashboard
        summary={summaryData}
        allBreakdowns={allBreakdowns}
        loading={loading}
      />
    </div>
  );
}



