# Airlink AI — Test Report

Run date: **27 October 2026**
Environment: Windows, Node 20.x, Next.js 16.1.6, Prisma 6.6, MySQL 8 (remote
`airlink_db`).

Everything below is the output of a command that was actually run. No results
are illustrative or projected.

---

## 1. Summary

| Suite | Command | Files | Tests | Result |
| --- | --- | --- | --- | --- |
| Unit | `npm test` | 6 | 71 | ✅ 71 passed |
| Integration (real DB) | `npm run test:integration` | 1 | 8 | ✅ 8 passed |
| Type check | `npx tsc --noEmit` | — | — | ✅ no output (clean) |
| Lint (changed files) | `npx eslint <files>` | — | — | ✅ clean |
| Production build | `npm run build` | — | 36 routes | ✅ exit 0 |
| Runtime smoke test | `npm run dev` + HTTP probes | 5 endpoints | — | ✅ see §5 |

Production build routes that are new in this work:

```
ƒ /admin/intelligence
ƒ /admin/knowledge
ƒ /api/cron/retention
```

The build emits `Database connection failed, using static fallbacks` during
static generation because the repo's `.env.production` is still a template
pointing at `localhost`. That is a **build-environment issue**, documented in
`docs/DEPLOYMENT.md` §0, not a failure — the build exits `0` and uses the
existing static fallback data.

---

## 2. Unit tests — 71 passed

### `tests/unit/phone.test.ts` — 23 tests

* Normalises `9876543210`, `+91 98765 43210`, `+91-98765-43210`,
  `09876543210`, `0091 9876543210`, `919876543210`, `(98765) 43210`, and every
  allowed starting digit 6/7/8/9 to `+91XXXXXXXXXX`.
* Rejects empty/whitespace, a number starting 1 or 5, 9 and 11 digits, letters,
  and a trailing character — each with the correct user-facing reason.
* Preserves the raw submission (`+91 (98765) 43210`) untouched.
* Asserts the result has **no `verified` property** — format validity is never
  presented as verification.

Coverage of the required cases: valid phone formats ✅, invalid phones ✅,
original preserved ✅, "never call regex-valid verified" ✅.

### `tests/unit/name.test.ts` — 7 tests

* Trims and collapses whitespace while keeping `raw`.
* Accepts Tamil combining marks (`முருகேசன்`).
* Accepts `John O'Brien`, `Anne-Marie D'Souza`, `Dr. A. Kumar`,
  `J. R. R. Tolkien`.
* Rejects only deterministic failures: empty, whitespace, one character, 81
  characters, digits only.
* Configurable limits report `{ min: 2, max: 80 }`.
* Flags — without rejecting — `placeholder_name`, `keyboard_smash`,
  `contains_digits`, `repeated_characters`, `unexpected_characters`.
* Confirms a flagged lead is still valid and its original is preserved.

Coverage: suspicious names ✅, Unicode names ✅, flags-not-rejects ✅.

### `tests/unit/email-pincode.test.ts` — 16 tests

* Blank email/PIN is valid (both optional).
* Email domain lower-cased, local part untouched.
* Six malformed emails rejected with a reason.
* Over-long email rejected.
* PIN `600 001` → `600001`; `060001`, `60001`, `6000012`, `ABCDEF`, `12345`
  rejected.

### `tests/unit/timing-token.test.ts` — 7 tests

Round-trip, missing, malformed, tampered signature, expired, future-dated, and
`isTooFast()` boundaries at 2 499 / 2 500 ms.

### `tests/unit/bot-risk.test.ts` — 7 tests

* Genuine enquiry → score `0`, no signals, not deterministic abuse.
* Honeypot → `80`, `honeypot_filled`, deterministic abuse `true`.
* Scripted submission (no token, 400 ms, no UA, invalid phone, link) → `100`
  with five named signals, **not** deterministic abuse.
* Duplicate and name-flag penalties are capped at 30 each so a real repeat
  customer is never auto-rejected.
* Missing token is worth 25 and is only a signal.
* Score clamps to 100.
* Banding: `<40` low, `40–69` elevated, `≥70` high.

Coverage: bots ✅, duplicate subtlety ✅.

### `tests/unit/lead-scoring.test.ts` — 11 tests

* Complete in-area enquiry → `hot` (≥70) with reasons naming valid mobile,
  service area and buying intent.
