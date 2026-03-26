import { useEffect, useState, useCallback, useRef } from 'react';
import { SOCKET_EVENTS } from '../../../shared/constants.js';
import { applyOperation, createInsertOp, createDeleteOp } from '../utils/otClient.js';

/**
 * useCollaboration.js — OT-based collaborative editing logic
 * Handles: local edits → emit operation, remote operations → apply to doc
 */
export function useCollaboration(socket, roomId) {
  const [code, setCodeState] = useState('// Start coding together...\n');
  const [remoteCursors, setRemoteCursors] = useState({});
  const revisionRef = useRef(0);
  const pendingOpsRef = useRef([]);

  // Apply incoming remote operation from server
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.OPERATION, ({ operation, revision }) => {
      setCodeState((prev) => applyOperation(prev, operation));
      revisionRef.current = revision;
    });

    socket.on(SOCKET_EVENTS.CURSOR_UPDATE, ({ userId, username, line, column }) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [userId]: { username, line, column },
      }));
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, ({ userId }) => {
      setRemoteCursors((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    });

    socket.on(SOCKET_EVENTS.ROOM_STATE, ({ code, revision }) => {
      setCodeState(code);
      revisionRef.current = revision;
    });

    return () => {
      socket.off(SOCKET_EVENTS.OPERATION);
      socket.off(SOCKET_EVENTS.CURSOR_UPDATE);
      socket.off(SOCKET_EVENTS.USER_LEFT);
      socket.off(SOCKET_EVENTS.ROOM_STATE);
    };
  }, [socket]);

  const setCode = useCallback(
    (newCode) => {
      setCodeState((prevCode) => {
        if (newCode === prevCode) return prevCode;
        // TODO: Compute diff to generate OT operation
        // For now, emit full code sync (simplified)
        if (socket) {
          socket.emit(SOCKET_EVENTS.CODE_CHANGE, {
            roomId,
            code: newCode,
            revision: revisionRef.current,
          });
        }
        return newCode;
      });
    },
    [socket, roomId]
  );

  return { code, setCode, remoteCursors };
}
