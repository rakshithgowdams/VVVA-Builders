/*
  # Create brand-assets public storage bucket

  Used to host static brand files (logo, etc.) at a stable public URL
  so they can be referenced inside transactional emails.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Brand assets are publicly readable"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'brand-assets');

-- Allow authenticated to upload
CREATE POLICY "Authenticated can upload brand assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'brand-assets');
