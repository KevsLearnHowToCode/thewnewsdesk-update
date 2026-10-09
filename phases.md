## Phase 0 — Foundation ✅ (Done)

Everything already built and confirmed working.

**Backend**
- [x] Express server running on port 4000
- [x] MySQL connected via db.js
- [x] `POST /api/auth/login` — JWT + bcrypt, httpOnly cookie
- [x] `POST /api/auth/logout`
- [x] `GET /api/auth/me`
- [x] Auth middleware auth.js
- [x] `GET /api/health`

**Frontend**
- [x] React 18 + Vite 6 running on port 3000
- [x] Figma pages merged: Login, Dashboard, Articles, Editor, Analytics, Settings, Media Library
- [x] Router wired (routes.tsx)
- [x] Sidebar + SidebarLayout + Topbar + StatusBadge components
- [x] Full design system (navy/gold/off-white, Inter/Playfair/Lora)
- [x] All shadcn/ui primitives scaffolded

**Database**
- [x] `users` table
- [x] `user_roles` table
- [x] `articles` table
- [x] `notifications` table

---

## Phase 1 — Database & Core API
**Dates: May 6–18 | ~12 days**

### Step 1.1 — Expand the Database Schema
Update schema.sql with all 18 new tables:
- [ ] `clients` — one record per client, API key, logo
- [ ] `client_settings` — per-client key/value config (role toggles, display names)
- [ ] `user_settings` — per-user preferences
- [ ] `settings` — global system key/value store
- [ ] `categories` — per-client, with parent_id for subcategories
- [ ] `article_tags` — pivot table article ↔ tag
- [ ] `article_seo` — meta title, description, OG image, slug (separate from article table)
- [ ] `article_revisions` — full content snapshot at each transition
- [ ] `article_feedback` — editor notes, visible_to_writer flag
- [ ] `article_assignments` — desk assigns article to editor
- [ ] `article_locks` — prevents two editors on same article
- [ ] `media` — every uploaded file, CDN URL, alt text
- [ ] `emagazines` — one record per issue
- [ ] `emagazine_pages` — individual WebP page images
- [ ] `sms_subscribers` — per-client subscriber list
- [ ] `sms_settings` — per-client daily limit, budget cap
- [ ] `audit_log` — all admin/superadmin actions
- [ ] `pages` — static pages (About, Contact, Privacy Policy)
- [ ] Add `client_id` FK to: articles, categories, media, notifications, sms_subscribers, emagazines
- [ ] Add `can_publish`, `can_sms_blast`, `can_delete` boolean columns to `users`
- [ ] Expand role ENUMs to include `managing_editor`, `editor_in_chief`, `superadmin`, `photographer`, `viewer`, `contributor`

### Step 1.2 — Seed File
Update seed.js:
- [x] Seed the OpinYon client
- [x] Seed test users for every role (from AGENDA §15.3)
- [x] Seed default categories per client (Politics, Economy, Opinion, Sports, Entertainment, Lifestyle)
- [x] Seed default client_settings (workflow toggles off by default)

### Step 1.3 — Article CRUD API (`server/routes/articles.js`)
- [x] `GET /api/articles` — list with filters (status, author, category, client). Writer: own only. Desk/Editor: queue. Publisher: approved queue.
- [x] `POST /api/articles` — create draft
- [x] `GET /api/articles/:id` — single article + feedback + audit trail
- [x] `PUT /api/articles/:id` — update content/meta (ownership check)
- [x] `POST /api/articles/:id/duplicate` — clone as new draft
- [x] `DELETE /api/articles/:id` — soft delete, requires `can_delete` toggle

### Step 1.4 — Article Status Transitions API
- [x] `POST /api/articles/:id/submit` — writer submits (draft → submitted)
- [x] `POST /api/articles/:id/assign` — desk assigns to editor (submitted → in_review)
- [x] `POST /api/articles/:id/return` — desk returns to writer
- [x] `POST /api/articles/:id/approve` — editor approves (in_review → pending_senior or approved)
- [x] `POST /api/articles/:id/reject` — editor/senior rejects with required reason
- [x] `POST /api/articles/:id/senior-approve` — managing editor / EIC approves
- [x] `POST /api/articles/:id/publish` — publisher publishes (immediate or scheduled)
- [x] `POST /api/articles/:id/unpublish` — remove from public, keep in system
- [x] `POST /api/articles/:id/archive`
- [x] `POST /api/articles/:id/breaking` — flag as breaking news

