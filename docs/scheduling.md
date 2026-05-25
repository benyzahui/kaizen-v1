# KaiZen Scheduled Daily Rhythm

Default timezone: **Europe/Bucharest**

| Slot | Local time | Function | Scheduler API |
|------|------------|----------|----------------|
| Morning activation | 06:00 | `netlify/functions/morning-dragon.js` | `sendMorningActivation(userId)` |
| Midday stabilization | 12:00 | `netlify/functions/midday-check.js` | `sendMiddayStabilization(userId)` |
| Evening reset | 21:00 | `netlify/functions/evening-mirror.js` | `sendEveningReset(userId)` |

Implementation: `src/scheduler/dailyRhythmScheduler.js`

## Current state

**Scheduler-ready, not live cron.** Message builders and copy are complete. Telegram send requires:

1. Uncomment `export const config = { schedule: "..." }` in each Netlify function.
2. Set `TELEGRAM_BOT_TOKEN`, `SUPABASE_URL`, `SUPABASE_KEY`.
3. Users with `notification_opt_in = true` in `kaizen_users`.

Suggested UTC crons (Bucharest ≈ UTC+2 / +3 DST — adjust seasonally):

- Morning: `0 4 * * *` (06:00 EET)
- Midday: `0 10 * * *` (12:00 EET)
- Evening: `0 19 * * *` (21:00 EET)

## Manual test (in-process)

```js
const { simulateDailyRhythmDay } = require("./src/scheduler/dailyRhythmScheduler");
simulateDailyRhythmDay(telegramUserId); // preview morning / midday / evening
```

```bash
node scripts/language-lock-rhythm-report.js
```

## Netlify manual trigger

```
GET /.netlify/functions/morning-dragon?trigger=test
```

## Language

Scheduled messages use `preferred_language` from profile / session. No mixed-language output.

## Later: Supabase cron

`pg_cron` → HTTP POST to Netlify function, or edge function calling `sendMorningActivation` per opted-in row.
