import { DuplicateRsvpError } from '../../domain/errors.js';
import { createRsvp } from '../../domain/rsvp.js';

export const COMING_FOR_BOTH = 'both';

export class SubmitRsvp {
  /**
   * @param {{
   *   rsvpRepository: import('../ports.js').RsvpRepository,
   *   eventContent: import('../ports.js').EventContentProvider,
   *   clock?: () => Date
   * }} deps
   */
  constructor({ rsvpRepository, eventContent, clock = () => new Date() }) {
    this.rsvpRepository = rsvpRepository;
    this.eventContent = eventContent;
    this.clock = clock;
  }

  async execute(input) {
    const { celebrants } = this.eventContent.get();
    const allowedComingFor = [...celebrants.map((c) => c.id), COMING_FOR_BOTH];

    const rsvp = createRsvp(input ?? {}, { allowedComingFor, now: this.clock() });

    if (await this.rsvpRepository.findByEmail(rsvp.email)) {
      throw new DuplicateRsvpError();
    }

    // The repository also enforces uniqueness, covering two submissions racing each other.
    await this.rsvpRepository.add(rsvp);
    return { id: rsvp.id, firstName: rsvp.firstName, attendance: rsvp.attendance };
  }
}
