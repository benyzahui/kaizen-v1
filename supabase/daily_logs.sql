-- Run in Supabase SQL Editor.
-- One row per completed flow (pulse today; mirror/trade later reuse the table).

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  telegram_id text not null references public.users(telegram_id) on delete cascade,
  type text not null,            -- 'pulse' | 'mirror' | ...
  mood int,                      -- 1..10 (pulse)
  focus text,                    -- main focus today (pulse)
  success text,                  -- success criterion (pulse)
  trading_day boolean,           -- yes/no (pulse)
  created_at timestamptz not null
);

create index if not exists daily_logs_user_created_idx
  on public.daily_logs (telegram_id, created_at desc);

create index if not exists daily_logs_type_created_idx
  on public.daily_logs (type, created_at desc);
