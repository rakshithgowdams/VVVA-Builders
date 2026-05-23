/*
  # Create site_images table

  ## Purpose
  Store global site-wide image URLs (hero background, about page, etc.)
  that are not tied to a specific project. This allows the UI to load all
  images dynamically from the database instead of using local static files.

  ## New Tables
  - `site_images`
    - `id` (bigint, primary key, auto-increment)
    - `key` (text, unique) — identifier used by the frontend, e.g. "hero_background"
    - `url` (text) — full image URL (Unsplash or other CDN)
    - `alt` (text) — accessibility alt text / caption
    - `section` (text) — section name for grouping: "hero", "about", "contact", etc.
    - `display_order` (int) — ordering within a section
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public SELECT allowed (images are public content)
  - No insert/update/delete for anonymous users (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS site_images (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key text UNIQUE NOT NULL,
  url text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images"
  ON site_images FOR SELECT
  TO anon, authenticated
  USING (true);
