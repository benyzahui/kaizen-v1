# KaiZen Scheduled Functions

Three Netlify functions handle daily push messages for opted-in users.

## Files

| Function | File | Default time |
|---|---|---|
| Morning Dragon | `netlify/functions/morning-dragon.js` | 06:00 local |
| Midday Check | `netlify/functions/midday-check.js` | 13:00 local (elite+ only) |
| Evening Mirror | `netlify/functions/evening-mirror.js` | 21:00 local |

## Current State

**Manual trigger only.** No cron is active. Each file has a commented-out `config.schedule` line.

## To Activate

1. Uncomment the `export const config = { schedule: "..." }` line in each function.
2. Redeploy to Netlify.
3. Netlify will call the function on the UTC cron expression you define.

**Note:** Netlify scheduled functions use UTC. If you want per-user local time you will need to:
- Store `timezone` in `kaizen_users`.
- Run the function hourly and filter users whose local time matches.

## User Opt-in Required

Functions filter by:
- `notification_opt_in = true`
- `active_mode = true`
- Midday check: `membership_tier IN ('elite', 'dragon')`

## Manual Test

Hit the function URL with `?trigger=test` to preview output without sending actual messages:

```
GET https://your-site.netlify.app/.netlify/functions/morning-dragon?trigger=test
```

## LLM Upgrade Path

Replace `buildMorningMessage(profile)` / `buildEveningMessage(profile)` with:

```js
const text = await coachBrain.generateMorningBrief(profile); // future
```

The send loop and Supabase filtering stay identical.
