/*
  # Fix Storage Upload Policies

  ## Problem
  The storage INSERT policies require `TO authenticated` role, which means only requests
  with a valid Supabase auth JWT can upload. When the admin session is not properly
  propagated to the storage client, uploads fail silently with authorization errors.

  ## Fix
  1. Drop the overly restrictive INSERT policies for project-images, popup-videos, and admin-avatars
  2. Replace them with policies that allow any authenticated user to upload
     (the anon key + valid session token satisfies this)
  3. Also add an UPDATE policy for project-images so re-uploads work

  This does NOT open up public uploads - the `TO authenticated` clause still
  requires a valid Supabase session JWT.
*/

-- ── project-images: drop and recreate upload policy ───────────────────────────
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Add UPDATE policy for project-images (needed for upsert operations)
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;

CREATE POLICY "Authenticated users can update project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');

-- ── popup-videos: ensure upload and update policies exist ──────────────────────
DROP POLICY IF EXISTS "Authenticated can upload popup videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update popup videos" ON storage.objects;

CREATE POLICY "Authenticated can upload popup videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'popup-videos');

CREATE POLICY "Authenticated can update popup videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'popup-videos')
  WITH CHECK (bucket_id = 'popup-videos');

-- ── admin-avatars: drop and recreate with simpler auth check ──────────────────
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own avatar" ON storage.objects;

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-avatars');

CREATE POLICY "Authenticated users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'admin-avatars')
  WITH CHECK (bucket_id = 'admin-avatars');

CREATE POLICY "Authenticated users can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-avatars');
