import { getRoomStore } from '../store/roomStore.js';
import { applyOperation, transform } from '../ot/otServer.js';
import { SOCKET_EVENTS } from '../../../shared/constants.js';

/**
 * editorHandler.js — Handles code synchronization via OT
 * Events: CODE_CHANGE, OPERATION
 */
export function registerEditorHandler(io, socket) {
  // Simplified full-code sync handler (Step 1 — before full OT is implemented)
  socket.on(SOCKET_EVENTS.CODE_CHANGE, ({ roomId, code, revision }) => {
    const store = getRoomStore();
    const room = store.get(roomId);
    if (!room) return;

    room.code = code;
    room.revision += 1;

    // Broadcast updated code to all OTHER users in the room
    socket.to(roomId).emit(SOCKET_EVENTS.CODE_UPDATE, code);
  });

  // Full OT operation handler (Step 2 — proper OT)
  socket.on(SOCKET_EVENTS.OPERATION, ({ roomId, operation, revision }) => {
    const store = getRoomStore();
    const room = store.get(roomId);
    if (!room) return;

    // Transform against any operations that happened since client's revision
    let transformedOp = operation;
    const opsToTransformAgainst = room.history.slice(revision);

    for (const historyOp of opsToTransformAgainst) {
      transformedOp = transform(transformedOp, historyOp);
      if (!transformedOp) return; // Operation cancelled by transform
    }

    // Apply to server document
    room.code = applyOperation(room.code, transformedOp);
    room.history.push(transformedOp);
    room.revision += 1;

    // Broadcast transformed operation to all others
    socket.to(roomId).emit(SOCKET_EVENTS.OPERATION, {
      operation: transformedOp,
      revision: room.revision,
    });

    // Acknowledge to sender
    socket.emit(SOCKET_EVENTS.ACK, { revision: room.revision });
  });
}
