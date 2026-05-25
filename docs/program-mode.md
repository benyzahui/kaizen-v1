# Program mode — daily flow control

## Session fields

| Field | Values |
|-------|--------|
| `programMode` | `inactive` \| `active` |
| `dailyPhase` | `morning` \| `midday` \| `evening` \| `completed` |
| `programPaused` | boolean |
| `completedPhases` | `['morning','midday','evening']` subset |
| `programDayKey` | ISO date — resets phase on new day |

## Commands

- `/program` — activate, start at morning
- `/whereami` — phase, mission, energy, next step
- `/pause` / `/resume` / `/stop`
- `/morning` `/midday` `/evening` — check-ins; advance phase when program active

## Open text (program active)

Brief reply + redirect to current step (`→ /midday` etc.). Overload text gets stabilization lines first.

## Scheduler

Automated pushes only when **all** are true:

- `KAIZEN_SCHEDULER_ENABLED=true`
- `programMode === 'active'`
- `notificationOptIn === true`
- `programPaused === false`
- language locked (hu/ro/en)

Use `{ force: true }` in tests to bypass eligibility.

## Tests

```bash
node scripts/program-mode-smoke.js
```
