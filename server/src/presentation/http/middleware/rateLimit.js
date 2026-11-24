/**
 * Small in-memory, per-IP rate limiter for form submissions.
 * Good enough for a single-instance event site; no extra dependency needed.
 */
export function rateLimit({ windowMs, max }) {
  const hits = new Map();

  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }, windowMs);
  sweep.unref();

  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);

    if (!entry || entry.resetAt <= now) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ message: 'Too many submissions. Please try again a little later.' });
    }
    return next();
  };
}
