/**
 * Real life awareness — busy days, fatigue, inconsistent energy.
 */

/** @type {Array<{ id: string, language: string, text: string, scenes?: string[] }>} */
const LIFE_AWARENESS_LINES = [
  {
    id: "la_hu_1",
    language: "hu",
    text: "Nem minden nap lesz warrior nap.",
    scenes: ["stressed_worker", "busy", "recovery_day"]
  },
  {
    id: "la_hu_2",
    language: "hu",
    text: "Ma lehet elég a stabilitás.",
    scenes: ["overloaded_evening", "recovery_day", "exhausted"]
  },
  {
    id: "la_hu_3",
    language: "hu",
    text: "A való élet nem mindig egyenletes.",
    scenes: ["stressed_worker", "busy_entrepreneur"]
  },
  {
    id: "la_hu_4",
    language: "hu",
    text: "Elfáradt nap is lehet érvényes nap.",
    scenes: ["exhausted", "recovery_day"]
  },
  {
    id: "la_hu_5",
    language: "hu",
    text: "A munka és a ritmus együtt él.",
    scenes: ["stressed_worker", "busy_entrepreneur"]
  },
  {
    id: "la_hu_6",
    language: "hu",
    text: "Nem kell tökéletes nap a haladáshoz.",
    scenes: ["exhausted", "overloaded_evening"]
  },
  {
    id: "la_en_1",
    language: "en",
    text: "Not every day is a warrior day.",
    scenes: ["stressed_worker", "busy", "recovery_day"]
  },
  {
    id: "la_en_2",
    language: "en",
    text: "Today, stability may be enough.",
    scenes: ["overloaded_evening", "recovery_day", "exhausted"]
  },
  {
    id: "la_en_3",
    language: "en",
    text: "Real life is not always even.",
    scenes: ["stressed_worker", "busy_entrepreneur"]
  },
  {
    id: "la_en_4",
    language: "en",
    text: "A tired day can still be a valid day.",
    scenes: ["exhausted", "recovery_day"]
  },
  {
    id: "la_en_5",
    language: "en",
    text: "Work and rhythm live together.",
    scenes: ["stressed_worker", "busy_entrepreneur"]
  },
  {
    id: "la_en_6",
    language: "en",
    text: "You do not need a perfect day to move forward.",
    scenes: ["exhausted", "overloaded_evening"]
  },
  {
    id: "la_ro_1",
    language: "ro",
    text: "Nu fiecare zi e zi de warrior.",
    scenes: ["stressed_worker", "busy", "recovery_day"]
  },
  {
    id: "la_ro_2",
    language: "ro",
    text: "Azi poate fi suficientă stabilitatea.",
    scenes: ["overloaded_evening", "recovery_day", "exhausted"]
  },
  {
    id: "la_ro_3",
    language: "ro",
    text: "Viața reală nu e mereu uniformă.",
    scenes: ["stressed_worker", "busy_entrepreneur"]
  },
  {
    id: "la_ro_4",
    language: "ro",
    text: "O zi obosită poate fi tot o zi validă.",
    scenes: ["exhausted", "recovery_day"]
  },
  {
    id: "la_ro_5",
    language: "ro",
    text: "Munca și ritmul trăiesc împreună.",
    scenes: ["stressed_worker", "busy_entrepreneur"]
  },
  {
    id: "la_ro_6",
    language: "ro",
    text: "Nu ai nevoie de zi perfectă ca să avansezi.",
    scenes: ["exhausted", "overloaded_evening"]
  }
];

module.exports = { LIFE_AWARENESS_LINES };
