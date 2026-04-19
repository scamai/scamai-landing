# ScamAI Backend API & Architecture Map

> For the backend team. This maps every endpoint the landing frontend needs, what exists today, what's missing, and what the backend needs to support for each phase of the product pivot.

**Last updated:** 2026-04-19
**Frontend repo:** `scamai-landing` (Next.js 15, App Router)
**Database:** Neon Postgres (`@neondatabase/serverless`)
**Auth:** Google One-Tap JWT (end-user) + NextAuth v4 (admin only)

---

## Current Database Schema

```
users            — id, email, name, avatar_url, provider, plan, stripe_customer_id,
                   scans_this_month, scans_reset_at, created_at
scans            — id, slug, image_hash, image_url, source_url, verdict, confidence,
                   signals (JSONB), heatmap_url, is_public, nsfw_flag, min_quality_passed,
                   user_id (FK users), anon_fingerprint, ttfr_ms, model_version, created_at
scan_events      — id, scan_id (FK scans), type, referrer, created_at
feedback         — id, user_id (FK users), email, message, created_at
newsletters      — (existing CMS, unchanged)
newsletter_articles — (existing CMS, unchanged)
news_sources     — (existing CMS, unchanged)
api_keys         — id, user_id, key_hash, key_prefix, tier, quota_monthly,
                   usage_this_month, revoked_at, created_at
```

---

## Endpoint Map

### Legend

| Status | Meaning |
|--------|---------|
| LIVE | Working in production |
| STUB | Frontend calls it, backend returns mock/partial data |
| MISSING | Frontend needs it, backend route doesn't exist yet |
| PLANNED | Specified in CLAUDE.md, not yet built on either side |

---

### 1. Authentication

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| POST | `/api/auth/google-onetap` | LIVE | Verify Google JWT, upsert user, set session cookie |
| POST | `/api/auth/logout` | LIVE | Clear session cookie |
| GET | `/api/auth/me` | LIVE | Return current user from JWT cookie |
| GET | `/api/auth/[...nextauth]` | LIVE | Admin-only (Google OAuth via NextAuth v4) |

**Backend action needed:**
- `/api/auth/me` currently returns JWT payload only (no fresh DB read). It should also return `scans_this_month` from the DB so the frontend can enforce the 20-scan free-tier gate. Either:
  - (A) Add `scansThisMonth` to the JWT payload when creating session (stale until re-login), or
  - (B) Have `/api/auth/me` do a DB lookup by `userId` and return fresh `scans_this_month` (preferred, ~2ms with Neon)
- **Apple Sign In** (PLANNED, phase 1): needs a new `/api/auth/apple` route. Same pattern as google-onetap but verifying Apple's JWT. Env vars: `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`.
- **Monthly scan reset**: `scans_this_month` needs to reset to 0 when the calendar month changes. Options:
  - (A) Cron job that resets all users on the 1st (simplest)
  - (B) Check `scans_reset_at` on each scan and reset inline if month changed (no cron dependency)

---

### 2. Scan Detection

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| POST | `/api/scan/detect` | LIVE | Parallel AI-image + face-swap detection (returns verdict, no DB write) |
| POST | `/api/scan` | STUB | Full scan: detect + save to DB + return slug |
| GET | `/api/scan/[slug]` | STUB | Fetch public scan result by slug |
| PATCH | `/api/scan/[slug]` | STUB | Record events (view, share, unshare, embed) |

**How detection works today:**
```
Frontend (NewLanding.tsx)
  └─> POST /api/scan/detect (multipart file upload)
        ├─> api.scam.ai/api/defence/ai-image-detection/detect-file
        └─> api.scam.ai/api/defence/faceswap/upload-detect
        └─< Returns: { verdict, confidencePct, aiImage, faceSwap, latencyMs }
```

**Backend action needed:**

1. **`POST /api/scan/detect`** (adjust existing):
   - Currently does NOT save to DB or track usage. The frontend uses this for the landing page scanner.
   - Needs to: increment `users.scans_this_month` for logged-in users after a successful scan.
   - Needs to: track anonymous fingerprint scans for rate-limiting (currently only in `/api/scan`).

