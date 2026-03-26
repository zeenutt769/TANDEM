/**
 * roomUtils.js — Room ID generation and validation utilities
 */

const ADJECTIVES = ['swift', 'bright', 'calm', 'dark', 'fast', 'cool', 'bold', 'keen'];
const NOUNS = ['wolf', 'hawk', 'bear', 'fox', 'owl', 'lynx', 'crow', 'deer'];

/**
 * Generate a random 6-character alphanumeric Room ID
 * @returns {string} e.g. "AB3X9Z"
 */
export function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Generate a human-readable room name (for display only)
 * @returns {string} e.g. "swift-wolf"
 */
export function generateRoomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}-${noun}`;
}

/**
 * Validate that a room ID is in the correct format
 * @param {string} roomId
 * @returns {boolean}
 */
export function isValidRoomId(roomId) {
  return /^[A-Z0-9]{6}$/.test(roomId);
}
