import React from 'react';
import Modal from 'react-modal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const RunRateModal = ({ isOpen, onClose, data }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="3-Day Run Rate"
      className="runrate-modal"
      overlayClassName="runrate-overlay"
      style={{
        content: {
          backgroundColor: '#1e293b', // slate-800 dark background
          color: '#f3f4f6',           // light text
          border: 'none',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '720px',
          margin: 'auto',
          inset: 'unset',            // disable default top/left styles
          maxHeight: '90vh',
          overflowY: 'auto',
        },
        overlay: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)', // dark navy overlay
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <div className="runrate-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 className="runrate-title" style={{ fontSize: '1.75rem', fontWeight: '600', textAlign: 'center', color: '#f9fafb' }}>
          📊 3-Day Run Rate
        </h2>

        <ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis dataKey="date" stroke="#cbd5e1" />
    <YAxis 
      stroke="#cbd5e1" 
      domain={[90, 100]} 
      tickFormatter={(tick) => `${tick}%`} 
    />
  <Tooltip
  contentStyle={{
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    border: '1px solid #256d46',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
    padding: '8px 12px',
  }}
  labelStyle={{ 
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '1.2rem',          // bigger label font
    textShadow: '0 0 3px rgba(0,0,0,0.7)',
  }}
  wrapperStyle={{ backgroundColor: 'transparent' }}
  cursor={{ fill: 'rgba(22, 163, 74, 0.25)' }}
  formatter={(value) => (
    <span
      style={{
        color: '#f87171',
        fontWeight: '800',
        fontSize: '1.5rem',      // bigger value font
        textShadow: '0 0 5px rgba(0,0,0,0.85)',
      }}
    >
      {value.toFixed(1)}%
    </span>
  )}
/>







    <Bar dataKey="passRate" fill="#16a34a" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

        <button
          className="runrate-close"
          onClick={onClose}
          style={{
            alignSelf: 'center',
            backgroundColor: '#334155',
            color: '#f1f5f9',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#475569')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#334155')}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default RunRateModal;

