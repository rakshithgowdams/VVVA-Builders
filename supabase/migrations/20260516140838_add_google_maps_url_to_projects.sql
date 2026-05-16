/*
  # Add Google Maps URL to projects

  ## Changes
  - Adds `google_maps_url` column to the `projects` table
    - Stores the full Google Maps share link set by admin
    - Defaults to empty string (no link = link not shown in UI)

  ## Notes
  - No data loss risk — additive column with a safe default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'google_maps_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN google_maps_url text DEFAULT '';
  END IF;
END $$;
