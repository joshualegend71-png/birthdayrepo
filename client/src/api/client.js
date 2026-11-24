export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError('We could not reach the server. Please check your connection.', 0);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.message ?? 'Something went wrong. Please try again.', response.status, body?.errors);
  }
  return body;
}

const post = (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) });

export const api = {
  getEvent: () => request('/event'),
  submitRsvp: (data) => post('/rsvps', data),
  listNotes: () => request('/notes'),
  postNote: (data) => post('/notes', data),
};
