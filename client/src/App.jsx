import React, { useState, useRef } from 'react';
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

  const { socket, users, connected } = useSocket(roomId, username);
  const { output, isRunning, runCode } = useCodeRunner();
  const editorRef = useRef(null);

  useRoomPersistence(roomId, code, language, ({ code: savedCode, language: savedLang }) => {
    setCode(savedCode);
    setLanguage(savedLang);
  });

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
              <OutputPanel output={output} isRunning={isRunning} />
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
    </div>
  );
}
