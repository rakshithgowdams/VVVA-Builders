/*
  # Full VVVA Developer Schema

  ## Tables

  1. `projects`
     - Core project info: name, location, status, description, coordinates
     - card_image_url, site_layout_image_url, hero_image_url
     - price_range, total_plots, rera_number, launch_date

  2. `project_images`
     - Gallery images per project
     - url, caption, display_order

  3. `plot_slots`
     - Each individual plot in a project
     - dimensions, status, bite_no, direction, price_lakhs, sqft, details

  4. `enquiries`
     - Contact/enquiry form submissions
     - name, phone, email, message, project_id, status

  ## Security
  - RLS enabled on all tables
  - projects, project_images, plot_slots: readable by everyone (public listing)
  - enquiries: insert by anyone, read/manage by authenticated admin only
  - plot_slots update: authenticated admin only
*/

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id                      bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name                    text NOT NULL,
  location                text NOT NULL,
  status                  text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'future', 'closed')),
  description             text DEFAULT '',
  card_image_url          text DEFAULT '',
  site_layout_image_url   text DEFAULT '',
  hero_image_url          text DEFAULT '',
  price_range             text DEFAULT '',
  rera_number             text DEFAULT '',
  total_area_acres        numeric DEFAULT 0,
  launch_date             date,
  map_lat                 numeric,
  map_lng                 numeric,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- PROJECT IMAGES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_images (
  id            bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id    bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url           text NOT NULL,
  caption       text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project images publicly readable"
  ON project_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert project images"
  ON project_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update project images"
  ON project_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete project images"
  ON project_images FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_order ON project_images(project_id, display_order);

-- ─────────────────────────────────────────────
-- PLOT SLOTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plot_slots (
  id          bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id  bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  bite_no     integer NOT NULL,
  dimensions  text NOT NULL,
  sqft        integer NOT NULL,
  direction   text NOT NULL DEFAULT 'North',
  status      text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'sold')),
  price_lakhs numeric NOT NULL DEFAULT 0,
  details     text DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE plot_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plot slots publicly readable"
  ON plot_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert plot slots"
  ON plot_slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update plot slots"
  ON plot_slots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_plot_slots_project_id ON plot_slots(project_id);
CREATE INDEX IF NOT EXISTS idx_plot_slots_status ON plot_slots(project_id, status);

-- ─────────────────────────────────────────────
-- ENQUIRIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id          bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id  bigint REFERENCES projects(id) ON DELETE SET NULL,
  name        text NOT NULL,
  phone       text NOT NULL,
  email       text DEFAULT '',
  message     text DEFAULT '',
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiry"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update enquiry status"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_enquiries_project_id ON enquiries(project_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
