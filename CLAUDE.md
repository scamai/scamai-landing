# CLAUDE.md

> **Product pivot in progress.** The landing site is moving from a marketing-only "AI trust platform" posture to a **tool-first consumer product**: drag an image, get a verdict in ~2 seconds, share the result. The newsletter CMS stays (now under `/blog/*`) as a content / GEO moat, and a new `/scan/[id]` page tree becomes the programmatic SEO engine that targets ScamAdviser-scale volume.

Any session working in this repo should read the whole file — most of it is strategy that directly constrains code decisions (free-tier math, SEO invariants, legal language).

---

## 1. Mission

Let any internet user verify, in under 3 seconds and without friction, whether an image is **AI-generated or manipulated** — then share that verdict publicly so the web grows more trustworthy over time.

**Target analog**: Have I Been Pwned (for breached passwords) — but for images.
**Volume target**: beat ScamAdviser (~15–25M visits/month per Similarweb).
**Moat**: in-house **ScamAI Eva V1.6** detection model (95% accuracy across 120+ deepfake / GenAI types), backed by published research at `/en/research`.

---

## 2. North-star metric & KPIs

- **North-star**: Weekly public scans completed (`/scan/[id]` pages created + visited).
- **Primary funnel**:
  `Landing → Scan #1 (anon) → Scan #2 (anon, gate warning) → Scan #3 → Google/Apple one-tap → Free tier → Paid`.
- **Key metrics** (all must be tracked — TTFR is currently missing, add it):
  - **TTFR** (Time To First Result) — from landing → verdict displayed. Target: **< 5s p95**.
  - **Anon → registered conversion %** at scan #3 gate.
  - **Registered → paid conversion %**.
  - **DAU / MAU ratio** — target 15%+ within 6 months (high for a trust tool; chat bots + trending feed do the heavy lifting).
  - **K-factor** (viral coefficient) via `/scan/[id]` Open Graph shares.
  - **SEO indexed pages count** — target 100K indexed within 12 months.

---

## 3. ICP & positioning

- **Primary ICP**: general public ("worried about the internet") — non-technical users encountering suspicious images on **WhatsApp / Messenger / Facebook / X / Telegram**. Emotional trigger moments include romance scams, grandparent scams, sextortion, viral misinformation, fake listings.
- **Positioning**: *generic utility hero* ("Verify any image — free, in 2 seconds") backed by *scenario-rich SEO landing pages* covering the specific moments (fake WhatsApp forwards, romance-scam photos, deepfake celebrities, viral misinfo). Do **not** pick a narrow vertical on the homepage — ScamAdviser-scale volume comes from being the Google of image trust, not from owning one niche.
- **Brand voice**: friendly-authoritative. Warmer than VirusTotal, more technical than Snopes. HIBP is the reference.
- **Honesty is a feature**: lead with "We catch ~95% of manipulated images. We'll tell you when we're uncertain." Overclaiming destroys trust in this category.

---

## 4. Tech stack

Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · TypeScript strict · next-intl · NextAuth v4 · Neon Postgres (`@neondatabase/serverless`) · shadcn/ui (admin). Deployed on Vercel (auto-deploy from `main`).

---

## 5. Commands

- `npm run dev` — dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type-check

---

## 6. Detection engine — ScamAI Eva V1.6

- **Name** (public-facing): ScamAI Eva V1.6
- **Claimed accuracy**: 95% overall across 120+ deepfake / GenAI generator types
- **Latency target**: ~2s end-to-end (upload → verdict)
- **Output per scan**:
  - Binary verdict (AI-manipulated / Likely real)
  - Confidence score (0–100%)
  - Per-region heatmap (paid / upgrade-gated)
  - Signal breakdown (face-swap vs fully synthetic vs edited region vs metadata-tampered)
- **Known limitations** (must be disclosed on site): not 100% accurate; newly released generator types lag detection; low-resolution / heavily-compressed images reduce confidence.
- **Research hub**: `/[locale]/research` (already live — `src/app/[locale]/research/{layout,page}.tsx`). Expand into `/research` index + `/research/[paper-slug]` detail pages — one URL per paper for maximum GEO / AI-search citation surface area.
- **Unit economics**: in-house serving is cheap enough to sustain ScamAdviser-scale free usage; the 2-scan anon gate is a **conversion lever, not a cost lever**.

