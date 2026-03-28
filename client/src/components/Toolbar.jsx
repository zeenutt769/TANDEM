import React from 'react';
import { LANGUAGES } from '../constants/languages.js';

export default function Toolbar({ language, onLanguageChange, onRun, onFormat, isRunning, roomId, connected }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#0a0a0a', borderBottom: '1px solid #222', width: '100%', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif', color: '#fff' }}>
      
      {/* Brand */}
      <div 
        onClick={() => window.location.reload()} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        title="Go to Home"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.3px' }}>TANDEM</span>
      </div>

      {/* Center Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{ appearance: 'none', background: '#111', border: '1px solid #333', color: '#e2e8f0', fontSize: '13px', fontWeight: '500', borderRadius: '6px', padding: '6px 32px 6px 12px', cursor: 'pointer', outline: 'none', transition: '0.2s' }}
            onFocus={(e) => e.target.style.border = '1px solid #555'}
            onBlur={(e) => e.target.style.border = '1px solid #333'}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>
          <svg style={{ position: 'absolute', right: '10px', top: '10px', pointerEvents: 'none', color: '#64748b' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        <button 
          onClick={onFormat}
          style={{ height: '32px', padding: '0 12px', background: 'transparent', border: '1px solid #333', color: '#e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
          onMouseEnter={(e) => { e.target.style.background = '#222'; e.target.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#e2e8f0'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Format
        </button>

        <button 
          onClick={onRun}
          disabled={isRunning}
          style={{ height: '32px', padding: '0 16px', background: isRunning ? '#333' : '#fff', border: 'none', color: isRunning ? '#888' : '#000', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: isRunning ? 'not-allowed' : 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
          onMouseEnter={(e) => { if(!isRunning) e.target.style.background = '#e2e8f0'; }}
          onMouseLeave={(e) => { if(!isRunning) e.target.style.background = '#fff'; }}
        >
          {isRunning ? 'Executing...' : (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run Code</>
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444', boxShadow: connected ? '0 0 8px rgba(34,197,94,0.5)' : 'none' }} />
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{connected ? 'Live' : 'Offline'}</span>
        </div>
        
        <button 
          onClick={handleCopyRoomId}
          style={{ height: '32px', padding: '0 12px', background: '#111', border: '1px solid #333', color: '#e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
          onMouseEnter={(e) => e.target.style.border = '1px solid #555'}
          onMouseLeave={(e) => e.target.style.border = '1px solid #333'}
        >
          {copied ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
          ID: {roomId}
        </button>
      </div>
    </div>
  );
}
