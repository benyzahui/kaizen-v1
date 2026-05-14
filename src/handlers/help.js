/**
 * /help with grouped commands + contextual suggested next + tip line.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {object} session
 * @param {object} r
 */
function buildSuggestedNextLine(session, r) {
  const cat = session.lastCategory || "";
  const st = session.conversationState || "";
  if (
    [
      "chaos_loop",
      "immediate_recovery",
      "pattern_blocked",
      "session_loop",
      "emotional_repeat_triple"
    ].includes(cat) ||
    st === "overload" ||
    st === "recovery"
  ) {
    return r.helpSuggestedOverload;
  }
  if (cat === "trading_impulse" || cat === "trading_context" || st === "trading") {
    return r.helpSuggestedTrading;
  }
  if (cat === "energy_question" || st === "energy_read") {
    return r.helpSuggestedEnergy;
  }
  if (cat === "focus_drift" || cat === "body_energy" || st === "focus") {
    return r.helpSuggestedFocus;
  }
  return r.helpSuggestedDefault;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [session]
 */
function buildHelpReply(lang, session = {}) {
  const r = getResponses(lang);
  const cat = session.lastCategory || "";
  let tip = r.helpTipDefault;

  if (session.onboardingActive && !session.onboardingCompleted) {
    tip = r.helpTipOnboarding;
  } else if (
    [
      "chaos_loop",
      "immediate_recovery",
      "pattern_blocked",
      "session_loop",
      "emotional_repeat_triple"
    ].includes(cat)
  ) {
    tip = r.helpTipOverload;
  } else if (cat === "emotional_reflection") {
    tip = r.helpTipEmotional;
  } else if (cat === "trading_impulse" || cat === "trading_context") {
    tip = r.helpTipTrade;
  } else if (cat === "focus_drift" || cat === "work_focus") {
    tip = r.helpTipFocus;
  } else if (cat === "plan_tracking" || cat === "self_development") {
    tip = r.helpTipPlan;
  } else if (cat === "body_energy") {
    tip = r.helpTipBody;
  } else if (cat === "casual_greeting" || cat === "light_conversation") {
    tip = r.helpTipLight || r.helpTipDefault;
  }

  const grouped = r.helpGrouped || r.help;
  const suggest = buildSuggestedNextLine(session, r);

  return lines(
    grouped,
    "",
    r.helpSuggestedLabel,
    suggest,
    "",
    "—",
    "",
    tip
  );
}

module.exports = { buildHelpReply };
