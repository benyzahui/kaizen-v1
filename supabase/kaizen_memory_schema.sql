-- KaiZen V1.6 — durable profile + session memory for serverless runtimes.
-- Run in Supabase SQL editor or via migration pipeline.

create table if not exists public.kaizen_users (
  telegram_id bigint primary key,
  username text,
  first_name text,
  preferred_language text,
  primary_path text,
  primary_path_note text,
  goal_30_days text,
  main_obstacle text,
  main_obstacle_note text,
  tone_preference text,
  onboarding_completed boolean not null default false,
  onboarding_active boolean not null default false,
  onboarding_skipped boolean not null default false,
  onboarding_step int not null default 0,
  program_lane text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kaizen_users_updated_at_idx
  on public.kaizen_users (updated_at desc);

create table if not exists public.kaizen_sessions (
  telegram_id bigint primary key references public.kaizen_users (telegram_id) on delete cascade,
  current_mode text,
  last_language text,
  last_category text,
  last_command text,
  last_topic text,
  last_emotional_intensity text,
  last_messages_summary text,
  ephemeral jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create index if not exists kaizen_sessions_expires_at_idx
  on public.kaizen_sessions (expires_at);

comment on table public.kaizen_users is 'Permanent KaiZen profile per Telegram user.';
comment on table public.kaizen_sessions is 'Rolling 24h companion session; expires_at refreshed on activity.';
comment on column public.kaizen_users.program_lane is 'Blueprint readiness: free | elite | dragon_path | trading | physical | emotional | business | mixed';
comment on column public.kaizen_sessions.ephemeral is 'Transient UI state (message tail, anti-loop snippets, etc.) — not authoritative for profile.';
