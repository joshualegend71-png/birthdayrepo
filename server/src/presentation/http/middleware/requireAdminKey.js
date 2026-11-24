import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value) => createHash('sha256').update(value).digest();

/**
 * Guards host-only routes with the ADMIN_KEY secret, sent as the `x-admin-key`
 * header or `?key=` query value. When no key is configured the routes are disabled.
 */
export function requireAdminKey(adminKey) {
  const expected = adminKey ? digest(adminKey) : null;

  return (req, res, next) => {
    if (!expected) {
      return res.status(404).json({ message: 'Not found.' });
    }
    const supplied = req.get('x-admin-key') ?? req.query.key;
    if (typeof supplied !== 'string' || !timingSafeEqual(digest(supplied), expected)) {
      return res.status(401).json({ message: 'Invalid admin key.' });
    }
    return next();
  };
}
