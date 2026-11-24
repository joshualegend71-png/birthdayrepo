import { readFileSync } from 'node:fs';

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

/**
 * Serves the page content from a JSON file, loaded once at start-up.
 * Edit event.json and restart the server to change any text on the site.
 *
 * @implements {import('../../application/ports.js').EventContentProvider}
 */
export class JsonEventContentProvider {
  constructor(filePath) {
    this.content = deepFreeze(JSON.parse(readFileSync(filePath, 'utf8')));
  }

  get() {
    return this.content;
  }
}
