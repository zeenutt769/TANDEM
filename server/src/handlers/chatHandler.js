import { SOCKET_EVENTS } from '../../../shared/constants.js';

/**
 * chatHandler.js — Relays chat messages and snippets across the room
 */
export function registerChatHandler(io, socket) {
  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (messagePayload) => {
    // messagePayload expects { text, isCodeSnippet, sender, time }
    const { roomId } = socket.data;
    if (roomId) {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, messagePayload);
    }
  });

  socket.on('snippet:request-apply', (payload) => {
    const { roomId } = socket.data;
    if (roomId) {
      socket.to(roomId).emit('snippet:request-apply', payload);
    }
  });
}
