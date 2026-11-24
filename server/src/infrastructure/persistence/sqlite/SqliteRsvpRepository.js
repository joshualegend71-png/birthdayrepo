import { DuplicateRsvpError } from '../../../domain/errors.js';

const toRsvp = (row) =>
  row && {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    comingFor: row.coming_for,
    relationship: row.relationship,
    attendance: row.attendance,
    message: row.message,
    createdAt: row.created_at,
  };

/** @implements {import('../../application/ports.js').RsvpRepository} */
export class SqliteRsvpRepository {
  constructor(db) {
    this.findByEmailStmt = db.prepare('SELECT * FROM rsvps WHERE email = :email');
    this.listStmt = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC');
    this.insertStmt = db.prepare(`
      INSERT INTO rsvps (id, first_name, last_name, email, phone, address, coming_for,
                         relationship, attendance, message, created_at)
      VALUES (:id, :firstName, :lastName, :email, :phone, :address, :comingFor,
              :relationship, :attendance, :message, :createdAt)
    `);
  }

  async findByEmail(email) {
    return toRsvp(this.findByEmailStmt.get({ email }));
  }

  async add(rsvp) {
    try {
      this.insertStmt.run({ ...rsvp });
    } catch (err) {
      if (/UNIQUE constraint failed: rsvps\.email/.test(err.message)) throw new DuplicateRsvpError();
      throw err;
    }
  }

  async list() {
    return this.listStmt.all().map(toRsvp);
  }
}
