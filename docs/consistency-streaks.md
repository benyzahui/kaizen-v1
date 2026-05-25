# Consistency + streak engine

Calm retention through structure — no hype, shame, or XP spam.

## Session: `streaks`

Each key: `morning`, `midday`, `evening`, `hydration`, `movement`, `fasting`, `meditation`, `focus`

```json
{ "current": 4, "best": 7, "lastDate": "2026-05-25" }
```

Updated when morning/midday/evening check-ins complete. Anchor streaks bump from `dailyState` flags.

## Commands

- Check-in completion → close line + `Streak: N nap` + one reinforcement line
- `/weekly` — short summary, strongest/weakest area, next focus
- `consistencyTitle` — Initiate → Guardian (subtle)

## Recovery copy

Shown when streak resets after a gap — no shame wording.

## Tests

```bash
node scripts/streak-engine-smoke.js
```
