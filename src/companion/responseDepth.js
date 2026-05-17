/**
 * Response depth scaling — short / medium / deep.
 */

const { getResponses } = require("../i18n/getResponses");
const { pickSeeded } = require("../personality/tone");
const { capWallLength } = require("./emotionalPacing");

/**
 * @param {string} text
 * @param {string} category
 * @param {object} state
 */
function resolveResponseDepth(text, category, state) {
  const t = String(text || "").trim();
  const low = t.toLowerCase();

  if (
    t.length < 90 &&
    /(megyek|kimegyek|futni|futok|run|walk|gym|edzek|edzés|alvás|sleep|shower|víz|water|kávé|coffee|eating|eszek)/i.test(
      low
    )
  ) {
    return "short";
  }

  if (category === "life_flow") return "short";

  if (category === "casual_greeting" || category === "light_conversation") {
    return t.length < 60 ? "short" : "medium";
  }

  if (category === "natural_conversation" || category === "emotional_reflection") {
    return state.emotionalIntensity >= 7 ? "medium" : "short";
  }

  if (category === "reflective_open" && state.emotionalIntensity >= 5) {
    return state.emotionalIntensity >= 7 ? "medium" : "short";
  }

  if (state.mentorMode === "sharp_focus" || state.mentorMode === "disciplined_push") {
    return "short";
  }

  if (state.length === "short") return "short";
  return "medium";
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 */
function tryShortActionReply(text, lang, userId) {
  const t = String(text || "").trim();
  if (t.length > 100) return null;
  if (!/(megyek|futni|futok|run|walk|gym|edzek|alvás|sleep)/i.test(t)) return null;

  const r = getResponses(lang);
  const pool = r.shortActionReplies || [];
  if (!pool.length) return null;
  return pickSeeded(pool, `shortact_${userId}_${t.slice(0, 20)}`);
}

/**
 * @param {string} body
 * @param {'short'|'medium'|'deep'} depth
 */
function applyDepthScale(body, depth) {
  if (depth === "short") return capWallLength(body, 4, 280);
  if (depth === "deep") return capWallLength(body, 10, 680);
  return capWallLength(body, 8, 520);
}

module.exports = {
  resolveResponseDepth,
  tryShortActionReply,
  applyDepthScale
};
