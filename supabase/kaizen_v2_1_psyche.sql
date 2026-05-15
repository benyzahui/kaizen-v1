-- V2.1 Psyche Layer — Dragon Path foundation, daily streak, tier, scheduling prefs.
-- Run in Supabase SQL Editor. All columns are nullable with safe defaults.

ALTER TABLE kaizen_users
  ADD COLUMN IF NOT EXISTS membership_tier        text        NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS dragon_level           smallint    NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_program        text,
  ADD COLUMN IF NOT EXISTS daily_streak           int         NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_morning_checkin   date,
  ADD COLUMN IF NOT EXISTS last_evening_mirror    date,
  ADD COLUMN IF NOT EXISTS seriousness_score      int         NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS notification_opt_in    boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS morning_time           text        NOT NULL DEFAULT '06:00',
  ADD COLUMN IF NOT EXISTS evening_time           text        NOT NULL DEFAULT '21:00',
  ADD COLUMN IF NOT EXISTS timezone               text;

-- Constrain tier to known values (safe to run after column exists)
ALTER TABLE kaizen_users
  DROP CONSTRAINT IF EXISTS chk_membership_tier;
ALTER TABLE kaizen_users
  ADD CONSTRAINT chk_membership_tier
    CHECK (membership_tier IN ('free','elite','dragon'));

-- Constrain level 1–7
ALTER TABLE kaizen_users
  DROP CONSTRAINT IF EXISTS chk_dragon_level;
ALTER TABLE kaizen_users
  ADD CONSTRAINT chk_dragon_level
    CHECK (dragon_level BETWEEN 1 AND 7);
