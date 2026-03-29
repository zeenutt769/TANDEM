import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Database, Server, Workflow, Shield, Columns, Users, Layers, Terminal } from 'lucide-react';
import { generateRoomId } from '../utils/roomUtils.js';

export default function RoomJoin({ onJoin }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  const handleJoin = () => {
    if (!username.trim() || !roomId.trim()) {
      alert("Please enter both Username and Room ID to join.");
      return;
    }
    onJoin({ roomId: roomId.trim().toUpperCase(), username: username.trim() });
  };

  const handleCreate = () => {
    if (!username.trim()) {
      alert("Please enter a username to create a room.");
      return;
    }
    const newRoomId = generateRoomId();
    onJoin({ roomId: newRoomId, username: username.trim() });
  };

  const FadeIn = ({ children, delay = 0, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#080808', color: '#ffffff', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>

      {/* 1. HERO SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingTop: '100px', paddingBottom: '80px', textAlign: 'center', position: 'relative', padding: '100px 20px 80px 20px', boxSizing: 'border-box' }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '50px', marginBottom: '32px' }}>
            <Terminal size={16} color="#c4b5fd" />
            <span style={{ fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', color: '#c4b5fd', fontWeight: '600' }}>Tandem 1.0 Runtime Active</span>
          </div>

          <h1 style={{ fontFamily: '"Array", sans-serif', fontSize: 'clamp(40px, 6vw, 76px)', margin: '0 0 24px 0', fontWeight: '400', letterSpacing: '0.05em', lineHeight: '1.1' }}>
            Collaborative coding,<br />
            <span style={{ background: 'linear-gradient(to right, #ffffff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>without the friction.</span>
          </h1>

          <p style={{ fontFamily: '"Khand", sans-serif', color: '#a1a1aa', fontSize: '24px', lineHeight: '1.5', margin: '0 auto 48px auto', maxWidth: '650px', fontWeight: '400' }}>
            Real-time collaborative code editor with <span style={{ color: '#fff', fontWeight: '600' }}>live suggestions</span> and <span style={{ color: '#c4b5fd', fontWeight: '600' }}>context-aware chat</span>. Code side-by-side seamlessly, faster than ever.
          </p>

          <div style={{
            background: '#0a0a0b', border: '1px solid #1f1f22', borderRadius: '12px', overflow: 'hidden', maxWidth: '440px', margin: '0 auto', textAlign: 'left', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* TABS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1f1f22' }}>
              <button
                onClick={() => setActiveTab('create')}
                style={{
                  flex: 1, padding: '16px', background: activeTab === 'create' ? 'transparent' : 'rgba(255,255,255,0.02)',
                  border: 'none', borderBottom: activeTab === 'create' ? '2px solid #8b5cf6' : '1px solid transparent',
                  color: activeTab === 'create' ? '#e2e8f0' : '#64748b', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: '0.2s', outline: 'none'
                }}
              >
                Create Room
              </button>
              <button
                onClick={() => setActiveTab('join')}
                style={{
                  flex: 1, padding: '16px', background: activeTab === 'join' ? 'transparent' : 'rgba(255,255,255,0.02)',
                  border: 'none', borderBottom: activeTab === 'join' ? '2px solid #8b5cf6' : '1px solid transparent',
                  color: activeTab === 'join' ? '#e2e8f0' : '#64748b', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: '0.2s', borderLeft: '1px solid #1f1f22', outline: 'none'
                }}
              >
                Join Room
              </button>
            </div>

            {/* CONTENT */}
            <div style={{ padding: '32px' }}>
              <div style={{ fontFamily: 'monospace', color: '#3f3f46', fontSize: '13px', marginBottom: '24px' }}>
                {activeTab === 'create' ? '// start a new collaborative session' : '// enter an existing room'}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>
                  USERNAME
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ZEEN"
                  style={{ width: '100%', padding: '14px', background: '#000000', border: '1px solid #1f1f22', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none', fontSize: '14px', fontFamily: 'monospace' }}
                  onFocus={(e) => e.target.style.border = '1px solid #8b5cf6'}
                  onBlur={(e) => e.target.style.border = '1px solid #1f1f22'}
                />
              </div>

              {activeTab === 'join' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>
                    ROOM ID
                  </label>
                  <input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="e.g. XPRN50"
                    style={{ width: '100%', padding: '14px', background: '#000000', border: '1px solid #1f1f22', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none', textTransform: 'uppercase', fontSize: '14px', fontFamily: 'monospace' }}
                    onFocus={(e) => e.target.style.border = '1px solid #8b5cf6'}
                    onBlur={(e) => e.target.style.border = '1px solid #1f1f22'}
                    maxLength={12}
                  />
                </div>
              )}

              {activeTab === 'create' ? (
                <button
                  onClick={handleCreate}
                  style={{ width: '100%', padding: '14px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
                  onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
                >
                  <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span> Create Room
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  style={{ width: '100%', padding: '14px', background: 'transparent', color: '#c4b5fd', border: '1px solid #27272a', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: '0.2s', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.borderColor = '#3f3f46'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#27272a'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                  Join Room
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div style={{ height: '1px', width: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0) 100%)', margin: '20px 0' }} />

      {/* 2. HOW IT WORKS (CRDT / Logic) */}
      <section style={{ maxWidth: '1200px', margin: '60px auto', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>Built for Real-time Precision</h2>
            <p style={{ color: '#a1a1aa', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>An architecture carefully designed to handle simultaneous code edits locally and sync them globally without data loss.</p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <FadeIn delay={0.1}>
            <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
              <Workflow size={32} color="#8b5cf6" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>CRDT Engine (Yjs)</h3>
              <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '15px' }}>We utilize Conflict-free Replicated Data Types to ensure that simultaneous edits to the syntax tree merge seamlessly without server-side arbitration slowing you down.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
              <Zap size={32} color="#8b5cf6" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Low-Latency WebSockets</h3>
              <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '15px' }}>Bi-directional Socket.io bindings broadcast cursor coordinates, selections, and typing events in sub-millisecond speeds to all peers in the room.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
              <Shield size={32} color="#8b5cf6" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Secure Proxied Execution</h3>
              <p style={{ color: '#a1a1aa', lineHeight: '1.6', fontSize: '15px' }}>Client payloads are strictly validated, then routed securely via our Express/Node middleware towards isolated Judge0 Docker environments to execute arbitrary untrusted code safely.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. KEY FEATURES */}
      <section style={{ background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 20px', margin: '40px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 80%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '56px', textAlign: 'center' }}>Unique Selling Points</h2>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', alignItems: 'center' }}>
            {/* Grid Item 1 */}
            <FadeIn delay={0.1}>
              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden', background: '#0a0a0a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '40px 40px 0 40px', background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 70%)' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Columns size={24} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Dynamic Resizable Layout</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>Custom-built React resizable panels mimicking VS Code. Slide your terminal, expand your chat, and focus on the code exactly how you want to.</p>
                </div>
              </div>
            </FadeIn>

            {/* Grid Item 2 */}
            <FadeIn delay={0.2}>
              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden', background: '#0a0a0a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '40px 40px 0 40px', background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 70%)' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Users size={24} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Persistent Mentions & Chat</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>Track exactly who is in your room, where their cursors are stationed, and ping them in a persistent chat box adjacent to the editor.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. THE TECH STACK TABLE */}
      <section style={{ maxWidth: '1000px', margin: '60px auto', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>The Powerhouse Stack</h2>
            <p style={{ color: '#a1a1aa', fontSize: '18px' }}>Selecting the right tools for speed, scalability, and Developer Experience.</p>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', background: '#0a0a0a' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '20px 24px', fontWeight: '600', color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '30%' }}>Technology</th>
                  <th style={{ padding: '20px 24px', fontWeight: '600', color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why I used it?</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px 24px', color: '#c4b5fd', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}> <Code size={16} /> React & Vite</td>
                  <td style={{ padding: '20px 24px', color: '#a1a1aa', lineHeight: '1.5', fontSize: '15px' }}>For a fast, component-based UI with lightning-fast HMR during development without the overhead of heavy SSR frameworks.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px 24px', color: '#c4b5fd', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}> <Server size={16} /> Socket.io</td>
                  <td style={{ padding: '20px 24px', color: '#a1a1aa', lineHeight: '1.5', fontSize: '15px' }}>To handle low-latency bi-directional communication, robust event acknowledgement, and automatic reconnection fallbacks.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px 24px', color: '#c4b5fd', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}> <Layers size={16} /> Yjs CRDTs</td>
                  <td style={{ padding: '20px 24px', color: '#a1a1aa', lineHeight: '1.5', fontSize: '15px' }}>Unbeatable peer-to-peer CRDT implementations guaranteeing deterministic merging of code without central server arbitration matrices.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px 24px', color: '#c4b5fd', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}> <Database size={16} /> PostgreSQL (Neon)</td>
                  <td style={{ padding: '20px 24px', color: '#a1a1aa', lineHeight: '1.5', fontSize: '15px' }}>Serverless relational data storage scaling perfectly with connection pools via Prisma ORM for persisting user code snapshots securely.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeIn>
      </section>

      {/* 5. INTERVIEW PRO-TIP: TECHNICAL CHALLENGES */}
      <section style={{ maxWidth: '800px', margin: '40px auto 100px auto', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
        <FadeIn>
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid #8b5cf6', borderRadius: '16px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#8b5cf6', borderRadius: '16px 0 0 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="#8b5cf6" />
              Technical Challenges Faced
            </h3>
            <p style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
              <strong>Handling state divergence during concurrent text insertion:</strong> Integrating Monaco Editor with a real-time transport mechanism initially meant standard React-controlled inputs would drop characters due to event loop blocking.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', borderLeft: '2px solid rgba(139, 92, 246, 0.5)' }}>
              <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                <span style={{ color: '#c4b5fd', fontWeight: '600' }}>The Fix:</span> I swapped traditional React component state for `Yjs` CRDTs bounded explicitly to the Monaco model using `y-monaco`. This pushed text resolution entirely to the background worker structure, securing O(1) merge times natively via peer-to-peer protocols instead of bottlenecking the main UI thread!
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 20px', textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            LinkedIn
          </a>
        </div>
        <p style={{ color: '#52525b', fontSize: '14px' }}>© {new Date().getFullYear()} TANDEM Web Solutions. Crafted precisely for developers.</p>
      </footer>
    </div>
  );
}
