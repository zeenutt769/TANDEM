import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import randomColor from 'randomcolor';

const WS_URL = import.meta.env.VITE_SERVER_URL
  ? import.meta.env.VITE_SERVER_URL.replace(/^http/, 'ws')
  : 'ws://localhost:3001';

/**
 * Editor.jsx — Monaco Editor with Yjs CRDT, precision coding options & auto-format
 */
const Editor = forwardRef(function Editor({ roomId, username, language, onChange }, ref) {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);
  const providerRef = useRef(null);
  const ydocRef = useRef(null);

  // Expose formatCode() so Toolbar/App can call it via ref
  useImperativeHandle(ref, () => ({
    formatCode: () => {
      editorRef.current
        ?.getAction('editor.action.formatDocument')
        ?.run();
    },
  }));

  useEffect(() => {
    return () => {
      providerRef.current?.destroy();
      bindingRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    // 1. Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 2. Setup Yjs WebSocket provider
    const provider = new WebsocketProvider(`${WS_URL}/yjs/${roomId}`, roomId, ydoc);
    providerRef.current = provider;

    // 3. Shared text type
    const ytext = ydoc.getText('monaco');

    // 4. Awareness — live cursors with username + color
    const awareness = provider.awareness;
    const color = randomColor({ luminosity: 'dark' });
    awareness.setLocalStateField('user', { name: username, color });

    // 5. Bind Yjs ↔ Monaco
    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      awareness
    );
    bindingRef.current = binding;

    // Keep React state in sync for "Run Code"
    ytext.observe(() => onChange(ytext.toString()));
  };

  return (
    <MonacoEditor
      height="100%"
      language={language}
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

        // ── Precision coding features ──────────────────────────────
        formatOnPaste: true,             // Auto-format pasted code instantly
        formatOnType: true,              // Smart indent as you type
        autoClosingBrackets: 'always',   // Auto-close { [ (
        autoClosingQuotes: 'always',     // Auto-close " '
        autoSurround: 'languageDefined', // Wrap selected text with brackets
        autoIndent: 'full',              // Full smart indentation
        matchBrackets: 'always',         // Highlight matching brackets
        showUnused: true,                // Dim unused variables
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
      }}
    />
  );
});

export default Editor;
