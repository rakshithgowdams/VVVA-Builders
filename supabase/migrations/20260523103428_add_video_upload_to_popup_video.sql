/*
  # Add uploaded video support to popup_video table

  ## Summary
  Extends the popup_video table to support direct video file uploads stored in
  Supabase Storage, alongside the existing YouTube URL option. Also creates the
  storage bucket for popup videos.

  ## Changes to popup_video table
  - `video_type` (text) — 'youtube' or 'upload', defaults to 'youtube'
  - `uploaded_video_url` (text) — public URL of the uploaded video file in storage

  ## New Storage Bucket
  - `popup-videos` — public bucket for uploaded video files (mp4, webm, mov)

  ## Notes
  - Existing rows default to video_type = 'youtube' so nothing breaks
  - Frontend checks video_type to decide whether to show YouTube iframe or <video> tag
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'popup_video' AND column_name = 'video_type'
  ) THEN
    ALTER TABLE popup_video ADD COLUMN video_type text NOT NULL DEFAULT 'youtube'
      CONSTRAINT popup_video_type_check CHECK (video_type IN ('youtube', 'upload'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'popup_video' AND column_name = 'uploaded_video_url'
  ) THEN
    ALTER TABLE popup_video ADD COLUMN uploaded_video_url text NOT NULL DEFAULT '';
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'popup-videos',
  'popup-videos',
  true,
  104857600,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view popup videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'popup-videos');

CREATE POLICY "Authenticated can upload popup videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'popup-videos');

CREATE POLICY "Authenticated can update popup videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'popup-videos');

CREATE POLICY "Authenticated can delete popup videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'popup-videos');