---

## 7. Core product surfaces (target architecture)

| Surface | Purpose | Auth | Indexed? |
|---|---|---|---|
| `/` | Tool-first homepage — upload zone is the hero | None | Yes |
| `/scan/[id]` | Public scan result page (OG verdict card) | None | **Yes by default** (see §8 privacy disclosure) |
| `/pricing` | Consumer $9/mo tier | None | Yes |
| `/developers` | B2B API docs + pricing ($99 / $499 / Enterprise) | None | Yes |
| `/enterprise` | "Contact Sales" form for platforms (Meta, TikTok, dating apps) | None | Yes |
| `/research` + `/research/[paper-slug]` | Peer-reviewed papers, benchmarks — GEO citation magnet | None | Yes |
| `/blog/[slug]` | Former `/newsletter/[slug]` — 301 from old URLs | None | Yes |
| `/trending` | Public feed of today's most-scanned suspicious images | None | Yes |
| `/category/[type]` | Hub pages linking scans + articles (e.g. `/category/deepfake-scams`) | None | Yes |
| `/how-to/[task]` | Evergreen explainers (e.g. `/how-to-spot-a-deepfake`) | None | Yes |
| `/is-[subject]-ai-generated` | Topical trending-entity pages (celebrities, memes) — editorial | None | Yes |
| `/stats/[topic]` | Data-driven stats with `data-speakable` for AI search | None | Yes |
| `/compare/scamai-vs-[competitor]` | Comparison pages vs Hive / Sensity / AI-or-Not | None | Yes |
| `/embed` | Free "Verify with ScamAI" badge snippet | None | Yes |
| `/account` | User dashboard, scan history, billing | Required | No |
| `/admin/newsletter/*` | Existing CMS (see §17) | Google OAuth (allowlist) | No |

**Deferred to phase 2**: `/verify/[platform]/[handle]` social-profile pages (privacy / liability risk), Chrome extension, browser push, watchlist / reverse image monitoring.

---

## 8. Free tier & paywall mechanics

**Anonymous (no account):**
- **2 scans total** per unique visitor
- Gate counted via **cookie + IP + device fingerprint combo** (Cloudflare Turnstile + FingerprintJS pattern). Robust but not perfect — accept ~5% bypass.
- At scan #3: **Google / Apple One-Tap auth wall** — zero-friction signup, no password forms.

**Registered free:**
- **20 scans / month**, reset on the 1st.
- Public `/scan/[id]` pages by default (same as anon).
- No heatmap, no signal breakdown (paid features).
- No scan history export.

**Paid ($9/mo or $79/yr):**
- Unlimited scans
- No watermark on result pages
- Private scans by default (opt-in "Make public" toggle)
- Heatmap + full signal breakdown
- Scan history + PDF export

**Privacy disclosure (non-negotiable on upload zone):**
> "Your scan result page will be public at scam.ai/scan/[id]. Don't upload private or sensitive images. Registered users can make scans private."

Registered users must have a **one-click Unshare** on any scan they own — flips `is_public = false` and sends `410 Gone` so Google de-indexes cleanly.

---

## 9. Monetization (three revenue streams from day 1)

1. **Consumer subscription** — $9/mo or $79/yr (single tier; keep pricing page simple).
2. **B2B API** — `/developers`:
   - **Hobby**: free, 100 scans/month, watermarked, rate-limited. Seeds developer loyalty.
   - **Starter**: $99/mo, 10K scans.
   - **Growth**: $499/mo, 100K scans.
   - **Enterprise**: custom.
3. **Enterprise / platform licensing** — `/enterprise` Contact Sales form. Inbound is real even without a sales team.

**Ads are NOT in the model.** Display ads undermine the trust signal — we match ScamAdviser on volume but differentiate on "clean, ad-free, trustworthy."

**Embed badge (free)** — `<iframe>` / `<script>` snippet with three verdict states ("Verified Real" / "Likely AI-Manipulated" / "Couldn't Verify"). Every embed = backlink + brand impression + referral. Ship alongside `/developers`.

---

## 10. SEO / GEO invariants — DO NOT BREAK

The existing site has non-trivial SEO / GEO equity. The pivot must preserve or extend these, never regress them.

