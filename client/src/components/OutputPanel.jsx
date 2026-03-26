import React, { useRef, useEffect } from 'react';

/**
 * OutputPanel.jsx — Displays code execution output from Judge0
 */
function OutputPanel({ output, isRunning }) {
  const outputRef = useRef(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="output-panel">
      <div className="output-header">
        <span className="output-title">⚡ Output</span>
        {isRunning && <span className="output-running">Running...</span>}
      </div>
      <div className="output-content" ref={outputRef} id="output-content">
        {isRunning ? (
          <span className="output-placeholder">Executing code...</span>
        ) : output ? (
          <pre className="output-text">{output}</pre>
        ) : (
          <span className="output-placeholder">Run code to see output here</span>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
