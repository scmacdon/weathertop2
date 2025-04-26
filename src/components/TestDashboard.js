import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');  // Set the root element for accessibility

function TestResultsDashboard({ summary = {}, allBreakdowns = [] }) {
  const {
    total = 0,
    passed = 0,
    failed = 0,
    duration = '—',
  } = summary;

  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const failInfo = [
    {
      "serviceName": "bedrock-agents-runtime",
      "errorSummary": "software.amazon.awssdk.core.exception.SdkClientException: Unable to marshall request to JSON: flowAliasIdentifier cannot be empty."
    },
    {
      "serviceName": "ecr",
      "errorSummary": "java.util.concurrent.CompletionException: javax.ws.rs.ProcessingException: java.net.SocketException: No such file or directory"
    },
    {
      "serviceName": "glacier",
      "errorSummary": "java.nio.file.NoSuchFileException: ./ReadME.MD"
    },
    {
      "serviceName": "rds",
      "errorSummary": "java.lang.NullPointerException: Cannot invoke \"software.amazon.awssdk.services.rds.model.Endpoint.address()\" because the return value of \"software.amazon.awssdk.services.rds.model.DBInstance.endpoint()\" is null"
    },
    {
      "serviceName": "s3",
      "errorSummary": "[ERROR] TransferManagerTest.s3DirectoriesDownloadWorks -- Time elapsed: 1.664 s <<< FAILURE!"
    },
    {
      "serviceName": "sns",
      "errorSummary": "[ERROR] com.example.sns.PriceUpdateExampleTest.publishPriceUpdateTest -- Time elapsed: 3.630 s <<< ERROR!"
    },
    {
      "serviceName": "ssm",
      "errorSummary": "java.util.concurrent.CompletionException: software.amazon.awssdk.services.ssm.model.ResourceLimitExceededException: Window limit exceeded. (Service: Ssm, Status Code: 400, Request ID: c413e487-6da6-439d-ac8f-0589a41b5e73)"
    },
    {
      "serviceName": "transcribe-streaming",
      "errorSummary": "[ERROR] TranscribeTest.BidirectionalStreaming -- Time elapsed: 0.033 s <<< ERROR!"
    }
  ];

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Test Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
          📊 Test Summary
        </h2>
        <div className="grid gap-4 text-gray-700 text-lg">
          <div className="flex justify-between">
            <span>✅ <strong>Total Tests Run:</strong></span>
            <span>{total}</span>
          </div>
          <div className="flex justify-between">
            <span>🟢 <strong>Passed:</strong></span>
            <span>{passed}</span>
          </div>
          <div className="flex justify-between">
            <span>🔴 <strong>Failed:</strong></span>
            <span>{failed}</span>
          </div>
          <div className="flex justify-between">
            <span>📈 <strong>Pass Rate:</strong></span>
            <span>{passRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>⏱️ <strong>Execution Time:</strong></span>
            <span>{duration}</span>
          </div>
          {/* Button to view fail information */}
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
                <span>{lang.total} tests – {lang.passRate}% pass</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No language data available.</p>
        )}
      </div>

      {/* Modal for Fail Information */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalToggle}
        contentLabel="Fail Information"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white rounded-xl p-6 w-1/2 max-w-lg">
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

const summaryData = {
  Java: {
    total: 442,
    passed: 432,
    failed: 10,
    duration: '5 hours 30 sec',
    languageBreakdown: [{ name: 'Java', total: 442, passRate: 97.7 }]
  },
  Python: {
    total: 500,
    passed: 450,
    failed: 50,
    duration: '3 min 20 sec',
    languageBreakdown: [{ name: 'Python', total: 500, passRate: 90.00 }]
  },
  '.NET': {
    total: 480,
    passed: 470,
    failed: 10,
    duration: '4 min 10 sec',
    languageBreakdown: [{ name: '.NET', total: 480, passRate: 97.92 }]
  }
};

// Flatten all languageBreakdown arrays into one
const allBreakdowns = Object.values(summaryData).flatMap(lang => lang.languageBreakdown);

export default function App() {
  const [selectedLang, setSelectedLang] = useState('Java');

  const handleChange = (e) => setSelectedLang(e.target.value);

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
          <option value="Python">Python</option>
          <option value=".NET">.NET</option>
        </select>
      </div>
      <TestResultsDashboard
        summary={summaryData[selectedLang]}
        allBreakdowns={allBreakdowns}
      />
    </div>
  );
}