**Preserve:**
- All existing `/[locale]/newsletter/[slug]` URLs — **301-redirect to `/[locale]/blog/[slug]`** on launch day. Do not delete the old routes until GSC confirms the redirects are honored.
- `$2.6M funding` nav announcement (commit `cd72c2c`) — keep in nav; it's a trust signal.
- Authoritative citations + `data-speakable` attributes (commit `384f1ea`) — **expand** into the new homepage hero fact-section AND every `/stats/*` page.
- JSON-LD schema (commits `345575a`, `6c80d34`) — keep, and extend with `SoftwareApplication`, `Product`, `FAQPage`, `HowTo` schemas per page type.
- Next-intl `[locale]` architecture — **keep the scaffolding**; English-only at launch, re-enable additional locales once WhatsApp-bot markets (IN, BR, ID, NG) need them.

**Expand:**
- `/research` → hub + per-paper pages (one URL per paper = max GEO surface for AI engines that cite research pages disproportionately).
- `/scan/[id]` pages — programmatic at scale; target 100K+ indexed within 12 months.
- `/stats/*` — every stat has a numeric claim + source + `data-speakable` attribute.
- `/is-[subject]-ai-generated` — editorial topical pages tied to news cycles.

**Guard:**
- `/scan/[id]` low-quality-scan indexing risk — filter out blurred / duplicate / tiny images from the indexable set. Only public scans with minimum resolution + unique hash should get `<link rel="canonical">` + `index,follow`.
- Consumer scans default public, **but the upload zone must carry the privacy disclosure**. Missing disclosure = legal risk.
- Any new page type needs: `<title>`, `<meta description>`, OG tags, JSON-LD schema, breadcrumb, canonical, and a linking-from from a category or hub page.

**Audit / cleanup item (not urgent, flag for future work):**
Duplicate non-localized pages exist at `src/app/*` (root-level `/company`, `/contact`, `/products/*`, `/solutions`, `/security`, etc.) alongside the `[locale]` versions. Likely zombie routes — audit and either delete or redirect. Do not introduce more unlocalized routes.

---

## 11. Growth loops (DAU / MAU engines)

**Viral / distribution (ship in v1):**
- `/scan/[id]` pages with auto-generated **Open Graph verdict cards** — every share becomes a branded preview. Zero ongoing cost.
- Embed badge (see §9).
- **Chat bots**: WhatsApp + Telegram + Discord `@ScamAIbot` — users forward images, get verdict, bot replies with link to `/scan/[id]`. **This is likely bigger than the web product** in misinformation-heavy markets (IN, BR, ID, NG). Treat as a top-3 eng priority, not a nice-to-have.

**Retention (reuse existing infrastructure where possible):**
- Newsletter CMS stays — repurpose "Deepfake Weekly" into a trust/scam-alert newsletter auto-populated from top public scans of the week. This is a ~2–3 day lift, not greenfield.
- Weekly trending-deepfakes digest email → drives return visits to `/trending`.
- `/trending` public feed of top-scanned suspicious images. Makes the site feel alive even for daily visitors with no image to scan.

**Acquisition:**
- **SEO-first** (programmatic pages from §7 + §10).
- **One press moment** — bundle funding badge + research corpus + a specific out-detection of a Sora / Veo / Midjourney controversy into one week. Keep a "benchmark readout" ready to deploy the next time a major GenAI model ships or a viral deepfake hits news cycles.
- **Partnerships** — free API access for Snopes / PolitiFact / AFP / Reuters / Anti-Phishing Working Group in exchange for attribution + backlinks.

**Referrals:**
- Simple refer-a-friend → both parties get +N bonus scans that month.

**Deferred to phase 2:** Chrome extension, browser push notifications, user watchlist / reverse image monitoring, creator / paid acquisition (hold until CAC is measurable).

---

## 12. Auth & session

- **Admin** (unchanged): Google OAuth via next-auth v4, allowlist in `ALLOWED_ADMIN_EMAILS`. `validateSession()` in `src/lib/admin-auth.ts` is the single auth check for admin API routes.
- **End-users** (new): **Google One Tap + Apple Sign In**. Do NOT reuse the admin NextAuth flow for end users — use Google's dedicated One-Tap SDK for <200ms signup UX. Sessions stored in Postgres.
- **Never block a scan behind auth for the first 2 anon scans.** The 2-scan gate is the central conversion lever.

---

## 13. Database

