/**
 * Humor / sharp mirror — rate-limited so KaiZen stays disciplined, not a gimmick bot.
 *
 * Future LLM: toneEngine selects persona seed + safety flags; model generates lines within bounds.
 */

const HUMOR_INTENTS = new Set([
  "trading_gate",
  "business_focus",
  "body_reset",
  "casual_companion",
  "user_confusion",
  "follow_classify",
  "procrastination_break"
]);

const NO_HUMOR_INTENTS = new Set(["emotional_chaos", "energy_read", "command_help_light"]);

/**
 * @param {object} session
 * @param {string} intent
 * @param {object} r responses bundle (trainingProtocol merged)
 * @returns {string} optional leading line (empty if skip)
 */
function maybeHumorLead(session, intent, r) {
  if (!session?.onboardingCompleted || session?.onboardingSkipped) return "";
  if (NO_HUMOR_INTENTS.has(intent)) return "";
  if (!HUMOR_INTENTS.has(intent)) return "";

  let cd = Number(session.brainHumorCooldown || 0);
  if (cd > 0) return "";

  const pool = r.brainHumorPool || [];
  if (!pool.length) return "";

  const idx =
    typeof session.brainHumorIndex === "number"
      ? session.brainHumorIndex % pool.length
      : 0;
  const line = pool[idx];
  return line || "";
}

/**
 * @param {object} session
 * @param {number} [poolLength]
 */
function humorConsumedPatch(session, poolLength = 6) {
  const pl = Math.max(1, poolLength);
  const nextIdx = (Number(session.brainHumorIndex || 0) + 1) % pl;
  return {
    brainHumorCooldown: 5,
    brainHumorIndex: nextIdx
  };
}

/**
 * Decrement cooldown each user turn (applied from session patch in composer).
 */
function humorIdlePatch(session) {
  const cd = Math.max(0, Number(session.brainHumorCooldown || 0) - 1);
  return { brainHumorCooldown: cd };
}

module.exports = {
  maybeHumorLead,
  humorConsumedPatch,
  humorIdlePatch
};
