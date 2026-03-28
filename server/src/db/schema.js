/**
 * db/schema.js — Runs DDL migrations at startup.
 *
 * Creates the `rooms` table if it does not exist.
 * Safe to call on every server boot (idempotent).
 */
import sql from './pool.js';

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id    VARCHAR(16)  PRIMARY KEY,
      code       TEXT         NOT NULL DEFAULT '',
      language   VARCHAR(32)  NOT NULL DEFAULT 'javascript',
      updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  console.log('[DB] Schema ready ✅');
}
