/**
 * roomStore.js — In-memory room state management
 *
 * Room shape:
 * {
 *   code: string,         — Current document content
 *   revision: number,     — Monotonically increasing revision counter
 *   history: Operation[], — All OT operations (for transform against late clients)
 *   users: Map<socketId, { id, username }>
 * }
 *
 * TODO: Replace with Redis for multi-instance deployments
 */

const roomStore = new Map();

export function getRoomStore() {
  return roomStore;
}

export function createRoom(roomId) {
  roomStore.set(roomId, {
    code: '// Start coding together!\n',
    revision: 0,
    history: [],
    users: new Map(),
  });
}

export function addUserToRoom(roomId, user) {
  const room = roomStore.get(roomId);
  if (!room) return false;
  room.users.set(user.id, user);
  return true;
}

export function removeUserFromRoom(roomId, socketId) {
  const room = roomStore.get(roomId);
  if (!room) return false;

  room.users.delete(socketId);

  // Clean up empty rooms after a delay
  if (room.users.size === 0) {
    setTimeout(() => {
      const r = roomStore.get(roomId);
      if (r && r.users.size === 0) {
        roomStore.delete(roomId);
        console.log(`[Store] Room ${roomId} cleaned up (empty)`);
      }
    }, 60_000); // 60 second grace period
  }

  return true;
}

export function getRoom(roomId) {
  return roomStore.get(roomId);
}

export function getRoomCode(roomId) {
  return roomStore.get(roomId)?.code ?? null;
}
