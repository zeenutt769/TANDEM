import React, { useState, useEffect, useRef } from 'react';
import { SOCKET_EVENTS } from '../../../shared/constants.js';

export default function ChatPanel({ socket, username, onApplySnippet }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSnippetMode, setIsSnippetMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);
    return () => socket.off(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: username,
      text: inputValue,
      isSnippet: isSnippetMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, newMsg);
    setInputValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#1c1c21', borderLeft: '1px solid #333', color: '#e2e8f0', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#7e22ce' }}></div>
        <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Workspace Chat</span>
      </div>
      
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', fontStyle: 'italic', marginTop: '40px' }}>
            No messages yet. Send a snippet or say hi.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === username;
            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textAlign: isMe ? 'right' : 'left' }}>
                  {isMe ? 'You' : msg.sender} <span style={{ opacity: 0.5 }}>{msg.timestamp}</span>
                </div>
                
                {msg.isSnippet ? (
                  <div style={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ padding: '4px 12px', background: '#111', borderBottom: '1px solid #333', fontSize: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      CODE SNIPPET
                    </div>
                    <pre style={{ margin: 0, padding: '12px', fontSize: '12px', color: '#c4b5fd', fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{msg.text}</pre>
                    <button 
                      onClick={() => {
                        if (socket) {
                          socket.emit('snippet:request-apply', { sender: username, snippet: msg.text });
                        }
                      }}
                      style={{ display: 'block', width: '100%', padding: '8px', background: 'rgba(126, 34, 206, 0.1)', color: '#c4b5fd', border: 'none', borderTop: '1px solid #333', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(126, 34, 206, 0.2)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(126, 34, 206, 0.1)'}
                    >
                      REQUEST TO APPLY →
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '10px 14px', background: isMe ? '#7e22ce' : '#2a2b38', color: '#fff', borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px', fontSize: '13px', lineHeight: '1.4', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {msg.text}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px', background: '#18181b', borderTop: '1px solid #333' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', gap: '8px', background: '#111', padding: '4px', borderRadius: '6px', border: '1px solid #333' }}>
            <button
              type="button"
              onClick={() => setIsSnippetMode(false)}
              style={{ flex: 1, padding: '4px', background: !isSnippetMode ? '#333' : 'transparent', color: !isSnippetMode ? '#fff' : '#888', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
            >
              TEXT
            </button>
            <button
              type="button"
              onClick={() => setIsSnippetMode(true)}
              style={{ flex: 1, padding: '4px', background: isSnippetMode ? '#7e22ce' : 'transparent', color: isSnippetMode ? '#fff' : '#888', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
            >
              CODE
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              placeholder={isSnippetMode ? 'Paste code block here...' : 'Write a message...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isSnippetMode) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              rows={isSnippetMode ? 4 : 2}
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '13px', fontFamily: isSnippetMode ? 'monospace' : 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.border = '1px solid #555'}
              onBlur={(e) => e.target.style.border = '1px solid #333'}
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim()}
              style={{ padding: '8px 16px', alignSelf: 'flex-end', background: inputValue.trim() ? '#fff' : '#333', color: inputValue.trim() ? '#000' : '#888', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: inputValue.trim() ? 'pointer' : 'not-allowed', transition: '0.2s' }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
