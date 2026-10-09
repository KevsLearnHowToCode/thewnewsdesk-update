
 
Technical Agenda
System Design, Features & Build Plan
The Complete CMS and Digital Newsroom
Prepared: May 2026  |  Version 1.0  |  CONFIDENTIAL
Founders: Jai Duena & Sophia Puracan
 
1. Development Approach
1.1 Team
Role	Person	Responsibilities
Lead Developer	Jai Duena	Full stack development, DevOps, system architecture, client websites
Business & QA	Sophia Puracan	User acceptance testing, copywriting, client communication, finance

No external contractors for v1. All development is handled in-house by Jai. Sophia does not write code.

1.2 Tech Stack
Layer	Technology	Notes
Frontend	React 18 + Vite 6	Already set up
Styling	Tailwind CSS + shadcn/ui	Components scaffolded
Routing	react-router 7	Already configured
Animation	motion/react (Framer Motion)	Already in use
Backend	Node.js + Express 4	Already running on port 4000
Database	MySQL 8	XAMPP locally, self-hosted on DigitalOcean in production
Auth	JWT + bcryptjs + httpOnly cookies	Already built
File Storage	DigitalOcean Spaces (S3-compatible)	For all uploaded images and eMagazines
Email	None for v1	No transactional email — in-app notifications only
SMS	Semaphore	Breaking news alerts to subscribers only
Package Manager	pnpm	Project already configured with pnpm-workspace.yaml
Process Manager	pm2	Production only — keeps API running, auto-restart on crash
Web Server	Nginx	Handles HTTPS, serves React build, proxies /api to Express
PDF Conversion	pdf2pic / sharp + poppler	Converts eMagazine PDF pages to WebP images
Client Websites	Next.js	One custom Next.js site per client, full custom design

1.3 Development Workflow
●	Local development: frontend on localhost:3000, backend on localhost:4000
●	XAMPP MySQL for local database
●	Single .env file in server/ for all secrets — never committed to git
●	Version control: git, single main branch, small descriptive commits
●	No staging server — test locally, deploy directly to production
●	Deploy: rsync/scp code to DigitalOcean droplet, then pm2 restart all

1.4 Folder Structure
Folder	Purpose
app/pages/	One file per route/page
app/components/ui/	shadcn primitives — do not modify
app/components/common/	Shared components (Header, Sidebar, etc.)
app/components/[feature]/	Feature-specific components
app/context/	React context providers (Auth, etc.)
app/hooks/	Custom React hooks
app/lib/	API client, utility functions
server/routes/	One file per API domain
server/middleware/	Auth, validation, file upload middleware
server/services/	Business logic (backup, SMS, storage)
server/uploads/	Local media — dev only, not committed to git
database/	schema.sql and seed.js
website-opinyon/	OpinYon Next.js public website (separate project)


2. Scope & Limitations (v1)
2.1 In Scope for July 1, 2026
Feature	Description
Authentication	Login, logout, JWT session, role-based access control
Article Lifecycle	Full pipeline: Draft → Submit → Desk → Editor → Senior Editor → Publisher → Live
Article Editor	Rich text editor (TipTap) with headings, bold/italic, lists, links, blockquotes, image embed
Article Preview	Renders article exactly as it will appear on the client's public website before publishing
Version History	Snapshot of article content saved at each major transition (submit, approve, reject). View previous versions.
Article Locking	When one person opens an article for editing, others see it as locked. Prevents silent overwrites.
Duplicate Article	Clone any existing article as a starting point for a new one
Scheduled Publishing	Set a future date and time — article goes live automatically
Word Count & Reading Time	Live counter in the editor. Reading time also displayed on the public website.
Global Search	Search all articles by title, keyword, author, or tag across the system
Article Audit Trail	Human-readable log on every article: edited by, approved by, notes. Visible to writers (selected notes only).
Media Uploads	Images only (JPEG, PNG, WebP, GIF). Max 10MB. Stored on DigitalOcean Spaces.
Media Library	Browse, search, and reuse previously uploaded images without re-uploading
eMagazine Upload	Admin uploads PDF. System converts pages to WebP for fast loading. Flip-book viewer on client website.
Role Dashboards	Separate dashboard UI for every role — Writer, Reporter, Desk, Editor, Managing Editor, Editor in Chief, Publisher, Admin, Superadmin
Workflow Toggles	Admin can enable/disable Traffic Desk, Managing Editor, and Editor in Chief per client
In-App Notifications	Bell icon on all roles. Notification feed for all article status changes and relevant events.
SMS Breaking News	Semaphore SMS alert to subscriber list when an article is flagged as Breaking News
PWA Support	CMS built as a Progressive Web App — installable on phone, Android push notifications supported
User Management	Admin creates, edits, deactivates users. Assigns and removes roles.
Categories & Tags	Admin/Editor manages categories. Writers pick from list. Tags are free-form.
Analytics	Views per article, articles per author, publication frequency. Visible to Admin, Editors, Publisher, Superadmin.
Client Website	Custom Next.js website for OpinYon that pulls published articles from the NewsDesk API.
Public API	Unauthenticated endpoints for client websites to fetch published articles. Protected by API key per client.
2FA	Two-factor authentication for Superadmin (Jai) only
Superadmin Panel	Cross-client overview, enter any client workspace, global system settings
SEO Fields	Publisher sets meta title, meta description, Open Graph image, and slug on the publish screen. If left blank, system auto-generates from article title and excerpt.
Static Pages Manager	Admin can create and edit static website pages (About Us, Contact, Privacy Policy, etc.) directly in the CMS. No editorial workflow — admin edits and publishes directly. Clients do not need to call Jai for text changes.
Client Onboarding Checklist	Superadmin panel includes a per-client onboarding checklist: create client record, generate API key, create admin account, configure workflow toggles, set up categories, deploy website, install GA, set up Viber group, send welcome message.

2.2 Out of Scope for v1 (Deferred)
Feature	Phase	Reason
Content migration from old websites	Paid add-on / Phase 2	Billed separately — ₱2k–₱15k per client depending on platform
Print / PDF layout export	Phase 2	Complex layout engine — not needed at launch
WhatsApp / Viber article intake	Phase 2	Requires Meta Business API approval — complex setup
Content calendar (visual)	Phase 2	Nice-to-have, not blocking launch
Breaking news push alerts (web)	Phase 2	PWA covers Android; iOS web push is unreliable
Full version restore (one-click)	Phase 2	v1 has view-only history; restore requires more DB work
Grammar and style checker	Phase 3	NLP API cost — not justified at this stage
Social media scheduling	Phase 3	Meta/Twitter API complexity
Research assistant / AI writing	Phase 3	OpenAI cost + editorial policy concerns
Self-serve client signup & billing	Phase 3	Clients are manually onboarded in v1
Video uploads	Phase 3	Storage cost too high for v1
Third-party CMS integrations (Sanity, WordPress)	Not planned	Replaced by new website strategy
Mobile app (iOS/Android)	Phase 4	PWA covers mobile use in v1
Multi-client SaaS mode	Phase 4	Currently each client is manually provisioned
Automated tests	Phase 2	Manual testing sufficient for solo dev on tight deadline

