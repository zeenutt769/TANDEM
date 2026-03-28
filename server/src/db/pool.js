/**
 * db/pool.js — Neon Serverless PostgreSQL client (singleton)
 *
 * Uses @neondatabase/serverless — Neon's official driver.
 * Communicates over HTTP (no TCP handshake), perfect for serverless + pooled connections.
 *
 * Usage in other modules:
 *   import sql from './pool.js';
 *   const rows = await sql`SELECT * FROM rooms WHERE room_id = ${roomId}`;
 */
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('[DB] DATABASE_URL is not set in server/.env');
}

// `neon()` returns a tagged-template SQL function.
// Each call is a fresh HTTP request — no long-lived connection to manage.
const sql = neon(process.env.DATABASE_URL);

export default sql;
