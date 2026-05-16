/*
  # Admin Users & OTP System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamptz)
    - `otp_codes`
      - `id` (uuid, primary key)
      - `email` (text)
      - `code` (text, 6-digit)
      - `expires_at` (timestamptz, 10 min TTL)
      - `used` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - admin_users: authenticated users can only read their own row
    - otp_codes: service role only (edge function uses service key)

  3. Notes
    - OTP codes expire after 10 minutes
    - Used codes cannot be reused
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read own record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);
