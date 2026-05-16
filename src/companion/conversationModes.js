/**
 * Phase 2 — lightweight conversation modes (internal only).
 * Drives tone; not shown as menus to the user.
 */

/**
 * @typedef {'MODE_STABLE'|'MODE_OVERLOADED'|'MODE_FOCUSED'|'MODE_REFLECTIVE'|'MODE_DISCIPLINE'|'MODE_RECOVERY'|'MODE_TRADING'} ConversationMode
 */

/**
 * @param {object} state analyzeUserState snapshot
 * @param {string} category classify category
 */
function resolveConversationMode(state, category) {
  if (category === "chaos_loop" || state.emotionalIntensity >= 7) {
    return "MODE_OVERLOADED";
  }
  if (state.energyLevel <= 4 || state.mentorMode === "recovery_mode") {
    return "MODE_RECOVERY";
  }
  if (
    category === "trading_impulse" ||
    category === "trading_context" ||
    state.mentorMode === "warrior_mode"
  ) {
    return "MODE_TRADING";
  }
  if (
    state.mentorMode === "disciplined_push" ||
    state.mentorMode === "sharp_focus" ||
    category === "plan_tracking"
  ) {
    return "MODE_DISCIPLINE";
  }
  if (category === "focus_drift" || state.scatter >= 6) {
    return "MODE_FOCUSED";
  }
  if (
    state.mentorMode === "reflective_mode" ||
    category === "emotional_reflection" ||
    category === "reflective_open"
  ) {
    return "MODE_REFLECTIVE";
  }
  return "MODE_STABLE";
}

function conversationModePatch(mode) {
  return { conversationMode: mode };
}

module.exports = { resolveConversationMode, conversationModePatch };
