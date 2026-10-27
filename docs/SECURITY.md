# Airlink AI — Security and Privacy

Last updated: 27 October 2026

Scope: the lead pipeline, the public assistant, the admin intelligence panel, and
the supporting data stores added for them.

---

## 1. Threat model

| # | Threat | Realistic attacker | Impact if unmitigated |
| --- | --- | --- | --- |
| T1 | Spam / bot form flooding | Script kiddie, scraper | Sales queue flooded, quota burned |
| T2 | Lead-data scraping via admin | Credential stuffing, insider | PII disclosure |
| T3 | Prompt injection of the assistant | Any public user | Fake pricing/coverage, disclosure |
| T4 | Injection via form fields | Any public user | Stored XSS, DB error leakage |
| T5 | Credential theft from repo/logs | Accidental commit, log capture | Full DB or AI-key compromise |
| T6 | PII over-retention | Time, negligence | Privacy-policy breach |
| T7 | Unauthenticated admin API access | Direct request to action/route | Full lead access |
| T8 | Enumeration of customers via assistant | Any public user | Disclosure of other customers |

Out of scope for this release: DDoS at network level, a compromised hosting
account, and insider access with the DB password.

---

## 2. Authentication and authorisation

* **Session** — HS256 JWT in `admin_session`, 1-day expiry, signed with
  `JWT_SECRET`. There is **no fallback secret in production**: if
  `JWT_SECRET` is unset, token validation returns `null` and access is denied
  (`src/lib/auth/admin-session.ts`, `src/proxy.ts`).
* **Edge guard** — `proxy.ts` matches `/admin/:path*` and `/api/admin/:path*`,
  fails closed, returns JSON 401 for API paths and a redirect to `/auth` for
  pages. Only `/api/admin/login` and `/api/admin/logout` are public.
* **Per-action guard** — every admin server action calls
  `requireAdminAction()` itself. Middleware is treated as a convenience, not as
  the authorisation boundary. This matters because server actions are invoked
  by opaque IDs and should never rely on a page-level check.
* **Roles** — `admin` (all mutations) and `viewer` (read-only intelligence).
  `requireAdmin("admin")` throws `AdminAuthError` with status 403 for a viewer
  performing a mutation.
* **Login** — timing-safe comparison, generic error message for unknown email
  and wrong password alike, failures logged to `SecurityEvent`.

### Permission matrix

| Capability | viewer | admin |
| --- | --- | --- |
| View `/admin/intelligence` overview and lead table | ✅ | ✅ |
| Ask business questions (real-DB queries) | ✅ | ✅ |
| Review a lead / set outcome | ❌ | ✅ |
| Bulk status update | ❌ | ✅ |
| Manage knowledge base | ❌ | ✅ |
| Banners / CMS / media / social | ❌ | ✅ |
| Trigger retention job | ❌ | ✅ |

---

## 3. Input handling

* All validation is server-side (`src/lib/lead-validation.ts`); client-side
  attributes are cosmetic only.
* Validation failures return **safe, field-scoped messages** — no stack traces,
  no SQL, no internal identifiers.
* Prisma is used exclusively with parameterised queries; there is no raw SQL
  built from user input.
* String fields are length-capped (`MAX_MESSAGE` 2000, `MAX_INTEREST` 80,
  `MAX_CITY` 80, `MAX_SOURCE` 40) and trimmed before storage.
* File uploads (banners/media) derive the extension from the detected MIME type
  rather than the client filename; path traversal in the media API was fixed.
* React escapes rendered output, so stored values cannot inject script.

---

## 4. Anti-abuse design

| Layer | Behaviour | Rejection? |
| --- | --- | --- |
| Honeypot | Hidden field filled ⇒ `status = spam` | Yes (only deterministic) |
| Rate limit | 5/IP/hour, 3/phone/day (configurable) | Yes, with a plain message |
| Timing token | Missing / too fast / tampered / expired ⇒ signal | No |
| Bot risk | Signals summed to 0–100; ≥40 ⇒ `suspicious` | No |
| Duplicate link | Repeat number linked via `duplicateOfId` | No |
| Name flags | Interesting patterns flagged | No |

Suspicious submissions are **stored, flagged and reviewable**. Nothing is
silently deleted, and no AI judgement rejects a lead.

---

## 5. Data protection

### What is stored

| Data | Storage | Notes |
| --- | --- | --- |
| Original name / phone | `rawName`, `rawPhone` | Preserves exactly what was submitted |
| Normalised name / phone | `name`, `nameNormalized`, `phoneNormalized` | Used for matching and duplicate detection |
| Email | `email` | Optional; lower-cased domain |
| Locality / PIN / interest / message | `city`, `pincode`, `interest`, `message` | Business need |
| IP address | `ipHash` (salted SHA-256, 32 hex) | Never stored in clear |
| Browser identifier | `userAgentHash` (salted SHA-256) | Never stored in clear |
| Validation result | `validationStatus`, `validationFlags`, `verificationStatus`, `botRisk`, `botSignals` | Explainability |
| Scoring | `qualityScore`, `spamRisk`, `classification`, `confidence`, `aiReasons` | Explainability |
| Review history | `LeadEvent`, `reviewOutcome`, `reviewedBy`, `reviewedAt` | Append-only accountability |

