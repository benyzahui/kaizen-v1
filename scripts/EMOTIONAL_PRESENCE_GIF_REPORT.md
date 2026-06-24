# Emotional Presence + GIF Report

Generated: 2026-06-24T08:29:26.287Z

## Smoke Results

**27 passed, 0 failed**

- PASS: welcome EN title
- PASS: welcome EN language prompt
- PASS: welcome HU
- PASS: welcome RO
- PASS: language locked after pick
- PASS: preferredLanguage hu
- PASS: HU lock confirm
- PASS: language lock blocks drift
- PASS: menu EN calm hub
- PASS: menu EN no command dump
- PASS: menu HU
- PASS: menu RO
- PASS: tired user HU
- PASS: tired HU hope close
- PASS: failed/skipped EN no shame
- PASS: no shame language EN
- PASS: motivated RO
- PASS: detect tired HU
- PASS: normal emoji cap 3
- PASS: blocked emoji removed
- PASS: gif registry populated
- PASS: gif silent null without env
- PASS: stage gif noop without env
- PASS: scheduled morning works
- PASS: scheduled midday works
- PASS: scheduled evening works
- PASS: lock confirm EN

## GIF Integration Status

- Registry: `src/media/gifRegistry.js` (11 entries, 5 categories)
- Selector: `src/media/gifSelector.js` (context-aware, silent fallback)
- Webhook: sends `pendingGifUrl` after text via `sendAnimation`
- Triggers: welcome, first language lock, streak 7/14/21, emotional recovery, morning/evening automation (rare)
- Configure via `KAIZEN_GIF_*` env vars — skips silently when unset

## Language Lock

- Permanent lock on language pick during onboarding
- Confirm message in EN/HU/RO after selection
- Only `/language` (Settings) can change after lock

## Sample Outputs

### Welcome (EN)
```
🐉 Welcome to KaiZen.
Your Dragon Blueprint Energy Companion.
I am here to help you build discipline, protect your energy, and return to the path every day.
Choose your language:
1 — English
2 — Magyar
3 — Română
...
```

### Tired (HU)
```
🐉 Itt vagyok.
Ma nem kell erőltetni.
Ma visszatérünk az alapokhoz.
💧 Víz.
🧘 5 lassú légzés.
🌿 Egy rövid séta.
Ez is haladás.
```

### Menu (EN)
```
🐉 Daily Path
Choose where you want to return today:
⚡ Energy Check
🧘 Breathwork
📖 Dragon Wisdom
🎯 Challenge
🪞 Reflection
⚙️ Settings
```