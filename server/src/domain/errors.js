/** Raised when input breaks a domain rule. `errors` maps field name -> message. */
export class ValidationError extends Error {
  constructor(errors) {
    super('Some details need your attention.');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/** Raised when an action conflicts with existing state (e.g. a duplicate RSVP). */
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

/** One RSVP per email address: each invitation admits one guest. */
export class DuplicateRsvpError extends ConflictError {
  constructor() {
    super('We already have an RSVP for this email address. Please contact us if you need to change it.');
    this.name = 'DuplicateRsvpError';
  }
}
