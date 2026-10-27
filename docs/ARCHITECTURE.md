# Airlink AI — Architecture

Last updated: 27 October 2026

This document describes what was actually built on top of the existing Airlink
website. It is a description of the running system, not a plan.

---

## 1. Stack and deployment shape

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.1.6 (App Router, React 19, TypeScript) |
| Rendering | Server Components + Server Actions; a few route handlers |
| Database | MySQL 8 via Prisma 6.6 (`@prisma/client`) |
| Styling | Tailwind CSS + framer-motion / GSAP (existing design untouched) |
| AI | Groq free tier through an OpenAI-compatible API |
| Mail | Nodemailer over authenticated SMTP (GoDaddy/cPanel) |
| Hosting | GoDaddy cPanel + Phusion Passenger (`output: "standalone"`) |

There is **one** database and **one** lead table. Nothing in this work created a
parallel lead store: every public form, every admin table and every metric reads
the same `Lead` rows.

---

## 2. Request flow for a public enquiry

```
Browser form (LeadCapturePopup / Coverage / Contact / AiAssistant)
   │  name, mobile, email, locality, PIN, interest, message
   │  + honeypot field (hidden)         + signed timing token
   ▼
createLead()  — src/app/actions/leads.ts        ["use server"]
   │
   ├─ 1. Honeypot check            (non-empty ⇒ deterministic abuse)
   ├─ 2. Rate limits               per hashed IP / per phone, DB-backed
   ├─ 3. validateLeadSubmission()  src/lib/lead-validation.ts
   │      ├─ validateName()        Unicode-aware, flags not rejects
   │      ├─ normalizeIndianMobile()  → format-valid only, never "verified"
   │      ├─ normalizeEmail()      optional
   │      ├─ normalizePincode()    optional; also inferred from locality
   │      ├─ verifyFormToken()     HMAC-signed render timestamp
   │      ├─ findRecentDuplicate() / findNameCityDuplicate()
   │      └─ assessBotRisk()       named signals, 0–100
   ├─ 4. Persist Lead              original + normalised + flags + signals
   │      status "spam" only for deterministic abuse; never deleted
   ├─ 5. LeadEvent("created")      append-only audit trail
   └─ 6. after(() => processNewLead(leadId))
          ├─ scoreAndSaveLead()   heuristics always; AI optional
          └─ sendLeadNotification() once per lead (skipped for spam)
```

A deterministic validation failure (bad phone, empty name, malformed email or
PIN) returns a field-level error and writes **nothing**. Everything that is
merely suspicious is stored and flagged.

### Why the browser cannot bypass this

* Fields are re-read server-side; the client payload is never trusted.
* `proxy.ts` protects `/admin/*` and `/api/admin/*` at the edge, but each admin
  server action **also** calls `requireAdminAction()` — defence in depth.
* Rate limits live in MySQL (`RateLimitBucket`), so they survive restarts and
  are shared across Passenger workers.

---

## 3. Validation and anti-spam modules

| File | Responsibility |
| --- | --- |
| `src/lib/validation/phone.ts` | Normalises `+91`, `0`, `0091`, spaces, dashes, brackets, dots to `+91XXXXXXXXXX`. Requires 10 digits starting 6–9. Result is *format-valid* only. |
| `src/lib/validation/name.ts` | Unicode letter/mark aware (`\p{L}\p{M}`), configurable `LEAD_NAME_MIN`/`LEAD_NAME_MAX`. Rejects only deterministic failures; flags `placeholder_name`, `keyboard_smash`, `contains_digits`, `repeated_characters`, `unexpected_characters`. |
| `src/lib/validation/email.ts` | Optional field; blank is valid. Domain lower-cased, length capped at 254. |
| `src/lib/validation/pincode.ts` | Optional; six digits, never leading zero. |
| `src/lib/anti-abuse/timing-token.ts` | HMAC-SHA256 signed issue timestamp. Detects missing, malformed, tampered, expired (>2 h) and future tokens; `isTooFast()` at <2.5 s. |
| `src/lib/anti-abuse/ip.ts` | `sha256(salt + ip)` truncated to 32 hex chars. Only hashes are stored. |
| `src/lib/anti-abuse/rate-limit.ts` | Fixed-window counters in `RateLimitBucket`. Defaults: 5 submissions/IP/hour, 3/phone/day. |
| `src/lib/anti-abuse/bot-risk.ts` | Pure scoring function. Every point is a named signal (`honeypot_filled`, `missing_form_token`, `submitted_too_fast`, `missing_user_agent`, `invalid_phone`, `link_in_message`, `duplicate_phone_xN`, `name_<flag>`). Only the honeypot is treated as deterministic abuse. |
| `src/lib/anti-abuse/duplicate.ts` | Finds recent same-phone and same-name-same-city leads. Duplicates are **linked** via `Lead.duplicateOfId`, never deleted or merged automatically. |
| `src/lib/lead-validation.ts` | Orchestrates the above and returns a single `ValidatedLead`. |

`validationStatus` is `suspicious` when any flag or signal exists, or when
`botRisk >= 40`; otherwise `valid`. `verificationStatus` can only ever be
`format_valid` or `unverified` today.

---

## 4. Scoring and classification

`src/lib/lead-scoring.ts` is deterministic, free and always runs. It returns a
0–100 score, a tier (`hot` ≥70, `warm` ≥40, `cold`), a list of human-readable
reasons, and it is stable for identical input.

`src/lib/lead-intelligence.ts` orchestrates persistence:

1. `scoreLead()` with coverage status, duplicate count and lead age.
2. Optional `enrichLead()` (`src/lib/ai-leads.ts`) — only when the daily quota
   allows, only on free models, with `AI_MODEL_FALLBACKS` in order. Phone and
   email are **excluded** from the prompt.
