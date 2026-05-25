# Daily state tracking (Dragon Blueprint)

Structured daily execution tracker on the in-memory session (24h TTL). Fields mirror a future Supabase `daily_state` JSON column.

## Session fields

| Field | Type | Description |
|-------|------|-------------|
| `dailyState` | object | Today's row (reset when `date` ≠ today) |
| `dailyCheckInPending` | object | Active check-in `{ flow, step, lang, startedAt }` |

## `dailyState` shape

- `date`, `userId`, `language`
- `energyLevel`, `sleepQuality` (1–10)
- `hydrationDone`, `movementDone`, `breathworkDone`, `fastingActive`
- `screenDiscipline`: `low` \| `medium` \| `high`
- `emotionalState`, `disciplineState`
- `todayMission`, `eveningReflection`, `energyLeak`, `eveningRelease`, `recoveryAction`
- `focusDrift`, `middayCorrection`
- `completedActions[]`

## Commands

- `/morning` — morning check-in prompt; replies saved via natural text
- `/midday` — midday check-in
- `/evening` — evening check-in
- `/status` — daily snapshot (HU/EN/RO, hard language lock)

## Persistence

When Supabase is configured, `dailyState` and `dailyCheckInPending` are stored in the session ephemeral blob (`kaizen_sessions.ephemeral`).

## Tests

```bash
node scripts/daily-state-tracking-smoke.js
```
