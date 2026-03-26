import React from 'react';
import { getUserColor } from '../utils/colors.js';

/**
 * UserCursors.jsx — Renders remote users' cursor overlays on top of the editor
 * Cursors are absolutely positioned based on line/column data from OT sync
 */
function UserCursors({ cursors }) {
  if (!cursors || Object.keys(cursors).length === 0) return null;

  return (
    <div className="user-cursors-overlay" aria-hidden="true">
      {Object.entries(cursors).map(([userId, cursorData]) => (
        <div
          key={userId}
          className="remote-cursor"
          style={{
            top: `${(cursorData.line - 1) * 19}px`,
            left: `${(cursorData.column - 1) * 7.8}px`,
            borderLeftColor: getUserColor(userId),
          }}
        >
          <span
            className="cursor-label"
            style={{ backgroundColor: getUserColor(userId) }}
          >
            {cursorData.username}
          </span>
        </div>
      ))}
    </div>
  );
}

export default UserCursors;
