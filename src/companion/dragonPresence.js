/**
 * Subtle dragon archetype atmosphere — rare, never roleplay.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const SKIP = new Set([
  "onboarding",
  "micro_reward",
  "companion_checkin",
  "accountability_followup",
  "cooldown"
]);

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} seed
 */
function maybeDragonWhisper(lang, category, seed = "") {
  if (SKIP.has(category)) return null;
  if (Math.random() > 0.06) return null;
  const r = getResponses(lang);
  const pool = r.dragonWhispers || [];
  if (!pool.length) return null;
  return pickSeeded(pool, seed || `dragon_${category}`);
}

module.exports = { maybeDragonWhisper, SKIP };
