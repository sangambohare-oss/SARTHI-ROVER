/*
# AgriVision AI — Complete Database Schema

## Overview
Creates the full database schema for the AgriVision AI Smart Farming Rover platform.
This is a multi-user application (has Login/Signup), so all tables are owner-scoped
with user_id columns defaulting to auth.uid() and RLS policies restricting access
to each user's own data.

## New Tables

1. **profiles** — Farmer profile information (extends auth.users)
   - id (uuid, PK, references auth.users)
   - name, phone, farm_location, preferred_language, dark_mode, notifications
   - number_of_farms
   - created_at, updated_at

2. **farms** — Farm field boundaries and metadata
   - id (uuid, PK)
   - user_id (uuid, owner, defaults to auth.uid())
   - name, crop_type
   - boundary (jsonb array of [lat, lng] coordinate pairs)
   - area (numeric, hectares, auto-calculated)
   - created_at

3. **detections** — AI disease detection results from crop scans
   - id (uuid, PK)
   - user_id (uuid, owner, defaults to auth.uid())
   - farm_id (uuid, nullable, references farms)
   - detected_crop, disease_name
   - confidence, plant_health (numeric percentages)
   - severity (text: Low/Moderate/High/Critical)
   - symptoms, treatment_steps, prevention_tips (jsonb arrays)
   - recommended_fertilizer, recommended_fungicide, recommended_pesticide
   - expected_recovery
   - image_url (text, nullable)
   - created_at

4. **reports** — Generated analysis reports
   - id (uuid, PK)
   - user_id (uuid, owner, defaults to auth.uid())
   - detection_id (uuid, nullable, references detections)
   - date, crop, disease, health (numeric)
   - treatment, status (text: Completed/In Progress/Pending)
   - created_at

5. **missions** — Rover mission records
   - id (uuid, PK)
   - user_id (uuid, owner, defaults to auth.uid())
   - farm_id (uuid, nullable, references farms)
   - status (text: Planned/Active/Paused/Completed/Aborted)
   - started_at, completed_at (timestamptz, nullable)
   - coverage (numeric percentage)
   - created_at

6. **history** — Activity log entries
   - id (uuid, PK)
   - user_id (uuid, owner, defaults to auth.uid())
   - type (text: detection/mission/report)
   - title, description
   - created_at

## Security (RLS)
- RLS enabled on ALL tables.
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE), scoped to authenticated users
  who own the row (auth.uid() = user_id).
- profiles table is keyed by id = auth.uid() directly.
- All owner columns default to auth.uid() so inserts that omit user_id succeed.

## Important Notes
1. profiles.id references auth.users(id) with ON DELETE CASCADE — when a user is deleted,
   their profile is automatically removed.
2. farms, detections, reports, missions, history all have user_id with DEFAULT auth.uid().
3. Child tables (detections, reports, missions) optionally reference farms via farm_id
   but are also independently owner-scoped by user_id.
4. history entries are auto-generated as a log — user_id defaults to the acting user.
5. Indexes added on user_id and farm_id for query performance.
*/

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  farm_location text NOT NULL DEFAULT '',
  number_of_farms integer NOT NULL DEFAULT 1,
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr')),
  dark_mode boolean NOT NULL DEFAULT false,
  notifications boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- =============================================
-- 2. FARMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  crop_type text NOT NULL DEFAULT '',
  boundary jsonb NOT NULL DEFAULT '[]'::jsonb,
  area numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_farms" ON farms;
CREATE POLICY "select_own_farms" ON farms FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_farms" ON farms;
CREATE POLICY "insert_own_farms" ON farms FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_farms" ON farms;
CREATE POLICY "update_own_farms" ON farms FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_farms" ON farms;
CREATE POLICY "delete_own_farms" ON farms FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);

-- =============================================
-- 3. DETECTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id uuid REFERENCES farms(id) ON DELETE SET NULL,
  detected_crop text NOT NULL,
  disease_name text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  plant_health numeric NOT NULL DEFAULT 0,
  severity text NOT NULL DEFAULT 'Low' CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
  symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,
  treatment_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  prevention_tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_fertilizer text NOT NULL DEFAULT '',
  recommended_fungicide text NOT NULL DEFAULT '',
  recommended_pesticide text NOT NULL DEFAULT '',
  expected_recovery text NOT NULL DEFAULT '',
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE detections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_detections" ON detections;
CREATE POLICY "select_own_detections" ON detections FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_detections" ON detections;
CREATE POLICY "insert_own_detections" ON detections FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_detections" ON detections;
CREATE POLICY "update_own_detections" ON detections FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_detections" ON detections;
CREATE POLICY "delete_own_detections" ON detections FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_detections_user_id ON detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_farm_id ON detections(farm_id);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON detections(created_at DESC);

-- =============================================
-- 4. REPORTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  detection_id uuid REFERENCES detections(id) ON DELETE SET NULL,
  date text NOT NULL,
  crop text NOT NULL,
  disease text NOT NULL,
  health numeric NOT NULL DEFAULT 0,
  treatment text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Completed', 'In Progress', 'Pending')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reports" ON reports;
CREATE POLICY "select_own_reports" ON reports FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reports" ON reports;
CREATE POLICY "insert_own_reports" ON reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reports" ON reports;
CREATE POLICY "update_own_reports" ON reports FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reports" ON reports;
CREATE POLICY "delete_own_reports" ON reports FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- =============================================
-- 5. MISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id uuid REFERENCES farms(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Active', 'Paused', 'Completed', 'Aborted')),
  started_at timestamptz,
  completed_at timestamptz,
  coverage numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_missions" ON missions;
CREATE POLICY "select_own_missions" ON missions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_missions" ON missions;
CREATE POLICY "insert_own_missions" ON missions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_missions" ON missions;
CREATE POLICY "update_own_missions" ON missions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_missions" ON missions;
CREATE POLICY "delete_own_missions" ON missions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_farm_id ON missions(farm_id);
CREATE INDEX IF NOT EXISTS idx_missions_created_at ON missions(created_at DESC);

-- =============================================
-- 6. HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('detection', 'mission', 'report')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_history" ON history;
CREATE POLICY "select_own_history" ON history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_history" ON history;
CREATE POLICY "insert_own_history" ON history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_history" ON history;
CREATE POLICY "update_own_history" ON history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_history" ON history;
CREATE POLICY "delete_own_history" ON history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at DESC);

-- =============================================
-- 7. AUTO-UPDATE updated_at TRIGGER ON PROFILES
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 8. AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
