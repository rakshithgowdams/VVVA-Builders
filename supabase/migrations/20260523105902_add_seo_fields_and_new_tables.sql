/*
  # SEO Schema Extension & New Tables

  ## Summary
  Extends the existing schema with SEO fields and adds new tables required
  for the full-featured website upgrade.

  ## Changes
  1. `projects` table — add SEO columns: slug, seo_title, seo_description, primary_keyword, last_updated
  2. New `locations` table — stores location/area page content with SEO fields
  3. New `blog_posts` table — stores blog article content with full SEO metadata
  4. New `leads` table — captures all lead forms with UTM tracking fields

  ## Security
  - RLS enabled on all new tables
  - `leads`: public INSERT (anyone can submit), only authenticated can SELECT
  - `blog_posts`: public SELECT, authenticated INSERT/UPDATE/DELETE
  - `locations`: public SELECT, authenticated INSERT/UPDATE/DELETE
*/

-- ── Extend projects table with SEO fields ─────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'slug'
  ) THEN
    ALTER TABLE projects ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'seo_title'
  ) THEN
    ALTER TABLE projects ADD COLUMN seo_title text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'seo_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN seo_description text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'primary_keyword'
  ) THEN
    ALTER TABLE projects ADD COLUMN primary_keyword text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'last_updated'
  ) THEN
    ALTER TABLE projects ADD COLUMN last_updated date DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- ── Blog Posts table ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  primary_keyword text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Rakshith',
  hero_image_url text NOT NULL DEFAULT '',
  hero_image_alt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated can read all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- ── Locations table ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS locations (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  primary_keyword text NOT NULL DEFAULT '',
  hero_heading text NOT NULL DEFAULT '',
  hero_subtext text NOT NULL DEFAULT '',
  intro_text text NOT NULL DEFAULT '',
  why_invest_text text NOT NULL DEFAULT '',
  landmarks text NOT NULL DEFAULT '',
  distance_info text NOT NULL DEFAULT '',
  map_lat double precision NOT NULL DEFAULT 13.0033,
  map_lng double precision NOT NULL DEFAULT 76.0959,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view locations"
  ON locations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete locations"
  ON locations FOR DELETE
  TO authenticated
  USING (true);

-- ── Leads table ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id serial PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  project_interest text NOT NULL DEFAULT '',
  source_page text NOT NULL DEFAULT '',
  utm_source text NOT NULL DEFAULT '',
  utm_medium text NOT NULL DEFAULT '',
  utm_campaign text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
