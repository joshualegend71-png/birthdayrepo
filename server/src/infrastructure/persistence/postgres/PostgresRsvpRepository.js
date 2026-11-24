import { DuplicateRsvpError } from '../../../domain/errors.js';

const UNIQUE_VIOLATION = '23505';

const toRsvp = (row) => ({
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
  createdAt: new Date(row.created_at).toISOString(),
});

/** @implements {import('../../../application/ports.js').RsvpRepository} */
export class PostgresRsvpRepository {
  constructor(sql) {
    this.sql = sql;
  }

  async findByEmail(email) {
    const rows = await this.sql`SELECT * FROM rsvps WHERE email = ${email}`;
    return rows[0] && toRsvp(rows[0]);
  }

  async add(r) {
    try {
      await this.sql`
        INSERT INTO rsvps (id, first_name, last_name, email, phone, address, coming_for,
                           relationship, attendance, message, created_at)
        VALUES (${r.id}, ${r.firstName}, ${r.lastName}, ${r.email}, ${r.phone}, ${r.address},
                ${r.comingFor}, ${r.relationship}, ${r.attendance}, ${r.message}, ${r.createdAt})`;
    } catch (err) {
      if (err?.code === UNIQUE_VIOLATION) throw new DuplicateRsvpError();
      throw err;
    }
  }

  async list() {
    const rows = await this.sql`SELECT * FROM rsvps ORDER BY created_at DESC`;
    return rows.map(toRsvp);
  }
}
