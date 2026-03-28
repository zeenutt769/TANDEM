import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimiter } from './middleware/rateLimiter.js';
import { registerRoomHandler } from './handlers/roomHandler.js';
import { registerEditorHandler } from './handlers/editorHandler.js';
import { registerCursorHandler } from './handlers/cursorHandler.js';
import { registerChatHandler } from './handlers/chatHandler.js';
import { WebSocketServer } from 'ws';
import yWsUtils from 'y-websocket/bin/utils';
import { initDB } from './db/schema.js';
import { getRoom, upsertRoom } from './db/roomQueries.js';
const { setupWSConnection } = yWsUtils;

dotenv.config();

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Room Persistence Routes ──────────────────────────────────────────────────

/**
 * GET /rooms/:roomId
 * Called once when a user joins a room — loads the last saved code + language.
 * Returns 404 with defaults if room has never been persisted.
 */
app.get('/rooms/:roomId', async (req, res) => {
  try {
    const room = await getRoom(req.params.roomId);
    if (!room) {
      // First time anyone opens this room — return clean defaults
      return res.json({ code: '// Start coding together...\n', language: 'javascript' });
    }
    res.json({ code: room.code, language: room.language });
  } catch (err) {
    console.error('[DB] GET /rooms error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * PATCH /rooms/:roomId
 * Called by the debounced frontend hook after 1.5 s of typing inactivity.
 * Body: { code: string, language: string }
 */
app.patch('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { code, language } = req.body;

  if (typeof code !== 'string' || typeof language !== 'string') {
    return res.status(400).json({ error: 'code and language are required strings' });
  }

  try {
    await upsertRoom(roomId, code, language);
    res.json({ saved: true });
  } catch (err) {
    console.error('[DB] PATCH /rooms error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/execute', async (req, res) => {
  const { code, languageConfig, engine } = req.body;
  const executionEngine = process.env.EXECUTION_ENGINE || engine || 'jdoodle';

  try {
    if (executionEngine === 'judge0') {
      // Judge0 Implementation (Fallback for future)
      const judge0Url = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
      const judge0Key = process.env.JUDGE0_API_KEY || '';

      const submitRes = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': judge0Key,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageConfig.judge0Id,
          stdin: '',
        }),
      });

      const data = await submitRes.json();
      const output = data.stdout || data.stderr || data.compile_output || '(No output)';
      return res.json({ output });

    } else {
      // JDoodle Implementation (Default)
      const jdoodleClientId = process.env.JDOODLE_CLIENT_ID;
      const jdoodleClientSecret = process.env.JDOODLE_CLIENT_SECRET;

      if (!jdoodleClientId || !jdoodleClientSecret) {
        return res.status(500).json({ error: 'JDoodle credentials missing in server/.env' });
      }

      const submitRes = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: jdoodleClientId,
          clientSecret: jdoodleClientSecret,
          script: code,
          language: languageConfig.jdoodleLang,
          versionIndex: languageConfig.jdoodleVer,
        })
      });

      const data = await submitRes.json();
      const output = data.output || data.error || '(No output)';
      return res.json({ output });
    }
  } catch (err) {
    console.error('Execution error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── HTTP + Socket.io + Yjs Server ───────────────────────────────────────────
const httpServer = createServer(app);

// Yjs Document Sync Server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (conn, req, { docName = req.url.slice(1).split('?')[0] } = {}) => {
  setupWSConnection(conn, req, { docName, gc: true });
});

httpServer.on('upgrade', (request, socket, head) => {
  if (request.url.startsWith('/yjs/')) {
    // strip the /yjs/ prefix to use the room name as docName
    request.url = request.url.substring(5);
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// ─── Socket.io Handlers ───────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] Client connected: ${socket.id}`);

  registerRoomHandler(io, socket);
  registerEditorHandler(io, socket);
  registerCursorHandler(io, socket);
  registerChatHandler(io, socket);

  socket.on('disconnect', () => {
    console.log(`[-] Client disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
// Boot DB first, then open the HTTP port
initDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 TANDEM Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DB] Failed to initialise database:', err.message);
    console.error('     Make sure DATABASE_URL is set in server/.env');
    process.exit(1);
  });
