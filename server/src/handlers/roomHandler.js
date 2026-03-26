import { getRoomStore, addUserToRoom, removeUserFromRoom, createRoom } from '../store/roomStore.js';
import { SOCKET_EVENTS } from '../../../shared/constants.js';

/**
 * roomHandler.js — Handles room lifecycle events
 * Events: JOIN_ROOM, LEAVE_ROOM, ROOM_USERS
 */
export function registerRoomHandler(io, socket) {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, username }) => {
    // Create room if it doesn't exist
    if (!getRoomStore().has(roomId)) {
      createRoom(roomId);
    }

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username;

    addUserToRoom(roomId, { id: socket.id, username });

    // Send current room state to the joining user
    const room = getRoomStore().get(roomId);
    socket.emit(SOCKET_EVENTS.ROOM_STATE, {
      code: room.code,
      revision: room.revision,
    });

    // Broadcast updated user list to all in room
    const users = Array.from(room.users.values());
    io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, users);

    console.log(`[Room] ${username} (${socket.id}) joined room ${roomId}`);
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId }) => {
    handleLeave(io, socket, roomId);
  });

  socket.on('disconnect', () => {
    const { roomId } = socket.data;
    if (roomId) handleLeave(io, socket, roomId);
  });
}

function handleLeave(io, socket, roomId) {
  removeUserFromRoom(roomId, socket.id);
  socket.leave(roomId);

  const room = getRoomStore().get(roomId);
  if (room) {
    const users = Array.from(room.users.values());
    io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, users);
    io.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, { userId: socket.id });
  }

  console.log(`[Room] ${socket.data.username} left room ${roomId}`);
}
