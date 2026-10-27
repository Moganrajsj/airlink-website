# Airlink AI — Deployment Guide

Target: **GoDaddy cPanel + Phusion Passenger** (Node.js app), MySQL 8.

Last updated: 27 October 2026

---

## 0. Before you deploy — two things that will bite you

1. **A local `.env.production` can silently poison a build.** The copy in the
   working tree is a template and contains
   `DATABASE_URL="mysql://user:password@localhost:3306/YOUR_DB_NAME"`. Next.js
   loads `.env.production` *before* `.env` during `next build`, so a build with
   that file present falls back to static data (you will see
   `Database connection failed, using static fallbacks`). It is **gitignored**
   and therefore never on the server — keep it that way, and delete it locally
   before any build that must hit the real database.
2. **Rotate the Groq API key** before going live if it has ever been pasted into
   a chat, ticket or commit. Keys must only ever exist in the hosting env panel.

---

## 1. Server-side environment variables

Set every one of these in **cPanel → Setup Node.js App → Environment variables**
(or the equivalent panel). Never commit real values.

### Required

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | `mysql://USER:PASS@HOST:3306/airlink_db` — URL-encode special characters in the password |
| `JWT_SECRET` | Long random string (≥ 32 chars). **No fallback exists in production**; a missing value makes admin auth fail closed. |
| `FORM_TOKEN_SECRET` | Separate random string for the form timing token |
| `IP_HASH_SALT` | Separate random string; changing it invalidates existing IP hashes |
| `APP_URL` | `https://www.srirambroadband.com` |
| `NODE_ENV` | `production` |

### AI (free Groq tier)

| Variable | Default | Notes |
| --- | --- | --- |
| `AI_API_KEY` *(or `GROQ_API_KEY`)* | — | Server-side only |
| `AI_BASE_URL` | `https://api.groq.com/openai/v1` | |
| `AI_MODEL` | `openai/gpt-oss-20b` | Primary model |
| `AI_MODEL_FALLBACKS` | `openai/gpt-oss-120b,qwen/qwen3.8-27b` | Tried in order on 429 |
| `AI_DAILY_LIMIT` | `150` | Assistant chat cap |
| `AI_SCORE_DAILY_LIMIT` | `150` | Lead-enrichment cap |
| `AI_LEAD_SCORING_ENABLED` | `true` | Set `false` to run heuristics only |
| `AI_ENRICH_MIN_SCORE` | `40` | Skip the model below this heuristic score |
| `AI_OBSERVATION_MODE` | `true` | AI never changes lead status while on |

### Mail

| Variable | Notes |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | GoDaddy: `smtpout.secureserver.net`, `465`, `true` |
| `SMTP_USER`, `SMTP_PASS` | Mailbox credentials |
| `SMTP_TLS_SERVERNAME` | `prod.sin2.secureserver.net` on GoDaddy — keeps certificate verification **on** while matching the cert name |
| `MAIL_FROM` | Envelope/from address |
| `MAIL_TO` | Default recipient fallback |
| `LEAD_NOTIFY_EMAILS` | Comma-separated new-lead alert recipients; falls back to `MAIL_TO` |

### Validation, abuse limits, retention

| Variable | Default |
| --- | --- |
| `LEAD_RATE_LIMIT_PER_HOUR` | `5` |
| `LEAD_PHONE_LIMIT_PER_DAY` | `3` |
| `LEAD_NAME_MIN` | `2` |
| `LEAD_NAME_MAX` | `80` |
| `LEAD_PII_RETENTION_DAYS` | `90` |
| `SECURITY_EVENT_RETENTION_DAYS` | `180` |
| `CRON_SECRET` | Random string; required if you schedule the retention job |
| `PRISMA_LOG_QUERIES` | unset (leave unset in production) |

---

## 2. Database

The hosting account **cannot create databases** (`GRANT ALL PRIVILEGES ON
airlink_db.*` only). Work against `airlink_db`.

