import React, { useState } from 'react';
import { generateRoomId } from '../utils/roomUtils.js';

/**
 * RoomJoin.jsx — Landing page: create or join a room
 */
function RoomJoin({ onJoin }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState('create'); // 'create' | 'join'
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }

    const finalRoomId = mode === 'create' ? generateRoomId() : roomId.trim().toUpperCase();

    if (mode === 'join' && !finalRoomId) {
      setError('Please enter a Room ID to join.');
      return;
    }

    onJoin({ roomId: finalRoomId, username: username.trim() });
  };

  return (
    <div className="room-join-page">
      <div className="room-join-card">
        <div className="room-join-logo">⟨/⟩</div>
        <h1 className="room-join-title">TANDEM</h1>
        <p className="room-join-subtitle">Real-time collaborative code editor</p>

        <div className="mode-toggle">
          <button
            id="create-mode-btn"
            className={`mode-btn ${mode === 'create' ? 'active' : ''}`}
            onClick={() => setMode('create')}
          >
            Create Room
          </button>
          <button
            id="join-mode-btn"
            className={`mode-btn ${mode === 'join' ? 'active' : ''}`}
            onClick={() => setMode('join')}
          >
            Join Room
          </button>
        </div>

        <form onSubmit={handleSubmit} className="room-join-form">
          <div className="form-group">
            <label htmlFor="username-input">Your Name</label>
            <input
              id="username-input"
              type="text"
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </div>

          {mode === 'join' && (
            <div className="form-group">
              <label htmlFor="room-id-input">Room ID</label>
              <input
                id="room-id-input"
                type="text"
                placeholder="Enter Room ID..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                maxLength={8}
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <button id="submit-room-btn" type="submit" className="submit-btn">
            {mode === 'create' ? '🚀 Create & Join' : '🔗 Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RoomJoin;