2. **`POST /api/scan`** (complete the stub):
   - The Eva inference client (`src/lib/detection/eva-client.ts`) has a stub fallback when `EVA_INFERENCE_URL` is not set. Wire this to the real Eva V1.6 endpoint.
   - Save scan result to `scans` table with proper slug generation.
   - Measure and record `ttfr_ms` (time to first result).
   - Return `shareUrl` for OG card sharing (`scam.ai/scan/{slug}`).

3. **`GET /api/scan/[slug]`** (complete):
   - Currently works but only returns raw DB fields.
   - Needs to serve the OG image / verdict card metadata for social sharing.
   - Should record a `view` event in `scan_events`.

4. **`PATCH /api/scan/[slug]`** (wire auth):
   - `unshare` action needs auth check (only scan owner can unshare).
   - When unshared: set `is_public = false`, return proper headers so Google de-indexes (`410 Gone` on the page).

5. **Scan quota enforcement** (NEW, server-side):
   - Anonymous: max 3 scans/day per fingerprint (cookie + IP + UA hash). Frontend enforces via localStorage but backend must also enforce.
   - Free registered: max 20 scans/month. Increment `scans_this_month` on each scan. Reject with 429 if exceeded.
   - Paid: unlimited.
   - Return remaining quota in scan response so frontend can update UI.

---

### 3. Payments (Stripe)

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| POST | `/api/stripe/checkout` | MISSING | Create Stripe Checkout session for consumer plan |
| POST | `/api/stripe/webhook` | MISSING | Handle Stripe events (subscription created/cancelled/updated) |
| GET | `/api/stripe/portal` | MISSING | Redirect to Stripe Customer Portal for billing management |

**Backend action needed:**

1. **`POST /api/stripe/checkout`** — Auth required. Creates a Stripe Checkout session for $9/mo or $79/yr consumer plan. Sets `success_url` and `cancel_url`. Returns `{ url }` for redirect.

2. **`POST /api/stripe/webhook`** — No auth (Stripe signature verification via `STRIPE_WEBHOOK_SECRET`). Handle events:
   - `checkout.session.completed` → set `users.plan = 'paid'`, store `stripe_customer_id`
   - `customer.subscription.deleted` → set `users.plan = 'free'`
   - `customer.subscription.updated` → update plan status
   - `invoice.payment_failed` → flag account, send email

3. **`GET /api/stripe/portal`** — Auth required. Creates Stripe billing portal session for the user's `stripe_customer_id`. Returns `{ url }`.

