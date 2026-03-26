import { SOCKET_EVENTS } from '../../../shared/constants.js';

/**
 * cursorHandler.js — Broadcasts cursor position updates to room members
 * Events: CURSOR_MOVE → CURSOR_UPDATE (broadcast to others)
 */
export function registerCursorHandler(io, socket) {
  socket.on(SOCKET_EVENTS.CURSOR_MOVE, ({ line, column }) => {
    const { roomId, username } = socket.data;
    if (!roomId) return;

    // Broadcast cursor position to all OTHER users in the room
    socket.to(roomId).emit(SOCKET_EVENTS.CURSOR_UPDATE, {
      userId: socket.id,
      username,
      line,
      column,
    });
  });
}
