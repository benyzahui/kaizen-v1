/**
 * Trigger-point narration: respond to detected coach state, not only surface text.
 * Copy lives in i18n (trainingProtocol.*) — this module only selects and merges.
 *
 * Higher-level interactive routing lives in src/brain/coachBrain.js (facade for future LLM).
 */

const { lines } = require("../personality/kaizenVoice");

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} timeSlot
 * @param {object} r responses bundle
 */
function slotPreamble(timeSlot, r) {
  if (timeSlot === "morning") return r.compSlotMorning || "";
  if (timeSlot === "midday") return r.compSlotMidday || "";
  if (timeSlot === "evening") return r.compSlotEvening || "";
  return r.compSlotLate || "";
}

/**
 * @param {string} preamble
 * @param {string} body
 */
function mergePreamble(preamble, body) {
  const p = String(preamble || "").trim();
  if (!p) return body;
  return lines(p, "", body);
}

/**
 * @param {string} coachState from stateDetector
 * @param {object} r
 * @returns {{ body: string, nextCommand: string }}
 */
function narrateTrigger(coachState, r) {
  switch (coachState) {
    case "agreement_surface":
      return { body: r.compAgreement, nextCommand: "/pulse" };
    case "trading_session_anchor":
      return { body: r.compNyOpen, nextCommand: "/trade" };
    case "trading_impulse_lane":
      return { body: r.compTradingImpulse, nextCommand: "/trade" };
    case "start_paralysis":
      return { body: r.compStartParalysis, nextCommand: "/mission" };
    case "procrastinating":
      return { body: r.compProcrastinate, nextCommand: "/focus" };
    case "casual_talk":
      return { body: r.compCasualTalk, nextCommand: "/pulse" };
    case "tired_push":
      return { body: r.compTiredPush, nextCommand: "/body" };
    case "scattered_state":
      return { body: r.compScattered, nextCommand: "/focus" };
    case "overload_recovery":
      return { body: r.compOverload, nextCommand: "/reset" };
    case "mission_drift":
      return { body: r.compMissionDrift, nextCommand: "/mission" };
    case "seeking_permission":
      return { body: r.compSeekingPermission, nextCommand: "/clarity" };
    case "seeking_clarity":
      return { body: r.compSeekingClarity, nextCommand: "/clarity" };
    case "overthinking":
      return { body: r.compOverthink, nextCommand: "/focus" };
    case "emotional_open":
      return { body: r.compEmotional, nextCommand: "/mirror" };
    case "body_neglect":
      return { body: r.compBodyNeglect, nextCommand: "/body" };
    default:
      return { body: "", nextCommand: "/pulse" };
  }
}

/**
 * Default lead when no specific trigger copy matched.
 * @param {'morning'|'midday'|'evening'|'late_night'} timeSlot
 * @param {object} r
 */
function narrateDefault(timeSlot, r) {
  if (timeSlot === "morning")
    return { body: r.compDefaultMorning, nextCommand: "/morning" };
  if (timeSlot === "midday")
    return { body: r.compDefaultMidday, nextCommand: "/focus" };
  if (timeSlot === "evening")
    return { body: r.compDefaultEvening, nextCommand: "/mirror" };
  return { body: r.compDefaultLate, nextCommand: "/evening" };
}

module.exports = {
  slotPreamble,
  mergePreamble,
  narrateTrigger,
  narrateDefault
};
