/**
 * PRESENCE_SYSTEM — emotional mirroring, pacing, human leads/closes.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { applyMoodPresence } = require("./moodPresence");

const SKIP_PRESENCE = new Set([
  "cooldown",
  "pattern_blocked",
  "language_switch",
  "avoidance_mirror",
  "immediate_recovery",
  "session_loop",
  "emotional_repeat_triple",
  "help_intent",
  "energy_question",
  "onboarding",
  "casual_greeting"
]);

/**
 * @param {string} body
 * @param {object} ctx companion context
 * @param {string} category
 */
function applyPresence(body, ctx, category) {
  if (SKIP_PRESENCE.has(category)) return body;
  const { state, memory, lang, plan, mood, session } = ctx;
  const skipLead =
    category === "light_conversation" || category === "trading_context";
  let out = applyMoodPresence(
    body,
    mood || "discipline",
    lang,
    session || { messages: memory.short.turns, userName: memory.permanent.userName },
    category,
    plan,
    skipLead
  );

  if (state.useHumor && state.seriousness >= 40) {
    const r = getResponses(lang);
    const quips = r.presenceQuips || [];
    if (quips.length && Math.random() < 0.22) {
      const q = pickSeeded(quips, `${category}_${memory.short.turns.length}`);
      out = lines(q, "", out);
    }
  }

  const name = memory.permanent.userName;
  if (name && category === "reflective_open" && !out.includes(name)) {
    const r = getResponses(lang);
    if (r.presenceNameAck) {
      out = lines(r.presenceNameAck.replace("{name}", name), "", out);
    }
  }

  return out;
}

module.exports = { applyPresence, SKIP_PRESENCE };