```bash
# 1. Apply the additive pipeline migration (idempotent, safe to re-run)
npx prisma db execute --file prisma/sql/20261027_lead_pipeline.sql --schema prisma/schema.prisma

# 2. Regenerate the client
npx prisma generate

# 3. Confirm the schema is in place
npx prisma validate
```

The SQL file is UTF-8 **without BOM** and uses only `ADD COLUMN IF NOT EXISTS`
/ `CREATE TABLE IF NOT EXISTS` patterns, so re-running it is harmless.

> The dev server holds a lock on `query_engine-windows.dll.node`. Stop the
> process on port 3000 before running `prisma generate` on Windows.

---

## 3. Build and deploy

```bash
npm ci --include=dev
npm run build
```

> **`--include=dev` is not optional.** The cPanel Node.js App panel sets
> `NODE_ENV=production`, and npm treats that as `--omit=dev`. Without the flag
> `npm ci` installs ~115 packages instead of ~507, `tailwindcss` and `postcss`
> are never installed, and `next build` fails with `Cannot find module
> 'tailwindcss'`. `typescript`, `postcss`, `tailwindcss` and the Prisma CLI are
> all devDependencies, so they are build-time requirements.

`next.config.js` uses `output: "standalone"` and the app is started through
Passenger with `node app.js` (`npm start`). The standalone folder is **not**
used on this host — see §3.1.

On cPanel:

1. **Setup Node.js App** → create the application pointing at the project
   directory, startup file `app.js`, `NODE_ENV=production`.
   Pick **Node 20.9+** (22 LTS preferred); Next.js 16 will not run on older
   versions.
2. Add the environment variables from step 1.
3. Get the source onto the server — see §3.1 for the Git flow.
4. Run `npm ci --include=dev && npm run build` from the cPanel terminal.
5. Restart the application.

### 3.1 Pulling from GitHub (cPanel → Git™ Version Control)

`app.js` boots Next.js via `next({ dev: false })`, so a normal `next build` is
all the server needs. `output: "standalone"` is also set, but the Passenger
entry point does **not** use `.next/standalone`, so do not copy that folder
into place or point the app root at it.

**The repo is private**, so cPanel needs read access. Pick one:

- **Deploy key (read-only, recommended)** — cPanel → *SSH Access* → *Manage SSH
  Keys* → generate a key → *Authorize* it. Copy the **public** key into GitHub →
  repo → *Settings* → *Deploy keys* → *Add deploy key* (leave write access off).
  Use the SSH clone URL `git@github.com:Moganrajsj/airlink-broadband.git`.
- **Personal access token** — create a GitHub token with `repo` read scope and
  use `https://<TOKEN>@github.com/Moganrajsj/airlink-broadband.git` as the clone
  URL. The token is stored in cPanel's git config; rotate it if it ever leaks.

Steps:

1. cPanel → **Files → Git™ Version Control → Create**.
2. Clone URL as above. **Clone directory must be empty** — if the site already
   lives at `~/airlink`, clone to a fresh path (e.g. `~/airlink-app`) or back
   the old directory up and remove it first.
3. Branch: `main`. Create.
4. Open the repo → **Manage** → **Update from Remote**, then **Deploy HEAD
   Commit**. Confirm the HEAD commit shown matches the one you pushed.
5. In **Setup Node.js App**, set *Application root* to that clone directory,
   *Application startup file* to `app.js`, and add an `LSN`/`.htaccess` restart.
6. Terminal: `cd ~/airlink-app && npm ci && npm run build`, then **Restart** in
   the Node.js App panel.

Step 5 above in full:

```bash
cd ~/<clone-dir>
npm ci --include=dev   # NOT plain `npm ci` - see the note in §3
npm run build
```

Then press **Restart** in the Node.js App panel.

Notes specific to this repo:

- `node_modules`, `.next` and **every `.env*` file are gitignored**, so a fresh
  clone contains no secrets at all. All configuration must come from the
  *Setup Node.js App → Environment variables* panel. That is intended — do not
  copy a local `.env` into the clone.
