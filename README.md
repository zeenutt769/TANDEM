<div align="center">

# ⟨/⟩ TANDEM

### Real-time Collaborative Code Editor

> Code together, in real-time. No lag. No conflict. Just flow.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-58a6ff?style=for-the-badge)](https://tandem-editor.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-0d1117?style=for-the-badge&logo=railway)](https://tandem-api.railway.app)
[![License](https://img.shields.io/badge/License-MIT-3fb950?style=for-the-badge)](LICENSE)

</div>

---

## 📸 Demo

> ⚠️ *Add a GIF here — record with [ScreenToGif](https://www.screentogif.com/) after running the project*

```
[demo.gif goes here — shows two browser windows editing the same file in real-time]
```

*Tip: Open two browser tabs → same Room ID → type in one → watch it appear in the other instantly.*

---

## ✨ Features

- 🔴 **Live Collaboration** — Multiple users editing the same file simultaneously
- ⚙️ **Operational Transformation (OT)** — Conflict-free concurrent edits with no data loss
- 🖱️ **Live Cursors** — See exactly where your teammates are typing, in real-time
- 🌐 **Multi-language Support** — JavaScript, Python, C++, Java, Go, Rust, TypeScript, C
- 🏃 **Code Execution** — Run code directly in the browser via Judge0 API
- 🔗 **Shareable Rooms** — 6-char Room ID — one link to invite your whole team
- 🎨 **Monaco Editor** — Same engine as VS Code

---

## 🧠 How It Works — OT Algorithm

**The Problem:** Two users type at the same time. Without synchronization, their edits collide and corrupt the document.

**The Solution — Operational Transformation:**

```
Client A (types " World" at pos 5)          Client B (deletes "H" at pos 0)
        │                                            │
        └──────────────► OT Server ◄────────────────┘
                              │
                    transform(opA, opB)
                    transform(opB, opA)
                              │
                    Broadcasts corrected ops
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
      Client A sees:                    Client B sees:
       "ello World"                      "ello World"
             ✓ Consistent ✓
```

**3-line summary:**
1. Every edit becomes an **Operation** `{ type: 'insert'|'delete', pos, text }`
2. The server **transforms** concurrent operations against each other before applying
3. All clients end up with the **same document** regardless of network delay

> 📖 Deep dive: [Operational Transformation — Wikipedia](https://en.wikipedia.org/wiki/Operational_transformation) | [Google Wave OT Paper](https://svn.apache.org/repos/asf/incubator/wave/whitepapers/operational-transform/operational-transform.html)

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, modern tooling |
| Editor | Monaco Editor | Same engine as VS Code |
| Real-time | Socket.io | WebSocket with auto-fallback |
| Sync Logic | Custom OT Algorithm | Conflict-free concurrent edits |
| Execution | Judge0 API | Sandboxed multi-language runner |
| Backend | Node.js + Express | Lightweight, non-blocking I/O |
| State | In-memory Map (Redis-ready) | Fast room state, Redis for scale |

---

## 📁 Project Structure

```
TANDEM/
├── client/                   # React Frontend (Vite)
│   └── src/
│       ├── components/       # Editor, Toolbar, UserList, RoomJoin...
│       ├── hooks/            # useSocket, useCollaboration, useCodeRunner
│       ├── utils/            # otClient.js, colors.js, roomUtils.js
│       └── constants/        # languages.js (Judge0 IDs)
│
├── server/                   # Node.js Backend
│   └── src/
│       ├── handlers/         # roomHandler, editorHandler, cursorHandler
│       ├── ot/               # OT engine — otServer.js, operations.js
│       ├── store/            # roomStore.js (in-memory, Redis-replaceable)
│       └── middleware/       # rateLimiter.js
│
├── shared/
│   └── constants.js          # Socket event names — DRY, used by both sides
│
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
VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=your_rapidapi_key_here

# server/.env
PORT=3001
CLIENT_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379   # Optional — only if using Docker
```

> 🔑 Get your free Judge0 API key at [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)

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
- `VITE_JUDGE0_API_KEY` → your RapidAPI key

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

- [x] Real-time code sync via OT
- [x] Live cursor positions
- [x] Multi-language code execution (Judge0)
- [x] Shareable room links
- [ ] 🎙️ Voice chat integration (WebRTC)
- [ ] 🌿 Git integration — commit directly from editor
- [ ] 📁 File tree support — multi-file collaboration
- [ ] 💾 Persistent rooms with database storage
- [ ] 🔒 Password-protected rooms
- [ ] 📝 Markdown preview panel

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
