-- V2.2 Companion architecture — identity fields for permanent memory.

ALTER TABLE kaizen_users
  ADD COLUMN IF NOT EXISTS user_name   text,
  ADD COLUMN IF NOT EXISTS user_purpose text;
