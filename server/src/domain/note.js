import { randomUUID } from 'node:crypto';
import { ValidationError } from './errors.js';
import { cleanMultiline, cleanText, requireText } from './validation.js';

/** A message left on the Love Wall. */
export function createNote(input, { now = new Date() } = {}) {
  const note = {
    name: cleanText(input.name),
    message: cleanMultiline(input.message),
  };

  const errors = {};
  requireText(errors, 'name', note.name, 'your name', 60);
  requireText(errors, 'message', note.message, 'a message', 500);

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return Object.freeze({
    id: randomUUID(),
    ...note,
    createdAt: now.toISOString(),
  });
}