Existing tables (keep):
- `newsletters` — id, edition, title, **slug**, date, reading_time, summary, content (JSONB), published, created_at
- `newsletter_articles` — id, newsletter_id (FK CASCADE), title, source, description, url, published_at, category

New tables (to add):
- `users` — id, email, provider (`google` | `apple`), plan (`free` | `paid`), stripe_customer_id, scans_this_month, created_at
- `scans` — id, slug (human-readable, e.g. `red-fox-a9f2`), image_hash, image_url, verdict, confidence, signals (JSONB), heatmap_url, is_public, user_id (nullable), anon_fingerprint, created_at, nsfw_flag, min_quality_passed
- `scan_events` — id, scan_id, type (`view`, `share`, `unshare`, `embed`), referrer, created_at
- `api_keys` — id, user_id, key_hash, tier, quota_monthly, created_at

All Neon Postgres via `@neondatabase/serverless`. Query functions live in `src/lib/db/*.ts` — one file per aggregate (`newsletters.ts`, `scans.ts`, `users.ts`, `apiKeys.ts`).

---

## 14. Project structure

```
src/
  app/
    [locale]/
      (site)/page.tsx          # NEW tool-first homepage (replaces current)
      scan/[id]/page.tsx       # NEW — public scan result page
      pricing/page.tsx         # existing, update content
      developers/page.tsx      # NEW — API pricing + docs
      enterprise/page.tsx      # NEW — Contact Sales
      research/{page,layout}.tsx          # EXISTING — keep
      research/[paper]/page.tsx           # NEW — per-paper
      blog/[slug]/page.tsx     # NEW — former /newsletter/[slug] (301 old → new)
      trending/page.tsx        # NEW — daily feed
      category/[type]/page.tsx # NEW — hub pages
      how-to/[task]/page.tsx   # NEW — evergreen explainers
      is-[subject]-ai-generated/page.tsx  # NEW — editorial trending
      stats/[topic]/page.tsx   # NEW — data pages (data-speakable)
      compare/scamai-vs-[x]/page.tsx      # NEW — competitor pages
      account/*                # NEW — user dashboard, billing, history
    admin/                     # EXISTING — unchanged
    api/
      scan/                    # NEW — POST /api/scan (upload + verdict)
      scan/[id]/               # NEW — share, unshare, public toggle
      auth/[...nextauth]/      # existing (admin only)
      admin/newsletter/        # existing
      developers/              # NEW — API key CRUD, usage stats
  components/
    scan/                      # NEW — UploadZone, VerdictCard, Heatmap, SignalList
    marketing/                 # NEW — shared hero, pricing cards, FAQ, schema helpers
    embed/                     # NEW — the embeddable badge HTML + OG card renderer
    newsletter/                # existing
    admin/                     # existing
    ui/                        # existing (shadcn)
  lib/
    detection/
      eva-client.ts            # NEW — talks to Eva V1.6 inference endpoint
      fingerprint.ts           # NEW — anon scan fingerprint (cookie+IP+FP combo)
    db/
      scans.ts                 # NEW
      users.ts                 # NEW
      apiKeys.ts               # NEW
      newsletters.ts           # existing
    seo/
      schema.ts                # NEW — JSON-LD builders per page type
      og.tsx                   # NEW — OG verdict-card image generator (next/og)
```

---

## 15. Brand voice & copy rules

- **Voice**: friendly, plainspoken, directly useful. HIBP > VirusTotal > Snopes on the warmth scale.
- **Never overclaim accuracy.** Always pair a verdict with a confidence % and a caveat when confidence < 85%.
- **Never promise 100%.** Always "likely AI-manipulated" / "likely real" — never "confirmed fake" / "guaranteed real."
- **Numbers are marketing.** Lead with specifics: *"95% accuracy across 120+ generator types — tested against Midjourney v6, FLUX, Sora, Veo, StyleGAN3, FaceSwap, DeepFaceLab, and 113 more."* Generic "high accuracy" reads as weak; AI engines quote specific lists verbatim.
- **Lead with usefulness, not mission.** The hero is the uploader; the "why we exist" copy moves below the fold or to `/about`.
- **Respect the user's time.** Every page should pass the "would a non-technical friend understand this in 10 seconds?" test.

---

## 16. Legal & accuracy claims

