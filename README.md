<div align="center">

# ⟨/⟩ TANDEM

### Real-time Collaborative Code Editor

> Code together, in real-time. No lag. No conflict. Just flow.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-58a6ff?style=for-the-badge)](https://tandem-editor.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-0d1117?style=for-the-badge&logo=railway)](https://tandem-api.railway.app)
[![License](https://img.shields.io/badge/License-MIT-3fb950?style=for-the-badge)](LICENSE)

</div>

---



*Tip: Open two browser tabs → same Room ID → type in one → watch it appear in the other instantly.*

---

## ✨ Features

- 🔴 **Live Collaboration** — Multiple users editing the same file simultaneously
- 🧬 **CRDT Sync (Yjs)** — Conflict-free concurrent edits, same tech as Figma & Notion
- 🗄️ **Persistent Code Sync** — Powered by Neon Serverless PostgreSQL for immediate room resume
- 🎨 **Dynamic Resizable Layout** — Slide your terminal, expand your chat (VS Code aesthetic)
- 💬 **Live Context-Aware Chat** — Dedicated chat panel for seamless team communication
- 🛡️ **Chat Snippet Approval System** — Request workspace permission before injecting code snippets (Antigravity-style)
- 🖱️ **Live Cursors & Named Labels** — Google Docs-style cursors showing exactly who is typing and where
- 🎯 **Shared Terminal Focus (Sync-Scroll)** — Keep your team on the same line with auto-synchronized output terminals
- 🌐 **Multi-language Support** — JavaScript, Python, C++, Java, Go, Rust, TypeScript, C
- 🏃 **Code Execution** — Run code directly in the browser via backend JDoodle API
- ✨ **Auto-formatting** — One-click format code + auto-closing brackets, smart indent
- 🔗 **Shareable Rooms** — 6-char Room code — one link to invite your whole team
- 🎨 **Monaco Editor** — Same robust engine as VS Code

---

## 🧠 How It Works — CRDT (Yjs)

**The Problem:** Two users type at the same time. Without synchronization, their edits collide and corrupt the document.

**The Solution — CRDT (Conflict-free Replicated Data Types) via Yjs:**

```
Client A (types "Hello")       Client B (types "World")
        │                               │
        │    Y.Doc (shared state)        │
        └──────────► Yjs ◄─────────────┘
                       │
           Mathematical merge (no conflict possible)
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
  Client A sees:               Client B sees:
   "HelloWorld"                  "HelloWorld"
        ✓ Always Consistent ✓   (even offline!)
```

**Why CRDT > OT for coding:**
1. **No central server needed** to resolve conflicts — math does it automatically
2. **Works offline** — edits sync when connection restores, zero data loss
3. **Character-level precision** — a single comma or bracket is never lost
4. **Live cursors + selections** built-in via Yjs Awareness protocol

> 📖 Deep dive: [Yjs Documentation](https://docs.yjs.dev) | [CRDT — Wikipedia](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) | [How Figma uses CRDTs](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

> 💡 **Note:** We originally built this with OT (like Google Docs), then upgraded to CRDT (like Figma/Notion) for better performance and offline support.

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, component-based UI without heavy SSR overhead |
| UI/UX | Framer Motion + Resizable Panels | Beautiful fade-ins and dynamic sliding layouts |
| Editor | Monaco Editor | Exact VS Code editing experience (IntelliSense natively) |
| Real-time | Socket.io + WebSocket (ws) | Low-latency bi-directional comms, robust event acks |
| Sync Logic | **Yjs CRDT** | Deterministic code merging, no server-side arbitration matrix |
| Execution | JDoodle Proxy | Backend proxy routes untrusted code securely |
| Backend | Node.js + Express | Lightweight, non-blocking middleware |
| Database | **PostgreSQL (Neon)** | Serverless DB for room persistence, snippets & stats |

---

## 📁 Project Structure

```
TANDEM/
├── client/                   # React Frontend (Vite)
│   └── src/
│       ├── components/       # Editor (Yjs), Toolbar, UserList, RoomJoin, OutputPanel
│       ├── hooks/            # useSocket, useCodeRunner
│       ├── utils/            # colors.js, roomUtils.js
│       └── constants/        # languages.js (JDoodle + Judge0 + Piston configs)
│
├── server/                   # Node.js Backend
│   └── src/
│       ├── handlers/         # roomHandler, editorHandler, cursorHandler
│       ├── store/            # roomStore.js (in-memory, Redis-replaceable)
│       └── middleware/       # rateLimiter.js
│       └── index.js          # Express + Socket.io + Yjs WebSocket server
│
├── shared/
│   └── constants.js          # Socket event names — DRY, used by both sides
│
├── DEVLOG.md                 # Day-by-day dev log — decisions, bugs, fixes
└── docker-compose.yml        # Local Redis setup
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/tandem.git
cd tandem

# Install all dependencies (root + client + server)
npm run install:all
```

### Environment Variables

```bash
# Copy the example files
cp client/.env.example client/.env
cp server/.env.example server/.env
```

```env
# client/.env
VITE_SERVER_URL=http://localhost:3001

# server/.env
PORT=3001
CLIENT_URL=http://localhost:5173
EXECUTION_ENGINE=jdoodle
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
REDIS_URL=redis://localhost:6379   # Optional — only if using Docker
```

> 🔑 Get your **free** JDoodle API credentials at [jdoodle.com/compiler-api](https://www.jdoodle.com/compiler-api) — no credit card needed!

> 💡 **Want to use Judge0 instead?** Set `EXECUTION_ENGINE=judge0` and add `JUDGE0_API_KEY` in `server/.env`. Judge0 key available at [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).

### Running in Development

```bash
# Starts BOTH frontend + backend simultaneously 🚀
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| Health Check | http://localhost:3001/health |

### 🐳 Docker (Optional Redis for persistence)

```bash
docker-compose up -d
```

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from client/ directory
cd client
vercel --prod
```

Set these environment variables in your Vercel dashboard:
- `VITE_SERVER_URL` → your Railway backend URL
- `VITE_PISTON_API_URL` → (Optional) Your own Piston instance URL if you prefer not to use the public one.

### Backend → Railway

1. Push your repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the repo, set **Root Directory** to `server/`
4. Add environment variables:
   - `PORT` = `3001`
   - `CLIENT_URL` = your Vercel frontend URL

> 💡 **Live Demo:** [tandem-editor.vercel.app](https://tandem-editor.vercel.app) ← *Update this after deploying!*

---

## 🔮 Roadmap

- [x] Real-time code sync — upgraded from OT → **Yjs CRDT** (Figma-level sync)
- [x] Live cursor positions + colored selections via Yjs Awareness
- [x] Multi-language code execution proxy (JDoodle)
- [x] Shareable room links & persistent chat panel
- [x] Neon Serverless Postgres integration for Room states
- [x] Dynamic Drag-to-Resize Layout mirroring standard IDEs
- [x] Beautiful Landing Page with Framer Motion animations
- [ ] 🎙️ Voice chat integration (WebRTC)
- [ ] 🌿 Git integration — commit directly from editor
- [ ] 📁 File tree support — multi-file collaboration
- [ ] 🔒 Password-protected rooms
- [ ] 🚀 Deploy — Vercel (frontend) + Railway (backend)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repo and create your branch
git checkout -b feature/your-feature-name

# 2. Make your changes and commit
git commit -m "feat: add your feature"

# 3. Push and open a Pull Request
git push origin feature/your-feature-name
```

**Please follow:**
- Conventional commits (`feat:`, `fix:`, `docs:`)
- One feature per PR
- Test your changes locally before submitting

---

## 📄 License

MIT © 2025 TANDEM — Built with ❤️ for real-time collaboration