2.3 Hard Limits (v1)
Limit	Value	Notes
Users per client	25 staff accounts	Increase manually on request
Media uploads	Images only, 10MB max	No video in v1
Concurrent editors on one article	1 (locked)	Last-write-wins replaced by locking
eMagazine file size	100MB max PDF	Larger files must be compressed before upload
Client installations	Manual provisioning	No self-serve in v1
Article archive	Auto-archive after 2 years	Still accessible, just removed from active queue


3. Architecture Overview
3.1 System Diagram
The NewsDesk is built on a single server with three layers: the React frontend (CMS), the Express API backend, and the MySQL database. Client public websites are separate Next.js applications that connect to the same API to fetch published content.

Layer	Technology	URL / Location
CMS Application	React + Vite (built to static files)	app.thenewsdesk.ph
API Server	Node.js + Express	app.thenewsdesk.ph/api (proxied by Nginx)
Database	MySQL 8 (self-hosted)	localhost on droplet, not publicly exposed
Media Storage	DigitalOcean Spaces CDN	thenewsdesk-media.sgp1.cdn.digitaloceanspaces.com
OpinYon Website	Next.js (custom)	opinyon.net (client domain, pointed to DO droplet or separate)
Status Page	UptimeRobot (external)	status.thenewsdesk.ph

3.2 Multi-Tenancy
All clients share one database. Articles, users, and media are separated by a client_id column on each table. Every API query filters by client_id — one client never sees another client's data.
●	Each client gets their own admin account to manage their own users and categories
●	The Superadmin (Jai) can view and manage all clients from a single panel
●	Client websites use a unique API key that is tied to their client_id — they can only fetch their own published articles

3.3 Authentication Flow
Step	What Happens
1	User submits username + password to POST /api/auth/login
2	Server validates credentials, signs a JWT (24-hour expiry)
3	JWT is set as an httpOnly cookie named "token" — JavaScript cannot read it
4	Every subsequent request carries the cookie automatically
5	Auth middleware on every protected route verifies the JWT and attaches req.user
6	Role checks are performed on the server for every route — never trusted from the client
7	Superadmin login additionally requires a 6-digit 2FA code (TOTP authenticator app)

3.4 Client Website Architecture
Each client website is a separate Next.js project with full custom design. It is not part of the NewsDesk codebase — it is a standalone site that uses the NewsDesk Public API to fetch content.
●	Fetches published articles via GET /api/public/articles?client=opinyon (API key in header)
●	Server-side rendered (SSR) by Next.js for fast load times and full SEO indexing
●	Cover images served directly from DigitalOcean Spaces CDN
●	Reading time displayed alongside each article
●	eMagazine flip-book viewer embedded on a dedicated /magazine page
●	Breaking news SMS handled separately via Semaphore — not through the website


4. Database Design
4.1 Existing Tables
Table	Purpose	Status
users	All user accounts — name, email, password hash, primary role, active status	✓ Exists
user_roles	Pivot table — one user can hold multiple roles simultaneously	✓ Exists
articles	All article content, status, author, category, views, publish date	✓ Exists
notifications	Per-user in-app notification feed	✓ Exists

4.2 New Tables to Add
Table	Key Columns	Purpose
clients	id, name, domain, api_key, logo_url, is_active, created_at	One record per publishing client.
media	id, uploader_id, client_id, filename, storage_url, file_size, alt_text, article_id (nullable), created_at	Tracks every uploaded image
categories	id, client_id, name, slug, description, color, parent_id (nullable), created_by, created_at	Admin/editor-managed category list per client
article_tags	article_id, tag — PRIMARY KEY (article_id, tag)	Free-form tags attached to articles
article_revisions	id, article_id, editor_id, content_snapshot (LONGTEXT), status_at_time, created_at	Full content snapshot at each key transition
article_feedback	id, article_id, from_user_id, message, type (comment/rejection/approval_note), visible_to_writer (BOOL), created_at	Notes and feedback attached to articles
article_assignments	id, article_id, assigned_to, assigned_by, assigned_at, status	Tracks desk-to-editor assignments
article_locks	article_id (PK), locked_by, locked_at	Prevents two people editing the same article simultaneously
emagazines	id, client_id, title, issue_date, original_pdf_url, page_count, uploaded_by, created_at	eMagazine issue records
emagazine_pages	id, emagazine_id, page_number, image_url	Individual WebP page images per eMagazine issue
sms_subscribers	id, client_id, phone_number, name (nullable), is_active, subscribed_at	SMS subscriber list for breaking news alerts
settings	id, key (UNIQUE), value, updated_at	Global system key-value config store
client_settings	client_id, key, value — PRIMARY KEY (client_id, key)	Per-client config: role toggles, display names, etc.
user_settings	user_id, key, value — PRIMARY KEY (user_id, key)	Per-user preferences: notification toggles, etc.
audit_log	id, user_id, client_id, action, target_type, target_id, metadata (JSON), created_at	Admin and superadmin action log
pages	id, client_id, title, slug, content (LONGTEXT), meta_title, meta_description, is_published, created_by, updated_at	Static website pages managed by admin (About Us, Contact, Privacy Policy, etc.)
article_seo	article_id (PK), meta_title, meta_description, og_image_url, slug (UNIQUE per client), updated_by, updated_at	SEO fields set by publisher before publishing. Stored separately from main article to keep article table clean.
sms_settings	client_id (PK), daily_limit (default 3), monthly_budget_php, alert_threshold_pct (default 80)	Per-client SMS cost controls

4.3 Article Status Machine
Every article moves through a defined set of states. Each transition is logged to article_revisions and fires an in-app notification.
From Status	To Status	Who Triggers It	Notes
draft	submitted	Writer / Reporter	Article enters the desk queue (or editor queue if desk is off)
submitted	in_review	Traffic Desk	Desk assigns article to an editor
submitted	draft	Traffic Desk	Desk returns incomplete article to writer without assigning
in_review	pending_senior	Editor	Editor approves — goes to Managing Editor or Editor in Chief if toggled on
in_review	draft	Editor	Editor rejects — returns to writer with required reason
pending_senior	approved	Managing Editor / Editor in Chief	Senior editor clears article for publishing
pending_senior	draft	Managing Editor / Editor in Chief	Senior editor rejects — returns to writer
approved	published	Publisher	Publisher pushes article live (immediate or scheduled)
approved	draft	Publisher	Publisher sends back with notes
published	archived	Publisher / Admin	Removes article from public website, kept in system
any	archived	Admin	Force-archive (spam, duplicate, legal)

