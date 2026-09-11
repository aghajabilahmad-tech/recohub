/*
# Create users and saved_recommendations tables (single-tenant, no auth)

1. New Tables
- `users`
  - `id` (uuid, primary key, defaults to gen_random_uuid())
  - `username` (text, not null, defaults to 'You')
  - `avatar` (text, defaults to '🦊' — emoji stored as text)
  - `coins` (integer, defaults to 1850 — gamification currency)
  - `streak` (integer, defaults to 5 — consecutive days active)
  - `level` (integer, defaults to 9 — user level)
  - `created_at` (timestamptz, defaults to now())
- `saved_recommendations`
  - `id` (uuid, primary key, defaults to gen_random_uuid())
  - `category` (text, not null — category id like 'film', 'gadget', etc.)
  - `title` (text, not null — short title of the recommendation)
  - `snippet` (text, not null — longer description/content)
  - `created_at` (timestamptz, defaults to now())

2. Seed Data
- Inserts a single default user row so the app has a profile to display on first load.

3. Security
- Enable RLS on both tables.
- This is a single-tenant app with NO sign-in screen, so all policies use
  `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because
  the data is intentionally shared/public within this single app instance.
- 4 separate CRUD policies per table (SELECT, INSERT, UPDATE, DELETE).
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL DEFAULT 'You',
  avatar text NOT NULL DEFAULT '🦊',
  coins integer NOT NULL DEFAULT 1850,
  streak integer NOT NULL DEFAULT 5,
  level integer NOT NULL DEFAULT 9,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_users" ON users;
CREATE POLICY "anon_select_users" ON users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_users" ON users;
CREATE POLICY "anon_insert_users" ON users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_users" ON users;
CREATE POLICY "anon_update_users" ON users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_users" ON users;
CREATE POLICY "anon_delete_users" ON users FOR DELETE
  TO anon, authenticated USING (true);

-- Seed a default user if none exists
INSERT INTO users (username, avatar, coins, streak, level)
SELECT 'You', '🦊', 1850, 5, 9
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);

-- Create saved_recommendations table
CREATE TABLE IF NOT EXISTS saved_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  snippet text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_recs" ON saved_recommendations;
CREATE POLICY "anon_select_saved_recs" ON saved_recommendations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_recs" ON saved_recommendations;
CREATE POLICY "anon_insert_saved_recs" ON saved_recommendations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_recs" ON saved_recommendations;
CREATE POLICY "anon_update_saved_recs" ON saved_recommendations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_recs" ON saved_recommendations;
CREATE POLICY "anon_delete_saved_recs" ON saved_recommendations FOR DELETE
  TO anon, authenticated USING (true);
