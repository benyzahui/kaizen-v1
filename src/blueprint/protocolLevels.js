/**
 * Dragon Blueprint protocol levels — beginner default, safety-first.
 */

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

/**
 * @param {object} session
 * @returns {'beginner'|'intermediate'|'advanced'}
 */
function resolveProtocolLevel(session) {
  const explicit = session?.protocolLevel;
  if (LEVEL_ORDER.includes(explicit)) return explicit;

  const intensity = session?.userIntensityPreference;
  const dragon = Number(session?.dragonLevel) || 1;

  if (dragon >= 6 || intensity === "direct") return "advanced";
  if (dragon >= 3 || intensity === "balanced") return "intermediate";
  return "beginner";
}

/**
 * Pick action tier from level (never skip beginner safety on low energy).
 * @param {object} tierCopy { beginner, intermediate, advanced }
 * @param {'beginner'|'intermediate'|'advanced'} level
 * @param {object} ctx protocol state
 */
function pickActionTier(tierCopy, level, ctx) {
  if (!tierCopy) return [];
  let key = "beginner";
  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    key = "beginner";
  } else if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    key = "beginner";
  } else if (
    level === "advanced" &&
    ctx.energyState === "high" &&
    ctx.disciplineState === "locked_in"
  ) {
    key = "advanced";
  } else if (level === "intermediate") {
    key = "intermediate";
  }
  const v =
    tierCopy[key] ||
    tierCopy.beginner ||
    tierCopy.intermediate ||
    [];
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
}

module.exports = {
  LEVEL_ORDER,
  resolveProtocolLevel,
  pickActionTier
};
