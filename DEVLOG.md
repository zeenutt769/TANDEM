# 📓 TANDEM — Developer Log

> Yahan hum TANDEM ke development ke har din ki progress, decisions, aur fixes track karte hain.

---

## 📅 Day 1 — Project Foundation
**Date:** 2026-03-26

### ✅ What We Built
- Full project structure setup: `client/` (React + Vite) + `server/` (Node.js + Express)
- Socket.io integration for real-time room management
- Custom **OT (Operational Transformation)** algorithm for code sync (`server/src/ot/`)
- Monaco Editor integration (`@monaco-editor/react`)
- Room join page with Create/Join room modes
- User list sidebar with live presence
- Toolbar with language selector + Run Code button
- Output panel for code execution results
- Live cursor broadcasting via Socket.io (`cursorHandler.js`)
- In-memory Room Store (`roomStore.js`) — Redis-ready architecture
- Rate limiter middleware
- Professional README for portfolio

### 🧠 Architectural Decisions
- Used `concurrently` at root level for `npm run dev` to start both client + server together
- Shared `constants.js` in `/shared/` folder to keep Socket event names DRY across client and server
- Room IDs are 6-char alphanumeric (easy to share)

---

## 📅 Day 2 — CRDT Upgrade, Code Execution & Precision Features
**Date:** 2026-03-28

### ✅ What We Built / Changed

#### 🔄 Replaced OT with Yjs CRDT
- **Problem:** OT (Operational Transformation) is server-centric — every edit has to go through the server to be "transformed." This adds latency and is complex to maintain correctly.
- **Decision:** Switched to **Yjs (CRDT — Conflict-free Replicated Data Types)** — the same tech used by Figma and Notion.
- **What changed:**
  - Removed `server/src/ot/` engine + `useCollaboration.js` hook
  - Installed `yjs`, `y-websocket`, `y-monaco` on both client and server
  - Added a raw `WebSocketServer (ws)` on top of our existing Express HTTP server, answering `ws://localhost:3001/yjs/<roomId>`
  - `Editor.jsx` now binds Monaco directly to a shared Yjs `Y.Text` object
  - Live cursors + selections now handled by **Yjs Awareness protocol** — no manual cursor events needed

#### ⚡ Code Execution: Piston → JDoodle (Backend Proxy)
- **Problem 1:** We initially planned to use **Judge0** (RapidAPI) — but requires credit card for API key. Skipped for now, kept in codebase as future fallback.
- **Problem 2:** Switched to **Piston API** (free, no key needed) — but Piston announced whitelist-only access as of Feb 15, 2026. Got error: `"Public Piston API is now whitelist only."`
- **Fix:** Switched to **JDoodle API**:
  - Free tier: 200 code runs/day — no credit card needed
  - Created a backend proxy route `POST /execute` in `server/src/index.js` — API keys stay safe on server, never exposed to client
  - Client (`useCodeRunner.js`) now hits `/execute` on our own backend
  - Judge0 logic also preserved in the same backend route — switch via `EXECUTION_ENGINE=judge0` in `.env`

#### 🐛 Bug: `EADDRINUSE :::3001` — Port Already in Use
- **Cause:** Multiple `npm run dev` terminals running simultaneously. Windows didn't properly kill old Node processes when we hit Ctrl+C (showed `Terminate batch job (Y/N)?` and didn't wait for input).
- **Fix:** Used `taskkill /f /im node.exe` in PowerShell to force-kill all running Node processes, then started fresh.

#### 🐛 Bug: CSS Corrupted — UTF-16 Garbage in `App.css`
- **Cause:** Used PowerShell `echo` to append Yjs cursor CSS styles to `App.css`. Windows `echo` writes in UTF-16 encoding, which inserted null bytes between every character (`b a c k g r o u n d - c o l o r`).
- **Error:** `[plugin:vite:css] [postcss] Unknown word background-color`
- **Fix:**
  1. Used PowerShell to read file as UTF-8, slice off the corrupt last lines, and write back cleanly
  2. Used the code editor's file write tool (UTF-8) to properly append the Yjs styles

#### 🐛 Bug: `y-websocket/bin/utils.js` Import Error
- **Cause:** `y-websocket` v3.x changed export paths. `./bin/utils.js` is not listed in `exports` field, so Node.js rejected it.
- **Fix:** Downgraded to `y-websocket@1.5.0` which exposes `./bin/utils` correctly (without `.js` extension).

#### ✨ Precision Coding Features Added
- `autoClosingBrackets: 'always'` — Auto-closes `{`, `[`, `(`
- `autoClosingQuotes: 'always'` — Auto-closes `"`, `'`
- `autoIndent: 'full'` — Full language-aware smart indentation
- `formatOnPaste: true` — Code auto-formats on paste
- `formatOnType: true` — Smart indent while typing

#### ✨ Format Code Button Added
- New **"✨ Format"** button in Toolbar
- Calls Monaco's built-in `editor.action.formatDocument` action via `useImperativeHandle` + `forwardRef`
- Keyboard shortcut `Shift+Alt+F` also works natively in Monaco

### 📦 Dependencies Added (Day 2)
| Package | Side | Purpose |
|---|---|---|
| `yjs` | Client + Server | CRDT document model |
| `y-websocket@1.5.0` | Client + Server | WebSocket sync provider |
| `y-monaco` | Client | Monaco ↔ Yjs binding |
| `randomcolor` | Client | Random user cursor colors |
| `ws` | Server | Raw WebSocket server for Yjs |

### 🔮 Planned for Day 3+
- [ ] UI polish — premium dark theme, micro-animations
- [ ] Persistent room state (code survives page refresh)
- [ ] Multi-file support (file tree sidebar)
- [ ] Deploy — Vercel (frontend) + Railway (backend)
- [ ] Judge0 integration (when card available)
