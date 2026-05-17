/**
 * Daily companion rhythm — morning direction, midday focus, evening downshift.
 * Supportive whispers only; never controlling.
 */

const { pickSeeded } = require("../personality/tone");
const { getTimeSlot } = require("../core/timeContext");
const { getResponses } = require("../i18n/getResponses");

const LOOP_CATEGORIES = new Set([
  "reflective_open",
  "work_focus",
  "plan_tracking",
  "unknown",
  "body_energy",
  "self_development"
]);

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function maybeDailyLoopWhisper(session, lang, category) {
  if (!session?.onboardingCompleted) return null;
  if (!LOOP_CATEGORIES.has(category)) return null;
  if (Math.random() > 0.11) return null;

  const slot = getTimeSlot(session);
  const r = getResponses(lang);
  const pool = r.dailyCompanionLoop?.[slot] || r.dailyCompanionLoop?.default;
  if (!pool?.length) return null;

  return pickSeeded(pool, `dloop_${slot}_${category}_${session.messages?.length || 0}`);
}

module.exports = { maybeDailyLoopWhisper, LOOP_CATEGORIES };
