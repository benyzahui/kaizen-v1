/**
 * Subtle grounded humor — rare, human, never alpha-coach.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const HUMOR_OK = new Set([
  "natural_conversation",
  "light_conversation",
  "life_flow",
  "focus_drift",
  "casual_greeting"
]);

/**
 * @param {object} state
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} text
 */
function maybeGroundedHumor(state, lang, category, text) {
  if (!HUMOR_OK.has(category)) return null;
  if (!state?.useHumor) return null;
  if (state.emotionalIntensity >= 7) return null;
  if (state.seriousness >= 55) return null;

  const t = String(text || "");
  const scattered =
    state.scatter >= 4 ||
    /(tab|tabs|szétszórt|scattered|9000|production|debug)/i.test(t);
  const overload =
    state.emotionalIntensity >= 5 ||
    /(túl sok|too much|overwhelm|projekt)/i.test(t);

  let chance = 0.06;
  if (scattered) chance = 0.14;
  if (overload && /(projekt|project|új|new)/i.test(t)) chance = 0.12;
  if (category === "life_flow") chance = 0.08;

  if (Math.random() > chance) return null;

  const r = getResponses(lang);
  const pool = r.groundedHumor || [];
  if (!pool.length) return null;

  return pickSeeded(pool, `gh_${category}_${t.slice(0, 16)}`);
}

module.exports = { maybeGroundedHumor, HUMOR_OK };
