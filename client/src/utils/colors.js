/**
 * colors.js — Deterministic user color palette for cursors and avatars
 * Each user gets a consistent color based on their socket ID
 */

const CURSOR_COLORS = [
  '#58a6ff', // blue
  '#3fb950', // green
  '#f78166', // red
  '#d2a8ff', // purple
  '#ffa657', // orange
  '#79c0ff', // light blue
  '#56d364', // light green
  '#ff7b72', // light red
  '#bc8cff', // light purple
  '#ffb86c', // light orange
];

/**
 * Get a deterministic color for a user based on their ID
 * @param {string} userId - Socket ID or user identifier
 * @returns {string} - Hex color string
 */
export function getUserColor(userId) {
  if (!userId) return CURSOR_COLORS[0];
  // Generate a numeric hash from the string ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) & 0xffffffff;
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

export { CURSOR_COLORS };
