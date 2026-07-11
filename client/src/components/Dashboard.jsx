import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Zap, Database, Server, Workflow, Shield, Columns, Users, 
  Layers, Terminal, Settings, Plus, Copy, Trash2, Play, 
  BarChart2, User, Sparkles, Clock, ArrowRight, ChevronRight, Check
} from 'lucide-react';
import { generateRoomId } from '../utils/roomUtils.js';

const AVAILABLE_COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16'  // Lime
];

const PRELOADED_SNIPPETS = [
  {
    id: 'pre-1',
    title: 'Express HTTP Server',
    language: 'javascript',
    code: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🚀 Tandem Sandbox Running!');
});

app.listen(PORT, () => {
  console.log(\`Server listening on port \${PORT}\`);
});`
  },
  {
    id: 'pre-2',
    title: 'Quick Sort Algorithm',
    language: 'python',
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`
  },
  {
    id: 'pre-3',
    title: 'Fetch GitHub User API',
    language: 'javascript',
    code: `fetch('https://api.github.com/users/octocat')
  .then(res => {
    if (!res.ok) throw new Error('API failure');
    return res.json();
  })
  .then(user => console.log('GitHub User:', user.name, '-', user.bio))
  .catch(err => console.error('Error:', err.message));`
  }
];

export default function Dashboard({ onJoin }) {
  // --- Profile State ---
  const [username, setUsername] = useState(() => localStorage.getItem('tandem_username') || 'Developer');
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem('tandem_avatar_color') || '#8b5cf6');

  // --- Room Join/Create State ---
  const [activeTab, setActiveTab] = useState('create');
  const [joinRoomId, setJoinRoomId] = useState('');

  // --- Dashboard Data State ---
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ executions: 0, languages: {} });
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Snippet Creation State ---
  const [showAddSnippet, setShowAddSnippet] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetLang, setSnippetLang] = useState('javascript');

  // --- Copy UI Feedback ---
  const [copiedId, setCopiedId] = useState(null);

  // --- Sync with localStorage ---
  useEffect(() => {
    // 1. Load History
    try {
      const savedHistory = JSON.parse(localStorage.getItem('tandem_history') || '[]');
      setHistory(savedHistory);
    } catch (e) {
      console.error('Error parsing room history', e);
    }

    // 2. Load Stats
    try {
      const savedStats = JSON.parse(localStorage.getItem('tandem_stats') || '{"executions":0,"languages":{}}');
      setStats(savedStats);
    } catch (e) {
      console.error('Error parsing stats', e);
    }

    // 3. Load Snippets
    try {
      const savedSnippets = JSON.parse(localStorage.getItem('tandem_snippets') || '[]');
      if (savedSnippets.length === 0) {
        // Prepopulate on first load
        localStorage.setItem('tandem_snippets', JSON.stringify(PRELOADED_SNIPPETS));
        setSnippets(PRELOADED_SNIPPETS);
      } else {
        setSnippets(savedSnippets);
      }
    } catch (e) {
      console.error('Error parsing snippets', e);
    }

    // 4. Hydration Skeleton Timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // 5. Parse URL Room parameter
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setJoinRoomId(roomParam.toUpperCase());
      setActiveTab('join');
    }

    return () => clearTimeout(timer);
  }, []);

  // Save profile changes
  const saveProfile = (newUsername, newColor) => {
    localStorage.setItem('tandem_username', newUsername);
    localStorage.setItem('tandem_avatar_color', newColor);
    setUsername(newUsername);
    setAvatarColor(newColor);
  };

  // --- Actions ---
  const handleJoin = (roomIdToJoin) => {
    const code = (roomIdToJoin || joinRoomId).trim().toUpperCase();
    if (!username.trim() || !code) {
      alert('Please configure your username and enter a Room ID.');
      return;
    }
    // Update local profile details just in case
    saveProfile(username.trim(), avatarColor);
    onJoin({ roomId: code, username: username.trim() });
  };

  const handleCreate = () => {
    if (!username.trim()) {
      alert('Please enter a username to create a room.');
      return;
    }
    const newRoomId = generateRoomId();
    saveProfile(username.trim(), avatarColor);
    onJoin({ roomId: newRoomId, username: username.trim() });
  };

  const handleDeleteHistory = (e, roomIdToDelete) => {
    e.stopPropagation();
    const updated = history.filter(item => item.roomId !== roomIdToDelete);
    localStorage.setItem('tandem_history', JSON.stringify(updated));
    setHistory(updated);
  };

  const handleAddSnippet = () => {
    if (!snippetTitle.trim() || !snippetCode.trim()) {
      alert('Snippet Title and Code are required!');
      return;
    }
    const newSnippet = {
      id: 'snip-' + Date.now(),
      title: snippetTitle.trim(),
      language: snippetLang,
      code: snippetCode
    };

    const updated = [newSnippet, ...snippets];
    localStorage.setItem('tandem_snippets', JSON.stringify(updated));
    setSnippets(updated);

    // Reset Form
    setSnippetTitle('');
    setSnippetCode('');
    setShowAddSnippet(false);
  };

  const handleDeleteSnippet = (snippetId) => {
    const updated = snippets.filter(s => s.id !== snippetId);
    localStorage.setItem('tandem_snippets', JSON.stringify(updated));
    setSnippets(updated);
  };

  const handleCopySnippet = (e, snippet) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate favorite language
  const getFavoriteLanguage = () => {
    const langs = stats.languages || {};
    let fav = 'None';
    let max = 0;
    Object.entries(langs).forEach(([lang, count]) => {
      if (count > max) {
        max = count;
        fav = lang;
      }
    });
    // Capitalize
    return fav !== 'None' ? fav.charAt(0).toUpperCase() + fav.slice(1) : 'None';
  };

  // Language percentage calculations for CSS Progress Bars
  const totalExecs = Object.values(stats.languages || {}).reduce((a, b) => a + b, 0) || 1;
  const languageDist = Object.entries(stats.languages || {}).map(([lang, count]) => ({
    name: lang.charAt(0).toUpperCase() + lang.slice(1),
    count,
    percent: Math.round((count / totalExecs) * 100)
  })).sort((a, b) => b.count - a.count);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040406',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.08) 0%, rgba(0,0,0,0) 60%)',
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif',
      paddingBottom: '80px',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* CSS stylesheet helper for transitions, scrollbars & grid-gaps */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.4);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media(min-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 440px 1fr;
          }
        }
        .glow-card {
          position: relative;
          background: rgba(10, 10, 15, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .glow-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(139,92,246,0.05));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.25; }
        }
        .skeleton {
          animation: pulse 1.8s ease-in-out infinite;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
        }
      `}</style>

      {/* HEADER BAR */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(4, 4, 6, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #ffffff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TANDEM
          </span>
        </div>

        {/* User profile preview widget in Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>{username}</span>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Developer Profile</span>
          </div>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: avatarColor,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '15px',
            boxShadow: `0 0 12px ${avatarColor}50`,
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* DASHBOARD HERO */}
      <section style={{ maxWidth: '1240px', margin: '40px auto 30px auto', padding: '0 24px', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.8px' }}>
            Welcome back, <span style={{ color: '#c084fc' }}>{username}</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
            Enter a workspace room to start collaborating instantly, or manage your personal snippets and stats.
          </p>
        </motion.div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: Entry Hub & Profile Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* JOIN & CREATE ROOM CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="glow-card" 
            style={{ borderRadius: '16px', overflow: 'hidden' }}
          >
            {/* TABS SELECTOR */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
              <button
                onClick={() => setActiveTab('create')}
                style={{
                  flex: 1, padding: '18px', background: activeTab === 'create' ? 'transparent' : 'rgba(0,0,0,0.1)',
                  border: 'none', borderBottom: activeTab === 'create' ? '2px solid #8b5cf6' : '2px solid transparent',
                  color: activeTab === 'create' ? '#e2e8f0' : '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', outline: 'none'
                }}
              >
                Create Workspace
              </button>
              <button
                onClick={() => setActiveTab('join')}
                style={{
                  flex: 1, padding: '18px', background: activeTab === 'join' ? 'transparent' : 'rgba(0,0,0,0.1)',
                  border: 'none', borderBottom: activeTab === 'join' ? '2px solid #8b5cf6' : '2px solid transparent',
                  color: activeTab === 'join' ? '#e2e8f0' : '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', outline: 'none'
                }}
              >
                Join with Code
              </button>
            </div>

            {/* TAB CONTENT */}
            <div style={{ padding: '32px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace', marginBottom: '24px' }}>
                {activeTab === 'create' ? '// spin up a fresh real-time session' : '// join peers in an active session'}
              </div>

              {activeTab === 'join' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.8px' }}>
                    ROOM ID CODE
                  </label>
                  <input
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="e.g. X123YZ"
                    style={{
                      width: '100%', padding: '14px', background: '#08080c', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none', textTransform: 'uppercase',
                      fontSize: '14px', fontFamily: 'monospace', transition: '0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    maxLength={10}
                  />
                </div>
              )}

              {activeTab === 'create' ? (
                <button
                  onClick={handleCreate}
                  style={{
                    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
                    transition: 'opacity 0.2s', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <Plus size={16} /> Create New Room
                </button>
              ) : (
                <button
                  onClick={() => handleJoin()}
                  style={{
                    width: '100%', padding: '14px', background: 'transparent', color: '#c4b5fd',
                    border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
                    transition: '0.2s', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(139, 92, 246, 0.05)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                >
                  <ArrowRight size={16} /> Join Active Room
                </button>
              )}
            </div>
          </motion.div>

          {/* PROFILE CONFIG WIDGET */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glow-card" 
            style={{ borderRadius: '16px', padding: '32px' }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="#c084fc" /> Profile Customizer
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.8px' }}>
                  DISPLAY USERNAME
                </label>
                <input
                  value={username}
                  onChange={(e) => saveProfile(e.target.value, avatarColor)}
                  placeholder="e.g. ZEEN"
                  style={{
                    width: '100%', padding: '12px', background: '#08080c', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', color: '#fff', boxSizing: 'border-box', outline: 'none',
                    fontSize: '14px', fontFamily: 'monospace', transition: '0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  maxLength={16}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.8px' }}>
                  AVATAR THEME COLOR
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => saveProfile(username, color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: color,
                        border: avatarColor === color ? '2px solid #ffffff' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, border-color 0.15s',
                        boxShadow: `0 0 10px ${color}30`
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.15)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Statistics & Workspace History & Snippet Vault */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {isLoading ? (
            <>
              {/* SKELETON STATS CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glow-card" style={{ borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '10px' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="skeleton" style={{ width: '60%', height: '12px' }} />
                      <div className="skeleton" style={{ width: '40%', height: '20px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* SKELETON LANGUAGE CHART */}
              <div className="glow-card" style={{ borderRadius: '16px', padding: '24px' }}>
                <div className="skeleton" style={{ width: '150px', height: '14px', marginBottom: '20px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="skeleton" style={{ width: '90px', height: '14px' }} />
                      <div className="skeleton" style={{ flex: 1, height: '8px' }} />
                      <div className="skeleton" style={{ width: '40px', height: '14px' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* SKELETON RECENT WORKSPACES */}
              <div className="glow-card" style={{ borderRadius: '16px', padding: '32px' }}>
                <div className="skeleton" style={{ width: '180px', height: '16px', marginBottom: '24px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[1, 2].map((i) => (
                    <div key={i} style={{ border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                          <div className="skeleton" style={{ width: '80px', height: '14px' }} />
                          <div className="skeleton" style={{ width: '120px', height: '10px' }} />
                        </div>
                        <div className="skeleton" style={{ width: '70px', height: '20px', borderRadius: '6px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '60px', height: '14px' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* SKELETON SNIPPET VAULT */}
              <div className="glow-card" style={{ borderRadius: '16px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div className="skeleton" style={{ width: '160px', height: '16px' }} />
                  <div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '6px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[1, 2].map((i) => (
                    <div key={i} style={{ border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="skeleton" style={{ width: '120px', height: '14px' }} />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                          <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                        </div>
                      </div>
                      <div className="skeleton" style={{ width: '100%', height: '60px', borderRadius: '6px' }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* STATS OVERVIEW CARDS */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}
              >
                {/* CARD 1: TOTAL ROOMS */}
                <div className="glow-card" style={{ borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color="#a855f7" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Rooms Collaborated</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>{history.length}</div>
                  </div>
                </div>

                {/* CARD 2: CODE EXECUTIONS */}
                <div className="glow-card" style={{ borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Code Executions</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>{stats.executions || 0}</div>
                  </div>
                </div>

                {/* CARD 3: FAVORITE LANGUAGE */}
                <div className="glow-card" style={{ borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code size={20} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Fav Language</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', color: '#f1f5f9' }}>{getFavoriteLanguage()}</div>
                  </div>
                </div>
              </motion.div>

              {/* LANGUAGE USAGE GRAPH */}
              {languageDist.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="glow-card" 
                  style={{ borderRadius: '16px', padding: '24px' }}
                >
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px 0' }}>Language Distribution</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {languageDist.map((item) => (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: '#e2e8f0', width: '90px', fontWeight: '600' }}>{item.name}</span>
                        <div style={{ flex: 1, height: '8px', background: '#09090b', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{
                            height: '100%',
                            background: item.name === 'Javascript' || item.name === 'Typescript' ? '#f59e0b' : item.name === 'Python' ? '#3b82f6' : '#8b5cf6',
                            width: `${item.percent}%`,
                            borderRadius: '4px'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b', width: '40px', textAlign: 'right', fontWeight: '500' }}>{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* WORKSPACE HISTORY (RECENT ROOMS) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glow-card" 
                style={{ borderRadius: '16px', padding: '32px' }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#c084fc" /> Recent Workspaces
                </h3>

                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <span style={{ color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>// no recent collaborative workspaces</span>
                  </div>
                ) : (
                  <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                    {history.map((room) => (
                      <div
                        key={room.roomId}
                        onClick={() => handleJoin(room.roomId)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          borderRadius: '10px',
                          padding: '14px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s, background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '1px', color: '#fff', fontFamily: 'monospace' }}>
                              {room.roomId}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
                              Joined as {room.username}
                            </span>
                          </div>
                          <span style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#c4b5fd',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            textTransform: 'uppercase'
                          }}>
                            {room.language}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>
                            {new Date(room.joinedAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={(e) => handleDeleteHistory(e, room.roomId)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#475569',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s, background 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
                            title="Remove from History"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* SNIPPET VAULT */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glow-card" 
                style={{ borderRadius: '16px', padding: '32px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="#c084fc" /> Code Snippet Vault
                  </h3>
                  <button
                    onClick={() => setShowAddSnippet(!showAddSnippet)}
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: 'none',
                      color: '#c4b5fd',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.25)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.15)'}
                  >
                    <Plus size={12} /> {showAddSnippet ? 'Close' : 'Add Snippet'}
                  </button>
                </div>

                {/* ADD SNIPPET INLINE CARD */}
                <AnimatePresence>
                  {showAddSnippet && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        padding: '16px',
                        marginBottom: '20px',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <input
                          placeholder="Snippet Title"
                          value={snippetTitle}
                          onChange={(e) => setSnippetTitle(e.target.value)}
                          style={{
                            flex: 1, padding: '10px', background: '#08080c', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none'
                          }}
                        />
                        <select
                          value={snippetLang}
                          onChange={(e) => setSnippetLang(e.target.value)}
                          style={{
                            padding: '10px', background: '#08080c', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer'
                          }}
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                          <option value="rust">Rust</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Paste code snippet here..."
                        value={snippetCode}
                        onChange={(e) => setSnippetCode(e.target.value)}
                        rows={4}
                        style={{
                          width: '100%', padding: '12px', background: '#08080c', border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '6px', color: '#fff', fontSize: '12px', fontFamily: 'monospace', outline: 'none',
                          resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={handleAddSnippet}
                          style={{
                            background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px',
                            borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
                          onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
                        >
                          Save Snippet
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SNIPPETS LIST */}
                <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                  {snippets.map((snip) => (
                    <div
                      key={snip.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>{snip.title}</span>
                          <span style={{
                            fontSize: '9px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#94a3b8',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            textTransform: 'uppercase'
                          }}>
                            {snip.language}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={(e) => handleCopySnippet(e, snip)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: copiedId === snip.id ? '#22c55e' : '#64748b',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s, background 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = copiedId === snip.id ? '#22c55e' : '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                            title="Copy to Clipboard"
                          >
                            {copiedId === snip.id ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteSnippet(snip.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#475569',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s, background 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
                            title="Delete Snippet"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <pre style={{
                        margin: 0,
                        padding: '10px 14px',
                        background: '#040406',
                        border: '1px solid rgba(255, 255, 255, 0.02)',
                        borderRadius: '6px',
                        color: '#94a3b8',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        maxHeight: '80px',
                        overflow: 'auto',
                        textAlign: 'left'
                      }} className="custom-scroll">
                        {snip.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