4.4 client_id on Key Tables
The following tables include a client_id foreign key to separate data between clients:
●	articles — every article belongs to one client
●	categories — each client has their own category list
●	media — each client's uploads are scoped to them
●	notifications — scoped per user, users belong to one client
●	sms_subscribers — each client manages their own subscriber list
●	emagazines — each client's magazine issues are separate


5. API Routes
5.1 Auth  —  /api/auth
Method	Path	Access	Description
POST	/login	Public	Login with username + password. Sets JWT httpOnly cookie.
POST	/logout	Auth	Clears JWT cookie.
GET	/me	Auth	Returns current user object (id, name, roles, client).
POST	/change-password	Auth	Change own password. Requires current password.
POST	/2fa/setup	Superadmin	Generate 2FA QR code for authenticator app.
POST	/2fa/verify	Superadmin	Verify 2FA code on login.

5.2 Articles  —  /api/articles
Method	Path	Access	Description
GET	/	Auth	List articles. Filtered by role (writer: own only; desk/editor: queue; publisher: approved queue).
POST	/	Writer/Reporter	Create new draft article.
GET	/:id	Auth	Get single article with feedback, assignments, and audit trail.
PUT	/:id	Auth	Update article content/meta. Only owner, desk, or editor.
POST	/:id/duplicate	Auth	Clone article as a new draft.
POST	/:id/submit	Writer/Reporter	Submit draft for review.
POST	/:id/assign	Desk	Assign article to an editor.
POST	/:id/return	Desk	Return article to writer without assigning.
POST	/:id/approve	Editor	Approve article (moves to senior editor or publisher).
POST	/:id/reject	Editor/Senior Editor/Publisher	Reject with required reason. Returns to draft.
POST	/:id/senior-approve	Managing Editor / Editor in Chief	Senior editor approval — clears for publishing.
POST	/:id/publish	Publisher	Publish article immediately or schedule for later.
POST	/:id/unpublish	Publisher/Admin	Remove from public website, keep in system as approved.
POST	/:id/archive	Publisher/Admin	Archive article.
POST	/:id/breaking	Publisher/Desk	Flag as breaking news. Triggers SMS alert to subscribers.
POST	/:id/lock	Auth	Lock article for editing.
POST	/:id/unlock	Auth	Release article lock.
GET	/:id/history	Auth	Get revision history snapshots.
POST	/:id/feedback	Auth	Add feedback note (specify visible_to_writer flag).

5.3 Users  —  /api/users
Method	Path	Access	Description
GET	/	Admin	List all users for current client.
POST	/	Admin	Create new user account.
GET	/:id	Admin	Get user detail with roles.
PUT	/:id	Admin	Update user info and roles.
POST	/:id/deactivate	Admin	Deactivate user account.
POST	/:id/activate	Admin	Reactivate user account.
POST	/:id/reset-password	Admin	Admin resets a user's password.

5.4 Media  —  /api/media
Method	Path	Access	Description
POST	/upload	Auth	Upload image. Multipart/form-data. Validates MIME type and size.
GET	/	Auth	List all media for client. Filterable by uploader and article.
DELETE	/:id	Admin/Uploader	Delete media file from storage and DB.

5.5 Categories  —  /api/categories
Method	Path	Access	Description
GET	/	Auth	List all categories for current client.
POST	/	Admin/Editor	Create new category.
PUT	/:id	Admin/Editor	Update category name, color, or description.
DELETE	/:id	Admin	Delete category. Only allowed if no articles are assigned to it.

5.6 Notifications  —  /api/notifications
Method	Path	Access	Description
GET	/	Auth	Get current user's notifications (paginated, newest first).
GET	/unread-count	Auth	Get count of unread notifications for bell badge.
POST	/:id/read	Auth	Mark single notification as read.
POST	/read-all	Auth	Mark all notifications as read.

5.7 Analytics  —  /api/analytics
Method	Path	Access	Description
GET	/summary	Admin/Editor/Publisher/Superadmin	Platform-wide stats: total articles, published today, drafts pending.
GET	/articles	Admin/Editor/Publisher	Per-article view counts.
GET	/authors	Admin/Editor	Per-author article count and publication rate.
POST	/articles/:id/view	Public	Increment article view count. Called by client website on page load.

5.8 eMagazine  —  /api/emagazine
Method	Path	Access	Description
POST	/upload	Admin	Upload PDF. Server converts pages to WebP and stores all assets.
GET	/	Auth	List all eMagazine issues for current client.
GET	/:id	Auth	Get eMagazine detail with all page image URLs.
DELETE	/:id	Admin	Delete eMagazine issue and all associated page images.

5.9 Search  —  /api/search
Method	Path	Access	Description
GET	/?q=keyword	Auth	Search articles by title, content excerpt, author name, or tag. Returns paginated results.

5.10 SMS  —  /api/sms
Method	Path	Access	Description
GET	/subscribers	Admin	List SMS subscribers for current client.
POST	/subscribers	Admin	Add subscriber manually.
DELETE	/subscribers/:id	Admin	Remove subscriber.
POST	/send-breaking	Publisher/Desk	Send breaking news SMS to all active subscribers for client. Triggered automatically when article is flagged breaking.

5.11 Public API  —  /api/public
These endpoints are unauthenticated but require a valid client API key in the X-API-Key request header. Used exclusively by client Next.js websites.
Method	Path	Description
GET	/articles	Fetch published articles for the client. Supports ?category, ?tag, ?limit, ?page, ?search.
GET	/articles/:slug	Fetch single published article by slug.
GET	/categories	Fetch all categories for the client.
GET	/emagazines	Fetch published eMagazine issues.
GET	/emagazines/:id/pages	Fetch all page image URLs for a specific eMagazine issue.

5.12 Pages  —  /api/pages
Method	Path	Access	Description
GET	/	Auth	List all static pages for current client.
POST	/	Admin	Create new static page.
GET	/:id	Admin	Get page content.
PUT	/:id	Admin	Update page content and publish status.
DELETE	/:id	Admin	Delete static page.
GET	/public/:slug	Public (API key)	Fetch published static page by slug — called by client Next.js website.

5.13 Superadmin  —  /api/superadmin
Method	Path	Description
GET	/clients	List all clients with stats.
POST	/clients	Create new client record.
GET	/clients/:id	Get full client detail and settings.
PUT	/clients/:id	Update client info, domain, API key.
POST	/clients/:id/deactivate	Deactivate client account.
GET	/clients/:id/impersonate	Get a short-lived admin token to enter a client's workspace.
GET	/clients/:id/onboarding	Get onboarding checklist status for a client.
PUT	/clients/:id/onboarding	Update onboarding checklist step as complete.