- **Allowed**: "likely AI-manipulated," "AI-detected signals," "provisional verdict," "Eva V1.6 model signals indicate X."
- **Avoid**: "confirmed fake," "guaranteed authentic," "100% accurate."
- Every claim on the homepage must be backed by a linked source in `/research` or `/stats/*`.
- The **"95% across 120+ types"** headline must carry a footnote / tooltip linking to the benchmark readout in `/research`.
- Privacy disclosure on upload zone is non-negotiable (§8).
- When legal counsel finalizes language, update this section and remove "assumed allowed / avoid" guidance.

---

## 17. Newsletter CMS operations guide (kept — just URL moved)

The admin CMS at `/admin/newsletter` is unchanged. Google OAuth login, Neon Postgres, JSONB content. What changes:

- **Public URL pattern**: old `/[locale]/newsletter/[slug]` → new `/[locale]/blog/[slug]`. The admin keeps its own path.
- **301 redirects** from all old newsletter URLs to new blog URLs at launch. Implement via `next.config.js` or middleware.
- **New use cases** for the CMS:
  - "Weekly Trending Scams" digest (auto-seeded draft from top public scans of the week — an editor reviews before publishing).
  - Editorial `/is-[subject]-ai-generated` pages authored through the same CMS as a new content type.

Newsletter data model, editor flows, batch operations, and API endpoints are unchanged. See the existing admin editor components under `src/components/admin/editor/*`.

---

## 18. Deployment

- **Hosting**: Vercel, auto-deploy from `main`.
- **Database**: Neon Postgres (pooler endpoint).
- **`NEXTAUTH_URL`**: `https://www.scam.ai` in prod (apex redirects to www).
- **Google OAuth callback**: `https://www.scam.ai/api/auth/callback/google`.
- **`DATABASE_URL`** must NOT include `channel_binding=require`.
- Keep `main` protected; PRs required even for small changes during the pivot — too easy to break an SEO invariant otherwise.

---

## 19. Environment variables

Existing:
```
DATABASE_URL            # Neon Postgres
NEWS_API_KEY            # NewsAPI.org
RESEND_API_KEY          # Email
GOOGLE_CLIENT_ID        # Google OAuth (admin)
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
ALLOWED_ADMIN_EMAILS
OLLAMA_BASE_URL         # optional local-dev only
```

To add (for the pivot):
```
EVA_INFERENCE_URL       # Eva V1.6 detection endpoint
EVA_INFERENCE_KEY       # auth to Eva
STRIPE_SECRET_KEY       # consumer + API billing
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_CONSUMER_MONTHLY
STRIPE_PRICE_CONSUMER_YEARLY
STRIPE_PRICE_API_STARTER
STRIPE_PRICE_API_GROWTH
APPLE_CLIENT_ID         # Apple Sign In (end-user)
APPLE_TEAM_ID
APPLE_KEY_ID
APPLE_PRIVATE_KEY
TURNSTILE_SITE_KEY      # Cloudflare for anon-gate
TURNSTILE_SECRET
FINGERPRINT_API_KEY     # FingerprintJS pro (anon-gate)
UPSTASH_REDIS_URL       # rate limiting
UPSTASH_REDIS_TOKEN
S3_BUCKET               # image + heatmap storage
S3_ACCESS_KEY
S3_SECRET_KEY
POSTHOG_KEY             # or Mixpanel / Amplitude — confirm which already wired
SLACK_SALES_WEBHOOK     # /enterprise form submissions
TELEGRAM_BOT_TOKEN      # phase 1.5
WHATSAPP_BUSINESS_TOKEN # phase 1.5
DISCORD_BOT_TOKEN       # phase 1.5
```

---

## 20. Analytics & key events

Existing tracking: present but inventory **not yet confirmed** — confirm whether GA4 / PostHog / Plausible / Mixpanel / Amplitude is wired, and consolidate to one primary source of truth.

**Must be instrumented (many are missing today):**

