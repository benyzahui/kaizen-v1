/**
 * Tiny acknowledgments for healthy actions — not fake hype.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const HEALTHY_RE =
  /\b(futottam|went for a run|ran\b|edzés|workout|trained|slept well|aludtam|hydrat|ittam vizet|drank water|meditat|meditated|breath work|lélegzet|napló|journaled|disciplined trade|closed green|no revenge|pihentem|rested)\b/i;

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 */
function tryMicroReward(text, lang, userId) {
  const t = String(text || "").trim();
  if (t.length > 180 || t.length < 6) return null;
  if (!HEALTHY_RE.test(t)) return null;
  if (/(but|de |however|viszont|dar)/i.test(t) && t.length > 80) return null;

  const r = getResponses(lang);
  const pool = r.microRewards || [];
  if (!pool.length) return null;
  if (Math.random() > 0.55) return null;

  return {
    body: pickSeeded(pool, `micro_${userId}_${t.slice(0, 24)}`),
    category: "micro_reward"
  };
}

module.exports = { tryMicroReward, HEALTHY_RE };
