/**
 * /help with light session context — commands stay visible, tips stay relevant.
 * Architecture: static menu from i18n + one contextual line from lastCategory.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [session]
 */
function buildHelpReply(lang, session = {}) {
  const r = getResponses(lang);
  const cat = session.lastCategory || "";
  let tip = r.helpTipDefault;

  if (
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
  } else if (cat === "trading_impulse") {
    tip = r.helpTipTrade;
  } else if (cat === "focus_drift" || cat === "work_focus") {
    tip = r.helpTipFocus;
  } else if (cat === "plan_tracking" || cat === "self_development") {
    tip = r.helpTipPlan;
  } else if (cat === "body_energy") {
    tip = r.helpTipBody;
  }

  return lines(r.help, "", "—", "", tip);
}

module.exports = { buildHelpReply };
