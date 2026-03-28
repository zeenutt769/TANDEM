import React from 'react';

export default function UserList({ users, currentUser }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#0a0a0a', borderRight: '1px solid #222', color: '#e2e8f0', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Team Members</span>
        </div>
        <div style={{ background: '#222', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
          {users.length}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {users.map((user) => {
          const isMe = user.username === currentUser;
          return (
            <div 
              key={user.id} 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '8px', background: isMe ? '#18181b' : 'transparent', transition: '0.2s', border: isMe ? '1px solid #333' : '1px solid transparent' }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #0a0a0a' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user.username}
                </span>
                {isMe && <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>You (Admin)</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