### Step 1.5 — Article Locking & History
- [x] `POST /api/articles/:id/lock` — set lock when user opens editor
- [x] `POST /api/articles/:id/unlock` — release lock on close
- [x] Background cron: auto-release locks older than 30 minutes
- [x] `GET /api/articles/:id/history` — return revision snapshots
- [x] `POST /api/articles/:id/feedback` — add feedback note with `visible_to_writer` flag

### Step 1.6 — Notifications API (`server/routes/notifications.js`)
- [x] `GET /api/notifications` — current user's feed, paginated
- [x] `GET /api/notifications/unread-count` — for bell badge
- [x] `POST /api/notifications/:id/read`
- [x] `POST /api/notifications/read-all`
- [x] Create `server/services/notify.js` — helper function to create notifications on every status event. Called by all article transition routes.

### Step 1.7 — Users API (`server/routes/users.js`)
- [x] `GET /api/users` — list users for current client (Admin only)
- [x] `POST /api/users` — create user (Admin only)
- [x] `GET /api/users/:id`
- [x] `PUT /api/users/:id` — update info, roles, permission toggles
- [x] `POST /api/users/:id/deactivate`
- [x] `POST /api/users/:id/activate`
- [x] `POST /api/users/:id/reset-password`

### Step 1.8 — Categories API (`server/routes/categories.js`)
- [x] `GET /api/categories` — list for current client
- [x] `POST /api/categories`
- [x] `PUT /api/categories/:id`
- [x] `DELETE /api/categories/:id` (only if no articles assigned)

### Step 1.9 — Auth Enhancements
- [x] Add `POST /api/auth/change-password`
- [x] Add `POST /api/auth/2fa/setup` (Superadmin only — generate TOTP QR)
- [x] Add `POST /api/auth/2fa/verify`
- [x] Add `express-rate-limit`: 10 login attempts per 15 min per IP

---

## Phase 2 — Frontend Wiring & Role Dashboards
**Dates: May 19 – June 1 | ~13 days**

### Step 2.1 — Auth Context & API Client
- [x] Create `app/lib/api.ts` — typed fetch wrapper (base URL, cookie credentials, error handling)
- [x] Wire `LoginPage.tsx` to real `POST /api/auth/login` (remove the fake setTimeout)
- [x] Create AuthContext.tsx — store user, roles, client, logout
- [x] Add `ProtectedRoute` wrapper — redirect to `/login` if no session
- [x] Wire `/login` redirect to role-based default page (use AGENDA §7.11 table)