6. Roles & Features
6.1 Role Overview
Role	DB Name	Toggle	Description
Writer	writer	Always on	Writes and submits articles. Sees own work only.
Reporter	reporter	Always on	Same as Writer. Different display label for field reporters.
Traffic Desk	desk	Toggle (per client)	Manages submission queue. Assigns to editors. Can do light editing.
Editor	editor	Always on	Reviews assigned articles. Approves or rejects. Can edit directly.
Managing Editor	managing_editor	Toggle (per client)	Higher approval tier above Editor. Optional second clearance.
Editor in Chief	editor_in_chief	Toggle (per client)	Highest editorial authority. Optional final editorial clearance.
Publisher	publisher	Always on	Final publishing gate. Pushes articles live. Manages breaking news.
Admin	admin	Always on	Full client-level control. Users, categories, settings.
Superadmin	superadmin	Jai only	Cross-client. Manages all clients. 2FA required.

A user can hold multiple roles simultaneously. Example: Jai holds superadmin + admin + publisher for all clients. A senior journalist might hold both writer and editor.
Role display names (e.g. "Editor in Chief" vs "Managing Editor") are configurable per client in client_settings. The DB role name remains fixed.

6.1.1 Role Shortcodes (used in route guard and UI visibility logic)
Code	Role	DB Name	Who
SA	Superadmin	superadmin	Jai — cross-client, full system, 2FA required
AD	Admin	admin	Per-client admin (Sophia or client-appointed)
ME	Managing Editor	managing_editor / editor_in_chief	Editorial authority — approves and publishes
SE	Section Editor	editor	Manages one section/category
SW	Senior Writer	writer (can_publish ON)	Writes + can self-publish (if toggle enabled)
WR	Writer / Reporter	writer / reporter	Writes, submits for review
CO	Contributor	contributor	External/freelancer — own articles only
PH	Photographer	photographer	Media uploads and captions only
VI	Viewer / Intern	viewer	Read-only, no editing

6.1.2 Toggleable Permission Overrides (applied per user on top of role)
Toggle	What it unlocks
can_publish	Bypass review — user can publish directly without going through approval chain
can_sms_blast	User can trigger SMS breaking news blast
can_delete	User can hard-delete articles and media (default: soft-delete / archive only)

6.2 Writer / Reporter
Can Do	Cannot Do
Create new article (title, category, tags, cover image, body)	See other writers' articles
Save draft at any time — auto-save every 60 seconds	Change category after submission
Live word count and reading time while writing	Publish directly
Upload images directly inside the editor	Access admin, analytics, or any other role's views
Preview article as it will appear on the website	
Submit article for review	
View full status history of their articles	
Read feedback and rejection reason from editor	
Re-edit a rejected article and resubmit	
Duplicate an existing article as a new draft	
View their own in-app notification feed	
View article view counts after publication	

6.3 Traffic Desk
Can Do	Cannot Do
View all submitted articles in the queue	Approve or reject articles editorially
Light editing — fix typos, formatting, obvious errors	Access admin settings
Assign article to a specific editor	Publish articles
Change article category or priority before assignment	
Flag article as Breaking News (jumps to queue top)	
Add desk note to article (internal or visible to writer)	
View all editors and their current workload	
Return article to writer without assigning (incomplete/missing photos)	
Unassign and reassign articles	
View read-only copy of any article	
Archive articles from queue (spam, duplicates)	

