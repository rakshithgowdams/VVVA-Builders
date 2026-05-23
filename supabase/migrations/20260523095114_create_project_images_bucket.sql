/*
  # Create project-images storage bucket

  Creates a public Supabase storage bucket for project images uploaded by admins.
  Admins (authenticated users) can upload and delete files.
  Public (anonymous) users can read files so images render on the site.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can upload project images'
  ) THEN
    CREATE POLICY "Authenticated users can upload project images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated users can delete project images'
  ) THEN
    CREATE POLICY "Authenticated users can delete project images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public can view project images'
  ) THEN
    CREATE POLICY "Public can view project images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'project-images');
  END IF;
END $$;
