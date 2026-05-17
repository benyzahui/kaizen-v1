/**
 * Dynamic atmosphere openings — time, state, memory, silence.
 */

const { pickSeeded } = require("../personality/tone");
const { getTimeSlot } = require("../core/timeContext");
const { getResponses } = require("../i18n/getResponses");

const OPENING_OK = new Set([
  "casual_greeting",
  "reflective_open",
  "natural_conversation",
  "life_flow",
  "unknown",
  "light_conversation",
  "companion_checkin"
]);

const SKIP_OPENING = new Set([
  "onboarding",
  "energy_question",
  "immediate_recovery",
  "pattern_blocked",
  "help_intent"
]);

/**
 * @param {object} session
 */
function silenceHours(session) {
  const gap = Date.now() - (session?.lastAt || Date.now());
  return gap / (60 * 60 * 1000);
}

/**
 * @param {object} ctx companion context
 * @param {string} category
 */
function pickDynamicOpening(ctx, category) {
  if (SKIP_OPENING.has(category) || !OPENING_OK.has(category)) return null;
  const session = ctx.session || {};
  if (!session.onboardingCompleted) return null;

  const hours = silenceHours(session);
  const msgs = session.messages || [];
  const isReturn = hours >= 4 || (msgs.length <= 2 && hours >= 1);
  const isSessionStart = msgs.length <= 1;
  if (!isReturn && !isSessionStart && category !== "casual_greeting") return null;
  if (Math.random() > (isReturn ? 0.55 : 0.32)) return null;

  const slot = getTimeSlot(session);
  const pm = session.presenceMemory || {};
  const state = ctx.state || {};
  const r = getResponses(ctx.lang);
  const pool = [];

  if (hours >= 8) {
    pool.push(...(r.dynamicOpenings?.returnAfterSilence || []));
  }

  if (slot === "morning") {
    pool.push(...(r.dynamicOpenings?.morning || []));
  } else if (slot === "evening" || slot === "late_night") {
    pool.push(...(r.dynamicOpenings?.lateNight || r.dynamicOpenings?.evening || []));
  } else if (slot === "midday") {
    pool.push(...(r.dynamicOpenings?.midday || []));
  }

  if (pm.emotionalState === "focused" || state.mentorMode === "sharp_focus") {
    pool.push(...(r.dynamicOpenings?.focused || []));
  }
  if (pm.emotionalState === "overloaded" || pm.overloadActive) {
    pool.push(...(r.dynamicOpenings?.overloaded || []));
  } else if (pm.emotionalState === "grounded" && session.lastEmotionalIntensity >= 5) {
    pool.push(...(r.dynamicOpenings?.groundedReturn || []));
  }
  if (pm.emotionalState === "tired" || state.energyLevel <= 3) {
    pool.push(...(r.dynamicOpenings?.tired || []));
  }

  if (!pool.length) return null;
  return pickSeeded(
    pool,
    `dyn_${slot}_${pm.emotionalState}_${category}_${msgs.length}_${Math.floor(hours)}`
  );
}

module.exports = { pickDynamicOpening, silenceHours, OPENING_OK };
