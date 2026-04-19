CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  edition INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT,
  date TEXT NOT NULL,
  reading_time INTEGER,
  summary TEXT,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS newsletter_articles (
  id SERIAL PRIMARY KEY,
  newsletter_id INTEGER NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source TEXT,
  description TEXT,
  url TEXT,
  published_at TIMESTAMPTZ,
  category TEXT
);

CREATE INDEX IF NOT EXISTS idx_newsletters_published ON newsletters(published);
CREATE INDEX IF NOT EXISTS idx_newsletters_edition ON newsletters(edition DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_slug ON newsletters(slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_articles_newsletter_id ON newsletter_articles(newsletter_id);

CREATE TABLE IF NOT EXISTS news_sources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'rss',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Add slug column to existing tables
-- ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS slug TEXT;
-- CREATE INDEX IF NOT EXISTS idx_newsletters_slug ON newsletters(slug);
-- UPDATE newsletters SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) WHERE slug IS NULL;

-- =============================================================
-- Tool-first pivot: users, scans, scan_events, api_keys
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'google',           -- 'google' | 'apple' | 'magic'
  plan TEXT NOT NULL DEFAULT 'free',                 -- 'free' | 'paid'
  stripe_customer_id TEXT,
  scans_this_month INTEGER NOT NULL DEFAULT 0,
  scans_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,                         -- human-readable, e.g. red-fox-a9f2
  image_hash TEXT NOT NULL,                          -- SHA-256 of the bytes
  image_url TEXT,                                    -- public URL (S3 / Vercel Blob / data-uri for stub)
  source_url TEXT,                                   -- if scanned via URL paste
  verdict TEXT NOT NULL,                             -- 'likely_ai_manipulated' | 'likely_real' | 'uncertain'
  confidence NUMERIC(5,2) NOT NULL,                  -- 0.00 – 100.00
  signals JSONB NOT NULL DEFAULT '{}'::jsonb,        -- model-specific breakdown
  heatmap_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  nsfw_flag BOOLEAN NOT NULL DEFAULT FALSE,
  min_quality_passed BOOLEAN NOT NULL DEFAULT TRUE,  -- false → noindex
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  anon_fingerprint TEXT,                             -- hash of cookie+ip+ua for anon rate-limiting
  ttfr_ms INTEGER,                                   -- time to first result (server measurement)
  model_version TEXT DEFAULT 'eva-v1.6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scans_slug ON scans(slug);
CREATE INDEX IF NOT EXISTS idx_scans_hash ON scans(image_hash);
CREATE INDEX IF NOT EXISTS idx_scans_user ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_public_created ON scans(is_public, created_at DESC) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_scans_anon_fp_created ON scans(anon_fingerprint, created_at DESC);

CREATE TABLE IF NOT EXISTS scan_events (
  id SERIAL PRIMARY KEY,
  scan_id INTEGER NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                                -- 'view' | 'share' | 'unshare' | 'embed'
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_events_scan ON scan_events(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_type ON scan_events(type, created_at DESC);

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,                     -- store hash, never the raw key
  key_prefix TEXT NOT NULL,                          -- first 8 chars for display (e.g. sk_live_)
  tier TEXT NOT NULL DEFAULT 'hobby',                -- 'hobby' | 'starter' | 'growth' | 'enterprise'
  quota_monthly INTEGER NOT NULL DEFAULT 100,
  usage_this_month INTEGER NOT NULL DEFAULT 0,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(revoked_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
