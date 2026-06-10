-- ============================================================
-- PitchSide Predictor — Supabase Schema
-- Run this in the Supabase SQL Editor of your new project
-- ============================================================

CREATE TABLE IF NOT EXISTS pitchside_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User info
  name            TEXT NOT NULL,
  -- All 4 are UNIQUE — enforced at DB level as final safety net
  nick            TEXT NOT NULL UNIQUE,
  instagram       TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT NOT NULL UNIQUE,     -- stored normalised: +91XXXXXXXXXX

  -- Picks (stored as JSONB for flexibility)
  final_pick      TEXT NOT NULL,
  group_picks     JSONB NOT NULL DEFAULT '{}',
  third_picks     JSONB NOT NULL DEFAULT '{}',
  r32_picks       JSONB NOT NULL DEFAULT '{}',
  r16_picks       JSONB NOT NULL DEFAULT '{}',
  qf_picks        JSONB NOT NULL DEFAULT '{}',
  sf_picks        JSONB NOT NULL DEFAULT '{}',

  -- Anti-fraud signals
  fingerprint_hash  TEXT UNIQUE,            -- FingerprintJS visitor ID (nullable — browser may block)
  ip_address        TEXT,                   -- logged for review, NOT used as hard block

  -- Timestamps
  entry_time      TIMESTAMPTZ NOT NULL,     -- when user started filling form
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────

-- Fast duplicate lookups (UNIQUE already creates an index, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_pitchside_email       ON pitchside_entries (email);
CREATE INDEX IF NOT EXISTS idx_pitchside_phone       ON pitchside_entries (phone);
CREATE INDEX IF NOT EXISTS idx_pitchside_instagram   ON pitchside_entries (instagram);
CREATE INDEX IF NOT EXISTS idx_pitchside_nick        ON pitchside_entries (nick);
CREATE INDEX IF NOT EXISTS idx_pitchside_fingerprint ON pitchside_entries (fingerprint_hash);

-- Leaderboard / winner determination
CREATE INDEX IF NOT EXISTS idx_pitchside_submitted   ON pitchside_entries (submitted_at);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE pitchside_entries ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can INSERT a new entry
CREATE POLICY "Allow public insert"
  ON pitchside_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service_role (your server) can SELECT — users never see other entries
CREATE POLICY "Service role can read all"
  ON pitchside_entries
  FOR SELECT
  TO service_role
  USING (true);

-- ── Migration: run this if you already created the table without these columns ──
-- ALTER TABLE pitchside_entries ADD COLUMN IF NOT EXISTS third_picks JSONB NOT NULL DEFAULT '{}';
-- ALTER TABLE pitchside_entries ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT UNIQUE;
-- ALTER TABLE pitchside_entries ADD COLUMN IF NOT EXISTS ip_address TEXT;
-- ALTER TABLE pitchside_entries ADD CONSTRAINT pitchside_entries_phone_key UNIQUE (phone);
-- ALTER TABLE pitchside_entries ADD CONSTRAINT pitchside_entries_instagram_key UNIQUE (instagram);
-- ALTER TABLE pitchside_entries ADD CONSTRAINT pitchside_entries_nick_key UNIQUE (nick);
