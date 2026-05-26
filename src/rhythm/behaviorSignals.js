/**
 * User behavior signals — timing-aware, no surveillance tone.
 */

const { getTimeSlot, localHour } = require("../core/timeContext");
const { getStreaks, daysSinceLastAny } = require("../consistency/streakModel");
const { isInactiveUser, msSinceLastInteraction } = require("../retention/retentionRhythmEngine");

const STRESS_RE =
  /(szétesek|stress|panik|overwhelm|remeg|félek|kimerült|anxious|anxiet|eșuat|epuizat|haos)/i;

const FRANTIC_WINDOW_MS = 12 * 60 * 1000;
const FRANTIC_CMD_THRESHOLD = 4;

/**
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function resolveBehaviorSignals(session, text = "", now = new Date()) {
  const slot = getTimeSlot(session, now);
  const hour = localHour(session, now);
  const t = String(text || "").trim();

  const recentCommands = session?.recentCommands || [];
  const recentCutoff = now.getTime() - FRANTIC_WINDOW_MS;
  const msgs = (session?.messages || []).filter((m) => m.ts >= recentCutoff);

  const uniqueCmds = new Set(recentCommands.slice(-8));
  const frantic =
    recentCommands.length >= FRANTIC_CMD_THRESHOLD &&
    uniqueCmds.size >= 3 &&
    msSinceLastInteraction(session) < FRANTIC_WINDOW_MS;

  let stressHits = 0;
  if (STRESS_RE.test(t)) stressHits += 1;
  for (const m of msgs.slice(-5)) {
    if (STRESS_RE.test(m.text || "")) stressHits += 1;
  }
  const stressLoop = stressHits >= 2;

  const inactive = isInactiveUser(session);
  const lateNightSpiral =
    (slot === "late_night" || hour >= 21 || hour < 6) &&
    (msgs.length >= 3 || t.length > 70 || stressHits >= 1);

  const streaks = getStreaks(session);
  const morningStreak = streaks.morning?.current || 0;
  const focusStreak = streaks.focus?.current || 0;
  const strongConsistency =
    morningStreak >= 3 || focusStreak >= 3 || daysSinceLastAny(streaks) <= 1;

  const streakMilestone =
    morningStreak === 3 ||
    morningStreak === 7 ||
    focusStreak === 5 ||
    (session?.lastStreakCelebrate !== morningStreak && morningStreak >= 5);

  const energy =
    session?.energyState || session?.protocolState?.energyState || "stable";
  const discipline =
    session?.disciplineState || session?.protocolState?.disciplineState || "focused";
  const nervous =
    session?.nervousSystemState || session?.protocolState?.nervousSystemState || "calm";

  const overloaded =
    nervous === "overloaded" ||
    nervous === "anxious" ||
    energy === "exhausted" ||
    stressLoop;

  const disciplinedFlow =
    !overloaded &&
    (discipline === "locked_in" || discipline === "focused") &&
    (energy === "stable" || energy === "high");

  const chaotic = frantic || stressLoop || lateNightSpiral;

  return {
    timeSlot: slot,
    hour,
    frantic,
    stressLoop,
    inactive,
    lateNightSpiral,
    strongConsistency,
    streakMilestone,
    overloaded,
    disciplinedFlow,
    chaotic,
    nightUsage: slot === "late_night"
  };
}

/**
 * Primary signal for contextual presence (one at a time).
 * @param {object} signals
 */
function primaryPresenceSignal(signals) {
  if (signals.overloaded) return "overload";
  if (signals.lateNightSpiral) return "night_spiral";
  if (signals.chaotic) return "chaotic";
  if (signals.inactive) return "inactivity";
  if (signals.streakMilestone || signals.strongConsistency) return "streak";
  if (signals.disciplinedFlow) return "disciplined_flow";
  if (signals.nightUsage) return "night";
  return null;
}

module.exports = {
  STRESS_RE,
  resolveBehaviorSignals,
  primaryPresenceSignal
};
