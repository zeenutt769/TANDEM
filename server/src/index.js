import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimiter } from './middleware/rateLimiter.js';
import { registerRoomHandler } from './handlers/roomHandler.js';
import { registerEditorHandler } from './handlers/editorHandler.js';
import { registerCursorHandler } from './handlers/cursorHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── HTTP + Socket.io Server ──────────────────────────────────────────────────
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
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

  socket.on('disconnect', () => {
    console.log(`[-] Client disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`🚀 TANDEM Server running on http://localhost:${PORT}`);
});
