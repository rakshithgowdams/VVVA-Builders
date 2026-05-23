/*
  # Create popup_video table

  ## Summary
  Creates a table to store the YouTube video URL shown in the inquiry popup on the public site.

  ## New Tables
  - `popup_video`
    - `id` (int, primary key, always 1 — single-row config pattern)
    - `youtube_url` (text) — full YouTube video URL (e.g. https://www.youtube.com/watch?v=...)
    - `is_active` (boolean) — whether the popup video is enabled
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public (anon) can SELECT (to display on frontend)
  - Authenticated users can UPDATE (admin edits)
  - No INSERT/DELETE needed (single-row seeded below)

  ## Notes
  - Single-row pattern: only row with id=1 is used
  - Seed with a default inactive row so frontend always gets a result
*/

CREATE TABLE IF NOT EXISTS popup_video (
  id integer PRIMARY KEY DEFAULT 1,
  youtube_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT popup_video_single_row CHECK (id = 1)
);

ALTER TABLE popup_video ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view popup video config"
  ON popup_video FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update popup video"
  ON popup_video FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO popup_video (id, youtube_url, is_active)
VALUES (1, '', false)
ON CONFLICT (id) DO NOTHING;
