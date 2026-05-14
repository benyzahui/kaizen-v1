-- Run in Supabase SQL Editor before using the bot.

create table if not exists public.users (
  telegram_id text primary key,
  username text,
  first_name text,
  created_at timestamptz not null,
  last_seen_at timestamptz not null
);
