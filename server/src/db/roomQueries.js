/**
 * db/roomQueries.js — All DB operations for the `rooms` table.
 *
 * Uses Neon's tagged-template SQL — parameters are automatically
 * escaped, safe against SQL injection.
 */
import sql from './pool.js';

/**
 * Fetch a room's persisted state.
 * Returns `null` if the room has never been saved.
 */
export async function getRoom(roomId) {
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
