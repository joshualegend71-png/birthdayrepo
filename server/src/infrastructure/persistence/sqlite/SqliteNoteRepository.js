const toNote = (row) => ({
  id: row.id,
  name: row.name,
  message: row.message,
  createdAt: row.created_at,
});

/** @implements {import('../../application/ports.js').NoteRepository} */
export class SqliteNoteRepository {
  constructor(db) {
    this.insertStmt = db.prepare(
      'INSERT INTO notes (id, name, message, created_at) VALUES (:id, :name, :message, :createdAt)',
    );
    this.listStmt = db.prepare('SELECT * FROM notes ORDER BY created_at DESC LIMIT :limit');
  }

  async add(note) {
    this.insertStmt.run({ ...note });
  }

  async listRecent(limit) {
    return this.listStmt.all({ limit }).map(toNote);
  }
}
