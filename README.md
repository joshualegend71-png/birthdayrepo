# #GracefullySixty

Website for the 60th birthday celebration of **Mrs Taiwo Oso and Mrs Kehinde Anifowose**:
Saturday, 12 December 2026, Akesan Hall, Iperu Remo, Ogun State.

- **Backend:** Node.js + Express, clean architecture, SQLite via Node's built-in `node:sqlite`
- **Frontend:** React + Vite
- **Deploys as one service:** the Node server serves both `/api` and the built React site.

## Requirements

Node.js **22.13 or newer** (Node 24 LTS recommended). On Windows:

```powershell
winget install OpenJS.NodeJS.LTS
```

## Run locally

```bash
npm run install:all      # install server + client packages

# terminal 1 – API on http://localhost:3000
npm run dev:server

# terminal 2 – site on http://localhost:5173 (proxies /api to the server)
npm run dev:client
```

Run the tests with `npm test`.

## Production

```bash
npm run build            # installs everything and builds the React site into client/dist
npm start                # serves the site and API on $PORT (default 3000)
```

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port to listen on |
| `DB_PATH` | `server/data/gracefully-sixty.db` | SQLite file. **Put this on a persistent disk** when hosting. |
| `ADMIN_KEY` | *(unset)* | Secret for the host RSVP list. The endpoint is disabled when unset. |
| `CONTENT_PATH` | `server/src/infrastructure/content/event.json` | Page content file |
| `TRUST_PROXY` | `true` | Set `false` if not behind a hosting proxy |

### Hosting on Vercel (current setup)

- `vercel.json` builds the React site to `client/dist` (served by Vercel's CDN) and routes `/api/*`
  to the serverless function in `api/index.js`.
- Storage is **Neon Postgres**: in the Vercel project open **Storage → Create → Neon**, connect it to
  the project, and Vercel adds `DATABASE_URL`. Tables are created automatically on first request.
- Set `ADMIN_KEY` under **Settings → Environment Variables**, then redeploy.
- Locally, without `DATABASE_URL`, the app keeps using the SQLite file.

### Hosting on Render (or Railway)

1. Push this folder to a Git repository and create a **Web Service** from it.
2. Build command: `npm run build`. Start command: `npm start`.
3. Add a **persistent disk** (e.g. mounted at `/var/data`) and set `DB_PATH=/var/data/gracefully-sixty.db`.
   Without a disk, RSVPs and Love Wall notes are lost on every redeploy.
4. Set `ADMIN_KEY` to a long random value.

## Viewing RSVPs (hosts)

- JSON with headcounts: `GET /api/admin/rsvps` with header `x-admin-key: <ADMIN_KEY>`
- Spreadsheet download: open `https://<your-site>/api/admin/rsvps?format=csv&key=<ADMIN_KEY>` in a browser

## Editing the content

All text, dates, colours, FAQ, gift accounts and photos live in
`server/src/infrastructure/content/event.json`. Edit it and restart the server.

- **Gift accounts:** add entries to `gifts.accounts`, e.g.
  `{ "bankName": "GTBank", "accountNumber": "0123456789", "accountName": "Full Name" }`.
  While the list is empty, the page shows the enquiry number instead.
- **Celebrant photos:** set each celebrant's `image` to a photo URL. While `null`, a monogram is shown.
- **Wishlist:** set `gifts.wishlistUrl`.

## Architecture

```
server/src/
  domain/          entities and rules (Rsvp, Note, validation, errors); no dependencies
  application/     use cases + ports (repository contracts)
  infrastructure/  repositories (postgres/ for Vercel, sqlite/ for local), JSON content provider
  presentation/    Express app, routes, middleware
  compositionRoot.js  wires everything together; picks Postgres when DATABASE_URL is set
  main.js          local server entry point
api/index.js       Vercel serverless entry point
client/src/
  api/             HTTP client
  features/        hero, celebrants, event-details, gallery, rsvp, faq, gifts, love-wall
  components/      shared UI
  lib/             date and calendar helpers
```

Dependencies point inward only: presentation → application → domain.
Infrastructure implements the ports defined by the application layer.
