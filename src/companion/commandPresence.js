/**
 * Conversation first — command hints only when truly useful.
 * Beta ship: never embed hints in reply body (human-first open chat).
 */

/**
 * @param {string} category
 * @param {string} text
 * @param {object} session
 * @param {string|null} suggested
 */
function resolveCommandHint(category, text, session, suggested) {
  if (!suggested) return null;
  if (/^\s*\/\w+/i.test(String(text || ""))) return null;

  if (
    category === "program_guidance" ||
    category === "rhythm_stabilization" ||
    category === "path_correction"
  ) {
    return suggested;
  }

  if (
    category === "help_intent" &&
    /(how do i use|what commands|milyen parancs|ce comenzi)/i.test(text) &&
    suggested === "/guide"
  ) {
    return "/guide";
  }

  return null;
}

/** @deprecated body hints disabled for beta; kept for tests importing the set */
const HEAVY_CMD_OK = new Set([
  "session_loop",
  "immediate_recovery",
  "pattern_blocked",
  "emotional_repeat_triple",
  "help_intent"
]);

module.exports = { resolveCommandHint, HEAVY_CMD_OK };
