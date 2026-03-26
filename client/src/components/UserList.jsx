import React from 'react';
import { getUserColor } from '../utils/colors.js';

/**
 * UserList.jsx — Sidebar showing all users currently in the room
 */
function UserList({ users, currentUser }) {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <span className="user-count-badge">{users.length}</span>
        <span>Online</span>
      </div>
      <ul className="user-list-items">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div
              className="user-avatar"
              style={{ backgroundColor: getUserColor(user.id) }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">
              {user.username}
              {user.username === currentUser && (
                <span className="you-badge"> (you)</span>
              )}
            </span>
            <div className="user-status-dot" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
