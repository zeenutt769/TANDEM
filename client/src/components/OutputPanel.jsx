import React from 'react';

export default function OutputPanel({ output, isRunning }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#000', borderTop: '1px solid #222', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Output Terminal</span>
        </div>
        {isRunning && (
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', letterSpacing: '1px', animation: 'pulse 1.5s infinite' }}>
            Running...
          </span>
        )}
      </div>

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#000' }}>
        {output ? (
          <pre style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.5' }}>
            {output}
          </pre>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'flex-start', color: '#333', fontStyle: 'italic', fontFamily: 'monospace', fontSize: '12px' }}>
            &gt;_ Ready for execution
          </div>
        )}
      </div>
    </div>
  );
}