3. Classification (`qualified` / `contactable` / `needs_review` /
   `low_intent` / `spam`) with confidence `high`/`medium`/`low`, stored with
   reasons in `aiReasons`.
4. `LeadEvent` row (`scored_heuristic` or `scored_ai`).
5. Admin email, exactly once, unless the lead is spam or `botRisk >= 60`.

Quality (`qualityScore`) and abuse (`spamRisk`) are deliberately separate
columns. A high-value lead can also be a high-risk submission; the admin sees
both.

`AI_OBSERVATION_MODE` defaults to **on**: the AI enrichment is advisory and does
not alter status. Only deterministic abuse (honeypot, rate limit) sets
`status = "spam"`.

The AI is *not* trained by this system. It produces summaries and suggestions;
the organisation's outcomes are recorded in `LeadEvent` and `reviewOutcome`
where they can be measured, but no model weights are updated.

---

## 5. Assistant and knowledge base

* `src/lib/knowledge.ts` — 60-second in-process cache of **approved, active**
  `KnowledgeEntry` rows, plus keyword-scored retrieval for the current question.
* `src/lib/ai-knowledge.ts` — system prompt: answer only from the supplied
  entries, ask for locality/PIN before any serviceability statement, never
  confirm address-level availability, never invent prices/plans/promotions,
  never reveal admin data or other customers, escalate when unsure.
* `src/app/api/ai/assistant/route.ts` — public chat endpoint; passes only the
  last user message for retrieval and the retrieved entries as context.
* `src/app/actions/knowledge.ts` — admin CRUD, guarded, attributed via
  `updatedBy`. Changes are visible to the assistant within the cache TTL, with
  no redeploy.
* `/admin/knowledge` + `KnowledgeManager.tsx` — admin UI.

The assistant has no database write access, no admin credentials and no tool
that can read a lead.

---

## 6. Admin intelligence

* `src/lib/intelligence.ts` — builds `IntelligenceMetrics` from real SQL
  aggregates: total / valid / suspicious / invalid / format-valid / OTP-verified
  / qualified / serviceable / contacted / converted / spam, 30-day trends,
  outcome rates, and duplicate groups. Every rate is `null` when the
  denominator is zero rather than a fabricated percentage.
* It also contains a small intent router for business questions. Each intent
  maps to a fixed, parameterised Prisma query; the answer is rendered from the
  query result. **No number is ever produced by the language model.**
* `src/app/actions/intelligence.ts` — guarded actions for single review,
  bulk status update (with explicit confirmation in the UI), duplicate
  dismissal and business questions. Every mutation writes `LeadEvent` with the
  acting admin's email.
* `/admin/intelligence` renders four tabs: Overview, Lead review, Duplicates,
  Ask.

---

## 7. Data model additions

Additive only; no existing column was dropped or retyped. DDL lives in
`prisma/sql/20261027_lead_pipeline.sql` and is reflected in `prisma/schema.prisma`.

`Lead` gained:

* submission fidelity — `rawName`, `rawPhone`, `nameNormalized`,
  `phoneNormalized`
* validation — `validationStatus`, `validationFlags`, `verificationStatus`,
  `botRisk`, `botSignals`
* attribution — `campaign`
* privacy — `ipHash`, `userAgentHash`
* duplicates — `duplicateOfId`
* scoring — `qualityScore`, `spamRisk`, `classification`, `confidence`,
  `aiReasons` (plus the pre-existing `ai*` enrichment columns)
* review — `reviewOutcome`, `followUpOwner`, `lastContactAt`, `reviewedBy`,
  `reviewedAt`

New tables:

| Model | Purpose | Retention |
| --- | --- | --- |
| `LeadEvent` | Append-only audit/outcome trail per lead | Life of the lead record |
| `RateLimitBucket` | Fixed-window counters | Deleted after 24 h |
| `SecurityEvent` | Auth failures, rate-limit hits, retention runs (no PII) | 180 days |
| `KnowledgeEntry` | Admin-editable assistant answers | Until deleted by admin |

Indexes were added on `createdAt`, `phoneNormalized`, `validationStatus`,
`classification`, `aiScore`, `aiStatus`, and the lead-event/duplicate foreign
keys.

---

## 8. Retention and scheduled work

`src/lib/retention.ts` is invoked by `POST /api/cron/retention`, authorised by
a timing-safe `CRON_SECRET` bearer token or an admin session.

It:

* nulls `ipHash`/`userAgentHash` on leads older than `LEAD_PII_RETENTION_DAYS`
  (default 90) — the enquiry itself is kept;
* deletes `RateLimitBucket` rows older than 24 h;
* deletes `SecurityEvent` rows older than `SECURITY_EVENT_RETENTION_DAYS`
  (default 180);
* writes one `retention_run` security event.

It never deletes a `Lead` or a `LeadEvent`.

---

## 9. Security boundary summary

| Concern | Control |
| --- | --- |
| Admin page access | `proxy.ts` fail-closed on `/admin/*`, `/api/admin/*` |
| Admin action access | `requireAdminAction()` inside every action |
| Roles | `admin` (write) and `viewer` (read-only intelligence) |
| Secrets | Read from env only; never sent to the browser; no production JWT fallback |
| PII to AI | Name, city, PIN, company, interest, message only — never phone or email |
| PII at rest | IP/UA stored as salted hashes; scrubbed after 90 days |
| Logging | `SecurityEvent` carries no names, phones or emails |
| Headers | HSTS, nosniff, SAMEORIGIN, referrer policy, permissions policy; admin pages `noindex` + `no-store` |

See `docs/SECURITY.md` for the threat model.
