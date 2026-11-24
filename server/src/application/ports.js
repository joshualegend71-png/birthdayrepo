/**
 * Contracts the application layer depends on. Infrastructure provides the
 * implementations; use cases never import infrastructure directly.
 *
 * @typedef {object} RsvpRepository
 * @property {(email: string) => Promise<object | undefined>} findByEmail
 * @property {(rsvp: object) => Promise<void>} add
 * @property {() => Promise<object[]>} list            newest first
 *
 * @typedef {object} NoteRepository
 * @property {(note: object) => Promise<void>} add
 * @property {(limit: number) => Promise<object[]>} listRecent   newest first
 *
 * @typedef {object} EventContentProvider
 * @property {() => object} get                         the public page content
 */
export {};
