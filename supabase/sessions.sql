-- Run in Supabase SQL Editor.
-- One active conversational flow per user; deleted when the flow finishes.

create table if not exists public.sessions (
  telegram_id text primary key references public.users(telegram_id) on delete cascade,
  flow text not null,                       -- 'pulse' | future flows
  step int not null,
  data jsonb not null default '{}'::jsonb,  -- partial answers
  updated_at timestamptz not null
);
