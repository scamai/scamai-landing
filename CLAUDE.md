# CLAUDE.md

## Project Overview
ScamAI landing site + newsletter admin CMS. Built with Next.js 15 (App Router), React 19, Tailwind CSS 4, and TypeScript. Deployed on Vercel with Neon Postgres.

## Commands
- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — Type-check

## Project Structure
```
src/
  app/
    [locale]/        # i18n public pages (next-intl)
      newsletter/[id]/ # Public newsletter detail (supports slug or numeric ID)
    admin/           # Admin CMS (newsletter management)
      login/         # Google OAuth login page
      (authenticated)/ # Protected routes (session-gated layout)
        newsletter/    # Dashboard + editor pages
    api/
      auth/[...nextauth]/ # NextAuth Google OAuth
      admin/newsletter/   # Admin API routes (direct DB queries)
        [id]/content/     # PUT - save all newsletter content
        [id]/toggle-publish/ # POST - publish/unpublish
        [id]/summary/     # PUT - update executive summary
        import/           # POST - import from markdown file
  components/
    admin/           # Admin UI components (shadcn/ui)
      editor/        # Newsletter editor sub-components
        EditorHeader.tsx
        ExecutiveSummaryEditor.tsx
        TopArticlesEditor.tsx
        ArticleCard.tsx        # Reusable article edit form
        SectionsEditor.tsx
        SectionBlock.tsx       # Collapsible section with articles
        ConfirmDialog.tsx      # Reusable confirmation dialog
    newsletter/      # Public newsletter components
    new-site/        # Main site components
    ui/              # shadcn/ui components (button, card, input, etc.)
  lib/
    auth.ts          # NextAuth config (Google OAuth, allowed emails)
    admin-auth.ts    # Server-side session validation (used by API routes)
    utils.ts         # cn() utility (clsx + tailwind-merge)
    db/
      index.ts       # Neon Postgres connection (uses DATABASE_URL)
      newsletters.ts # All newsletter DB query functions
      schema.sql     # Postgres DDL (run once to create tables)
    newsletter/
      news-fetcher.ts          # Fetches articles from NewsAPI
      newsletter-generator.ts  # Generates newsletters with scoring/categorization
      index.ts                 # Barrel export
  messages/          # i18n translation files
  middleware.ts      # next-intl middleware
scripts/
  migrate-data.ts    # One-time SQLite → Neon Postgres migration
```

## Key Patterns
- **Auth**: Google OAuth via next-auth v4. Allowed emails configured in `ALLOWED_ADMIN_EMAILS` env var. `validateSession()` in `admin-auth.ts` is the single auth check used by all admin API routes.
- **Database**: Neon Postgres via `@neondatabase/serverless`. All queries in `src/lib/db/newsletters.ts`. Content stored as JSONB. Newsletters have a `slug` column for SEO-friendly URLs.
- **Newsletter generation**: `NewsFetcher` pulls from NewsAPI, `NewsletterGenerator` scores/categorizes/summarizes articles. Ollama optional (template fallback for production).
- **i18n**: next-intl with `[locale]` dynamic segment. Translations in `src/messages/`.
- **Styling**: Tailwind CSS 4 with `@tailwindcss/postcss`. Dark theme throughout. Admin uses shadcn/ui components (Button, Card, Input, Textarea, Dialog, Collapsible, etc.). CSS variables for shadcn defined in `globals.css`.
- **Admin API routes**: Direct Neon Postgres queries with `validateSession()` auth check. No separate backend needed.
- **Newsletter URLs**: Public newsletters use slug-based URLs (`/newsletter/deepfake-weekly`). Old numeric IDs still work as fallback.

## Deployment
- **Hosting**: Vercel (auto-deploys from `main` branch)
- **Database**: Neon Postgres (connection pooler endpoint)
- **Auth redirect URIs**: `https://scam.ai/api/auth/callback/google` (prod), `http://localhost:3000/api/auth/callback/google` (dev)

## Environment Variables
```
DATABASE_URL            # Neon Postgres connection string
NEWS_API_KEY            # NewsAPI.org key for article fetching
RESEND_API_KEY          # Email sending via Resend
GOOGLE_CLIENT_ID        # Google OAuth
GOOGLE_CLIENT_SECRET    # Google OAuth
NEXTAUTH_SECRET         # NextAuth session encryption
NEXTAUTH_URL            # Canonical URL (http://localhost:3000 dev, https://scam.ai prod)
ALLOWED_ADMIN_EMAILS    # Comma-separated list of authorized admin emails
OLLAMA_BASE_URL         # Optional: Ollama LLM for AI summaries (local dev only)
```

## Newsletter CMS Operations Guide

### How the CMS Works
The admin CMS is at `/admin/newsletter` (requires Google OAuth login). It manages newsletters stored in Neon Postgres with content as JSONB.

