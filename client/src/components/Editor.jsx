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
  const styleRef = useRef(null);

  // Expose methods so Toolbar/App can call them via ref
  useImperativeHandle(ref, () => ({
    formatCode: () => {
      editorRef.current
        ?.getAction('editor.action.formatDocument')
        ?.run();
    },
    insertSnippetAtCursor: (snippetText) => {
      const editor = editorRef.current;
      if (!editor) return;
      
      const position = editor.getPosition();
      editor.executeEdits('chat-snippet', [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          text: snippetText + '\n',
          forceMoveMarkers: true,
        }
      ]);
      editor.focus();
    }
  }));

  useEffect(() => {
    return () => {
      providerRef.current?.destroy();
      bindingRef.current?.destroy();
      ydocRef.current?.destroy();
      if (styleRef.current) {
        styleRef.current.remove();
      }
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
    const color = randomColor({ luminosity: 'dark', format: 'hex' });
    awareness.setLocalStateField('user', { name: username, color });

    styleRef.current = document.createElement('style');
    document.head.appendChild(styleRef.current);

    const updateCursorStyles = () => {
      let css = `
        @keyframes cursorLabelFade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;
      awareness.getStates().forEach((state, clientId) => {
        if (state.user) {
          const { color, name } = state.user;
          const transparentColor = color + '40'; // ~25% opacity
          css += `
            .yRemoteSelection-${clientId} {
              background-color: ${transparentColor};
            }
            .yRemoteSelectionHead-${clientId} {
              position: absolute;
              border-left: 2px solid ${color};
              box-sizing: border-box;
            }
            .yRemoteSelectionHead-${clientId}::after {
              content: '${name}';
              position: absolute;
              top: -22px;
              left: -2px;
              background-color: ${color};
              color: #fff;
              font-size: 11px;
              font-family: inherit;
              padding: 2px 6px;
              border-radius: 4px;
              border-bottom-left-radius: 0;
              pointer-events: none;
              white-space: nowrap;
              z-index: 50;
              animation: cursorLabelFade 3s forwards;
            }
            .yRemoteSelectionHead-${clientId}:hover::after {
              opacity: 1;
              animation: none;
            }
          `;
        }
      });
      if (styleRef.current) {
        styleRef.current.innerHTML = css;
      }
    };

    awareness.on('change', updateCursorStyles);
    updateCursorStyles();

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

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('tandem-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '0a0a0a' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c4b5fd' }, // sleek purple
        { token: 'string', foreground: '86efac' },  // sleek green
        { token: 'function', foreground: '93c5fd' },// sleek blue
      ],
      colors: {
        'editor.background': '#0a0a0a', // Deep black matches layout
        'editor.lineHighlightBackground': '#111111',
        'editorLineNumber.foreground': '#333333',
        'editorLineNumber.activeForeground': '#7e22ce',
        'editorIndentGuide.background': '#222222',
        'editorWidget.background': '#111111',
        'editorWidget.border': '#333333',
        'editorSuggestWidget.background': '#0a0a0a',
        'editorSuggestWidget.border': '#333333',
        'editorSuggestWidget.highlightForeground': '#c4b5fd',
        'editorSuggestWidget.selectedBackground': '#222222',
      }
    });
  };

  return (
    <MonacoEditor
      height="100%"
      language={language}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      theme="tandem-dark"
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