* Deterministic for identical input.
* Invalid phone lowers the score but still yields a lead.
* "test / spam" wording penalises.
* Duplicate phone penalty is exactly −20; closed status is exactly −20.
* Missing coverage does **not** promise service.
* Score never leaves 0–100.
* Tier thresholds: `hot ≥70`, `warm ≥40`, else `cold`.
* `shouldEnrichWithAi()` defaults to the warm threshold and honours
  `AI_ENRICH_MIN_SCORE`.

---

## 3. Integration tests — 8 passed against the real database

`tests/integration/lead-intake.test.ts` executes the **real `createLead` server
action**, including rate limits, duplicate detection, validation and
persistence. Only request-scoped Next.js primitives are stubbed:
`headers()`, `revalidatePath()`, `after()`. The `after()` stub deliberately
prevents AI spend and admin email delivery.

Because the hosting account cannot create a second database
(`GRANT ALL PRIVILEGES ON airlink_db.*` only), the tests run against
production `airlink_db` and rely on strict data hygiene instead:

* phones `9000000101`–`9000000106`
* IPs `203.0.113.11`–`203.0.113.16` (TEST-NET-3)
* `source = "integration_test"`
* `afterAll` deletes only the lead IDs and rate-limit keys it created

### Results

| # | Test | Required case | Assertion highlights |
| --- | --- | --- | --- |
| 1 | stores a genuine enquiry with normalised contact data and the original submission | Genuine lead | `rawName`/`rawPhone` preserved, `mobile = 9000000101`, email domain lower-cased, PIN `636 701` → `636701`, `validationStatus = valid`, `verificationStatus = format_valid`, `status = new`, `duplicateOfId = null`, IP/UA hashes stored, `created` event written |
| 2 | rejects an invalid phone number before writing anything | Invalid phone | `success = false`, `field = "phone"`, and `Lead.count()` unchanged — nothing is written |
| 3 | stores a suspicious name as flagged, not rejected or marked spam | Suspicious name | Stored, `validationStatus = suspicious`, `status = new` (not spam), `botRisk` between 1 and 59, flags contain `name_keyboard_smash` |
| 4 | accepts a PIN code typed into the locality field and flags it for review | PIN in locality | `pincode = 636701` extracted, flag `pincode_in_locality_field` recorded |
| 5 | links a repeat number to the earlier lead instead of deleting it | Duplicates | `duplicateOfId` set and not self, `duplicate_phone*` signal present, `duplicate_linked` event written, both leads retained |
| 6 | stores a honeypot submission as spam without rejecting or emailing | Bots | Stored with `status = spam`, `validationStatus = suspicious`, `botRisk ≥ 80`, `spam_detected` event; `after()` stubbed so no email |
| 7 | scores a stored lead deterministically and explains the result | Scoring | `aiStatus = heuristic`, `enriched = false`, score 0–100 with reasons, `qualityScore`/`aiScore` persisted, `spamRisk = botRisk`, classification and confidence from the documented sets, `aiReasons` non-empty, re-scoring yields the identical score |
| 8 | reports counts that match direct queries | Metrics integrity | `total`, `spam`, `converted` equal direct `count()` results; 30 trend points; `valid + suspicious + invalid = total`; `phoneVerified = 0`; every rate within 0–1 |

### Database hygiene check after the run

```
{"integration_test_leads":0,"test_phone_leads":0,"rate_bucket_rows":0,"security_events":0,"total_leads":263}
```

The lead total is exactly the pre-test production count (263), confirming the
suite created and removed only its own rows.

---

## 4. Bug found and fixed during testing

The first integration run failed test 1 with
`expected 'valid' to be 'suspicious'`. Debugging showed the flag
`pincode_in_locality_field` on a lead that had supplied a **correct** PIN in the
dedicated field.

Root cause: `extractPincode()` returned the explicit PIN in the same shape as a
PIN inferred from the locality text, and the caller flagged any truthy result.

Fix (`src/lib/lead-validation.ts`): the helper now returns
`inferred: boolean`, and the flag is raised only when the PIN was parsed out of
the locality field. The explicit-PIN path is no longer flagged.

Regression coverage: integration test 1 (explicit PIN ⇒ `valid`) and test 4
(PIN in locality ⇒ flagged). The unit suite was unaffected.

This is a genuine false-positive fix, not a test adjustment: a real customer who
filled the form correctly would previously have been marked suspicious.

---

## 5. Runtime smoke test (dev server, production database)