### Step 2.2 — Article Editor (TipTap)
Install and wire TipTap:
- [x] Install: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`, `@tiptap/extension-character-count`
- [x] Wire `ArticleEditorPage.tsx` toolbar to real TipTap extensions (Heading H1–H3, Bold, Italic, Strike, Link, Image, BulletList, OrderedList, Blockquote, HorizontalRule, History)
- [x] Live word count + reading time in status bar (CharacterCount extension)
- [x] Auto-save every 60 seconds — `PUT /api/articles/:id` silently
- [x] localStorage draft fallback (save to `draft_[id]` if API call fails)
- [x] Article lock: call `POST /api/articles/:id/lock` on mount, `unlock` on unmount
- [x] Show lock banner if article is locked by someone else
- [x] Wire Settings drawer to real API: status, category, tags, SEO fields, author, breaking flag
- [x] Wire Submit / Approve / Reject / Publish buttons to their respective API endpoints

### Step 2.3 — Articles List Page
- [x] Wire `ArticlesPage.tsx` to `GET /api/articles` with filters
- [x] Wire search input (debounced, calls `GET /api/search?q=`)
- [x] Wire category, status, author dropdown filters
- [x] Wire pagination
- [x] Wire Edit button → `/articles/:id/edit`
- [x] Wire New Article button → `POST /api/articles` then navigate to `/articles/:id/edit`
- [x] Role-visibility: show only own articles for WR/CO, show all for ME/AD/SA

### Step 2.4 — Dashboard Page
- [x] Wire stat cards to `GET /api/analytics/summary`
- [x] Wire recent articles table to `GET /api/articles?limit=8&sort=updated`
- [x] Wire notifications feed to `GET /api/notifications?limit=10`
- [x] Bell icon: fetch `GET /api/notifications/unread-count` on mount, poll every 60s
- [x] Click notification → navigate to relevant article
- [x] Role-based dashboard views: Writer, Desk, Editor, Publisher, Admin/Superadmin

### Step 2.5 — Article Preview
- [x] Create `app/pages/ArticlePreviewPage.tsx`
- [x] Route: `/articles/:id/preview`
- [x] Renders article using Playfair headline + Lora body, full layout as it'll appear on client website
- [x] Shows all SEO fields, publish date, author, category, tags
- [x] Read-only — no editing controls

### Step 2.6 — Role-Based Navigation & Visibility
- [x] Update `Sidebar.tsx` — show/hide nav items based on role (use AGENDA §7.10)
- [x] Route guards: redirect if role lacks permission for that page
- [x] Toolbar buttons in editor: show/hide Publish, Approve, Submit, Reject, SMS Blast per role and per `can_*` toggles
- [x] Article table actions: show/hide Edit based on ownership + role

### Step 2.7 — Notifications System (Frontend)
- [x] Wire bell badge to `unread-count` API
- [x] Build notification dropdown panel in `Topbar.tsx`
- [x] Mark read on click
- [x] Mark all read button
- [x] Navigate to article/page on click

### Step 2.8 — Settings Pages
- [x] Wire `/settings` profile form to `PUT /api/users/:id`
- [x] Wire password change to `POST /api/auth/change-password`
- [x] Wire notification toggles to `user_settings` API

---

## Phase 3 — Media, eMagazine & Public API
**Dates: June 2–8 | 7 days**

### Step 3.1 — Media Upload (DO Spaces)
- [x] Install `@aws-sdk/client-s3` and `multer` in server
- [x] Create `server/services/storage.js` — upload to DO Spaces, return CDN URL
- [x] Create `server/routes/media.js`:
  - `POST /api/media/upload` — validate MIME (check file headers), sanitize filename (UUID), upload to Spaces, save to DB
  - `GET /api/media` — list for current client
  - `DELETE /api/media/:id` — delete from Spaces + DB
- [x] Wire `MediaLibraryPage.tsx`:
  - Upload button / drag-and-drop → `POST /api/media/upload`
  - Grid of uploaded images from `GET /api/media`
  - Copy CDN URL button
  - Delete with confirm dialog
  - Select image → insert into article editor (pass CDN URL back via callback)
- [x] Wire TipTap image insertion: clicking image button in editor opens MediaLibrary modal

### Step 3.2 — eMagazine
- [x] Install `pdf2pic` and `sharp` (requires poppler on server)
- [x] Create `server/routes/emagazine.js`:
  - `POST /api/emagazine/upload` — accept PDF, convert each page to WebP via pdf2pic, upload all page images + original PDF to Spaces, save emagazines + emagazine_pages records
  - `GET /api/emagazine` — list issues for client
  - `GET /api/emagazine/:id` — detail with all page image URLs
  - `DELETE /api/emagazine/:id` — delete all Spaces files + DB records
- [x] Build `app/pages/EMagazinePage.tsx` — list of issues, upload button (Admin/ME only)
- [x] Build `app/components/EMagazineViewer.tsx` — page-by-page WebP flip-book viewer (built into client websites)

### Step 3.3 — Search API
- [x] Create `server/routes/search.js`
- [x] `GET /api/search?q=keyword` — MySQL LIKE/FULLTEXT search across article title, content excerpt, author name, tags. Filter by client_id. Role-scoped.
- [x] Wire to global search in Topbar (⌘K or search icon)

### Step 3.4 — Analytics API
- [x] Create `server/routes/analytics.js`:
  - `GET /api/analytics/summary` — published today, pending review, total articles, breaking active
  - `GET /api/analytics/articles` — per-article view counts, sorted by views
  - `GET /api/analytics/authors` — per-author article count and avg publishing rate
  - `POST /api/analytics/articles/:id/view` — increment view count (called by client website)
- [x] Wire `AnalyticsPage.tsx` to real data (Recharts charts already in place from Figma)

### Step 3.5 — Public API (for Client Websites)
- [x] Create `server/middleware/apiKey.js` — validates `X-API-Key` header against `clients.api_key`
- [x] Create `server/routes/public.js`:
  - `GET /api/public/articles` — published articles for client. Supports `?category`, `?tag`, `?limit`, `?page`, `?search`
  - `GET /api/public/articles/:slug` — single article by slug
  - `GET /api/public/categories`
  - `GET /api/public/emagazines`
  - `GET /api/public/emagazines/:id/pages`
  - `GET /api/public/pages/:slug` — static pages

### Step 3.6 — SMS / Breaking News
- [x] Install `axios` in server (or use built-in fetch)
- [x] Create `server/services/sms.js` — wraps Semaphore API, reads `sms_settings` per client, enforces daily limit + budget cap
- [x] Create `server/routes/sms.js`:
  - `GET /api/sms/subscribers`
  - `POST /api/sms/subscribers`
  - `DELETE /api/sms/subscribers/:id`
  - `POST /api/sms/send-breaking` — send to all active subscribers, log send, check limits
- [x] Wire breaking news flag in editor settings drawer to trigger SMS
- [x] Build `/breaking` page (breaking news management)

### Step 3.7 — Static Pages Manager
- [x] Create `server/routes/pages.js` (CRUD for static pages)
- [x] Build `app/pages/PagesPage.tsx` — list + create/edit with TipTap editor
- [x] Add to router under `/pages`
- [x] Add to Sidebar nav (Admin+ only)

### Step 3.8 — Users Management Page
- [x] Wire `app/pages/UsersPage.tsx` (new) to `GET /api/users`
- [x] Invite user form: `POST /api/users`
- [x] Edit user: `PUT /api/users/:id` — role, section assignment, permission toggles
- [x] Deactivate / activate

### Step 3.9 — Client Next.js Websites
Both are separate projects — build in parallel with Phase 3 backend work:
- [x] Create `website-opinyon/` — full custom design, all pages built
- [x] Both: custom design matching each client's brand
- [x] Both: fetch articles from `GET /api/public/articles` using client API key
- [x] Both: article detail page (`/[slug]`) with reading time
- [x] Both: category pages
- [x] Both: `GET /api/public/pages/:slug` for About/Contact pages
- [x] Both: eMagazine viewer page
- [x] Both: OpenGraph meta tags per article (SEO)
- [x] Both: call `POST /api/analytics/articles/:id/view` on article page load
- [ ] Both: Google Analytics 4 — add GA4 measurement ID per client (pending client setup)

---

## Phase 4 — Production & Security
**Dates: June 9–15 | 7 days**

### Step 4.1 — Security Hardening (Backend)
- [x] Install and configure `helmet` — sets X-Frame-Options, HSTS, CSP headers
- [x] Install and configure `express-rate-limit` on all routes (strict on `/api/auth/login`)
- [x] Install `express-validator` — add validation middleware to all `POST`/`PUT` routes
- [x] Add `sameSite: 'strict'` to JWT cookie config
- [x] Lock CORS to `app.thenewsdesk.ph` in production (`CORS_ORIGIN` env var)
- [x] Verify all SQL queries use `?` parameterized placeholders — no string concatenation
- [x] Article ownership checks: writers can only edit/submit own articles (enforced in query, not just UI)
- [x] Client isolation: every query filters by `client_id` from `req.user` — never from request body

### Step 4.2 — Superadmin Panel
- [x] Create `server/routes/superadmin.js` (SA-only middleware on all routes)
- [x] `GET /api/superadmin/clients` — all clients with stats
- [x] `POST /api/superadmin/clients` — create new client
- [x] `PUT /api/superadmin/clients/:id`
- [x] `GET /api/superadmin/clients/:id/impersonate` — short-lived admin token
- [x] `GET/PUT /api/superadmin/clients/:id/onboarding` — checklist
- [x] Build `app/pages/SuperadminPage.tsx` — combined superadmin dashboard with client list + onboarding

### Step 4.3 — Audit Log
- [x] Create `server/services/audit.js` — helper that inserts into `audit_log` table. Call from all admin/superadmin actions.
- [x] `GET /api/audit-log` — SA/AD only, filterable
- [x] Build `app/pages/AuditLogPage.tsx`

### Step 4.4 — 2FA for Superadmin
- [x] Install `otplib` and `qrcode` in server
- [x] Wire `POST /api/auth/2fa/setup` — generate TOTP secret, return QR code
- [x] Wire `POST /api/auth/2fa/verify` — verify 6-digit code on login
- [x] Store `totp_secret` in `users` table (encrypted)
- [x] Login flow: after password OK, if user is superadmin and 2FA is set up, require code before issuing JWT

### Step 4.5 — DigitalOcean Server Provisioning
- [ ] Create $12/mo Droplet: Ubuntu 22.04, 2GB RAM, Singapore (sgp1)
- [ ] SSH key auth only — disable root password login
- [ ] UFW: allow ports 22, 80, 443 only
- [ ] Install Node.js 20 LTS, Nginx, MySQL 8, pm2, Certbot, poppler-utils
- [ ] Create MySQL `thenewsdesk` database and user with limited permissions
- [ ] MySQL `bind-address = 127.0.0.1` in `/etc/mysql/mysql.conf.d/mysqld.cnf`

### Step 4.6 — Nginx + SSL
- [ ] Nginx config: serve `dist/` for all non-API requests, proxy `/api/*` to `localhost:4000`
- [ ] Certbot: obtain Let's Encrypt cert for `app.thenewsdesk.ph`
- [ ] Nginx enforces HTTPS redirect (301 HTTP → HTTPS)
- [ ] Nginx sets security headers (X-Frame-Options, HSTS)

### Step 4.7 — pm2 + Deploy Script
- [ ] `ecosystem.config.js` for pm2 — name `thenewsdesk-api`, index.js, `NODE_ENV=production`
- [ ] pm2 `startup` — auto-restart on server reboot
- [ ] Create `deploy.sh` script: `git pull`, `npm install`, `npm run build` (frontend), `pm2 restart all`
- [ ] Configure .env with all production secrets

### Step 4.8 — Automated Backups
- [ ] Create `server/scripts/backup-db.sh` — `mysqldump | gzip` → upload to private DO Spaces bucket
- [ ] Create `server/scripts/backup-files.sh` — sync `/uploads` to Spaces
- [ ] Add to crontab: DB backup daily 2am, file backup daily 3am
- [ ] Test restore procedure from backup
- [ ] Set up weekly DO Droplet Snapshot (from DO control panel)

### Step 4.9 — UptimeRobot
- [ ] Create UptimeRobot account
- [ ] Add monitor: `GET app.thenewsdesk.ph/api/health` every 5 min
- [ ] Configure `status.thenewsdesk.ph` public status page (CNAME to UptimeRobot)
- [ ] Set alert email to `support@thenewsdesk.ph`

### Step 4.10 — PWA Setup
- [x] Add `public/manifest.webmanifest` — name, icons, theme color `#0B1B2B`, background `#F8F8F6`
- [x] Add `dist/sw.js` — service worker generated by vite-plugin-pwa
- [x] Register service worker via vite-plugin-pwa (registerSW.js)
- [x] PWA meta tags in index.html
- [ ] Test install to home screen on Android Chrome (manual test)

---

## Phase 5 — Beta & Go-Live
**Dates: June 16–30 | 15 days**

### Step 5.1 — Beta Preparation (June 16)
- [ ] Production DB seeded with real data: clients, categories, initial users
- [ ] OpinYon admin account created
- [ ] OpinYon staff accounts created — roles assigned
- [ ] OpinYon Viber group and one internal group (Jai + Sophia) created
- [ ] Welcome message sent to OpinYon with login URL and credentials

### Step 5.2 — Client Beta (June 16–29)
- [ ] OpinYon staff use the system for 2 weeks with real articles
- [ ] Sophia does UAT: every screen, every role, every workflow
- [ ] Jai monitors Viber group daily — fix all reported issues same day
- [ ] Track all issues in a simple bug list (Google Sheet or notes)
- [ ] OpinYon website is accessible at its domain during beta

### Step 5.3 — Pre-Launch Checklist (June 28–30)
**Security:**
- [ ] All `.env` secrets are production values (not dev/test)
- [ ] JWT_SECRET and COOKIE_SECRET are 64-char random strings
- [ ] Rate limiting active on login endpoint
- [ ] CORS locked to production domain
- [ ] Helmet.js headers active

**Functionality:**
- [ ] All regression tests from AGENDA §15.4 pass
- [ ] Login/logout works for all 9 roles
- [ ] Article full lifecycle works end-to-end
- [ ] Breaking news SMS fires correctly
- [ ] eMagazine upload + viewer works
- [ ] Media upload, CDN URLs serving correctly
- [ ] Notifications firing for all events
- [ ] Scheduled publish fires on correct time
- [ ] Article locking works

**Infrastructure:**
- [ ] UptimeRobot showing green
- [ ] Backup scripts ran and restore tested
- [ ] SSL cert active, HTTPS redirecting
- [ ] pm2 auto-restart verified (kill process, confirm it restarts)
- [ ] DO Snapshots configured

**Business:**
- [ ] OpinYon.net pointing to their Next.js site
- [ ] GA4 installed on both client websites and accounts handed over
- [ ] Invoices sent to both clients for Month 1 (₱20,000/mo)
- [ ] Support channels active (Viber groups + support@thenewsdesk.ph)

### Step 5.4 — Go-Live (July 1, 2026)
- [ ] Announce in both client Viber groups
- [ ] Monitor server logs and UptimeRobot closely for 48 hours
- [ ] Sophia on standby for any client questions
- [ ] Production smoke test (AGENDA §15.6)

---

## Phase 6 — Post-Launch Maintenance & Phase 2 Features
**Dates: July 2026 onward**

### Step 6.1 — Ongoing (Every Week)
- [ ] Deploy bug fixes as needed
- [ ] Weekly UI improvements batch deploy
- [ ] Monitor DO Spaces storage usage
- [ ] Review Semaphore SMS usage reports (Sophia)
- [ ] Review UptimeRobot alerts

### Step 6.2 — Phase 2 Features (Aug–Sep 2026)
- [ ] WordPress content migration tool (import XML → articles)
- [ ] Visual content calendar
- [ ] WhatsApp/Viber article intake (requires Meta Business API)
- [ ] Print/PDF layout export
- [ ] Full version restore (one-click rollback to any revision)
- [ ] Automated test suite

### Step 6.3 — Phase 3 Features (Oct–Dec 2026)
- [ ] Grammar/style checker (LanguageTool API)
- [ ] Social media scheduling (Meta + Twitter/X API)
- [ ] SEO suggestions engine
- [ ] Research assistant (web search integration)

### Step 6.4 — End of 2026 Milestone
- [ ] SEC registration (Stock Corporation, 50/50 Jai + Sophia)
- [ ] Trademark application — Class 42 at IPOPHL (₱3,240/class)
- [ ] `thenewsdesk.ph` marketing website launched
- [ ] Public commercial launch — open to new clients

### Step 6.5 — Phase 4 (2027)
- [ ] Full analytics dashboard (GA4 + internal data combined)
- [ ] Multi-client SaaS mode (self-serve signup + billing)
- [ ] React Native mobile app (iOS + Android)
- [ ] Broadcast ticker integration

