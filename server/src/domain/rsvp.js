import { randomUUID } from 'node:crypto';
import { ValidationError } from './errors.js';
import {
  cleanMultiline,
  cleanText,
  isEmail,
  isPhone,
  limitText,
  requireText,
} from './validation.js';

export const Attendance = Object.freeze({
  ATTENDING: 'attending',
  DECLINED: 'declined',
});

const ATTENDANCE_VALUES = Object.values(Attendance);

/**
 * Builds a valid RSVP or throws ValidationError.
 * Each invitation admits one guest, so an RSVP always represents exactly one person.
 *
 * @param {object} input raw values from the guest
 * @param {{ allowedComingFor: string[], now?: Date }} rules
 */
export function createRsvp(input, { allowedComingFor, now = new Date() }) {
  const rsvp = {
    firstName: cleanText(input.firstName),
    lastName: cleanText(input.lastName),
    email: cleanText(input.email).toLowerCase(),
    phone: cleanText(input.phone),
    address: cleanText(input.address),
    comingFor: cleanText(input.comingFor),
    relationship: cleanText(input.relationship),
    attendance: cleanText(input.attendance),
    message: cleanMultiline(input.message),
  };

  const errors = {};
  requireText(errors, 'firstName', rsvp.firstName, 'your first name', 60);
  requireText(errors, 'lastName', rsvp.lastName, 'your last name', 60);

  if (requireText(errors, 'email', rsvp.email, 'your email address', 120) && !isEmail(rsvp.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (requireText(errors, 'phone', rsvp.phone, 'your phone number', 20) && !isPhone(rsvp.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  limitText(errors, 'address', rsvp.address, 'your address', 200);
  requireText(errors, 'relationship', rsvp.relationship, 'how you know the celebrants', 80);
  limitText(errors, 'message', rsvp.message, 'your note', 300);

  if (!allowedComingFor.includes(rsvp.comingFor)) {
    errors.comingFor = 'Please select who you are coming for.';
  }
  if (!ATTENDANCE_VALUES.includes(rsvp.attendance)) {
    errors.attendance = 'Please let us know if you will attend.';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return Object.freeze({
    id: randomUUID(),
    ...rsvp,
    createdAt: now.toISOString(),
  });
}
