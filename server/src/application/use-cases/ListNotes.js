const MAX_NOTES = 200;

export class ListNotes {
  /** @param {{ noteRepository: import('../ports.js').NoteRepository }} deps */
  constructor({ noteRepository }) {
    this.noteRepository = noteRepository;
  }

  async execute() {
    return this.noteRepository.listRecent(MAX_NOTES);
  }
}
