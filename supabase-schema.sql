-- KLE Alumni Platform — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Alumni submissions table
CREATE TABLE IF NOT EXISTS alumni (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  batch_year    INTEGER NOT NULL,
  department    TEXT,
  description   TEXT,
  quote         TEXT,
  image_url     TEXT,
  image_path    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ,
  linkedin_url    TEXT,
  "current_role"  TEXT,
  current_company TEXT
);

-- Index for fast gallery queries
CREATE INDEX IF NOT EXISTS idx_alumni_status ON alumni(status);
CREATE INDEX IF NOT EXISTS idx_alumni_batch ON alumni(batch_year DESC);

-- Storage bucket for alumni photos
-- Run separately after creating the bucket in the Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('alumni-photos', 'alumni-photos', true);

-- RLS Policies

-- Allow anyone to read approved alumni
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved alumni"
  ON alumni FOR SELECT
  USING (status = 'approved');

-- Allow anyone to insert (submit) a new alumni (status defaults to pending)
CREATE POLICY "Anyone can submit"
  ON alumni FOR INSERT
  WITH CHECK (status = 'pending');

-- Service role can do everything (for admin operations)
-- This is handled automatically when using the service role key

-- Storage policies (run after creating bucket)
-- Allow public reads on alumni-photos
-- CREATE POLICY "Public read alumni photos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'alumni-photos');

-- Allow anyone to upload to alumni-photos
-- CREATE POLICY "Anyone can upload alumni photo"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'alumni-photos');
