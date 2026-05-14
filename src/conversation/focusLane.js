/**
 * Detect rapid "lane switching" in open conversation (structure, not therapy).
 * Uses last two stored message categories + the incoming classification bucket.
 */

const BUCKET = {
  trading_impulse: "trading",
  trading_context: "trading",
  plan_tracking: "plan",
  work_focus: "work",
  emotional_reflection: "emotion",
  chaos_loop: "emotion",
  focus_drift: "mind",
  body_energy: "body",
  energy_question: "energy",
  self_development: "growth",
  general_curiosity: "mind",
  reflective_open: "reflect",
  light_conversation: "light",
  casual_greeting: "light",
  help_intent: "light",
  clarity_protocol: "mind",
  easter_creator: "light",
  immediate_recovery: "overload",
  pattern_blocked: "overload",
  session_loop: "overload",
  emotional_repeat_triple: "emotion",
  cooldown: "trading",
  onboarding: "light"
};

/**
 * @param {string|null|undefined} category
 * @returns {string|null}
 */
function laneBucket(category) {
  if (!category) return null;
  return BUCKET[category] || "open";
}

/**
 * Last two completed turns (session.messages) plus this turn's bucket — all three differ.
 * @param {{ messages?: { category?: string|null }[] }} session
 * @param {string|null} nextCategory
 */
function detectLaneWandering(session, nextCategory) {
  const m = session?.messages || [];
  if (m.length < 2) return false;
  const b0 = laneBucket(m[m.length - 2]?.category);
  const b1 = laneBucket(m[m.length - 1]?.category);
  const b2 = laneBucket(nextCategory);
  if (!b0 || !b1 || !b2) return false;
  if (b0 === "light" || b1 === "light" || b2 === "light") return false;
  if (b0 === b1 || b1 === b2 || b0 === b2) return false;
  return true;
}

module.exports = { detectLaneWandering, laneBucket };
