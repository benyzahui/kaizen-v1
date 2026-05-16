/**
 * Lightweight presence memory — emotional continuity without long-term AI memory.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {object} session
 * @param {object} state analyzeUserState snapshot
 * @param {string} text
 * @param {string} category
 */
function buildPresenceSnapshot(session, state, text, category) {
  const prev = session.presenceMemory || {};
  let emotionalState = prev.emotionalState || "stable";

  if (state.emotionalIntensity >= 7 || category === "chaos_loop") {
    emotionalState = "overloaded";
  } else if (state.scatter >= 6) {
    emotionalState = "scattered";
  } else if (state.energyLevel <= 3) {
    emotionalState = "tired";
  } else if (state.emotionalIntensity <= 3 && state.scatter <= 3) {
    emotionalState = "grounded";
  } else if (state.mentorMode === "sharp_focus") {
    emotionalState = "focused";
  }

  const mission =
    session.currentMission?.trim() ||
    session.sessionTodayFocus?.trim() ||
    prev.mission ||
    null;

  let focus = prev.focus || "stability";
  if (session.userPrimaryPath === "trading") focus = "trading";
  else if (session.userPrimaryPath === "business") focus = "execution";
  else if (state.mentorMode === "recovery_mode") focus = "recovery";

  const tone =
    session.userIntensityPreference === "direct"
      ? "direct"
      : session.userIntensityPreference === "gentle"
        ? "gentle"
        : prev.tone || "balanced";

  let energyPattern = prev.energyPattern || "neutral";
  if (state.energyLevel <= 3) energyPattern = "mental fatigue";
  else if (category === "energy_question") energyPattern = "energy read";
  else if (state.coachState === "trading_impulse_lane") energyPattern = "trading pressure";

  const lastImportantTopic =
    String(text || "").trim().slice(0, 200) ||
    session.lastTopic ||
    prev.lastImportantTopic ||
    null;

  return {
    emotionalState,
    mission,
    focus,
    tone,
    energyPattern,
    lastImportantTopic,
    lastEnergyDirection: category === "energy_question" ? "energy" : prev.lastEnergyDirection,
    overloadActive: emotionalState === "overloaded" || emotionalState === "scattered",
    updatedAt: Date.now()
  };
}

/**
 * @param {object} patch
 */
function presenceMemoryPatch(patch) {
  return { presenceMemory: patch };
}

/**
 * Occasional memory reference — not every reply.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} [seed]
 */
function maybePresenceMemoryLine(session, lang, seed = "") {
  const pm = session.presenceMemory;
  if (!pm || !session.onboardingCompleted) return null;
  if (Math.random() > 0.28) return null;

  const r = getResponses(lang);
  const pool = [];

  if (pm.overloadActive && pm.emotionalState === "overloaded") {
    pool.push(...(r.memoryRefOverload || []));
  }
  if (pm.emotionalState === "grounded" && session.lastEmotionalIntensity >= 6) {
    pool.push(...(r.memoryRefGroundedAfterChaos || []));
  }
  if (pm.mission) {
    pool.push(
      ...(r.memoryRefMission || []).map((line) =>
        String(line).replace("{mission}", pm.mission.slice(0, 80))
      )
    );
  }
  if (pm.lastImportantTopic && (session.messages || []).length >= 3) {
    pool.push(...(r.memoryRefTopic || []));
  }

  if (!pool.length) return null;
  return pickSeeded(pool, seed || `mem_${session.lastAt}_${pm.emotionalState}`);
}

module.exports = {
  buildPresenceSnapshot,
  presenceMemoryPatch,
  maybePresenceMemoryLine
};
