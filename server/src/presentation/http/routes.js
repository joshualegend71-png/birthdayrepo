import { Router } from 'express';
import { toCsv } from './csv.js';
import { rateLimit } from './middleware/rateLimit.js';
import { requireAdminKey } from './middleware/requireAdminKey.js';

const RSVP_CSV_COLUMNS = [
  { header: 'First name', key: 'firstName' },
  { header: 'Last name', key: 'lastName' },
  { header: 'Email', key: 'email' },
  { header: 'Phone', key: 'phone' },
  { header: 'Address', key: 'address' },
  { header: 'Coming for', key: 'comingFor' },
  { header: 'Relationship', key: 'relationship' },
  { header: 'Attendance', key: 'attendance' },
  { header: 'Note', key: 'message' },
  { header: 'Submitted at', key: 'createdAt' },
];

/**
 * Thin controllers: translate HTTP to use-case calls and back.
 * Express 5 forwards rejected promises to the error handler automatically.
 */
export function createApiRouter({ useCases, adminKey }) {
  const router = Router();
  const submissionLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

  router.get('/health', (req, res) => res.json({ status: 'ok' }));

  router.get('/event', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=300');
    res.json(await useCases.getEventDetails.execute());
  });

  router.post('/rsvps', submissionLimit, async (req, res) => {
    res.status(201).json(await useCases.submitRsvp.execute(req.body));
  });

  router.get('/notes', async (req, res) => {
    res.json(await useCases.listNotes.execute());
  });

  router.post('/notes', submissionLimit, async (req, res) => {
    res.status(201).json(await useCases.postNote.execute(req.body));
  });

  router.get('/admin/rsvps', requireAdminKey(adminKey), async (req, res) => {
    const result = await useCases.listRsvps.execute();
    if (req.query.format === 'csv') {
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="gracefully-sixty-rsvps.csv"');
      return res.send('﻿' + toCsv(RSVP_CSV_COLUMNS, result.rsvps));
    }
    return res.json(result);
  });

  router.use((req, res) => res.status(404).json({ message: 'Not found.' }));

  return router;
}
