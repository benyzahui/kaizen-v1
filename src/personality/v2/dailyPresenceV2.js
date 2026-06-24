/**
 * Daily presence — morning greet, midday recenter, evening release.
 */

const { pickSeeded } = require("../kaizenVoice");
const { energyToneHint } = require("./energyTone");

const PRESENCE = {
  hu: {
    morning: ["☀️ Jó reggelt. Vissza az útra.", "🐉 Reggel. Egy lépés elég.", "💧 Víz. Légzés. Kezdés."],
    midday: ["🎯 Dél. Egy stabil blokk.", "⚡ Újra fókusz. Egy sáv.", "🌿 Recenter. Egy irány."],
    evening: ["🌙 Este. Engedd el a napot.", "🪞 Lezárás. Holnap új kör.", "🧘 Pihenj. Elég volt mára."]
  },
  en: {
    morning: ["☀️ Good morning. Back to the path.", "🐉 Morning. One step is enough.", "💧 Water. Breath. Begin."],
    midday: ["🎯 Midday. One stable block.", "⚡ Recenter. One lane.", "🌿 Back to structure."],
    evening: ["🌙 Evening. Release the day.", "🪞 Close the loop. Tomorrow is new.", "🧘 Rest. Enough for today."]
  },
  ro: {
    morning: ["☀️ Bună dimineața. Înapoi pe drum.", "🐉 Dimineață. Un pas e suficient.", "💧 Apă. Respirație. Start."],
    midday: ["🎯 Amiază. Un bloc stabil.", "⚡ Recenter. O bandă.", "🌿 Înapoi la structură."],
    evening: ["🌙 Seară. Lasă ziua.", "🪞 Închide ciclul. Mâine e nou.", "🧘 Odihnește. Destul pentru azi."]
  }
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} session
 */
function pickDailyPresenceLine(lang, phase, userId, dateKey, session) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const slot = phase === "late_night" ? "evening" : phase;
  const pool = PRESENCE[locked]?.[slot] || PRESENCE.en[slot];
  const line = pickSeeded(pool, `${userId}|dpv2|${dateKey}|${slot}`);
  const hint = energyToneHint(session, locked);
  return `${line}\n${hint}`;
}

/**
 * Rare opener for daily rhythm — not every message.
 */
function maybeDailyPresenceOpener(lang, phase, userId, dateKey, session, chance = 0.14) {
  const seed = `${userId}|dpo|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 12 >= Math.floor(chance * 12)) return null;
  return pickDailyPresenceLine(lang, phase, userId, dateKey, session).split("\n")[0];
}

module.exports = { PRESENCE, pickDailyPresenceLine, maybeDailyPresenceOpener };
