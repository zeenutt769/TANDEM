import React, { useState, useRef, useEffect } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import RoomJoin from './components/RoomJoin.jsx';
import Editor from './components/Editor.jsx';
import Toolbar from './components/Toolbar.jsx';
import UserList from './components/UserList.jsx';
import OutputPanel from './components/OutputPanel.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import { useSocket } from './hooks/useSocket.js';
import { useCodeRunner } from './hooks/useCodeRunner.js';
import { useRoomPersistence } from './hooks/useRoomPersistence.js';

export default function App() {
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Start coding together...\n');
  const [snippetRequest, setSnippetRequest] = useState(null);

  const { socket, users, connected } = useSocket(roomId, username);
  const { output, isRunning, runCode } = useCodeRunner();
  const editorRef = useRef(null);

  useRoomPersistence(roomId, code, language, ({ code: savedCode, language: savedLang }) => {
    setCode(savedCode);
    setLanguage(savedLang);
  });

  useEffect(() => {
    if (!socket) return;
    
    const handleSnippetReq = (payload) => {
      // Don't ask the sender themselves
      if (payload.sender !== username) {
        setSnippetRequest(payload);
      }
    };

    socket.on('snippet:request-apply', handleSnippetReq);
    return () => socket.off('snippet:request-apply', handleSnippetReq);
  }, [socket, username]);

  const handleFormat = () => editorRef.current?.formatCode();
  const handleApplySnippet = (snippetText) => editorRef.current?.insertSnippetAtCursor(snippetText);

  const handleJoinRoom = ({ roomId, username }) => {
    setRoomId(roomId);
    setUsername(username);
  };

  const handleRunCode = () => {
    runCode(code, language);
  };

  if (!roomId) {
    return <RoomJoin onJoin={handleJoinRoom} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000000', color: '#e2e8f0', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      {/* Top Toolbar */}
      <div style={{ flexShrink: 0, zIndex: 20 }}>
        <Toolbar
          language={language}
          onLanguageChange={setLanguage}
          onRun={handleRunCode}
          onFormat={handleFormat}
          isRunning={isRunning}
          roomId={roomId}
          connected={connected}
        />
      </div>
      
      {/* Main Workspace wrapped in PanelGroup */}
      <PanelGroup orientation="horizontal" style={{ flex: 1, position: 'relative' }}>
        
        {/* Left: Members List */}
        <Panel defaultSize={18} minSize={10} collapsible={true} collapsedSize={0}>
          <UserList users={users} currentUser={username} />
        </Panel>

        <PanelResizeHandle 
          style={{ width: '2px', cursor: 'col-resize', background: '#222' }} 
        />

        {/* Center: Editor (Top) & Terminal (Bottom) */}
        <Panel defaultSize={57} minSize={30}>
          <PanelGroup orientation="vertical" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {/* Editor Container */}
            <Panel defaultSize={75} minSize={20}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                 <Editor
                  ref={editorRef}
                  roomId={roomId}
                  username={username}
                  language={language}
                  onChange={setCode}
                />
              </div>
            </Panel>

            <PanelResizeHandle 
              style={{ height: '2px', cursor: 'row-resize', background: '#222', zIndex: 50 }} 
            />

            {/* Bottom Terminal */}
            <Panel defaultSize={25} minSize={10} collapsible={true} collapsedSize={0}>
              <OutputPanel output={output} isRunning={isRunning} socket={socket} roomId={roomId} />
            </Panel>
          </PanelGroup>
        </Panel>
        
        <PanelResizeHandle 
          style={{ width: '2px', cursor: 'col-resize', background: '#222' }} 
        />

        {/* Right: Glass Chat Box */}
        <Panel defaultSize={25} minSize={15} collapsible={true} collapsedSize={0}>
          <ChatPanel 
            socket={socket} 
            username={username} 
            onApplySnippet={handleApplySnippet} 
          />
        </Panel>

      </PanelGroup>

      {/* Toast Notification for Snippet Approval */}
      {snippetRequest && (
        <div style={{
          position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          background: '#1e1e24', border: '1px solid #7e22ce', borderRadius: '8px',
          padding: '16px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.8)', minWidth: '320px', fontFamily: '"Inter", sans-serif'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#c4b5fd' }}>{snippetRequest.sender}</span> wants to inject code. Allow?
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button 
              onClick={() => setSnippetRequest(null)}
              style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Reject
            </button>
            <button 
              onClick={() => {
                handleApplySnippet(snippetRequest.snippet);
                setSnippetRequest(null);
              }}
              style={{ background: '#7e22ce', border: 'none', color: '#fff', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: '0.2s' }}
              onMouseEnter={(e) => e.target.style.background = '#9333ea'}
              onMouseLeave={(e) => e.target.style.background = '#7e22ce'}
            >
              Approve & Inject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
