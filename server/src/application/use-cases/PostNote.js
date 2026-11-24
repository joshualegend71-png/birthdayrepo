import { createNote } from '../../domain/note.js';

export class PostNote {
  /** @param {{ noteRepository: import('../ports.js').NoteRepository, clock?: () => Date }} deps */
  constructor({ noteRepository, clock = () => new Date() }) {
    this.noteRepository = noteRepository;
    this.clock = clock;
  }

  async execute(input) {
    const note = createNote(input ?? {}, { now: this.clock() });
    await this.noteRepository.add(note);
    return note;
  }
}
