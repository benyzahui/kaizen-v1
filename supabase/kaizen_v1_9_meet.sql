-- KaiZen V1.9 — Meet KaiZen flag (run in Supabase SQL editor).

alter table public.kaizen_users
  add column if not exists meet_kaizen_completed boolean not null default false;

comment on column public.kaizen_users.meet_kaizen_completed is 'True after first Meet KaiZen self-intro; skips intro card on future /start onboarding.';
