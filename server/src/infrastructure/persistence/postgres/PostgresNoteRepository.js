const toNote = (row) => ({
  id: row.id,
  name: row.name,
  message: row.message,
  createdAt: new Date(row.created_at).toISOString(),
});

/** @implements {import('../../../application/ports.js').NoteRepository} */
export class PostgresNoteRepository {
  constructor(sql) {
    this.sql = sql;
  }

  async add(note) {
    await this.sql`
      INSERT INTO notes (id, name, message, created_at)
      VALUES (${note.id}, ${note.name}, ${note.message}, ${note.createdAt})`;
  }

  async listRecent(limit) {
    const rows = await this.sql`SELECT * FROM notes ORDER BY created_at DESC LIMIT ${limit}`;
    return rows.map(toNote);
  }
}
