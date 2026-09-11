-- AI Recommendation Hub - Database Schema
-- This file is for reference. The actual migration was applied via Supabase MCP.

-- ============================================================
-- Table: users
-- Stores gamification data (coins, streaks, level) for the app.
-- Single-tenant: one default user row, no auth required.
-- ============================================================
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

-- Seed default user
INSERT INTO users (username, avatar, coins, streak, level)
SELECT 'You', '🦊', 1850, 5, 9
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);

-- ============================================================
-- Table: saved_recommendations
-- Stores AI recommendations the user bookmarks from chat.
-- ============================================================
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
