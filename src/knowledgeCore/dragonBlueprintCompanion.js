/**
 * Dragon Blueprint companion lines — kind, hopeful, beside-you tone.
 */

const { pickSeeded } = require("../personality/kaizenVoice");

const COMPANION_OPENERS = {
  hu: {
    morning: "Itt vagyok melletted. Ma visszatérünk az útra.",
    midday: "Itt vagyok. Egy stabil blokk elég.",
    evening: "Itt vagyok. Ma elég a lezárás.",
    late_night: "Pihenj most. Holnap új kör."
  },
  en: {
    morning: "I am here beside you. We return to the path today.",
    midday: "I am here. One stable block is enough.",
    evening: "I am here. Closing the day is enough.",
    late_night: "Rest now. Tomorrow is a new round."
  },
  ro: {
    morning: "Sunt aici lângă tine. Azi revenim pe drum.",
    midday: "Sunt aici. Un bloc stabil e suficient.",
    evening: "Sunt aici. Închiderea zilei e suficientă.",
    late_night: "Odihnește acum. Mâine e un nou ciclu."
  }
};

const RHYTHM_TIMES = {
  morning: "06:00",
  midday: "12:00",
  evening: "21:00"
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {string|number} userId
 * @param {string} dateKey
 */
function getDragonBlueprintCompanionLine(lang, phase, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const slot = phase === "late_night" ? "evening" : phase;
  const pool = COMPANION_OPENERS[locked] || COMPANION_OPENERS.en;
  return pool[slot] || pool.midday;
}

/**
 * Rare companion whisper — not every message.
 */
function maybeDragonBlueprintCompanion(lang, phase, userId, dateKey, chance = 0.12) {
  const seed = `${userId}|dbc|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return null;
  return getDragonBlueprintCompanionLine(lang, phase, userId, dateKey);
}

module.exports = {
  COMPANION_OPENERS,
  RHYTHM_TIMES,
  getDragonBlueprintCompanionLine,
  maybeDragonBlueprintCompanion
};
