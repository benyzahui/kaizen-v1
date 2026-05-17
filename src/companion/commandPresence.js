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

  if (category === "energy_question" && /energy|energia/i.test(t)) {
    return Math.random() < 0.15 ? suggested : null;
  }

  if (category === "natural_conversation" || category === "emotional_reflection") {
    return null;
  }

  if (category === "trading_impulse" && session?.userPrimaryPath === "trading") {
    return Math.random() < 0.12 ? suggested : null;
  }

  return Math.random() < 0.08 ? suggested : null;
}

module.exports = { resolveCommandHint, HEAVY_CMD_OK };
