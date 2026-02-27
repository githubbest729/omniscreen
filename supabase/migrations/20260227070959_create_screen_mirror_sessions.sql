/*
  # Screen Mirroring Sessions Schema

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `code` (text, unique) - 6-digit connection code
      - `offer` (jsonb) - WebRTC offer from sender
      - `answer` (jsonb) - WebRTC answer from receiver
      - `sender_ice_candidates` (jsonb) - Array of ICE candidates from sender
      - `receiver_ice_candidates` (jsonb) - Array of ICE candidates from receiver
      - `status` (text) - Session status: waiting, connected, closed
      - `created_at` (timestamptz) - Session creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `sessions` table
    - Add policies for public access (anyone can create/read/update sessions)
    - Sessions are temporary and auto-expire after 1 hour

  3. Indexes
    - Index on `code` for fast lookups
    - Index on `created_at` for cleanup queries
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  offer jsonb,
  answer jsonb,
  sender_ice_candidates jsonb DEFAULT '[]'::jsonb,
  receiver_ice_candidates jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'waiting',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create sessions"
  ON sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update sessions"
  ON sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete old sessions"
  ON sessions FOR DELETE
  TO anon
  USING (created_at < now() - interval '1 hour');