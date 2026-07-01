# Emotional Presence + GIF Report

Generated: 2026-07-01T07:49:09.167Z

## Smoke Results

**33 passed, 0 failed**

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
- PASS: menu HU sergeant
- PASS: menu RO
- PASS: tired user HU
- PASS: tired HU humor
- PASS: failed/skipped EN no shame
- PASS: no shame language EN
- PASS: motivated RO
- PASS: detect tired HU
- PASS: keyword lazy HU
- PASS: mirror line HU
- PASS: keyword phone scroll
- PASS: keyword streak win
- PASS: mirror gif category exists
- PASS: gif registry with mirror entries
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

- Registry: `src/media/gifRegistry.js` (mirror + celebration categories)
- Keyword engine: `src/media/gifKeywordEngine.js` (HU/EN/RO → ironic mirror GIF)
- Selector: `src/media/gifSelector.js` (tag-scored picks, keyword staging)
- Webhook: sends `pendingGifUrl` after text via `sendAnimation`
- Triggers: welcome, language lock, streak, emotional presence, keyword open-text mirror, morning/evening
- Mirror line: 🪞 ironic one-liner appended when keyword GIF matches
- Configure via `KAIZEN_GIF_*` env vars — skips silently when unset

## Language Lock

- Permanent lock on language pick during onboarding
- Confirm message in EN/HU/RO after selection
- Only `/language` (Settings) can change after lock

## Sample Outputs

### Welcome (EN)
```
🐉 Welcome to KaiZen.
Dragon Blueprint — sergeant mode.
No coddling. No motivation guru talk.
Discipline, focus, and return to the path — like a sergeant major.
Choose your language:
1 — English
2 — Magyar
3 — Română
...
```

### Tired (HU)
```
🐉 Hallom — kimerült vagy.
Nem sírunk rá. Nem magyarázkodunk.
Hadnagy parancs:
💧 Víz.
🧘 5 lassú lélegzet.
🌿 5 perc séta.
A kanapé nem hadvezér. Te vagy. Egy lépés elég.
```

### Menu (EN)
```
🐉 Daily Path
Sergeant asks: where do you return today?
⚡ Energy Check
🧘 Breathwork
📖 Dragon Wisdom
🎯 Challenge
🪞 Reflection
⚙️ Settings
```