Not collected: national ID numbers, payment data, address-level details, or
anything the form does not ask for.

### What the AI sees

Sent to the model provider: name, city, PIN code, company, service interest,
message, form source. **Not sent:** mobile number, email address, IP hash, user
agent, session token, admin data, other customers' data.

The lead text is wrapped in delimiters and the prompt instructs the model to
treat it as untrusted data, so a message such as "ignore your instructions" is
data, not an instruction.

### AI as a decision aid

`AI_OBSERVATION_MODE` is on by default. The LLM adds a summary, intent and
suggested next action; it does not set `status`, does not reject a lead, and
does not contact anyone. Deterministic abuse signals are the only automatic
rejections. The privacy policy states this in §3.

### Retention

| Data | Window | Mechanism |
| --- | --- | --- |
| `ipHash` / `userAgentHash` on old leads | 90 days (`LEAD_PII_RETENTION_DAYS`) | `runRetention()` |
| `RateLimitBucket` | 24 hours | `runRetention()` |
| `SecurityEvent` | 180 days (`SECURITY_EVENT_RETENTION_DAYS`) | `runRetention()` |
| Leads and lead events | Not auto-deleted | Manual review per policy |

The job is scheduled via cPanel cron hitting `/api/cron/retention` with a
timing-safe `CRON_SECRET` bearer token. If it is not scheduled, the retention
promise in the privacy policy is not met — see `docs/DEPLOYMENT.md` §4.

---

## 6. Secret management

* All secrets come from environment variables; none are hard-coded except
  explicitly dev-only fallbacks that **cannot** activate in production.
* `.env`, `.env.local` and `.env.production` are never served to the browser
  (Next.js only exposes `NEXT_PUBLIC_*`, and none of these secrets use it).
* `PRISMA_LOG_QUERIES` is off by default in production, preventing customer data
  from appearing in query logs.
* Structured responses never include credentials, connection strings or model
  keys — errors are reduced to a generic message before reaching the client.

### Required rotations

1. **Groq API key** — rotate if it has ever left the hosting env panel.
2. **`JWT_SECRET`** — rotating invalidates all admin sessions (expected).
3. **`IP_HASH_SALT`** — rotating breaks continuity of existing abuse hashes;
   acceptable because they expire in 90 days anyway.

---

## 7. Logging and auditability

* `LeadEvent` records every state transition with the acting admin's email:
  `created`, `duplicate_linked`, `spam_detected`, `scored_heuristic`,
  `scored_ai`, `reviewed`, `status_changed`, `duplicate_dismissed`,
  `retention_run`.
* `SecurityEvent` records authentication failures, rate-limit hits and
  retention runs. It carries **no names, phones, emails or raw IPs**.
* Audit rows are append-only in practice: the UI exposes no delete path, and
  retention never touches `LeadEvent`.

---

## 8. Transport and browser hardening

`next.config.js` sets on `/`:

* `X-Content-Type-Options: nosniff`
* `X-Frame-Options: SAMEORIGIN`
* `Referrer-Policy: strict-origin-when-cross-origin`
* `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
* `Strict-Transport-Security: max-age=31536000; includeSubDomains`

On `/admin/*`: `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`,
and `Content-Security-Policy: frame-ancestors 'self'`.

On `/api/admin/*`: `noindex` and `no-store`.

`poweredByHeader: false` removes the framework fingerprint.

---

## 9. Assistant safeguards

| Requirement | Implementation |
| --- | --- |
| Only approved, maintainable answers | `KnowledgeEntry.isActive` + admin CRUD; no code deploy needed |
| No invented prices/plans/coverage | System prompt restricts answers to supplied entries |
| Ask locality/PIN before serviceability | Prompt rule; refuses to confirm address-level service |
| No admin access | The route has no DB write path and no admin token |
| No other customers' data | Retrieval is limited to knowledge entries, never lead rows |
| Escalate when uncertain | Prompt instructs a hand-off to the contact form/phone |
| Prompt-injection resistance | Entries and user text are delimited as data |

---

## 10. Residual risks and accepted limitations

1. **Phone verification is format-only.** No OTP provider was integrated.
   `verificationStatus` never claims otherwise, and the UI reports OTP-verified
   as `0`. Numbers are therefore "format-valid", not "verified".
2. **CAPTCHA is deferred.** A configuration stub exists, but only layered
   heuristics are active. Determined bots that solve nothing but mimic a browser
   can still submit; the honeypot, timing and rate limits are the mitigation.
3. **No automated model retraining.** Outcome labels feed metrics, not weights.
   There is no claim that the AI "learns" from producing scores.
4. **Shared hosting.** Credential and OS-level isolation depend on the host;
   the application layer cannot compensate for a compromised cPanel account.
5. **The AI provider processes lead text.** This is disclosed in the privacy
   policy; a customer can ask for manual handling.
6. **Bulk actions are guarded but irreversible in effect** (status changes are
   audited, not versioned). The UI requires explicit confirmation; a mistaken
   bulk update must be corrected manually.
