import React from 'react';
import { LANGUAGES } from '../constants/languages.js';

/**
 * Toolbar.jsx — Language selector, Run button, room info
 */
function Toolbar({ language, onLanguageChange, onRun, isRunning, roomId, connected }) {
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-logo">⟨/⟩</span>
        <span className="toolbar-title">TANDEM</span>
      </div>

      <div className="toolbar-center">
        <select
          className="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          id="language-selector"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>

        <button
          id="run-code-btn"
          className={`run-btn ${isRunning ? 'running' : ''}`}
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Running...' : '▶ Run Code'}
        </button>
      </div>

      <div className="toolbar-right">
        <div className={`connection-dot ${connected ? 'connected' : 'disconnected'}`} />
        <button
          id="copy-room-id-btn"
          className="room-id-btn"
          onClick={handleCopyRoomId}
          title="Click to copy Room ID"
        >
          🔗 Room: {roomId}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