| Event | Trigger | Why |
|---|---|---|
| `ttfr_measured` | verdict rendered | north-star input; currently missing |
| `scan_started` | upload accepted | funnel top |
| `scan_completed` | verdict saved | funnel conversion |
| `scan_wall_hit` | 3rd anon scan attempted | primary reg pressure point |
| `auth_one_tap_shown` / `auth_one_tap_success` | reg funnel | drop-off debugging |
| `scan_shared` | share button clicked | virality / K-factor |
| `scan_embed_copied` | embed badge snippet copied | distribution |
| `paywall_shown` / `paywall_upgraded` | paid funnel | MRR input |
| `api_signup` / `api_key_created` | developers funnel | B2B funnel |
| `enterprise_form_submitted` | sales form | pipeline |
| `bot_forward_received` | chat-bot interaction | phase 1.5 |

---

## 21. Migration plan (phased)

**Phase 1 — Tool is the homepage (weeks 1–3):**
- New homepage with upload zone (drag/drop + paste + URL + chat prompt all on one screen).
- `/scan/[id]` public result page with OG verdict card.
- Anon 2-scan gate + Google/Apple One-Tap wall.
- `/pricing` consumer tier + Stripe checkout.
- 301 redirects from `/newsletter/*` to `/blog/*`.
- TTFR instrumented.
- Privacy disclosure on upload zone.

**Phase 1.5 — B2B + distribution (weeks 3–6):**
- `/developers` API page + self-serve API key dashboard.
- `/enterprise` Contact Sales form (webhooks to Slack).
- Embed badge + `/embed` snippet generator.
- `/research` expanded with per-paper pages.
- `/trending` feed.
- Category + how-to + stats pages scaffolded (at least 10 of each live).
- Weekly trending-deepfakes digest email (reusing newsletter CMS).

**Phase 2 — Growth surfaces (weeks 6–10):**
- WhatsApp / Telegram / Discord bots.
- `/compare/scamai-vs-*` competitor pages.
- `/is-[subject]-ai-generated` editorial pages (first 20).
- Refer-a-friend bonus-scan loop.

**Phase 3 — Deferred:**
- Chrome extension.
- Browser push notifications.
- Watchlist / reverse-image monitoring.
- `/verify/[platform]/[handle]` pages (subject to liability review).
- Paid acquisition (only once CAC is measurable).

---

## 22. Dev practices

- **TypeScript strict**; no `any` in merged code.
- **Server Components by default**; mark client components explicitly with `"use client"`. Interactive pieces (upload zone, heatmap viewer) are client islands.
- **Tailwind only** for styling; shadcn/ui for admin + account UI. No CSS modules, no styled-components.
- **next-intl `[locale]`** is the only locale scaffolding. Do not introduce unlocalized public routes. Audit & retire duplicate non-localized pages at `src/app/*` when touched.
- **SEO invariant**: every new public page needs `<title>`, `<meta description>`, OG tags, JSON-LD, canonical, breadcrumb, and at least one internal link from a hub page.
- **Commit discipline**: small commits with descriptive messages; see `git log` — the current voice is `"feat: ..."`, `"revert: ..."`, `"fix: ..."`.
- **Never touch SEO-equity pages casually** — `/en/research`, existing newsletter URLs, the $2.6M nav badge, `data-speakable` attributes. Changes to these must be called out in PR descriptions.
- **Never introduce ads.** Full stop. Trust category, no exceptions.

---

## 23. Open TBDs — confirm before shipping

- **Analytics source of truth**: which of GA4 / PostHog / Plausible / Mixpanel is the canonical tool? Consolidate before adding more events.
- **Legal language sign-off** on homepage accuracy claims and privacy disclosure copy (§15, §16).
- **Eva V1.6 inference endpoint**: hosting (Vercel function? dedicated GPU? Modal / Replicate / RunPod?) — drives latency and cost per scan.
- **S3 vs Vercel Blob vs R2** for image + heatmap storage.
- **Stripe tax / VAT** handling for global consumer subscriptions.
- **NSFW filter** for `/scan/[id]` public indexing — pre-Eva vision check or stack on top?
- **Timeline anchor**: does the launch want to be tied to a specific press moment (funding extension, research paper drop, viral deepfake cycle)?
- **Duplicate non-localized page cleanup** at `src/app/*` — audit and either delete or redirect.

---

## 24. Project context for reference

- Git user: `aptxaptx`
- Primary branch: `main` → Vercel auto-deploy
- Deployment URL: `https://www.scam.ai` (apex → www redirect)
- Investor context: **$2.6M raised** (visible in nav + OG image — don't accidentally remove).
- Today's working date: 2026-04-17.
- User email: dennisng@scam.ai.
