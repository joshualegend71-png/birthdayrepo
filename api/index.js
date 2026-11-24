// Vercel serverless entry point. vercel.json routes every /api/* request here.
import { createApplication } from '../server/src/compositionRoot.js';

let appPromise;

export default async function handler(req, res) {
  appPromise ??= createApplication({ env: process.env }).then(({ app }) => app);

  let app;
  try {
    app = await appPromise;
  } catch (err) {
    appPromise = undefined; // retry set-up on the next request
    console.error(err);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'The site is not fully set up yet. Please try again shortly.' }));
    return;
  }

  return app(req, res);
}
