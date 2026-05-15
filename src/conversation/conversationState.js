/**
 * Maps classifier / command routing to a coarse conversation state for help,
 * pacing, and suggested-next hints (not a second engine — display + nudges).
 */

/**
 * @param {string|null|undefined} category
 * @param {{ command?: string|null }} [opts]
 * @returns {string}
 */
function mapCategoryToConversationState(category, opts = {}) {
  if (opts.command) return "command_mode";
  const c = category || "";
  if (c === "onboarding") return "onboarding";
  if (c === "companion_active" || c === "companion_flow" || c === "companion_paused") {
    return "companion";
  }
  if (c === "chaos_loop" || c === "session_loop" || c === "emotional_repeat_triple") {
    return "overload";
  }
  if (c === "immediate_recovery" || c === "pattern_blocked") return "recovery";
  if (c === "energy_question") return "energy_read";
  if (c === "focus_drift" || c === "body_energy") return "focus";
  if (c === "trading_impulse" || c === "trading_context") return "trading";
  if (c === "plan_tracking" || c === "clarity_protocol") return "planning";
  if (c === "casual_greeting") return "casual";
  if (
    c === "light_conversation" ||
    c === "help_intent" ||
    c === "easter_creator" ||
    c === "unknown"
  ) {
    return "light_conversation";
  }
  return "reflective";
}

module.exports = { mapCategoryToConversationState };
