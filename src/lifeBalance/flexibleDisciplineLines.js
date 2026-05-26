/**
 * Flexible discipline — consistency over perfection.
 */

/** @type {Array<{ id: string, language: string, text: string, scenes?: string[] }>} */
const FLEXIBLE_DISCIPLINE_LINES = [
  {
    id: "fd_hu_1",
    language: "hu",
    text: "⚔ Egy kis blokk is számít.",
    scenes: ["busy", "exhausted", "stressed_worker"]
  },
  {
    id: "fd_hu_2",
    language: "hu",
    text: "🌱 A ritmus fontosabb mint a maximalizmus.",
    scenes: ["busy_entrepreneur", "exhausted"]
  },
  {
    id: "fd_hu_3",
    language: "hu",
    text: "⚔ A következetesség többet ér mint a tökéletesség.",
    scenes: ["stressed_worker", "recovery_day"]
  },
  {
    id: "fd_hu_4",
    language: "hu",
    text: "🌱 Ma elég egy stabil blokk.",
    scenes: ["overloaded_evening", "busy"]
  },
  {
    id: "fd_hu_5",
    language: "hu",
    text: "⚔ Kis lépés > nagy terv ma.",
    scenes: ["exhausted", "busy_entrepreneur"]
  },
  {
    id: "fd_en_1",
    language: "en",
    text: "⚔ One small block still counts.",
    scenes: ["busy", "exhausted", "stressed_worker"]
  },
  {
    id: "fd_en_2",
    language: "en",
    text: "🌱 Rhythm matters more than maximalism.",
    scenes: ["busy_entrepreneur", "exhausted"]
  },
  {
    id: "fd_en_3",
    language: "en",
    text: "⚔ Consistency beats perfection.",
    scenes: ["stressed_worker", "recovery_day"]
  },
  {
    id: "fd_en_4",
    language: "en",
    text: "🌱 One stable block is enough today.",
    scenes: ["overloaded_evening", "busy"]
  },
  {
    id: "fd_en_5",
    language: "en",
    text: "⚔ Small step > big plan today.",
    scenes: ["exhausted", "busy_entrepreneur"]
  },
  {
    id: "fd_ro_1",
    language: "ro",
    text: "⚔ Un bloc mic contează.",
    scenes: ["busy", "exhausted", "stressed_worker"]
  },
  {
    id: "fd_ro_2",
    language: "ro",
    text: "🌱 Ritmul contează mai mult decât maximalismul.",
    scenes: ["busy_entrepreneur", "exhausted"]
  },
  {
    id: "fd_ro_3",
    language: "ro",
    text: "⚔ Consecvența bate perfecțiunea.",
    scenes: ["stressed_worker", "recovery_day"]
  },
  {
    id: "fd_ro_4",
    language: "ro",
    text: "🌱 Azi e suficient un bloc stabil.",
    scenes: ["overloaded_evening", "busy"]
  },
  {
    id: "fd_ro_5",
    language: "ro",
    text: "⚔ Pas mic > plan mare azi.",
    scenes: ["exhausted", "busy_entrepreneur"]
  }
];

module.exports = { FLEXIBLE_DISCIPLINE_LINES };
