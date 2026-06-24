/**
 * Unified daily content schema — future expansion without rewrites.
 */

const TIME_OF_DAY = ["morning", "midday", "evening", "late_night"];
const ENERGY_STATES = ["exhausted", "low", "stable", "high", "overstimulated"];
const ACTIVE_PATHS = [
  "discipline",
  "energy",
  "stabilization",
  "warrior",
  "recovery",
  "trading"
];
const EMOTIONAL_TONES = [
  "calm",
  "grounded",
  "focus",
  "release",
  "warrior",
  "reflective",
  "safety",
  "awareness"
];
const INTENSITIES = ["low", "medium", "high"];

/**
 * @param {object} raw
 */
function normalizeContentEntry(raw) {
  const phases = raw.phases || raw.timeOfDay || ["morning", "midday", "evening"];
  return {
    id: raw.id,
    kind: raw.kind || "prompt",
    language: raw.language,
    category: raw.category,
    text: raw.text || null,
    title: raw.title || null,
    actions: raw.actions || null,
    timeOfDay: phases,
    phases,
    energyState: raw.energyState || raw.energy || ENERGY_STATES,
    energy: raw.energyState || raw.energy || ENERGY_STATES,
    activePath: raw.activePath || raw.modes || [],
    modes: raw.activePath || raw.modes || [],
    emotionalTone: raw.emotionalTone || "calm",
    intensity: raw.intensity || "medium",
    contexts: raw.contexts || ["default"],
    atmosphere: raw.atmosphere,
    tags: raw.tags || []
  };
}

/**
 * @param {object} entry
 * @param {object} ctx
 * @param {string} phase
 */
function contentMatches(entry, ctx, phase) {
  const slot = phase === "late_night" ? "evening" : phase;
  if (!entry.phases?.includes(slot) && !entry.timeOfDay?.includes(slot)) return false;

  const energy = ctx.energyState || "stable";
  if (entry.energy?.length && !entry.energy.includes(energy)) {
    if (energy === "overstimulated" && (entry.energy.includes("high") || entry.energy.includes("stable"))) {
      // allow stabilization for overstimulated
    } else if (entry.intensity !== "low") return false;
  }

  if (entry.modes?.length && ctx.activeMode) {
    if (!entry.modes.includes(ctx.activeMode) && !entry.activePath?.includes(ctx.primaryPath)) {
      return false;
    }
  }

  if (ctx.primaryPath && entry.activePath?.length) {
    if (
      !entry.activePath.includes(ctx.primaryPath) &&
      !entry.modes?.includes(ctx.activeMode)
    ) {
      return false;
    }
  }

  return true;
}

module.exports = {
  TIME_OF_DAY,
  ENERGY_STATES,
  ACTIVE_PATHS,
  EMOTIONAL_TONES,
  INTENSITIES,
  normalizeContentEntry,
  contentMatches
};
