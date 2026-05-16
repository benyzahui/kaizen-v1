/**
 * Time-of-day presence — morning / day / evening tone shifts.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/tone");
const { getTimeSlot } = require("../core/timeContext");
const { getResponses } = require("../i18n/getResponses");

const SKIP_TIME = new Set([
  "onboarding",
  "language_switch",
  "energy_question",
  "natural_conversation",
  "companion_checkin",
  "cooldown"
]);

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function pickTimeBeat(session, lang, category) {
  if (SKIP_TIME.has(category)) return null;
  const slot = getTimeSlot(session);
  const r = getResponses(lang);
  const pool = r.timePresence?.[slot];
  if (!pool?.length) return null;
  if (Math.random() > 0.32) return null;
  return pickSeeded(pool, `time_${slot}_${category}_${session.messages?.length || 0}`);
}

/**
 * Adjust intensity hint for plan (used by pacing).
 * @param {string} timeSlot
 */
function timeIntensityBias(timeSlot) {
  if (timeSlot === "morning") return { warmth: 0.6, pressure: 0.5 };
  if (timeSlot === "midday") return { warmth: 0.4, pressure: 0.7 };
  if (timeSlot === "evening" || timeSlot === "late_night") {
    return { warmth: 0.75, pressure: 0.3 };
  }
  return { warmth: 0.5, pressure: 0.5 };
}

/**
 * Optional time opening prepended lightly.
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function applyTimePresence(body, ctx, category) {
  if (SKIP_TIME.has(category)) return body;
  const beat = pickTimeBeat(ctx.session || {}, ctx.lang, category);
  if (!beat) return body;
  return lines(beat, "", body);
}

module.exports = { applyTimePresence, pickTimeBeat, timeIntensityBias, SKIP_TIME };
