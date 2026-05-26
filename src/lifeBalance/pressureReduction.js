/**
 * Pressure reduction — fewer tasks when overwhelmed, no stacking.
 */

const { resolveBehaviorSignals } = require("../rhythm/behaviorSignals");
const { getTimeSlot } = require("../core/timeContext");
const { isRebuildingModeActive } = require("../rebuilding/rebuildingMode");

const WORK_STRESS_RE =
  /\b(munka|work|meeting|határidő|deadline|boss|iroda|office|projekt|project|shift|túlóra|overtime)\b/i;

const STUDY_STRESS_RE =
  /\b(vizsga|exam|tanul|study|iskola|school|university|egyetem|hallgat|deadline|essay)\b/i;

const BUSY_SCHEDULE_RE =
  /\b(nincs idő|no time|busy|zsúfolt|packed day|full schedule|elfoglalt|prea ocupat)\b/i;

const RELATIONSHIP_LOAD_RE =
  /\b(kapcsolat|partner|család|family|relationship|viták|argument|gyerek|kids)\b/i;

const PRESSURE_LEVEL = {
  low: 4,
  medium: 3,
  high: 2,
  critical: 1
};

/**
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function resolvePressureLevel(session, text = "", now = new Date()) {
  const signals = resolveBehaviorSignals(session, text, now);
  const slot = getTimeSlot(session, now);
  const energy = session?.energyState || "stable";
  const nervous = session?.nervousSystemState || "calm";
  const t = String(text || "");

  let score = 0;
  if (signals.overloaded || signals.chaotic || signals.frantic) score += 3;
  if (signals.stressLoop) score += 2;
  if (energy === "exhausted" || energy === "low") score += 2;
  if (nervous === "overloaded" || nervous === "anxious") score += 2;
  if (WORK_STRESS_RE.test(t) || BUSY_SCHEDULE_RE.test(t)) score += 1;
  if (isRebuildingModeActive(session)) score += 1;
  if (slot === "evening" || slot === "late_night") score += 1;

  for (const m of (session?.messages || []).slice(-5)) {
    if (WORK_STRESS_RE.test(m.text || "") || BUSY_SCHEDULE_RE.test(m.text || "")) {
      score += 1;
      break;
    }
  }

  if (score >= 5) return "critical";
  if (score >= 3) return "high";
  if (score >= 1) return "medium";
  return "low";
}

/**
 * Max protocol action steps under pressure.
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function getMaxProtocolActions(session, text = "", now = new Date()) {
  const level = resolvePressureLevel(session, text, now);
  return PRESSURE_LEVEL[level] ?? 3;
}

/**
 * @param {boolean} value
 */
function shouldReducePressure(session, text = "", now = new Date()) {
  const level = resolvePressureLevel(session, text, now);
  return level === "high" || level === "critical";
}

/**
 * Trim protocol actions — do not stack tasks when overwhelmed.
 * @param {object|null} proto
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function simplifyProtocolForPressure(proto, session, text = "", now = new Date()) {
  if (!proto?.actions?.length) return proto;
  const max = getMaxProtocolActions(session, text, now);
  if (proto.actions.length <= max) return proto;
  return {
    ...proto,
    actions: proto.actions.slice(0, max),
    _pressureReduced: true
  };
}

/**
 * Cap stacked extras on daily body (touch + check-in + whispers).
 * @param {string[]} parts
 * @param {object} session
 * @param {string} [text]
 */
function capDailyExtras(parts, session, text = "") {
  if (!shouldReducePressure(session, text)) return parts.filter(Boolean);
  return parts.filter(Boolean).slice(0, 2);
}

module.exports = {
  WORK_STRESS_RE,
  STUDY_STRESS_RE,
  BUSY_SCHEDULE_RE,
  RELATIONSHIP_LOAD_RE,
  PRESSURE_LEVEL,
  resolvePressureLevel,
  getMaxProtocolActions,
  shouldReducePressure,
  simplifyProtocolForPressure,
  capDailyExtras
};
