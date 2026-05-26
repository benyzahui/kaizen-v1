/**
 * Rebuilding mode — detect collapse/recovery state, sync session, calm grounded tone.
 */

const { getTimeSlot } = require("../core/timeContext");
const { resolveBehaviorSignals } = require("../rhythm/behaviorSignals");
const { isInactiveUser } = require("../retention/retentionRhythmEngine");
const { updateSession } = require("../session/sessionStore");
const { resolvePrimaryPathId } = require("../path/dailyPathEngine");

const INJURY_RE =
  /\b(sérül|sérült|injury|rehab|felépül|műtét|térd|váll|hátfáj|back pain|knee|shoulder|mobilit|fizioter|physio|strain|húzód|sprain)\b/i;

const EXHAUSTION_RE =
  /\b(kimerült|burnout|kiég|emotional exhaust|lemerült|epuizat|overwhelm|túlterhelt|nem bírom|can't keep up|brain fog)\b/i;

const SELF_DOUBT_RE =
  /\b(nem hiszem|self.?doubt|nem vagyok elég|nu sunt destul|not good enough|csőd|failed again)\b/i;

const LOW_ENERGY_VALUES = new Set(["low", "exhausted"]);

/**
 * @param {object} session
 */
function isRebuildingModeActive(session) {
  return Boolean(session?.rebuildingModeActive);
}

/**
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function evaluateRebuildingTriggers(session, text = "", now = new Date()) {
  const reasons = [];
  const energy = session?.energyState || session?.protocolState?.energyState;
  const discipline = session?.disciplineState || session?.protocolState?.disciplineState;
  const nervous = session?.nervousSystemState || session?.protocolState?.nervousSystemState;
  const pathId = resolvePrimaryPathId(session);
  const mode = session?.activeMode;
  const signals = resolveBehaviorSignals(session, text, now);
  const t = String(text || "");

  if (pathId === "recovery" || mode === "recovery" || mode === "stabilization") {
    reasons.push("recovery_path");
  }
  if (LOW_ENERGY_VALUES.has(energy)) reasons.push("low_energy");
  if ((session?.lowEnergyStreak || 0) >= 2) reasons.push("repeated_low_energy");
  if (INJURY_RE.test(t)) reasons.push("injury_language");

  for (const m of (session?.messages || []).slice(-6)) {
    if (INJURY_RE.test(m.text || "")) {
      reasons.push("injury_language");
      break;
    }
  }

  if (EXHAUSTION_RE.test(t) || signals.stressLoop) reasons.push("emotional_exhaustion");
  if (SELF_DOUBT_RE.test(t)) reasons.push("self_doubt");
  if (isInactiveUser(session) || signals.inactive) reasons.push("comeback_inactivity");
  if (discipline === "drifting" || discipline === "inconsistent") {
    reasons.push("discipline_collapse");
  }
  if (nervous === "overloaded" || nervous === "anxious" || signals.overloaded) {
    reasons.push("nervous_overload");
  }

  return [...new Set(reasons)];
}

/**
 * Map triggers to content scenes.
 * @param {string[]} reasons
 */
function rebuildingScenesFromReasons(reasons) {
  const scenes = [];
  if (reasons.includes("comeback_inactivity")) scenes.push("comeback", "inactivity");
  if (reasons.includes("repeated_low_energy") || reasons.includes("low_energy")) {
    scenes.push("low_energy_week", "burnout");
  }
  if (reasons.includes("injury_language")) scenes.push("injury", "physical");
  if (reasons.includes("emotional_exhaustion")) scenes.push("exhaustion", "burnout");
  if (reasons.includes("discipline_collapse")) scenes.push("discipline_collapse", "slow_comeback");
  if (reasons.includes("recovery_path")) scenes.push("physical", "slow_comeback");
  if (reasons.includes("nervous_overload")) scenes.push("exhaustion", "burnout");
  if (reasons.includes("self_doubt")) scenes.push("slow_comeback");
  if (!scenes.length) scenes.push("slow_comeback");
  return [...new Set(scenes)];
}

/**
 * @param {string} dateKey YYYY-MM-DD
 * @param {object} session
 * @param {string|number} userId
 */
function trackLowEnergyStreak(dateKey, session, userId) {
  const energy = session?.energyState || session?.protocolState?.energyState;
  const lastKey = session?.lowEnergyLastDateKey;
  let streak = session?.lowEnergyStreak || 0;

  if (LOW_ENERGY_VALUES.has(energy)) {
    if (lastKey && lastKey !== dateKey) {
      streak = streak + 1;
    } else if (!lastKey) {
      streak = 1;
    }
    updateSession(userId, {
      lowEnergyStreak: streak,
      lowEnergyLastDateKey: dateKey
    });
    return streak;
  }

  if (streak > 0) {
    updateSession(userId, { lowEnergyStreak: 0, lowEnergyLastDateKey: null });
  }
  return 0;
}

/**
 * Sync rebuilding mode on session — call before daily/rhythm picks.
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 * @param {string|number} [userId]
 * @param {string} [dateKey]
 */
function syncRebuildingMode(session, text = "", now = new Date(), userId = null, dateKey = null) {
  const dk = dateKey || now.toISOString().slice(0, 10);
  if (userId) trackLowEnergyStreak(dk, session, userId);

  const reasons = evaluateRebuildingTriggers(session, text, now);
  const active =
    reasons.length > 0 &&
    (reasons.includes("recovery_path") ||
      reasons.includes("repeated_low_energy") ||
      reasons.includes("injury_language") ||
      reasons.includes("emotional_exhaustion") ||
      reasons.includes("comeback_inactivity") ||
      reasons.includes("discipline_collapse") ||
      reasons.includes("nervous_overload") ||
      (reasons.includes("low_energy") && reasons.length >= 2));

  const patch = {
    rebuildingModeActive: active,
    rebuildingModeReasons: reasons,
    lastRebuildingSyncAt: now.getTime()
  };

  if (userId) updateSession(userId, patch);

  return {
    active,
    reasons,
    scenes: rebuildingScenesFromReasons(reasons),
    slot: getTimeSlot(session, now)
  };
}

/**
 * Full rebuilding context for content selection.
 */
function resolveRebuildingContext(session, text = "", now = new Date(), userId = null, dateKey = null) {
  const mode = syncRebuildingMode(session, text, now, userId, dateKey);
  return {
    ...mode,
    comeback: mode.reasons.includes("comeback_inactivity"),
    injury: mode.reasons.includes("injury_language"),
    burnout: mode.reasons.includes("emotional_exhaustion") || mode.reasons.includes("repeated_low_energy"),
    physical: mode.reasons.includes("injury_language") || mode.reasons.includes("recovery_path")
  };
}

module.exports = {
  INJURY_RE,
  EXHAUSTION_RE,
  SELF_DOUBT_RE,
  LOW_ENERGY_VALUES,
  isRebuildingModeActive,
  evaluateRebuildingTriggers,
  rebuildingScenesFromReasons,
  trackLowEnergyStreak,
  syncRebuildingMode,
  resolveRebuildingContext
};
