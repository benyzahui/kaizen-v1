# Adaptive correction + relapse engine

Detects drift, overload, low energy, and inactivity — returns user to the path without shame or spam.

## Session fields

- `relapseRisk`: `low` | `medium` | `high`
- `lastRelapseCheck`: timestamp

## Modules

| File | Role |
|------|------|
| `relapseEngine.js` | Risk score, `tryAdaptiveCorrectionReply` |
| `overloadDetector.js` | Text + conversation overload, chaos |
| `correctionResponses.js` | Micro copy, discipline nudge |
| `resetProtocols.js` | Mini reset, recovery day |

## Open chat priority

After onboarding, before program guide: correction → program → stabilization → protocol.

## Weekly

`/weekly` appends Recovery Day block when collapse risk is elevated.

## Tests

```bash
node scripts/relapse-engine-smoke.js
```
