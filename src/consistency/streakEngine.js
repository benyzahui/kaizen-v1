/**
 * Consistency + streak engine — calm progression, no hype.
 */

const { lines } = require("../personality/kaizenVoice");
const { updateSession, getSession } = require("../session/sessionStore");
const { getStreakCopy } = require("./i18n/getStreakCopy");
const {
  getStreaks,
  bumpStreakRecord,
  daysSinceLastAny,
  todayKey,
  yesterdayKey
} = require("./streakModel");

const CRINGE_RE =
  /(LET'S GO|🔥|YOU ARE A MACHINE|GRIND|HUSTLE|level up|szégyen|failed|loser)/i;

/**
 * @param {object} streaks
 */
function rhythmScore(streaks) {
  const m = streaks.morning?.current || 0;
  const d = streaks.midday?.current || 0;
  const e = streaks.evening?.current || 0;
  return m + d + e;
}

/**
 * @param {object} streaks
 */
function resolveConsistencyTitle(streaks) {
  const copy = getStreakCopy("en").titles;
  const score = rhythmScore(streaks);
  const anchor =
    (streaks.movement?.current || 0) + (streaks.hydration?.current || 0);
  const total = score + anchor;

  if (total >= 21) return copy.guardian;
  if (total >= 14) return copy.warrior;
  if (total >= 7) return copy.stabilizer;
  if (total >= 3) return copy.builder;
  return copy.initiate;
}

/**
 * @param {number} current
 * @param {string} lang
 * @param {object} ctx
 */
function pickReinforcement(current, lang, ctx = {}) {
  const c = getStreakCopy(lang);
  if (ctx.overload) return c.adaptive.overload;
  if (ctx.collapse) return c.adaptive.collapse;
  if (current >= 7) return c.reinforce.high;
  if (current >= 4) return c.reinforce.mid;
  return c.reinforce.low;
}

/**
 * @param {object} streaks
 * @param {string} key
 * @param {string} today
 */
function applyBump(streaks, key, today) {
  const prev = streaks[key] || { current: 0, best: 0, lastDate: null };
  const y = yesterdayKey();
  const wasBroken = Boolean(
    prev.lastDate && prev.lastDate !== today && prev.lastDate !== y
  );
  const next = bumpStreakRecord(prev, today);
  streaks[key] = next;
  return { next, wasBroken };
}

/**
 * @param {string} userId
 * @param {'morning'|'midday'|'evening'} flow
 * @param {string} lang
 * @param {object} daily
 * @param {object} session
 */
function recordCheckInCompletion(userId, flow, lang, daily, session) {
  const today = todayKey();
  const gapBefore = daysSinceLastAny(getStreaks(session));
  const streaks = getStreaks(session);
  const copy = getStreakCopy(lang);

  const rhythmKey = flow;
  const { next: rhythmRec, wasBroken } = applyBump(streaks, rhythmKey, today);

  if (flow === "morning") {
    if (daily.hydrationDone) applyBump(streaks, "hydration", today);
    if (daily.movementDone) applyBump(streaks, "movement", today);
    if (daily.breathworkDone) applyBump(streaks, "meditation", today);
    if (daily.fastingActive) applyBump(streaks, "fasting", today);
  }
  if (flow === "midday" && daily.focusDrift === false) {
    applyBump(streaks, "focus", today);
  }
  if (flow === "evening" && daily.recoveryAction) {
    applyBump(streaks, "meditation", today);
  }

  const energy = daily.energyLevel;
  const overload =
    daily.screenDiscipline === "high" ||
    session.nervousSystemState === "overloaded";
  const collapse = typeof energy === "number" && energy <= 4;
  const growing = rhythmRec.current >= 4 && !wasBroken;

  const ctx = { overload, collapse, growing };
  const title = resolveConsistencyTitle(streaks);
  const reinforce = pickReinforcement(rhythmRec.current, lang, ctx);
  const recovery =
    wasBroken && rhythmRec.current === 1
      ? copy.recovery.gap
      : gapBefore >= 3 && rhythmRec.current === 1
        ? copy.recovery.broken
        : null;

  updateSession(userId, {
    streaks,
    consistencyTitle: title,
    lastStreakUpdate: today
  });

  const milestones = [7, 14, 21];
  if (milestones.includes(rhythmRec.current)) {
    try {
      const { stageGifForContext } = require("../media/gifSelector");
      stageGifForContext(userId, session, "streak_milestone", { force: true });
    } catch {
      // gif optional
    }
  }

  const parts = [
    copy.close[flow],
    copy.streakLine(rhythmRec.current),
    "",
    reinforce
  ];
  if (recovery) parts.push("", recovery);
  if (rhythmRec.current >= 3) {
    parts.push("", copy.titleLine(title));
  }

  const body = lines(...parts);
  if (CRINGE_RE.test(body)) {
    throw new Error("cringe_copy_leak");
  }
  return body;
}

/**
 * Adaptive tone for open/program layers.
 * @param {object} session
 * @param {string} lang
 */
function getAdaptiveStreakTone(session, lang) {
  const streaks = getStreaks(session);
  const daily = session.dailyState || {};
  const c = getStreakCopy(lang);
  if (daily.screenDiscipline === "high" || session.nervousSystemState === "overloaded") {
    return c.adaptive.overload;
  }
  if (typeof daily.energyLevel === "number" && daily.energyLevel <= 4) {
    return c.adaptive.collapse;
  }
  const m = streaks.morning?.current || 0;
  if (m >= 5) return c.adaptive.growing;
  return null;
}

module.exports = {
  recordCheckInCompletion,
  resolveConsistencyTitle,
  pickReinforcement,
  getAdaptiveStreakTone,
  rhythmScore,
  CRINGE_RE
};
