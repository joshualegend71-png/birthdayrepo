import { ConflictError, ValidationError } from '../../../domain/errors.js';

/** Maps domain/application errors to HTTP responses. Must be registered last. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ message: err.message });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'The request body is not valid JSON.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'The request is too large.' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
}
