/**
 * Structured mantra registry — id, language, phase, text, tags.
 */

const { buildEntries } = require("./poolBuilder");
const morningLegacy = require("./morning");
const middayLegacy = require("./midday");
const eveningLegacy = require("./evening");

function legacyToEntries(phase, pool) {
  return [
    ...buildEntries(phase, "en", pool.en || []),
    ...buildEntries(phase, "hu", pool.hu || []),
    ...buildEntries(phase, "ro", pool.ro || [])
  ];
}

const REGISTRY = {
  morning: legacyToEntries("morning", morningLegacy),
  midday: legacyToEntries("midday", middayLegacy),
  evening: legacyToEntries("evening", eveningLegacy),
  late_night: legacyToEntries("evening", eveningLegacy)
};

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {'en'|'hu'|'ro'} lang
 */
function getEntries(phase, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const p = phase === "late_night" ? "evening" : phase;
  return (REGISTRY[p] || []).filter((e) => e.language === locked);
}

module.exports = { REGISTRY, getEntries, legacyToEntries };
