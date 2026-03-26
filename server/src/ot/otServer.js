/**
 * otServer.js — Server-side Operational Transformation engine
 * Mirrors the client OT logic — keeps the server document authoritative
 */

/**
 * Apply a single operation to the server document string
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
 * Transform operation A against operation B
 * Returns the transformed version of A to apply after B
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
    return null; // Overlapping delete — cancelled
  }

  return opA;
}
