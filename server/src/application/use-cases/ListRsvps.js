import { Attendance } from '../../domain/rsvp.js';

/** Host-only view of all RSVPs with headline counts. */
export class ListRsvps {
  /** @param {{ rsvpRepository: import('../ports.js').RsvpRepository }} deps */
  constructor({ rsvpRepository }) {
    this.rsvpRepository = rsvpRepository;
  }

  async execute() {
    const rsvps = await this.rsvpRepository.list();

    const byComingFor = {};
    let attending = 0;
    for (const rsvp of rsvps) {
      if (rsvp.attendance === Attendance.ATTENDING) {
        attending += 1;
        byComingFor[rsvp.comingFor] = (byComingFor[rsvp.comingFor] ?? 0) + 1;
      }
    }

    return {
      summary: {
        total: rsvps.length,
        attending,
        declined: rsvps.length - attending,
        attendingByComingFor: byComingFor,
      },
      rsvps,
    };
  }
}
