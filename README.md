# TheNewsDesk

TheNewsDesk is a newsroom CMS with a React/Vite frontend, an Express API, and a MySQL-compatible database.

## Standalone article admin demo

The independent `article-admin-demo/` folder contains a browser-only article dashboard mockup. It does not connect to TheNewsDesk, an API, or a database. Run it with `python -m http.server 3001` from that folder and open <http://localhost:3001>. Articles stay in that browser's local storage.

## Requirements

- Node.js 20.16 or later and npm
- MySQL 8 or MariaDB (XAMPP is suitable for local development)

## Local setup

1. Clone the repository and install dependencies:

   ```sh
   npm ci --prefix server
   npm ci --prefix frontend
   ```

2. Create the local database from the schema in `database/schema.sql`. For example, import that file with phpMyAdmin, or run it with the MySQL client. It creates the `thenewsdesk` database.

   For an existing database, apply any unapplied SQL files in `database/migrations/`. In particular, `005_fix_article_workflow_statuses.sql` upgrades the article status column for the current workflow and restores submissions that an older schema recorded with a blank status.

3. Copy `server/.env.example` to `server/.env` and set the database username, password, and a private JWT secret for your machine. Do not commit `server/.env`.

4. Create the development accounts and sample newsroom data:

   ```sh
   npm run seed --prefix server
   ```

   The local seed accounts use the password `password123`; for example, sign in with `jai_super`. These are development-only credentials. Never use seeded accounts or their passwords in a public or production deployment.

5. Start the API and frontend in separate terminals:

   ```sh
   npm run dev --prefix server
   ```

   ```sh
   npm run dev --prefix frontend
   ```

6. Open <http://localhost:3000>. The Vite development server proxies `/api` and `/uploads` requests to the API at <http://localhost:4000>.

   Local development allows up to 200 login requests per IP every 15 minutes so you can switch between seeded demo roles. Production keeps the stricter 20-request limit, applied only to login attempts.

## Checks

Build the frontend:

```sh
npm run build --prefix frontend
```

For a one-origin deployment with the frontend and Express API together, see
[deployment/RENDER.md](deployment/RENDER.md). The API still requires a
MySQL-compatible database and persistent object storage.

Check the API health endpoint while the backend is running:

```text
http://localhost:4000/api/health
```

## Environment and local data

- Keep credentials and API keys in your own ignored `server/.env` file. `server/.env.example` contains placeholders only.
- Local MySQL databases and files in `server/uploads/` are not shared through Git. Each collaborator needs their own database and local environment.
- `database/schema.sql` is the schema for a fresh standalone development database. The `database/migrations/003_unify_opinyon_database.sql` migration is for an existing OpinYon database; do not run it against a database unless you intend to integrate the CMS with that site's existing data.
- Apply numbered migrations only once and in order when upgrading an existing database.
- DigitalOcean Spaces and Semaphore integrations require separately provisioned credentials. They are not needed for the basic local development flow.
- eMagazine PDF pages are rendered with the bundled WebAssembly PDFium renderer; no external PDF or native graphics tools need to be installed.
