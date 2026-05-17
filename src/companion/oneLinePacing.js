/**
 * Premium pacing — sometimes one strong line is enough.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const ONE_LINE_CATEGORIES = new Set([
  "casual_greeting",
  "light_conversation",
  "micro_reward",
  "companion_checkin",
  "life_flow",
  "natural_conversation"
]);

/**
 * @param {string} userText
 * @param {object} state
 * @param {string} category
 */
function shouldUseOneLinePacing(userText, state, category) {
  const t = String(userText || "").trim();
  if (category === "life_flow") return true;
  if (ONE_LINE_CATEGORIES.has(category) && t.length < 80) return true;
  if (
    category === "natural_conversation" &&
    (state?.emotionalIntensity >= 5 || state?.energyLevel <= 4)
  ) {
    return true;
  }
  if (category === "reflective_open" && t.length < 90) return true;
  if (t.length < 35 && (state?.responseDepth === "short" || state?.length === "short")) {
    return true;
  }
  if (t.length < 25 && state?.emotionalIntensity < 5) return true;
  return false;
}

/**
 * Collapse long replies to 1–3 lines when pacing calls for it.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} seed
 */
function applyOneLinePacing(body, lang, seed = "") {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (parts.length <= 2) return body;

  const r = getResponses(lang);
  const density = r.densityLines || [];
  const pool = r.oneLineBeats || [];
  const silence = r.silenceBeats || [];

  if (density.length && parts.length > 2 && Math.random() < 0.42) {
    return pickSeeded(density, seed);
  }
  if (silence.length && parts.length > 2 && Math.random() < 0.35) {
    return pickSeeded(silence, seed);
  }
  if (pool.length && Math.random() < 0.32) {
    return pickSeeded(pool, seed);
  }

  if (parts.length > 3) return parts.slice(0, 1).join("\n");
  return parts.slice(0, 2).join("\n");
}

module.exports = { shouldUseOneLinePacing, applyOneLinePacing, ONE_LINE_CATEGORIES };
