-- KaiZen V1.8 — Dragon Training OS profile fields (run in Supabase SQL editor).

alter table public.kaizen_users
  add column if not exists current_mission text,
  add column if not exists preferred_training_style text;

comment on column public.kaizen_users.current_mission is 'One-line training mission; optional; persisted with profile.';
comment on column public.kaizen_users.preferred_training_style is 'Optional training tone preference for future personalization.';