**Env vars needed:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_CONSUMER_MONTHLY`, `STRIPE_PRICE_CONSUMER_YEARLY`

---

### 4. User Account

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| GET | `/api/auth/me` | LIVE | Current user (needs scansThisMonth added) |
| GET | `/api/account/scans` | MISSING | Paginated scan history for logged-in user |
| DELETE | `/api/account` | MISSING | Delete account + all data (GDPR) |

**Backend action needed:**

1. **`GET /api/account/scans`** — Auth required. Returns paginated list of user's scans (slug, verdict, confidence, createdAt, isPublic). Query params: `?page=1&limit=20`.

2. **`DELETE /api/account`** — Auth required. Deletes user record, all their scans, scan_events, feedback, api_keys. Cancels Stripe subscription if active. Clears session cookie.

---

### 5. API Keys (B2B Developer Portal)

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| POST | `/api/developers/keys` | MISSING | Create new API key |
| GET | `/api/developers/keys` | MISSING | List user's API keys |
| DELETE | `/api/developers/keys/[id]` | MISSING | Revoke an API key |
| GET | `/api/developers/usage` | MISSING | Usage stats for current billing period |

**Phase 1.5** — not urgent for launch, but schema is ready (`api_keys` table exists).

**Backend action needed:**
- Generate API keys with format `sk_live_` + 32 random bytes (hex). Store only the SHA-256 hash. Return the raw key once on creation, never again.
- Rate limit by tier: hobby (5 req/min), starter (60 req/min), growth (300 req/min).
- Monthly usage tracking: increment `usage_this_month`, reset on the 1st.

---

### 6. Feedback & Leads

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| POST | `/api/feedback` | LIVE | User feedback (DB + optional Slack) |
| POST | `/api/enterprise-lead` | LIVE | Enterprise contact form (email + Slack) |
| POST | `/api/demo` | LIVE | Demo request form (email) |
| GET/POST | `/api/dataset-access` | LIVE | Research dataset download (rate-limited, token-based) |

**No backend changes needed.** These are all working. Optional: add `SLACK_FEEDBACK_WEBHOOK` env var if you want feedback piped to a Slack channel.

---

### 7. Content (Newsletter/Blog CMS)

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| GET/POST | `/api/admin/newsletter/*` | LIVE | Full CRUD for newsletter CMS |

**No backend changes needed.** Admin CMS is unchanged. The only frontend change is URL: `/newsletter/[slug]` → `/blog/[slug]` (301 redirects handled in Next.js middleware, not backend).

---

## Architecture Diagram

```
                         ┌──────────────────────────────────────────────────────┐
                         │                    FRONTEND                          │
                         │              (Next.js 15 on Vercel)                  │
                         └───────────┬──────────┬──────────┬───────────────────┘
                                     │          │          │
                    ┌────────────────┘          │          └────────────────┐
                    ▼                           ▼                          ▼
             ┌─────────────┐          ┌─────────────────┐         ┌──────────────┐
             │  Auth Flow  │          │   Scan Flow     │         │  Payments    │
             │             │          │                 │         │              │
             │ Google 1-Tap│          │ Upload image    │         │ Stripe       │
             │ Apple SignIn│          │ ──► /api/scan/  │         │ Checkout     │
             │ ──► JWT     │          │     detect      │         │ ──► Webhook  │
             │    cookie   │          │                 │         │    callback  │
             └──────┬──────┘          │ Calls 2 APIs:  │         └──────┬───────┘
                    │                 │ • ai-image-det  │                │
                    │                 │ • faceswap-det  │                │
                    ▼                 │                 │                ▼
             ┌─────────────┐         │ Returns verdict │         ┌──────────────┐
             │   Neon       │         │ + confidence    │         │   Stripe     │
             │  Postgres    │◄────────┴─────────────────┘         │   API        │
             │              │                                     └──────────────┘
             │ • users      │
             │ • scans      │         ┌─────────────────┐
             │ • scan_events│         │  External APIs  │
             │ • feedback   │         │                 │
             │ • api_keys   │         │ • ScamAI Eva    │
             │ • newsletters│         │   V1.6 (detect) │
             └──────────────┘         │ • Google JWKS   │
                                      │ • Resend (email)│
                                      │ • Slack webhooks│
                                      └─────────────────┘
```

---

## Data Flow: Scan Lifecycle

```
User drops image
    │
    ▼
POST /api/scan/detect  ←── multipart file (max 10MB)
    │
    ├──► api.scam.ai/ai-image-detection/detect-file   (parallel)
    ├──► api.scam.ai/faceswap/upload-detect            (parallel)
    │
    ▼
Frontend receives verdict + confidence
    │
    ├── If anonymous: check localStorage counter (3/day)
    ├── If free user: check scansThisMonth (20/month)  ←── NEEDS BACKEND SUPPORT
    └── If paid: unlimited
    │
    ▼
[MISSING] POST /api/scan  ←── save result to DB, get slug
    │
    ▼
/scan/[slug] page  ←── public, shareable, OG card
    │
    ▼
User shares on WhatsApp/X/Facebook  ←── branded verdict card in preview
```

---

## Priority Actions for Backend Team

### P0 — Required for launch (Phase 1)

| # | Task | Effort | Details |
|---|------|--------|---------|
| 1 | **Add `scansThisMonth` to `/api/auth/me`** | Small | DB lookup by userId, return `scans_this_month`. Frontend needs this to show upgrade gate. |
| 2 | **Scan quota enforcement on `/api/scan/detect`** | Medium | Increment `users.scans_this_month` for logged-in users. Reject 429 when quota exceeded. Return `{ remaining }` in response. |
| 3 | **Anonymous rate-limit on `/api/scan/detect`** | Medium | Track by fingerprint (cookie + IP + UA hash). Max 3/day. Currently only enforced client-side. |
| 4 | **Monthly scan reset** | Small | Either cron on 1st or inline check on `scans_reset_at`. |
| 5 | **Stripe checkout + webhook** | Medium | `/api/stripe/checkout`, `/api/stripe/webhook`, `/api/stripe/portal`. Updates `users.plan` on subscription events. |
| 6 | **Wire `/api/scan` to real Eva endpoint** | Small | Set `EVA_INFERENCE_URL` + `EVA_INFERENCE_KEY`. Currently falls back to deterministic stub. |

### P1 — Phase 1.5

| # | Task | Effort | Details |
|---|------|--------|---------|
| 7 | **`/api/account/scans`** | Small | Paginated scan history for user dashboard. |
| 8 | **API key CRUD** | Medium | `/api/developers/keys` — create, list, revoke. Schema exists. |
| 9 | **API key auth middleware** | Medium | Validate `Authorization: Bearer sk_live_...` on `/api/v1/scan`. Rate-limit by tier. |
| 10 | **Apple Sign In** | Small | `/api/auth/apple` — same pattern as google-onetap, Apple JWT verification. |

### P2 — Phase 2

| # | Task | Effort | Details |
|---|------|--------|---------|
| 11 | **Bot endpoints** | Large | WhatsApp/Telegram/Discord webhook receivers. Forward image → detect → reply with verdict + link. |
| 12 | **Account deletion** | Small | `DELETE /api/account` — cascade delete + Stripe cancel. |
| 13 | **Scan export** | Small | `GET /api/account/scans/export` — CSV/PDF of scan history (paid only). |

---

## Environment Variables Needed

```bash
# Already configured
DATABASE_URL              # Neon Postgres
GOOGLE_CLIENT_ID          # Google OAuth
NEXTAUTH_SECRET           # JWT signing
RESEND_API_KEY            # Email

# Need to add
STRIPE_SECRET_KEY         # Stripe payments
STRIPE_WEBHOOK_SECRET     # Stripe webhook verification
STRIPE_PRICE_CONSUMER_MONTHLY  # Price ID for $9/mo
STRIPE_PRICE_CONSUMER_YEARLY   # Price ID for $79/yr
EVA_INFERENCE_URL         # Eva V1.6 real endpoint (currently stubbed)
EVA_INFERENCE_KEY         # Eva auth token
SLACK_FEEDBACK_WEBHOOK    # Optional: feedback → Slack
APPLE_CLIENT_ID           # Phase 1.5: Apple Sign In
APPLE_TEAM_ID
APPLE_KEY_ID
APPLE_PRIVATE_KEY
```

---

## Notes

- **Two scan endpoints exist**: `/api/scan/detect` (lightweight, no DB, used by landing page) and `/api/scan` (full lifecycle with DB persistence). The backend team should decide whether to merge these or keep them separate. Recommendation: keep separate — `/detect` is the fast path for the landing page, `/scan` is for creating permanent shareable results.
- **Auth is JWT-only, no server sessions.** The session cookie contains the full user payload. If `scansThisMonth` is added to the JWT, it goes stale. Better to have `/api/auth/me` do a fresh DB read.
- **The `scan_events` table** is ready for analytics but nothing reads from it yet. Once the trending feed is built, it'll query `scan_events WHERE type = 'view' AND created_at > now() - interval '24h'` grouped by scan_id.
- **Image storage**: Currently using inline data URLs (base64 in the `image_url` column, max 4MB). This won't scale. Backend should switch to S3/R2/GCS upload and store the object URL instead. The `image_url` column is already TEXT so no schema change needed.
