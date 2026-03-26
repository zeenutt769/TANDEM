import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../../../shared/constants.js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

/**
 * useSocket.js — Manages Socket.io connection lifecycle
 * Handles: connect, disconnect, room join/leave, user list updates
 */
export function useSocket(roomId, username) {
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId || !username) return;

    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, username });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on(SOCKET_EVENTS.ROOM_USERS, (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId });
      socket.disconnect();
    };
  }, [roomId, username]);

  return { socket: socketRef.current, users, connected };
}
