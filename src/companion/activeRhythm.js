/**
 * ACTIVE_RHYTHM_SYSTEM — time-of-day companion context.
 * Does not send pushes here; supplies tone + optional nudge hint for replies.
 */

const { getTimeSlot } = require("../core/timeContext");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function getActiveRhythmContext(session, lang = "en") {
  const slot = getTimeSlot(session);
  const r = getResponses(lang);
  const hints = r.rhythmHints || {};
  const phaseMap = {
    morning: "morning_alignment",
    midday: "midday_correction",
    evening: "evening_mirror",
    late_night: "late_downshift"
  };
  const phase = phaseMap[slot] || "neutral";
  const hint = hints[slot] || hints.neutral || null;

  return {
    timeSlot: slot,
    phase,
    hint,
    shouldNudge:
      Boolean(session.onboardingCompleted) &&
      !session.companionPaused &&
      (slot === "morning" || slot === "evening")
  };
}

/**
 * One-line rhythm tail — rare, appended only when plan says so.
 * @param {object} rhythm
 * @param {'en'|'hu'|'ro'} lang
 */
function rhythmTailIfNeeded(rhythm, lang) {
  if (!rhythm?.hint || !rhythm.shouldNudge) return null;
  return rhythm.hint;
}

module.exports = { getActiveRhythmContext, rhythmTailIfNeeded };
