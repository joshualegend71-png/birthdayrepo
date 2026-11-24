import { existsSync } from 'node:fs';
import { join } from 'node:path';
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { createApiRouter } from './routes.js';

/**
 * Builds the Express app. When the React build exists it is served from the
 * same origin, so the whole site deploys as one service.
 */
export function createApp({ useCases, adminKey, clientDistPath, trustProxy }) {
  const app = express();

  app.disable('x-powered-by');
  if (trustProxy) app.set('trust proxy', 1);

  app.use(securityHeaders);
  app.use(express.json({ limit: '10kb' }));
  app.use('/api', createApiRouter({ useCases, adminKey }));

  if (clientDistPath && existsSync(join(clientDistPath, 'index.html'))) {
    app.use(express.static(clientDistPath, { index: false, maxAge: '7d' }));
    app.get('/{*splat}', (req, res) => {
      res.set('Cache-Control', 'no-cache');
      res.sendFile(join(clientDistPath, 'index.html'));
    });
  }

  app.use(errorHandler);
  return app;
}
