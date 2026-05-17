/**
 * Conversation first — command hints only when truly useful.
 */

const HEAVY_CMD_OK = new Set([
  "session_loop",
  "immediate_recovery",
  "pattern_blocked",
  "emotional_repeat_triple",
  "help_intent"
]);

/**
 * @param {string} category
 * @param {string} text
 * @param {object} session
 * @param {string|null} suggested
 */
function resolveCommandHint(category, text, session, suggested) {
  if (!suggested) return null;

  const t = String(text || "").trim();
  if (/^\s*\/\w+/i.test(t)) return null;

  if (HEAVY_CMD_OK.has(category)) return suggested;

  if (
    /(how do i use|what commands|milyen parancs|ce comenzi)/i.test(t) &&
    suggested === "/guide"
  ) {
    return "/guide";
  }

  if (category === "energy_question") return null;

  if (/\/(reset|pulse|focus|guide|energy)\b/i.test(String(suggested || ""))) {
    return null;
  }

  const humanFirst = new Set([
    "natural_conversation",
    "emotional_reflection",
    "life_flow",
    "relational_flow",
    "light_conversation",
    "casual_greeting",
    "companion_checkin",
    "body_energy",
    "light_accountability"
  ]);
  if (humanFirst.has(category)) return null;

  if (category === "trading_impulse" && session?.userPrimaryPath === "trading") {
    return Math.random() < 0.08 ? suggested : null;
  }

  if (category === "focus_drift" || category === "chaos_loop") {
    return Math.random() < 0.05 ? suggested : null;
  }

  return Math.random() < 0.06 ? suggested : null;
}

module.exports = { resolveCommandHint, HEAVY_CMD_OK };
