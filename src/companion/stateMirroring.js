/**
 * Subtle user-state mirroring — stabilize, soften, deepen, concise.
 */

/**
 * @param {object} state
 * @param {object} session
 * @param {string} text
 * @param {string} category
 * @returns {'stabilize'|'soften'|'deepen'|'concise'|'slow'|'sharp'}
 */
function resolveMirrorMode(state, session, text, category) {
  const intensity = state?.emotionalIntensity ?? 0;
  const energy = state?.energyLevel ?? 5;
  const scatter = state?.scatter ?? 0;

  if (category === "chaos_loop" || intensity >= 8) return "stabilize";
  if (scatter >= 6 || session?.presenceMemory?.emotionalState === "scattered") {
    return "stabilize";
  }
  if (energy <= 3 || state?.mentorMode === "recovery_mode") return "soften";
  if (intensity >= 6 || category === "emotional_reflection") return "slow";
  if (
    state?.mentorMode === "sharp_focus" ||
    state?.mentorMode === "disciplined_push" ||
    category === "focus_drift"
  ) {
    return "concise";
  }
  if (intensity <= 3 && scatter <= 3 && energy >= 6 && category === "reflective_open") {
    return "deepen";
  }
  if (state?.useHumor && intensity < 5) return "sharp";
  return "breath";
}

const MIRROR_CAPS = {
  stabilize: { maxLines: 2, maxChars: 180, depth: "short" },
  soften: { maxLines: 3, maxChars: 180, depth: "short" },
  concise: { maxLines: 4, maxChars: 260, depth: "short" },
  slow: { maxLines: 5, maxChars: 360, depth: "medium" },
  deepen: { maxLines: 6, maxChars: 420, depth: "medium" },
  sharp: { maxLines: 3, maxChars: 240, depth: "short" },
  breath: { maxLines: 4, maxChars: 320, depth: "medium" }
};

/**
 * @param {string} mode
 */
function getMirrorCaps(mode) {
  return MIRROR_CAPS[mode] || MIRROR_CAPS.breath;
}

module.exports = { resolveMirrorMode, getMirrorCaps, MIRROR_CAPS };
