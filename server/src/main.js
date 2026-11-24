// Local / long-running server entry point. Vercel uses api/index.js instead.
import { createApplication } from './compositionRoot.js';

const { app, config, close } = await createApplication({ env: process.env });

const server = app.listen(config.port, () => {
  console.log(`#GracefullySixty running on http://localhost:${config.port}`);
  console.log(`Storage: ${config.databaseUrl ? 'Postgres' : `SQLite (${config.databasePath})`}`);
  if (!config.adminKey) console.log('ADMIN_KEY not set: the RSVP admin endpoint is disabled.');
});

const shutdown = () => {
  server.close(() => {
    close();
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
