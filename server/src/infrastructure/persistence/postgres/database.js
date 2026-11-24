import { neon } from '@neondatabase/serverless';

/**
 * Connects to Postgres over HTTP (works in serverless functions without
 * connection pooling) and makes sure the tables exist.
 */
export async function connectPostgres(connectionString) {
  const sql = neon(connectionString);

  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id            TEXT PRIMARY KEY,
      first_name    TEXT NOT NULL,
      last_name     TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      phone         TEXT NOT NULL,
      address       TEXT NOT NULL DEFAULT '',
      coming_for    TEXT NOT NULL,
      relationship  TEXT NOT NULL,
      attendance    TEXT NOT NULL,
      message       TEXT NOT NULL DEFAULT '',
      created_at    TIMESTAMPTZ NOT NULL
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      message     TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL
    )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at DESC)`;

  return sql;
}
