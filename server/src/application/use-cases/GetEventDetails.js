export class GetEventDetails {
  /** @param {{ eventContent: import('../ports.js').EventContentProvider }} deps */
  constructor({ eventContent }) {
    this.eventContent = eventContent;
  }

  async execute() {
    return this.eventContent.get();
  }
}