| Probe | Result |
| --- | --- |
| `GET /` | `200` — site renders |
| `GET /admin/intelligence` (no session) | `307 → /auth`, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store` |
| `GET /admin/knowledge` (no session) | `307 → /auth`, same hardening headers |
| `POST /api/cron/retention` (no credentials) | `401` |
| `GET /api/admin/social` (no session) | `401`, `noindex`, `no-store` |
| `POST /api/ai/assistant` | `200`, streamed answer |

### Assistant behaviour checks (live Groq calls)

1. **“Can you guarantee a connection at my exact address in Chennai today?”**
   → *“I’m sorry, but I can’t guarantee a connection at a specific address
   today. Only our local team can confirm serviceability after checking the
   exact location. Could you share your locality and PIN code…”*
   No guarantee, no address-level confirmation, asks for locality/PIN, offers
   the human handoff. ✅

2. **“What is your cheapest plan and is it available in Dharmapuri?”**
   → *“The cheapest plan is the 40 Mbps – Rs. 499/month. It’s available in
   Dharmapuri…”* followed by two plans.
   The price and the city status are both real database values (`Plan` 40 Mbps /
   ₹499, `Coverage` Dharmapuri = `Live`), confirmed by direct query. ✅

3. **“Do you provide broadband in Salem? I want it installed tomorrow.”**
   → *“Salem is listed as ‘Coming Soon,’ so we don’t have coverage there yet.”*
   `Coverage` Salem = `Coming Soon`; the assistant declined to claim coverage
   and made no installation commitment. ✅

### Prompt defects found and fixed during the smoke test

The first live reply said it would *“check availability for your exact
address”* and repeated a 24-hour installation claim as if guaranteed. That
contradicted the serviceability rules.

Fixes in `src/lib/ai-knowledge.ts`:

* coverage context now renders `City: Status` (previously
  `City (database status: …)`, which could be echoed to a customer);
* the prompt now states that SERVICE AREAS are **cities, not addresses**, that
  the assistant must never promise to check an address itself, and that only the
  local team confirms serviceability;
* added an explicit refusal rule for guarantee questions;
* added a status rule: only `Live`/`Active`/`Available`/`Covered`/`Serviceable`
  mean covered; `Coming Soon` must never be described as available;
* installation/free-installation copy is labelled as a published offer that may
  change and is never a guarantee;
* the assistant must ask for locality/PIN before recommending plans or
  discussing serviceability.

All three behaviours above were re-tested after the fix.

> **Operational note:** the `KnowledgeEntry` table currently contains **0**
> rows. Plans and coverage are answered from the database, but FAQ-level
> questions will fall back to a human handoff until an admin adds approved
> answers at `/admin/knowledge`. This is expected, not a defect.

---

## 6. Required test-report cases — mapping

| Required case | Covered by |
| --- | --- |
| Valid phone | unit `phone` (11 normalisation cases) + integration 1 |
| Invalid phone | unit `phone` (9 rejections) + integration 2 (nothing written) |
| Suspicious names | unit `name` (5 flags) + integration 3 (stored, not spam) |
| Duplicates | unit `bot-risk` (capped penalty) + integration 5 (linked, not deleted) |
| Bots | unit `bot-risk` (7) + integration 6 (spam, no email) |
| Genuine leads | unit `lead-scoring` (hot lead) + integration 1 (full persistence) |
| Deterministic scoring | unit `lead-scoring` + integration 7 (re-score identical) |
| Metrics from real DB only | integration 8 (counts equal direct queries) |

---

## 7. What is **not** covered (and why)

| Gap | Reason | Mitigation |
| --- | --- | --- |
| OTP verification | No SMS provider integrated | `verificationStatus` only ever `format_valid`; UI reports 0 verified |
| CAPTCHA | Deferred by decision; config stub only | Honeypot + timing token + rate limits + heuristic risk |
| End-to-end browser tests | No Playwright/Cypress in the repo | Server actions exercised directly; UI is a thin layer over them |
| Admin UI click-through automation | Same | Permission checks verified by code review; actions re-guard server-side |
| AI model responses | Nondeterministic and quota-limited | Model calls stubbed in tests; heuristics cover the decision path |
| Load/performance testing | Out of scope for this release | Rate limits bound abuse traffic |
| Retention job execution | Would delete real production rows | `runRetention()` is additive-safe and idempotent; verify after scheduling |

---

## 8. How to reproduce

```bash
npm ci
npm test                                   # 71 unit tests
npm run test:integration                   # 8 tests against .env database
npx tsc --noEmit
npx eslint src tests
npm run build
```

Integration tests write to the database in `.env`. Run them against a
non-production database if one becomes available; until then the reserved phone
ranges and `source = "integration_test"` tag make the created rows identifiable,
and `afterAll` removes them.
