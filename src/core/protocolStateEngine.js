/**
 * Protocol state model — energy, discipline, nervous system, active mode.
 */

const { analyzeUserState } = require("./responseEngine");

/**
 * @param {object} session
 * @param {string} text
 * @param {string} [category]
 */
function buildProtocolState(session, text, category) {
  const trimmed = String(text || "").trim();
  const commandOnly = /^\/[a-z0-9_]+$/i.test(trimmed);
  if (
    commandOnly &&
    (session?.energyState || session?.disciplineState || session?.nervousSystemState)
  ) {
    return {
      energyState: session.energyState || "stable",
      disciplineState: session.disciplineState || "focused",
      nervousSystemState: session.nervousSystemState || "calm",
      activeMode:
        session?.activeMode ||
        mapPathToMode(session?.userPrimaryPath) ||
        "stabilization",
      analyzed: session?.protocolState?.analyzed || {}
    };
  }

  const state = analyzeUserState(text, session, category);
  const pm = session?.presenceMemory || {};

  let energyState = "stable";
  if (state.energyLevel <= 2 || /(exhausted|kimerült|epuizat)/i.test(text)) {
    energyState = "exhausted";
  } else if (state.energyLevel >= 7 && state.emotionalIntensity <= 4) {
    energyState = "high";
  } else if (state.energyLevel <= 3) {
    energyState = "low";
  } else if (
    state.emotionalIntensity >= 6 ||
    state.scatter >= 6 ||
    pm.emotionalState === "overloaded"
  ) {
    energyState = "overstimulated";
  }

  let disciplineState = "focused";
  if (state.mentorMode === "disciplined_push" && state.seriousness < 40) {
    disciplineState = "drifting";
  } else if (state.coachState === "procrastinating" || state.coachState === "start_paralysis") {
    disciplineState = "drifting";
  } else if (state.seriousness >= 70 && state.scatter <= 4) {
    disciplineState = "locked_in";
  } else if (state.scatter >= 5) {
    disciplineState = "inconsistent";
  }

  let nervousSystemState = "calm";
  if (state.emotionalIntensity >= 7 || pm.emotionalState === "overloaded") {
    nervousSystemState = "overloaded";
  } else if (/(anxious|pánik|panic|félek|anxiet)/i.test(text)) {
    nervousSystemState = "anxious";
  } else if (pm.emotionalState === "grounded" || state.emotionalIntensity <= 3) {
    nervousSystemState = "grounded";
  }

  const activeMode =
    session?.activeMode ||
    mapPathToMode(session?.userPrimaryPath) ||
    "stabilization";

  return {
    energyState,
    disciplineState,
    nervousSystemState,
    activeMode,
    analyzed: state
  };
}

/**
 * @param {string|null} path
 */
function mapPathToMode(path) {
  const map = {
    stabilization: "stabilization",
    emotional: "stabilization",
    discipline: "discipline",
    selfdev: "discipline",
    energy: "energy",
    spiritual: "energy",
    warrior: "warrior",
    recovery: "recovery",
    trading: "trading",
    physical: "discipline",
    business: "discipline",
    mixed: "stabilization"
  };
  return map[path] || "stabilization";
}

/**
 * @param {string|number} userId
 * @param {object} protocolState
 */
function protocolStatePatch(protocolState) {
  return {
    protocolState,
    energyState: protocolState.energyState,
    disciplineState: protocolState.disciplineState,
    nervousSystemState: protocolState.nervousSystemState,
    activeMode: protocolState.activeMode
  };
}

module.exports = {
  buildProtocolState,
  mapPathToMode,
  protocolStatePatch
};
