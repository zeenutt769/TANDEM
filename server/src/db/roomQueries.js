/**
 * db/roomQueries.js — All DB operations for the `rooms` table.
 *
 * Uses Neon's tagged-template SQL — parameters are automatically
 * escaped, safe against SQL injection.
 */
import sql, { hasDb } from './pool.js';

// In-memory database fallback
const memoryDB = new Map();

/**
 * Fetch a room's persisted state.
 * Returns `null` if the room has never been saved.
 */
export async function getRoom(roomId) {
  if (!hasDb) {
    return memoryDB.get(roomId) ?? null;
  }
  const rows = await sql`
    SELECT room_id, code, language, updated_at
    FROM rooms
    WHERE room_id = ${roomId}
  `;
  return rows[0] ?? null;
}

/**
 * Upsert (insert-or-update) the room's code + language.
 * Called by the debounced PATCH route — safe to call frequently.
 */
export async function upsertRoom(roomId, code, language) {
  if (!hasDb) {
    memoryDB.set(roomId, {
      room_id: roomId,
      code,
      language,
      updated_at: new Date()
    });
    return;
  }
  await sql`
    INSERT INTO rooms (room_id, code, language, updated_at)
    VALUES (${roomId}, ${code}, ${language}, NOW())
    ON CONFLICT (room_id)
    DO UPDATE SET
      code       = EXCLUDED.code,
      language   = EXCLUDED.language,
      updated_at = NOW()
  `;
}