### Newsletter Data Structure
Each newsletter has:
- **Title** and **Date** (editable in the editor header)
- **Slug** (auto-generated from title, used for SEO-friendly public URLs)
- **Executive Summary** (main summary paragraph)
- **Top 3 Articles** (each with: title, URL, source, publishedAt, takeaway)
- **Sections** (categorized groups like "Security Breaches", "Technology & Tools", each containing articles with: title, URL, source, description)

### Creating a Newsletter
1. **Auto-generate**: Click "Generate Newsletter" on dashboard — fetches articles from NewsAPI, scores/categorizes them, creates a draft
2. **Import Markdown**: Click "Import MD" and upload a `.md` file with this format:
   ```markdown
   ---
   title: "Newsletter Title"
   edition: 10
   date: "February 23, 2026"
   summary: "One-line summary"
   readingTime: 5
   ---
   Executive summary paragraph here.

   ## Top Stories
   - [Article Title](https://url.com) - Source Name
     Takeaway or description text.

   ## Section Name
   - [Article Title](https://url.com) - Source Name
     Description text.
   ```

### Editing a Newsletter
1. Click "Edit" on any newsletter in the dashboard
2. Edit **title**, **date**, **executive summary** inline
3. Edit any **article field** (title, URL, source, takeaway/description)
4. **Add/remove articles** using the + and trash buttons
5. **Reorder articles** using the up/down arrows
6. **Add/remove/rename sections** — sections are collapsible
7. Click **"Save Changes"** (top right) to persist all edits at once
8. Changes are NOT saved until you click Save — the button shows "Save Changes" when there are unsaved edits

### Publishing
- Toggle publish/unpublish from the dashboard using the "Publish"/"Unpublish" button
- Published newsletters appear at `/[locale]/newsletter/[slug]`
- Draft newsletters are only visible in the admin

### Batch Operations
- Select multiple newsletters with checkboxes
- "Select All" checkbox in the table header
- "Delete Selected" button appears when items are selected

### API Endpoints (for programmatic access)
All require authenticated session (Google OAuth).
- `GET /api/admin/newsletter` — list all newsletters
- `POST /api/admin/newsletter` — auto-generate new newsletter
- `DELETE /api/admin/newsletter` — batch delete `{ ids: number[] }`
- `GET /api/admin/newsletter/[id]` — get newsletter detail
- `DELETE /api/admin/newsletter/[id]` — delete single newsletter
- `PUT /api/admin/newsletter/[id]/content` — save all content `{ executiveSummary, top3Articles, sections, title, date }`
- `POST /api/admin/newsletter/[id]/toggle-publish` — toggle publish status
- `POST /api/admin/newsletter/import` — import from markdown `{ markdown: string }`
- `GET /api/admin/newsletter/stats` — get total/published/drafts counts

### Database
- `newsletters` table: id, edition, title, slug, date, reading_time, summary, content (JSONB), published, created_at
- `newsletter_articles` table: id, newsletter_id (FK CASCADE), title, source, description, url, published_at, category
- Key functions in `src/lib/db/newsletters.ts`: `insertNewsletter()`, `updateContent()`, `updateMeta()`, `deleteNewsletter()`, `deleteNewsletters()`, `togglePublish()`, `getPublishedNewsletterBySlug()`

### Deployment
- Push to `main` triggers Vercel auto-deploy, or run `npx vercel --prod`
- `NEXTAUTH_URL` must be `https://www.scam.ai` on Vercel (domain redirects to www)
- Google OAuth callback: `https://www.scam.ai/api/auth/callback/google`
- `DATABASE_URL` must NOT include `channel_binding=require`

## Auto-Promoted Rules

