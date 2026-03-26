import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin.jsx';
import Editor from './components/Editor.jsx';
import Toolbar from './components/Toolbar.jsx';
import UserList from './components/UserList.jsx';
import UserCursors from './components/UserCursors.jsx';
import OutputPanel from './components/OutputPanel.jsx';
import { useSocket } from './hooks/useSocket.js';
import { useCollaboration } from './hooks/useCollaboration.js';
import { useCodeRunner } from './hooks/useCodeRunner.js';

function App() {
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState(null);
  const [language, setLanguage] = useState('javascript');

  const { socket, users, connected } = useSocket(roomId, username);
  const { code, setCode, remoteCursors } = useCollaboration(socket, roomId);
  const { output, isRunning, runCode } = useCodeRunner();

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
    <div className="app-container">
      <Toolbar
        language={language}
        onLanguageChange={setLanguage}
        onRun={handleRunCode}
        isRunning={isRunning}
        roomId={roomId}
        connected={connected}
      />
      <div className="editor-layout">
        <UserList users={users} currentUser={username} />
        <div className="editor-wrapper">
          <Editor
            code={code}
            onChange={setCode}
            language={language}
            socket={socket}
          />
          <UserCursors cursors={remoteCursors} />
        </div>
        <OutputPanel output={output} isRunning={isRunning} />
      </div>
    </div>
  );
}

export default App;