- Consequently the `.env.production` trap in §0 cannot reach the server unless
  you upload it by hand. Don't.
- `npm ci` runs `postinstall: prisma generate`. This needs the Linux engine,
  which is already in `binaryTargets` (`rhel-openssl-3.0.x`,
  `debian-openssl-3.0.x`); no extra step is required.
- To update later: **Update from Remote** → **Deploy HEAD Commit** → `npm ci`
  (only when dependencies changed) → `npm run build` → **Restart**.
- To roll back: check out the previous commit in cPanel's Git UI, rebuild, and
  restart. The migration is additive (§6), so older code runs fine against the
  newer schema.

### Build sanity check

A healthy build ends with `✓ Compiled successfully` and an exit code of `0`,
listing these new routes among others:

```
ƒ /admin/intelligence
ƒ /admin/knowledge
ƒ /api/cron/retention
```

---

## 4. Scheduled retention job (required for the privacy policy to be true)

The policy states that abuse signals are removed after 90 days and security logs
after 180 days. That only happens if the job runs.

Create a **cPanel → Cron Jobs** entry (daily, off-peak):

```bash
curl -s -X POST https://www.srirambroadband.com/api/cron/retention \
  -H "Authorization: Bearer $CRON_SECRET"
```

Verify the first run:

```bash
curl -s https://www.srirambroadband.com/api/cron/retention \
  -H "Authorization: Bearer $CRON_SECRET"
```

A successful response looks like:

```json
{ "success": true, "result": { "piiScrubbed": 0, "rateLimitBuckets": 0, "securityEvents": 0, "windows": { "piiDays": 90, "securityEventDays": 180 } } }
```

`SecurityEvent` will contain one `retention_run` row per execution.

---

## 5. Post-deploy smoke test

1. Submit the contact form with a real number → success message, one admin
   email, lead appears at `/admin/leads` with a score and reasons.
2. Submit with `12345` → field error, no row created.
3. Submit with the browser's hidden honeypot filled → lead stored with
   `status = spam`, **no** admin email.
4. Submit the same number twice → second lead linked via `duplicateOfId`.
5. `/admin/intelligence` → counts match `/admin/leads` totals.
6. `/admin/knowledge` → add an entry, ask the assistant about it, confirm it is
   answered from the entry and not invented.
7. Ask the assistant for an address-level guarantee → it must ask for
   locality/PIN and decline to confirm.
8. `curl -I https://…/admin` → `x-robots-tag: noindex, nofollow`,
   `cache-control: no-store`, HSTS present.

---

## 6. Rollback

The migration is additive, so rolling back the **code** is safe: no column was
dropped or retyped and every new column is nullable or defaulted. The new tables
(`LeadEvent`, `RateLimitBucket`, `SecurityEvent`, `KnowledgeEntry`) can remain in
place unused.

If you must start the AI over, set `AI_LEAD_SCORING_ENABLED=false`; heuristics
continue and nothing breaks.

---

## 7. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `JWT_SECRET is not configured` | Missing env var in production (intentional fail-closed) |
| `Database connection failed, using static fallbacks` during build | `.env.production` placeholder overriding `.env` — section 0 |
| `Cannot find module 'tailwindcss'` during build | `npm ci` ran with `NODE_ENV=production` and skipped devDependencies — re-run `npm ci --include=dev` |
| `"next start" does not work with "output: standalone"` warning | Expected/benign on this host. `app.js` calls `next({ dev: false })` and serves fine; the standalone folder is unused. Verified: `/` → 200, `/admin/*` → 307, `/api/cron/retention` → 401 |
| Admin emails fail with a certificate name mismatch | Set `SMTP_TLS_SERVERNAME=prod.sin2.secureserver.net`; do **not** disable TLS verification |
| AI features silent | Quota exhausted (`AiUsage`) or `AI_LEAD_SCORING_ENABLED=false`; heuristics still work |
| `prisma generate` fails on Windows | Stop the dev server on port 3000 first |
| Multiple lockfile warning | Cosmetic; set `turbopack.root` if it becomes noisy |
