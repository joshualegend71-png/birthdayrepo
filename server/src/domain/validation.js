const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{6,19}$/;

export const cleanText = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

export const cleanMultiline = (value) =>
  typeof value === 'string' ? value.trim().replace(/\n{3,}/g, '\n\n') : '';

export const isEmail = (value) => EMAIL_PATTERN.test(value);
export const isPhone = (value) => PHONE_PATTERN.test(value);

/**
 * Checks a required text value and records a message in `errors` when invalid.
 * Returns true when the value is acceptable.
 */
export function requireText(errors, field, value, label, maxLength) {
  if (!value) {
    errors[field] = `Please enter ${label}.`;
    return false;
  }
  if (value.length > maxLength) {
    errors[field] = `Please keep ${label} under ${maxLength} characters.`;
    return false;
  }
  return true;
}

export function limitText(errors, field, value, label, maxLength) {
  if (value.length > maxLength) {
    errors[field] = `Please keep ${label} under ${maxLength} characters.`;
  }
}
