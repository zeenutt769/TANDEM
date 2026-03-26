import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { SOCKET_EVENTS } from '../../../shared/constants.js';

/**
 * Editor.jsx — Monaco Editor wrapper with Socket.io sync
 * Sends local changes to server and applies remote changes from OT
 */
function Editor({ code, onChange, language, socket }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const isRemoteChange = useRef(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Broadcast cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (socket) {
        socket.emit(SOCKET_EVENTS.CURSOR_MOVE, {
          line: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });
  };

  const handleChange = (value) => {
    if (!isRemoteChange.current) {
      onChange(value);
    }
  };

  // Apply remote changes without triggering local emit loop
  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENTS.CODE_UPDATE, (newCode) => {
      isRemoteChange.current = true;
      onChange(newCode);
      isRemoteChange.current = false;
    });
    return () => socket.off(SOCKET_EVENTS.CODE_UPDATE);
  }, [socket, onChange]);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={code}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'all',
        bracketPairColorization: { enabled: true },
        padding: { top: 16 },
      }}
    />
  );
}

export default Editor;
