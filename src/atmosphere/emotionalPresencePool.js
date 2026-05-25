/**
 * Subtle presence lines — rare, non-manipulative.
 */

const { pickSeeded } = require("../personality/kaizenVoice");

const POOLS = {
  hu: [
    "Itt vagyok.",
    "Nem kell egyedül cipelned.",
    "Holnap új kör.",
    "Lassan stabilizálunk.",
    "Pihenj most.",
    "Egy lépés elég.",
    "Nem kell mindent most."
  ],
  en: [
    "I'm here.",
    "You do not have to carry this alone.",
    "Tomorrow is a new round.",
    "We stabilize slowly.",
    "Rest now.",
    "One step is enough.",
    "Not everything needs solving now."
  ],
  ro: [
    "Sunt aici.",
    "Nu trebuie să duci asta singur.",
    "Mâine e un nou ciclu.",
    "Stabilizăm încet.",
    "Odihnește acum.",
    "Un pas e suficient.",
    "Nu totul cere soluție acum."
  ]
};

const CRINGE_RE =
  /\b(universe|manifest|twin flame|cosmic|guru|jósl|predicție|horoscope|sorsod|univerzum)\b/i;

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} tone from timeAwareTone
 * @param {string} atmosphereState
 * @param {string|number} userId
 * @param {number} [baseChance]
 * @returns {string|null}
 */
function maybePresenceLine(lang, tone, atmosphereState, userId, baseChance) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  let chance = baseChance ?? tone?.presenceChance ?? 0.06;
  if (atmosphereState === "recovery" || atmosphereState === "emotional") chance += 0.04;
  if (tone?.timeSlot === "late_night") chance += 0.05;
  if (atmosphereState === "overloaded") chance += 0.02;

  const seed = `${userId}|presence|${Date.now() >> 12}`;
  const roll = pickSeeded([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], seed);
  if (roll >= Math.floor(chance * 10)) return null;

  const pool = POOLS[locked] || POOLS.en;
  const line = pickSeeded(pool, `${seed}|line`);
  if (CRINGE_RE.test(line)) return null;
  return line;
}

module.exports = { POOLS, maybePresenceLine, CRINGE_RE };