6.4 Editor
Can Do	Cannot Do
View articles assigned to them	See articles not assigned to them
Read full article with all media and audit trail	Assign articles (that's the Desk role)
Leave feedback notes (internal or visible to writer)	Publish articles
Approve article (moves to next tier or Publisher)	
Reject with required reason (returns to writer as draft)	
Edit article directly (tracked in revision history)	
View revision history of an article	
Set article priority (Normal / High / Breaking)	
View analytics	

6.5 Managing Editor / Editor in Chief
Same capabilities as Editor, plus: higher approval authority. Their approval is required before Publisher can publish (when their role toggle is on). Can see all articles across all editors, not just assigned ones.

6.6 Publisher
Can Do	Cannot Do
View all approved articles awaiting publication	Edit article content directly
Review article before publishing	
Set publish date/time (immediate or scheduled)	
Add publisher note to article (visible to writer on request)	
Approve or reject article (send back with notes)	
Push article live to client website via Public API	
Set SEO fields: meta title, meta description, OG image, slug (auto-filled from article, editable)	
Flag article as Breaking News (triggers SMS)	
Unpublish a live article	
Archive published articles	
View all published articles and their live status	
View analytics	

6.7 Admin
●	Everything all roles can do (read-only on article content unless also assigned editor role)
●	Create, edit, and deactivate user accounts
●	Assign and remove roles from users
●	Reset user passwords
●	Manage categories (create, rename, reorder, delete)
●	Configure workflow: toggle Traffic Desk, Managing Editor, Editor in Chief on or off
●	Set display name for toggleable roles (e.g. rename "Editor in Chief" to "News Director")
●	View audit log of all admin actions
●	Manage SMS subscriber list
●	Upload eMagazine issues
●	View platform-wide analytics

6.8 Superadmin (Jai)
●	Full access to all clients — can enter any client workspace
●	Create and deactivate client records
●	Generate and rotate client API keys
●	View cross-client analytics and system health
●	Global system settings
●	2FA required on every login (TOTP authenticator app)

6.9 Article Audit Trail
Every article has a chronological log visible from the article detail screen. The log is permanent and cannot be edited or deleted.
Event	Visible to Writer	Example Entry
Article created	Yes	Created by Maria Santos on May 5, 2026 at 9:14am
Article edited	Yes (name only, not what changed)	Edited by Juan dela Cruz (Desk) on May 6, 2026 at 11:02am
Article submitted	Yes	Submitted for review by Maria Santos on May 6, 2026 at 2:30pm
Assigned to editor	No (internal)	Assigned to Ana Reyes (Editor) by Traffic Desk on May 6, 2026 at 3:00pm
Editor feedback (visible)	Yes	Note from Ana Reyes (Editor): Please add a quote from the barangay captain.
Editor feedback (internal)	No	Internal note: Article has potential, needs one more source.
Approved by editor	Yes	Approved by Ana Reyes (Editor) on May 7, 2026 at 10:15am
Approved by senior	Yes	Cleared by Ricardo Santos (Editor in Chief) on May 7, 2026 at 11:00am
Rejected	Yes	Returned to writer by Ana Reyes (Editor) on May 7, 2026. Reason: Missing official statement.
Published	Yes	Published by Carlo Mendoza (Publisher) on May 7, 2026 at 12:00pm
Publisher note	Yes (if flagged)	Note from Publisher: Great story. Held for front page tomorrow.
Archived	Yes	Archived by Admin on Nov 5, 2026


7. All Pages & Screens
7.1 Public (Unauthenticated)
Route	File	Status
/	Login.tsx	✓ Done

7.2 Shared Layout
Component	Description	Status
DashboardLayout.tsx	Sidebar + topbar shell. Role-aware nav. Notification bell. Real auth data.	✓ Done
ProtectedRoute.tsx	Redirects unauthenticated users to login.	✓ Done

7.3 Writer / Reporter
Route	File	Status
/dashboard	WriterDashboard.tsx	⚠ UI done, needs API wiring
/dashboard/articles	Articles.tsx	⚠ Stub — needs full implementation
/dashboard/articles/new	ArticleEditor.tsx	✗ Not started
/dashboard/articles/:id	ArticleEditor.tsx	✗ Not started
/dashboard/articles/:id/preview	ArticlePreview.tsx	✗ Not started
/dashboard/settings	Settings.tsx	⚠ Stub

7.4 Traffic Desk
Route	File	Status
/dashboard	DeskDashboard.tsx	✗ Not started
/dashboard/queue	ArticleQueue.tsx	✗ Not started
/dashboard/articles/:id	ArticleView.tsx (read + edit)	✗ Not started

7.5 Editor / Managing Editor / Editor in Chief
Route	File	Status
/dashboard	EditorDashboard.tsx	✗ Not started
/dashboard/assigned	AssignedArticles.tsx	✗ Not started
/dashboard/articles/:id/review	ArticleReview.tsx	✗ Not started

7.6 Publisher
Route	File	Status
/dashboard	PublisherDashboard.tsx	✗ Not started
/dashboard/approved	ApprovedQueue.tsx	✗ Not started
/dashboard/publish/:id	PublishArticle.tsx	✗ Not started
/dashboard/published	PublishedArticles.tsx	✗ Not started

7.7 Admin
Route	File	Status
/dashboard	AdminDashboard.tsx	✗ Not started
/dashboard/users	UserManagement.tsx	✗ Not started
/dashboard/users/new	UserForm.tsx	✗ Not started
/dashboard/users/:id	UserForm.tsx	✗ Not started
/dashboard/categories	CategoryManagement.tsx	✗ Not started
/dashboard/emagazine	EMagazineManagement.tsx	✗ Not started
/dashboard/sms	SMSSubscribers.tsx	✗ Not started
/dashboard/analytics	Analytics.tsx	⚠ Stub
/dashboard/settings	AdminSettings.tsx	✗ Not started
/dashboard/settings/workflow	WorkflowSettings.tsx	✗ Not started
/dashboard/pages	PageManagement.tsx	✗ Not started
/dashboard/pages/new	PageEditor.tsx	✗ Not started
/dashboard/pages/:id	PageEditor.tsx	✗ Not started

7.8 Superadmin
Route	File	Status
/superadmin	SuperadminDashboard.tsx	✗ Not started
/superadmin/clients	ClientList.tsx	✗ Not started
/superadmin/clients/new	ClientForm.tsx	✗ Not started
/superadmin/clients/:id	ClientDetail.tsx	✗ Not started
/superadmin/clients/:id/onboarding	OnboardingChecklist.tsx	✗ Not started

7.9 Shared Components to Build
Component	Description	Status
ArticleEditor.tsx	TipTap rich text editor: title, category, tags, cover image, word count, auto-save	✗ Not started
ArticlePreview.tsx	Renders article as it will appear on the client website	✗ Not started
RichTextViewer.tsx	Read-only rendered output from editor — used in review and preview screens	✗ Not started
ArticleStatusBadge.tsx	Colored badge for article status — extract from WriterDashboard	⚠ Inline, needs extraction
ArticleAuditTrail.tsx	Chronological log component shown on article detail	✗ Not started
NotificationDropdown.tsx	Bell icon with unread count + dropdown notification feed	✗ Not started
ImageUploader.tsx	Drag-and-drop image upload to DO Spaces — used in editor and media library	✗ Not started
MediaLibrary.tsx	Browse and reuse uploaded images. Modal or full page view.	✗ Not started
FeedbackThread.tsx	Article feedback/comment thread with visibility flag	✗ Not started
UserAvatar.tsx	User avatar with initials fallback	✗ Not started
ConfirmDialog.tsx	Reusable confirm modal for submit, publish, reject, delete	✗ Not started
ArticleLockBanner.tsx	Warning shown when article is locked by another user	✗ Not started
EmptyState.tsx	Consistent empty queue/list state with icon and message	✗ Not started
LoadingSkeleton.tsx	Consistent loading placeholder for lists and cards	✗ Not started
SchedulePublishModal.tsx	Date/time picker modal for scheduled publishing	✗ Not started
EMagazineViewer.tsx	Flip-book page viewer for eMagazines — embedded on client websites	✗ Not started

7.10 Role-Based Page Access Matrix
Every page lists which roles can access it and what each role can do. This is the authoritative reference for route guards and UI visibility rules.

/login
All roles — no auth required. After login, each role is redirected to their default landing page.

/dashboard
Role	What they see
SA	Cross-client summary: all clients, total articles, system health, uptime, server stats
AD	Client stats: published today, pending review, active writers, breaking news toggle
ME	Editorial queue: pending review, approved ready to publish, recent activity feed
SE	Section-specific: articles in their section only, pending in their section
SW	My articles: recent + assigned, word count stats, feedback received
WR	My articles: drafts, submitted, rejected with feedback
CO	My submissions only: draft, submitted, current status
PH	Recent uploads, storage used, pending caption requests
VI	Read-only news feed of published articles and announcements

/articles
PH and VI cannot access this page.
Role	Can see	Can do
SA	All articles, all clients	View, edit, delete, change status
AD	All articles in their client	View, edit, delete, change status, assign
ME	All articles in their client	View, edit, approve, reject, publish, assign
SE	Articles in their section only	View, edit, approve/reject within section
SW	All articles (read); own articles (edit)	Create, edit own, submit, view others read-only
WR	Own articles only	Create, edit own drafts, submit for review
CO	Own articles only	Create, edit own drafts, submit
Filters: SA/AD/ME see all filters (author, section, client, status, date). SE locked to their section. SW/WR/CO default to My Articles tab; can see all published read-only.

/articles/new  and  /articles/:id/edit
Role	Can edit	Can change status to
SA	Any article	Any status
AD	Any article in client	Any status
ME	Any article	Draft → In Review → Approved → Published → Rejected
SE	Articles in their section	Approve/reject within section; cannot publish
SW	Own articles	Draft → Submitted; if can_publish ON → can publish
WR	Own articles	Draft → Submitted only
CO	Own articles	Draft → Submitted only
Reference panel visibility: All writers see Transcription, Document, Scratch Pad. SE/ME/AD/SA additionally see Comments tab. CO can receive comments but cannot post.
Settings drawer visibility: SA/AD/ME — full access (status, publish date, category, tags, breaking, SMS, SEO, author assignment). SE — category (own section only), tags, status within section, SEO. SW/WR — category, tags, SEO; cannot change status directly. CO — category only.
Toolbar buttons by role: Publish button → SA, AD, ME, SW with can_publish ON. Approve → ME, SE (within section). Submit for Review → SW, WR, CO. Reject → ME, SE, AD. SMS Blast → SA, AD, ME with can_sms_blast ON.

/articles/:id/preview
All roles — read-only rendered view of article as it appears on the client website.

/media
VI cannot access.
Role	Can see	Can do
SA	All media, all clients	Upload, delete any, view CDN URLs
AD	All media in their client	Upload, delete any
ME	All media in their client	Upload, delete own
SE / SW / WR	All media	Upload, delete own
CO	Own uploads only	Upload, delete own
PH	All media	Upload, bulk upload, edit captions, edit alt text + credit, view EXIF data, delete own

/emagazine
WR, CO, PH have no access. SE, SW, VI can view the list and read published pages only.
Role	Can do
SA / AD	Upload PDF, trigger page conversion, set cover, publish/unpublish
ME	Upload PDF, trigger conversion, publish/unpublish
SE / SW / VI	View list and read published eMagazine pages
Subpages: /emagazine/upload (SA, AD, ME only). /emagazine/:id — page viewer (all with access).

/analytics
Role	Can see
SA	All clients, cross-client comparison, server-level stats
AD / ME	Their client only — full pageviews, top articles, author performance, category breakdown
SE	Their section only — section pageviews, top articles in section
SW / WR	Own articles only — views per article, read time
CO	Own articles only — basic view count
PH / VI	No access

/users
All roles below AD have no access.
Route	Access	Can do
/users	SA, AD	View all users; role badge, status, last login
/users/invite	SA, AD	Invite by email, assign role, assign section
/users/:id	SA, AD	Edit name, role, section; toggle can_publish / can_sms_blast / can_delete
AD can assign roles up to ME level only. SA can assign any role.

/categories
SA, AD, ME — full CRUD. SE — view only, can request changes. All others — no access.
Create/edit/delete categories and subcategories. Assign section editors to categories. Set category slug and description.

/pages  (Static Pages Manager)
SA, AD, ME only.
Create/edit/publish static pages: About, Contact, Privacy Policy, Terms. Rich text editor (same TipTap toolbar as articles). SEO fields per page. No editorial workflow — admin edits and publishes directly.

/breaking  (Breaking News & SMS Control)
SA, AD, ME + any user with can_sms_blast ON.
List active breaking news flags. Enable/disable breaking badge on any article. Compose and send SMS blast with subscriber count preview before sending. Daily blast count indicator (limit configurable, default 3/day). Monthly SMS spend tracker with 80% warning / 100% pause. SMS subscriber list (view only from this screen).

/notifications
All roles — personal notification inbox.
In-app notifications for: article assigned, article feedback, article approved/rejected, mentioned in comment. Mark read/unread. Mark all read. Click notification → navigates to relevant article or page.

/settings
Route	Access	Content
/settings/profile	All roles	Name, avatar, bio, password change
/settings/notifications	All roles	Toggle in-app notification types; toggle SMS alerts if subscribed
/settings/client	SA, AD	Client name, logo, publication URL, default category, API key management, GA4 measurement ID
/settings/seo	SA, AD, ME	Default meta title format, default OG image, canonical URL base
/settings/sms	SA, AD	Semaphore API key, sender name, daily blast limit, monthly budget cap, alert threshold
/settings/system	SA only	Server health, storage usage (DO Spaces), backup status and last run, UptimeRobot embed

/audit-log
SA, AD only. Read-only table: who, what, when, on which record. Filters: user, action type, date range. Cannot be edited or deleted.

/superadmin
SA only — not visible in nav for any other role.
All clients dashboard: plan status, active user count, article volume, storage used. Add/remove client. Client onboarding checklist. System-wide announcements (push to all CMS users). Force logout any user. Raw audit log across all clients.

7.11 Default Landing Page per Role
Role	After login →	Reason
SA	/superadmin	Needs cross-client overview first
AD	/dashboard	Client stats and activity
ME	/dashboard	Editorial queue
SE	/articles (filtered to their section)	Their primary daily task
SW	/dashboard (my articles view)	Track their own work
WR	/dashboard (my articles view)	Track their own work
CO	/articles (own only)	Single-purpose — submitting articles
PH	/media	Single-purpose — uploading media
VI	/dashboard (read-only feed)	Browse published content


8. Design System
The visual design of the CMS is to be decided. The following is a framework only — nothing is final until design direction is confirmed.

8.1 Brand (Locked)
Element	Value
Primary Navy	#0B1B2B
Gold Accent	#C9A84C
Text on Dark	#F5F0E8 (warm white)
Background	White / #FAFAFA
Logo Font	Playfair Display (serif) — for display/cover use
UI Font	Calibri or system-ui sans-serif

8.2 Component Library (Locked)
●	Tailwind CSS — utility-first styling
●	shadcn/ui — all primitive components already scaffolded (buttons, inputs, tables, modals, etc.)
●	Do not modify files in app/components/ui/ — these are managed by shadcn
●	Custom components go in app/components/common/ or app/components/[feature]/

8.3 Visual Direction (To Be Decided)
Option	Description
A — Dark sidebar, light content	Classic dashboard feel. Dark navy sidebar, white main panel. Most CMS tools look like this.
B — Fully light	White everywhere, minimal color. Clean, editorial. Looks like a news website.
C — Dark mode default	Full dark UI. Good for night shift journalists.
D — Light default + dark mode toggle	Best of both. More build time.

8.4 Rich Text Editor (TipTap)
Feature	Detail
Extensions	Heading (H1–H3), Bold, Italic, Strike, Link, Image, BulletList, OrderedList, Blockquote, HorizontalRule, History (undo/redo)
Toolbar	Fixed top or floating — to be decided with design
Image insertion	Triggers ImageUploader modal, uploads to DO Spaces, inserts CDN URL
Word count	Live count shown in editor footer
Reading time	Calculated from word count (avg 200 words/min), shown alongside word count
Auto-save	Every 60 seconds — silent PUT /api/articles/:id if article exists; localStorage fallback


9. Integrations
Service	Purpose	When Used
DigitalOcean Spaces	Cloud storage for all uploaded images and eMagazines	Every file upload in production
Semaphore (SMS)	Breaking news SMS alerts to subscriber list	When article is flagged Breaking News
UptimeRobot	External uptime monitoring — checks API every 5 minutes	Always-on in production
Public API Key (per client)	Authenticates client Next.js websites to fetch published articles	Every page load on client websites
pdf2pic / sharp + poppler	Converts uploaded eMagazine PDF pages to WebP images	On eMagazine upload
Google Analytics 4	Reader behavior tracking on each client public website — traffic sources, page views, session duration, device breakdown. Jai installs GA4 on each Next.js site and hands the account to the client.	Set up per client website at launch

9.1 Client Websites
Each client website is a separately built Next.js project with full custom design. They are not part of the main NewsDesk codebase. Both are built by Jai and billed under the one-time website development fee.
Client	Domain	Design	Codebase
OpinYon Media Advocacies Inc.	opinyon.net	Full custom — matches OpinYon brand	website-opinyon/ (separate repo)

The site pulls from the NewsDesk API using its unique API key. Content is separated by client_id. It is treated as a separate billable deliverable from the CMS.


10. File Storage & Media
10.1 Local Development
●	Images saved to server/uploads/ (not committed to git)
●	Served at http://localhost:4000/uploads/[filename]

10.2 Production (DigitalOcean Spaces)
Setting	Value
Bucket name	thenewsdesk-media
Region	sgp1 (Singapore)
CDN URL	https://thenewsdesk-media.sgp1.cdn.digitaloceanspaces.com
Access control	Article images: public-read. Backup bucket: private.
SDK	@aws-sdk/client-s3 (S3-compatible API)

10.3 Upload Rules
Rule	Detail
Allowed image types	image/jpeg, image/png, image/webp, image/gif
Max image size	10MB per file
eMagazine PDF max size	100MB
MIME validation	Server checks actual file headers — not just file extension
Rejected uploads	Return HTTP 400 with clear error message

10.4 eMagazine Processing
●	Admin uploads PDF via /api/emagazine/upload
●	Server uses pdf2pic (via poppler) to convert each page to a WebP image
●	All page images uploaded to DO Spaces under /emagazines/[id]/page-[n].webp
●	Original PDF also stored at /emagazines/[id]/original.pdf for download
●	Flip-book viewer on client website loads pages one at a time — fast even on mobile
●	Viewer is built as a reusable React component (EMagazineViewer.tsx) embedded on client sites


11. Notifications
11.1 In-App Notifications
All CMS events generate in-app notifications. Every role has a notification bell in the top bar showing unread count. Clicking opens a dropdown feed.
Event	Who Gets Notified	Visible to Writer
Writer submits article	Desk staff (or Editor if desk is off)	No
Desk assigns article to editor	Assigned editor	No
Desk returns article to writer	Writer	Yes
Editor leaves visible feedback	Writer	Yes
Editor approves article	Writer + next tier in chain	Yes
Editor rejects article	Writer	Yes — includes rejection reason
Senior editor approves	Writer + Publisher	Yes
Senior editor rejects	Writer	Yes
Publisher publishes article	Writer + Editor	Yes
Publisher rejects/sends back	Writer + Editor	Yes
Article flagged as Breaking News	All desk and publisher accounts	No
New user account created	That user (welcome notification)	N/A

11.2 Email Notifications
No email notifications in v1. All notifications are in-app only.

11.3 SMS Notifications (Semaphore)
Trigger	Recipients	Message Content
Article flagged as Breaking News	All active SMS subscribers for that client	BREAKING: [Article title] — Read more at [client domain]

●	Cost: approximately ₱0.50 per SMS via Semaphore Philippines
●	Sophia monitors monthly Semaphore usage report — billed back to client if volume exceeds agreed threshold
●	Subscribers opt in via a form on the client website or are added manually by admin

SMS Cost Controls (configured per client in Admin Settings)
Setting	Default	Description
Daily send limit	3 blasts/day	Maximum breaking news SMS blasts per day. Publisher gets a warning and must confirm before exceeding limit. Configurable by admin.
Monthly budget cap	Admin sets (in ₱)	When estimated monthly SMS cost reaches 80% of cap, Jai receives an alert. At 100%, SMS alerts are paused automatically until admin raises the limit.

11.4 PWA Push Notifications
The CMS is built as a Progressive Web App from the start. This enables:
●	Install to home screen on Android and iOS
●	Android: full push notification support — staff receive real-time alerts even when the app is not open
●	iOS: limited support (Safari 16.4+ required). In-app notifications remain the primary channel for iOS users.


12. Deployment
12.1 Server Setup
Component	Choice	Cost
Server	DigitalOcean Droplet — Ubuntu 22.04 LTS, 2GB RAM, 1 vCPU, Singapore (sgp1)	$12/month
Database	Self-hosted MySQL 8 on the same droplet	$0 (included in droplet)
Media Storage	DigitalOcean Spaces — thenewsdesk-media bucket	$5/month (250GB)
SSL Certificate	Let's Encrypt via Certbot — auto-renewing	Free
Domain	thenewsdesk.ph — registered on GoDaddy	₱1,000/year
SMS	Semaphore Philippines	₱0.50/SMS (pay-as-you-go)
Uptime Monitoring	UptimeRobot free tier	Free
Total Monthly		~$17/month (~₱1,000) at launch

12.2 Domain Structure
Domain	Purpose
thenewsdesk.ph	Brand/marketing website — deferred to end of 2026, alongside SEC registration, trademark, and public launch
app.thenewsdesk.ph	CMS application
status.thenewsdesk.ph	UptimeRobot public status page
support@thenewsdesk.ph	Support email (Google Workspace or Zoho Mail)
opinyon.net	OpinYon's public website (pointed to DO droplet or separate server)

12.3 Production Stack
●	Nginx: serves built React app (static files), proxies /api/* to Express on port 4000
●	pm2: keeps Express API running, auto-restart on crash, startup on server reboot
●	Let's Encrypt SSL on app.thenewsdesk.ph — Nginx enforces HTTPS redirect
●	UFW firewall: allow ports 22 (SSH), 80 (HTTP redirect), 443 (HTTPS) only
●	MySQL binds to 127.0.0.1 only — not publicly accessible

12.4 Automated Backups
What	How	When	Retention
MySQL database	mysqldump → gzip → upload to private DO Spaces bucket	Daily at 2:00am	7 daily + 4 weekly + 3 monthly
Uploaded files (media)	Sync server/uploads/ to private DO Spaces bucket	Daily at 3:00am	Same as above
Server snapshot	DigitalOcean Droplet Snapshot	Weekly	4 snapshots kept

12.5 Environment Variables
Stored in server/.env — never committed to git. Required variables:
Variable	Purpose
NODE_ENV	production
PORT	API port (4000)
DB_HOST / DB_USER / DB_PASSWORD / DB_NAME	MySQL connection
JWT_SECRET	64-character random string
COOKIE_SECRET	Separate 64-character random string
DO_SPACES_KEY / DO_SPACES_SECRET	DigitalOcean Spaces credentials
DO_SPACES_ENDPOINT	https://sgp1.digitaloceanspaces.com
DO_SPACES_BUCKET	thenewsdesk-media
SEMAPHORE_API_KEY	Semaphore SMS API key
TOTP_SECRET_SUPERADMIN	2FA secret for Jai's superadmin account


13. Maintenance & Support
13.1 Support Channels
Channel	Purpose	Managed By
Viber group (per client)	Day-to-day questions, fast issue reporting	Jai
support@thenewsdesk.ph	Formal issues requiring documentation and SLA	Jai + Sophia
Semaphore usage reports	Monthly SMS cost monitoring	Sophia

13.2 Response Commitments
Issue Type	Target Response	Target Resolution
CMS is down	Acknowledge within 30 minutes	Resolved within 1 hour
Feature is broken	Acknowledge same day	Fixed within 24 hours
How-to question	Answer within 2 business hours	N/A
Billing inquiry	Sophia responds within 1 business day	N/A

13.3 Update Policy
●	Bug fixes: deployed immediately without client notice
●	UI improvements: batched and deployed weekly
●	New features: monthly release, announced in client Viber group
●	Breaking changes: 1-week advance notice, client has option to delay


14. Security
14.1 Authentication & Session Security
Measure	Detail	Status
Password hashing	bcryptjs, 10 salt rounds	✓ Built
JWT in httpOnly cookie	JavaScript cannot access the token — protects against XSS	✓ Built
JWT expiry	24-hour access token	✓ Built
SameSite cookie	sameSite: strict — protects against CSRF	Confirm on deploy
2FA for Superadmin	TOTP authenticator app (Google Authenticator / Authy)	✗ To build
Rate limiting on login	express-rate-limit: max 10 attempts per 15 min per IP	✗ To build

14.2 API Security
Measure	Detail	Status
Role enforcement	Every API route checks role server-side — never trusted from client	✗ To implement per route
Input validation	express-validator on all POST/PUT body inputs	✗ To build
SQL injection prevention	Parameterized queries (? placeholders) throughout — maintain strictly	✓ In use
CORS locked to production domain	Only app.thenewsdesk.ph allowed in production	✗ To configure
Helmet.js	Sets X-Frame-Options, HSTS, CSP, and other security headers automatically	✗ To add
Public API key validation	Client websites must send valid X-API-Key header	✗ To build
Article ownership checks	Writers can only edit/submit their own articles — enforced in DB query	✗ To implement

14.3 File Upload Security
Measure	Detail
MIME type validation	Check actual file header bytes — not just file extension
File size limit	10MB images, 100MB eMagazines — enforced by multer before processing
Filename sanitization	Replace original filename with a UUID on server — never trust client filename
Uploads not publicly listed	DO Spaces bucket does not allow directory listing

14.4 Infrastructure Security
●	SSH key authentication only — root password login disabled
●	UFW firewall: only ports 22, 80, 443 open
●	MySQL binds to 127.0.0.1 — not accessible from outside the server
●	.env secrets never committed to git — .env in .gitignore
●	Secrets rotated immediately on any suspected breach
●	Audit log on all admin and superadmin actions — permanent, cannot be deleted


15. Testing Plan
15.1 Development Testing (Jai)
●	Manual test of every new feature before committing
●	Test with at least 3 different user accounts per feature (the roles involved)
●	Test on Chrome desktop + Chrome mobile (responsive layout)

15.2 UAT (Sophia)
●	Sophia goes through every new screen as a non-technical user
●	Reports anything confusing, broken, or unclear in the Viber support group
●	Jai fixes before moving to the next feature

15.3 Test Accounts (seed.js)
Username	Role(s)	Purpose
jai_super	superadmin	Full system access, 2FA enabled
jai_admin	admin	Client-level admin testing
sophia_pub	publisher	Publisher flow testing
editor1	editor	Article review testing
senior_ed	managing_editor	Senior approval testing
desk1	desk	Traffic Desk queue testing
writer1	writer	Article authoring testing
reporter1	reporter	Reporter flow testing

15.4 Regression Checklist (Before Every Deploy)
●	Login and logout work for all roles
●	Role-based navigation shows correct items per role
●	Writer can create, save draft, and submit an article
●	Desk can see submitted article, do light edit, and assign to editor
●	Editor can review, leave feedback, approve, and reject
●	Senior editor tier works when toggled on
●	Publisher can publish immediately and via scheduled date
●	Breaking news flag triggers SMS
●	Notifications appear for each status change
●	Image upload works and image appears in article
●	Article preview renders correctly
●	Article locking prevents simultaneous editing
●	Version history shows correct snapshots
●	Admin can create and deactivate a user
●	Global search returns correct results

15.5 Client Beta (June 16–30, 2026)
Two weeks before go-live, OpinYon uses the system with its staff. Jai monitors the Viber group for issues, which are fixed before July 1.

15.6 Production Smoke Test (After Every Deploy)
●	GET /api/health returns { status: "ok" }
●	Login page loads at app.thenewsdesk.ph
●	Login with test account succeeds
●	UptimeRobot shows no active alerts


16. Build Timeline
Today: May 5, 2026  |  Go-live: July 1, 2026  |  57 days

Week	Dates	Focus	Key Deliverables
Week 1–2	May 5–18	Core Backend	DB schema finalized (all tables). Article CRUD API. Auth routes complete. Status transition API (submit, assign, approve, reject, publish). Notifications API.
Week 3–4	May 19 – Jun 1	Role Dashboards & Editor	TipTap article editor with word count + auto-save. Article preview. All role dashboards (Writer, Desk, Editor, Publisher, Admin). Article locking. Version history. Global search.
Week 5	Jun 2–8	Media, eMagazine & Client Website	DO Spaces image upload. eMagazine PDF upload + WebP conversion. Flip-book viewer. OpinYon Next.js website. Public API with API key auth.
Week 6	Jun 9–15	Production & Security	DO droplet provisioned. Nginx + SSL configured. pm2 running. Backup script + cron deployed. Rate limiting, Helmet.js, input validation. 2FA for superadmin. Semaphore SMS integration.
Week 7–8	Jun 16–30	Beta & Fix	Client beta with OpinYon staff. Sophia UAT complete. All reported bugs fixed. Production DB seeded. Staff accounts created. Go-live checklist complete.
July 1, 2026		Go-Live	OpinYon live on the platform.


17. Post-Launch Phases
Phase	Timeline	Features
Phase 2	Aug–Sep 2026	Content migration tool (WordPress import), content calendar, WhatsApp/Viber article intake, print/PDF layout export, eMagazine print edition, full version restore (one-click)
Phase 3	Oct–Dec 2026	Grammar and style checker (LanguageTool API), social media scheduling (Meta + Twitter), SEO suggestions, research assistant (web search integration)
Phase 4	2027	Full analytics dashboard, broadcast ticker integration, multi-client SaaS mode (self-serve signup), mobile app (React Native)
End of 2026 Milestone	Dec 2026	The NewsDesk marketing website (thenewsdesk.ph), SEC registration as Stock Corporation (50/50), trademark application (Class 42 at IPOPHL — ₱3,240/class), full public commercial launch


Built by people who've worked inside a newsroom.
Jai Duena & Sophia Puracan  •  thenewsdesk.ph
