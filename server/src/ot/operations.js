/**
 * operations.js — OT Operation type definitions and factory functions
 */

/**
 * Operation types
 */
export const OP_TYPE = {
  INSERT: 'insert',
  DELETE: 'delete',
};

/**
 * Create an Insert operation
 * @param {number} pos - Character position in document
 * @param {string} text - Text to insert
 * @returns {Object} Insert operation
 */
export function insert(pos, text) {
  return { type: OP_TYPE.INSERT, pos, text };
}

/**
 * Create a Delete operation
 * @param {number} pos - Character position in document
 * @param {number} length - Number of characters to delete
 * @returns {Object} Delete operation
 */
export function del(pos, length) {
  return { type: OP_TYPE.DELETE, pos, length };
}

/**
 * Validate that an operation is well-formed
 * @param {Object} op - Operation to validate
 * @param {string} doc - Current document (for bounds checking)
 * @returns {boolean}
 */
export function isValidOperation(op, doc) {
  if (!op || !op.type || typeof op.pos !== 'number') return false;
  if (op.pos < 0 || op.pos > doc.length) return false;
  if (op.type === OP_TYPE.INSERT && typeof op.text !== 'string') return false;
  if (op.type === OP_TYPE.DELETE && typeof op.length !== 'number') return false;
  return true;
}
