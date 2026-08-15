/*
# Remove AgriVision AI Database Schema

## Overview
Drops all tables, triggers, and functions created by the AgriVision AI schema migration.
This completely removes the database layer from the project.

## Tables Removed
1. history — activity log entries
2. missions — rover mission records
3. reports — generated analysis reports
4. detections — AI disease detection results
5. farms — farm field boundaries
6. profiles — farmer profile information

## Triggers Removed
- on_auth_user_created (on auth.users)
- trg_profiles_updated_at (on profiles)

## Functions Removed
- handle_new_user()
- update_updated_at()

## Important Notes
1. All tables are currently empty (0 rows), so no data is lost.
2. CASCADE is used on all drops to remove dependent objects (indexes, constraints).
3. The auth.users table (managed by Supabase) is NOT touched.
4. This migration is idempotent — safe to re-run.
*/

-- Drop triggers first (they reference tables we're about to drop)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at();

-- Drop tables (order matters for foreign key dependencies)
DROP TABLE IF EXISTS history CASCADE;
DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS detections CASCADE;
DROP TABLE IF EXISTS farms CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
