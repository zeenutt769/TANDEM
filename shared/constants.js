/**
 * shared/constants.js — Shared constants between client and server
 *
 * Single source of truth for:
 *  - Socket event names
 *  - Room configuration limits
 *  - App-wide constants
 *
 * DRY Principle: Both client (src/hooks) and server (src/handlers)
 * import from this file to prevent event name typos/mismatches.
 */

// ─── Socket Event Names ───────────────────────────────────────────────────────
export const SOCKET_EVENTS = {
  // Room lifecycle
  JOIN_ROOM: 'room:join',
  LEAVE_ROOM: 'room:leave',
  ROOM_STATE: 'room:state',    // Server → Client: full room state on join
  ROOM_USERS: 'room:users',    // Server → Client: user list update
  USER_LEFT: 'room:user_left', // Server → Client: someone disconnected

  // Code synchronization
  CODE_CHANGE: 'code:change',  // Client → Server: local code change
  CODE_UPDATE: 'code:update',  // Server → Client: broadcast code change
  OPERATION: 'ot:operation',   // OT operation (full OT flow)
  ACK: 'ot:ack',               // Server → Client: operation acknowledged

  // Cursor synchronization
  CURSOR_MOVE: 'cursor:move',    // Client → Server: local cursor moved
  CURSOR_UPDATE: 'cursor:update', // Server → Client: remote cursor position
};

// ─── Room Limits ──────────────────────────────────────────────────────────────
export const ROOM_CONFIG = {
  MAX_USERS_PER_ROOM: 10,
  ROOM_ID_LENGTH: 6,
  CODE_MAX_LENGTH: 100_000, // 100KB max code size
  HISTORY_MAX_SIZE: 500,    // Max OT operations to keep in memory
};

// ─── App Constants ────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  NAME: 'TANDEM',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'javascript',
  CURSOR_INACTIVITY_TIMEOUT_MS: 30_000, // Hide cursor after 30s inactivity
};
