/**
 * otClient.js — Client-side Operational Transformation
 *
 * Operations: { type: 'insert', pos, text } | { type: 'delete', pos, length }
 * This is the client-side OT logic. Core transform() is shared via shared/constants.js
 */

/**
 * Apply a single operation to a string document
 * @param {string} doc - Current document content
 * @param {Object} operation - OT operation to apply
 * @returns {string} - New document content
 */
export function applyOperation(doc, operation) {
  if (operation.type === 'insert') {
    return doc.slice(0, operation.pos) + operation.text + doc.slice(operation.pos);
  }
  if (operation.type === 'delete') {
    return doc.slice(0, operation.pos) + doc.slice(operation.pos + operation.length);
  }
  return doc;
}

/**
 * Create an insert operation
 */
export function createInsertOp(pos, text) {
  return { type: 'insert', pos, text };
}

/**
 * Create a delete operation
 */
export function createDeleteOp(pos, length) {
  return { type: 'delete', pos, length };
}

/**
 * Transform operation A against operation B (client-side)
 * Returns transformed A so it can be applied after B
 */
export function transform(opA, opB) {
  if (opA.type === 'insert' && opB.type === 'insert') {
    if (opB.pos <= opA.pos) {
      return { ...opA, pos: opA.pos + opB.text.length };
    }
    return opA;
  }

  if (opA.type === 'insert' && opB.type === 'delete') {
    if (opB.pos < opA.pos) {
      return { ...opA, pos: Math.max(opB.pos, opA.pos - opB.length) };
    }
    return opA;
  }

  if (opA.type === 'delete' && opB.type === 'insert') {
    if (opB.pos <= opA.pos) {
      return { ...opA, pos: opA.pos + opB.text.length };
    }
    return opA;
  }

  if (opA.type === 'delete' && opB.type === 'delete') {
    if (opB.pos + opB.length <= opA.pos) {
      return { ...opA, pos: opA.pos - opB.length };
    }
    if (opB.pos >= opA.pos + opA.length) {
      return opA;
    }
    // Overlapping deletes — complex case
    return null; // Indicates operation is cancelled
  }

  return opA;
}