- [2026-06-02] playground-ui (edge-case): When splitting a face gallery into "preset" vs "user upload" sections, verify which items truly belong to each — don't label real celebrity photos as "StyleGAN2 AI-generated" and don't lock famous-figure photos that should blend in as user uploads. Instead check the actual generation method (synthetic flag) before assigning section and lock status. [auto-promoted 2026-06-23]
- [2026-06-02] hero-mobile (edge-case): Desktop top-padding values (pt-[136px]) are wrong on mobile where nav is ~64px — always make pt responsive (e.g. pt-[88px] sm:pt-[128px]). Also audit pill/badge text length: anything >40 chars will wrap on 375px screens and must have a shorter mobile variant. [auto-promoted 2026-06-23]
- [2026-06-02] nav-breakpoint (edge-case): `md:` (768px) breakpoint for a full desktop nav bar with 5 items + search + 2 buttons causes overflow — always use `lg:` (1024px) as the desktop/mobile threshold for navigation. Verify total nav width at the breakpoint before committing. [auto-promoted 2026-06-23]
- [2026-06-02] admin-viewer (settings-disconnect): Don't build a web admin viewer unless explicitly asked — ask how the user wants to view collected data before building a UI for it. Internal dashboards add complexity that the user may not want. [auto-promoted 2026-06-23]
- [2026-06-02] branding-surface (edge-case): Use the brand that owns the surface — scam.ai for playground watermarks/share pages, not sub-brand Halo. Check which product the page belongs to before picking brand copy or domain references. [auto-promoted 2026-06-23]
- [2026-06-02] share-ux (edge-case): Never gate a share button on upload completion — the link is always instant (Loom pattern). Backend state (saving, processing) must never surface as user-facing copy. Share modal should always be ready at demo-end. [auto-promoted 2026-06-23]
- [2026-06-02] nextintl-root-layout (deploy-gap): Components in root layout (app/layout.tsx) must NOT use @/i18n/navigation — they render on ALL routes including ones outside [locale] without NextIntlClientProvider. Use next/link instead. [auto-promoted 2026-06-23]
- [2026-06-02] server-component-fetch (deploy-gap): Never fetch from own API in a server component — call DB/service directly. Self-referential fetch fails at build time on Vercel when the deployment isn't live yet. Use force-dynamic + client-side fetch instead. [auto-promoted 2026-06-23]
- [2026-06-02] share-pattern (edge-case): Confirm share UX before building — "share" can mean link-to-session-page OR screenshot-card. For live demos, screenshot card (client canvas → image download/Web Share) is usually correct. Building session-based URL infrastructure is wasted work without confirmation. [auto-promoted 2026-06-23]
- [2026-06-02] share-card-content (edge-case): A share card is marketing material — it needs headline, sub-copy, real product URLs, and a CTA. A bare screenshot with minimal text is not shareable. Ask what the card should say before designing the canvas layout. [auto-promoted 2026-06-23]
- [2026-06-02] camera-permission (edge-case): Cache camera grant state — after first getUserMedia success, skip the consent/permission UI on re-runs. Stop tracks between sessions for the camera indicator, but re-acquire without re-prompting. [auto-promoted 2026-06-23]
- [2026-06-02] image-share-reality (edge-case): Web pages CANNOT push an image to X/IG/WhatsApp programmatically — only Web Share API Level 2 (mobile native sheet) carries a file. Desktop must download the image (which has branding baked in). X intent URLs are text+link only, never image. Don't build "share to platform X" buttons that imply auto-posting an image. [auto-promoted 2026-06-23]
- [2026-06-02] cobrand-copy (edge-case): Keep partner co-branding minimal — `Scam AI · Qualcomm` one-liner, NOT "powered by"/"Running on" prefixes. Prefer the simplest possible lockup unless the user asks for more. [auto-promoted 2026-06-23]
- [2026-06-02] design-not-generate (edge-case): When asked for many design variants, hold the content constant (SAME face) so the user compares DESIGNS, and give each concept a genuinely different COMPOSITION (layout, hierarchy, type scale, negative space) — not one skeleton with swapped overlays. "为了生成而生成" (mechanical variation) gets rejected; real art direction is the ask. Also: if a feature is a stated core need (QR), design it INTO every card, don't bolt it onto a few. [auto-promoted 2026-06-23]
- [2026-06-03] share-card-goal (edge-case): Confirm the card's GOAL before adding product copy — "attract play" (challenge/odds/pull hooks) vs "explain product" (feature taglines) lead to opposite footers. User flipped from "introduce Halo" to "lure them to play"; when goal is virality, gamified challenge copy beats product explanation. Keep old version alongside new for A/B comparison instead of overwriting. [auto-promoted 2026-06-23]
- [2026-06-03] qr-destination (edge-case): Share-card QR routes to scam.ai HOMEPAGE (face-swap playground sits at the top there) — NOT scam.ai/halo. Halo = the detection product, footer-ad only. Map each CTA to the product surface it belongs to before wiring links (same lesson as branding-surface). [auto-promoted 2026-06-23]
- [2026-06-03] lockfile-manager (deploy-gap): This repo deploys on Vercel with pnpm + frozen-lockfile. ALWAYS add deps with `pnpm add` (or run `pnpm install --lockfile-only` after npm) and commit pnpm-lock.yaml — npm install alone breaks the deploy (ERR_PNPM_OUTDATED_LOCKFILE). Check which lockfile the CI uses before installing. [auto-promoted 2026-06-23]
- [2026-06-05] analytics-viz (edge-case): When visualizing analytics, ALWAYS show both unique users AND raw event counts (one user fires many events — 8 users ≠ 16 swaps, both true) — a users-only funnel makes previously-reported event counts look contradictory. Label every metric with its unit. [auto-promoted 2026-06-23]
