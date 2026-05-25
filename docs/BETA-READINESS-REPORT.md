# KaiZen V1 — Beta Readiness Report

Generated: 2026-05-25  
Simulation: 7 nap · HU · Discipline + Energy · ingadozó energia · fókusz gyengeség

---

## Executive summary

| Metric | Result |
|--------|--------|
| **Readiness** | **99%** |
| **Gate** | ✅ LIMITED BETA ajánlott |
| Language lock (avg) | 100% |
| Open reply uniqueness | 57% |
| Session repetition (raw) | 10% (status blocks repeat) |
| Mantra variety (7d) | 7 unique IDs |
| Relapse corrections | 7 |
| Shame / hype hits | 0 / 0 |
| Generic coach hits | 0 |
| Blueprint-aligned replies | 59% |
| Scheduler HU slots | 21/21 |

---

## 1. Does KaiZen feel structured?

Igen — program + napi fázisok + check-in struktúra érezhető.

Program → reggel → dél → este; `/whereami` és streak lezárások rögzítik a kört.

---

## 2. Does it stay Hungarian?

Igen — HU zárolás tart.

---

## 3. Does it avoid loops?

Gyenge — open loop 57%.

---

## 4. Does it adapt to low/high energy?

Igen — alacsony → stabilizálás (1/1); magas nap path_correction (0/1).

---

## 5. Does it correctly reduce pressure during exhaustion?

Igen — nincs warrior push kimerültségnél.

---

## 6. Does it push correctly during discipline drift?

Igen — szétszórtságnál fókusz/zár irány.

---

## 7. Does /energy feel useful?

Igen — blueprint formátum, állapot, lépés.

---

## 8. Does the rhythm feel premium?

Igen — rövid, nyugodt, HU ütemezett sablonok.

---

## 9. What still feels generic?

Kevés — főleg path_correction és check-in, nem coach spam.

---

## 10. What must be fixed before beta?

- Open-reply loop risk 57% unique (target ≥70)

---

## 11. Is it ready for 3 test users?

Igen — 3 HU beta tester, programMode ON, rövid napi kör.

---

## 12. Readiness percentage

**99%**

---

## Score breakdown

```json
{
  "languageLock": 15,
  "repetition": 6,
  "noShame": 10,
  "noHype": 10,
  "blueprint": 10,
  "adaptation": 8,
  "relapse": 10,
  "commandClarity": 5,
  "rhythm": 10,
  "energyCmd": 10,
  "structured": 5
}
```

**Relapse risk (end state):** high  
**Morning streak:** 1  
**Program mode:** active

---

## 7-day simulation log (abbrev.)

**Day 1** (2026-05-25) — morning: ✓ · events: status:ok
**Day 2** (2026-05-26) — morning: ✓ · events: low_energy:ok, energy_cmd:ok
**Day 3** (2026-05-27) — morning: ✓ · events: high_energy:ok, workout:ok
**Day 4** (2026-05-28) — morning: missed · events: missed:?
**Day 5** (2026-05-29) — morning: ✓ · events: chaotic:ok, drift:ok
**Day 6** (2026-05-30) — morning: ✓ · events: fasting:ok
**Day 7** (2026-05-31) — morning: ✓ · events: overload:ok, trade:ok

---

## Pass / fail gate

Readiness **99%** ≥ 75% → **Limited closed beta** recommended for 3 Hungarian users with `/program` onboarding and daily check-in habit.

---

*Automated run: `node scripts/beta-readiness-7day-simulation.js`*
