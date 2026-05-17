/**
 * PRESENCE_SYSTEM — emotional mirroring, pacing, human leads/closes.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { applyModePresence } = require("./modePresence");

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
  "casual_greeting",
  "natural_conversation",
  "emotional_reflection",
  "focus_drift",
  "body_energy",
  "reflective_open",
  "companion_checkin",
  "micro_reward",
  "accountability_setup",
  "accountability_followup",
  "natural_conversation",
  "thread_continuity",
  "life_flow"
]);

/**
 * @param {string} body
 * @param {object} ctx companion context
 * @param {string} category
 */
function applyPresence(body, ctx, category) {
  if (SKIP_PRESENCE.has(category)) return body;
  const { state, memory, lang, session } = ctx;
  const mode = ctx.conversationMode || "MODE_STABLE";
  const skipLead =
    category === "light_conversation" || category === "trading_context";
  let out = applyModePresence(
    body,
    mode,
    lang,
    session || { messages: memory.short.turns, userName: memory.permanent.userName },
    category,
    skipLead
  );

  const r = getResponses(lang);
  if (state.useHumor && state.seriousness >= 40) {
    const quips = r.presenceQuips || [];
    if (quips.length && Math.random() < 0.12) {
      const q = pickSeeded(quips, `${category}_${memory.short.turns.length}`);
      out = lines(q, "", out);
    }
  }

  if (state.scatter >= 4 && Math.random() < 0.08) {
    const sarcasm = r.sarcasmRare || [];
    if (sarcasm.length) {
      out = lines(pickSeeded(sarcasm, `sar_${category}`), "", out);
    }
  }

  if (
    Math.random() < 0.04 &&
    category !== "trading_context" &&
    category !== "reflective_open"
  ) {
    const elite = r.eliteWhispers || [];
    if (elite.length) {
      out = lines(out, "", pickSeeded(elite, `elite_${state.mentorMode}`));
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
