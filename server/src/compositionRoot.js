// Composition root: the only module that knows about every layer.
// Shared by the local server (main.js) and the Vercel function (api/index.js).
import { resolve } from 'node:path';
import { GetEventDetails } from './application/use-cases/GetEventDetails.js';
import { ListNotes } from './application/use-cases/ListNotes.js';
import { ListRsvps } from './application/use-cases/ListRsvps.js';
import { PostNote } from './application/use-cases/PostNote.js';
import { SubmitRsvp } from './application/use-cases/SubmitRsvp.js';
import { JsonEventContentProvider } from './infrastructure/content/JsonEventContentProvider.js';
import { createApp } from './presentation/http/app.js';

const here = import.meta.dirname;

export function loadConfig(env) {
  return {
    port: Number(env.PORT) || 3000,
    // Vercel's Neon integration sets DATABASE_URL (POSTGRES_URL on older setups).
    databaseUrl: env.DATABASE_URL || env.POSTGRES_URL || null,
    databasePath: resolve(env.DB_PATH ?? resolve(here, '../data/gracefully-sixty.db')),
    contentPath: resolve(env.CONTENT_PATH ?? resolve(here, 'infrastructure/content/event.json')),
    clientDistPath: env.CLIENT_DIST === 'none' ? null : resolve(env.CLIENT_DIST ?? resolve(here, '../../client/dist')),
    adminKey: env.ADMIN_KEY || null,
    trustProxy: env.TRUST_PROXY !== 'false',
    serverless: Boolean(env.VERCEL),
  };
}

async function createRepositories(config) {
  if (config.databaseUrl) {
    const { connectPostgres } = await import('./infrastructure/persistence/postgres/database.js');
    const { PostgresRsvpRepository } = await import('./infrastructure/persistence/postgres/PostgresRsvpRepository.js');
    const { PostgresNoteRepository } = await import('./infrastructure/persistence/postgres/PostgresNoteRepository.js');
    const sql = await connectPostgres(config.databaseUrl);
    return {
      rsvpRepository: new PostgresRsvpRepository(sql),
      noteRepository: new PostgresNoteRepository(sql),
      close: () => {},
    };
  }

  if (config.serverless) {
    throw new Error('DATABASE_URL is not set. Connect a Neon Postgres database to this Vercel project.');
  }

  const { openDatabase } = await import('./infrastructure/persistence/sqlite/database.js');
  const { SqliteRsvpRepository } = await import('./infrastructure/persistence/sqlite/SqliteRsvpRepository.js');
  const { SqliteNoteRepository } = await import('./infrastructure/persistence/sqlite/SqliteNoteRepository.js');
  const db = openDatabase(config.databasePath);
  return {
    rsvpRepository: new SqliteRsvpRepository(db),
    noteRepository: new SqliteNoteRepository(db),
    close: () => db.close(),
  };
}

export async function createApplication({ env = process.env } = {}) {
  const config = loadConfig(env);
  const eventContent = new JsonEventContentProvider(config.contentPath);
  const { rsvpRepository, noteRepository, close } = await createRepositories(config);

  const useCases = {
    getEventDetails: new GetEventDetails({ eventContent }),
    submitRsvp: new SubmitRsvp({ rsvpRepository, eventContent }),
    listRsvps: new ListRsvps({ rsvpRepository }),
    postNote: new PostNote({ noteRepository }),
    listNotes: new ListNotes({ noteRepository }),
  };

  const app = createApp({
    useCases,
    adminKey: config.adminKey,
    clientDistPath: config.serverless ? null : config.clientDistPath,
    trustProxy: config.trustProxy,
  });

  return { app, config, close };
}
