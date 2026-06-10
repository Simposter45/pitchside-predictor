-- ============================================================
-- PitchSide Predictor — Supabase Schema
-- Run this in the Supabase SQL Editor of your new project
-- ============================================================

CREATE TABLE IF NOT EXISTS pitchside_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User info
  name            TEXT NOT NULL,
  nick            TEXT NOT NULL,
  instagram       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT NOT NULL,

  -- Picks (stored as JSONB for flexibility)
  final_pick      TEXT NOT NULL,
  group_picks     JSONB NOT NULL DEFAULT '{}',
  r32_picks       JSONB NOT NULL DEFAULT '{}',
  r16_picks       JSONB NOT NULL DEFAULT '{}',
  qf_picks        JSONB NOT NULL DEFAULT '{}',
  sf_picks        JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  entry_time      TIMESTAMPTZ NOT NULL,  -- when user started filling form
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  ip_address      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast duplicate-email lookups
CREATE INDEX IF NOT EXISTS idx_pitchside_entries_email ON pitchside_entries (email);

-- Index for leaderboard / winner determination queries
CREATE INDEX IF NOT EXISTS idx_pitchside_entries_submitted ON pitchside_entries (submitted_at);

-- ============================================================
-- Row Level Security
-- Allow anyone to INSERT (anon), but only service role can SELECT
-- ============================================================
ALTER TABLE pitchside_entries ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (new entry)
CREATE POLICY "Allow public insert"
  ON pitchside_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: only authenticated/service role can read
CREATE POLICY "Service role can read all"
  ON pitchside_entries
  FOR SELECT
  TO service_role
  USING (true);
