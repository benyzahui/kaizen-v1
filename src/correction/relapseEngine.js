/**
 * Relapse risk detection + adaptive correction orchestration.
 */

const { lines } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { getStreaks, daysSinceLastAny, todayKey, yesterdayKey } = require("../consistency/streakModel");
const { getOrCreateDailyState } = require("../tracking/dailyStateModel");
const { isOverloaded, isChaoticConversation } = require("./overloadDetector");
const {
  pickMicroCorrection,
  buildOverloadCorrection,
  buildChaoticInterruption,
  buildDisciplineNudge
} = require("./correctionResponses");
const { formatMiniReset, formatRecoveryDay } = require("./resetProtocols");

/**
 * @param {object} session
 * @param {string} [text]
 */
function computeRelapseRisk(session, text = "") {
  let score = 0;
  const streaks = getStreaks(session);
  const daily = session.dailyState || {};
  const today = todayKey();
  const y = yesterdayKey();

  const morning = streaks.morning;
  if (!morning?.lastDate || (morning.lastDate !== today && morning.lastDate !== y)) {
    score += 2;
  }
  if ((streaks.movement?.current || 0) < 2) score += 1;
  if ((streaks.hydration?.current || 0) < 2) score += 1;

  if (typeof daily.energyLevel === "number" && daily.energyLevel <= 4) score += 2;
  if (typeof daily.sleepQuality === "number" && daily.sleepQuality <= 4) score += 1;
  if (daily.focusDrift === true) score += 1;
  if (daily.screenDiscipline === "high") score += 2;

  const gap = daysSinceLastAny(streaks);
  if (gap >= 2) score += 2;
  if (gap >= 4) score += 1;

  if (session.nervousSystemState === "overloaded") score += 2;
  if (session.disciplineState === "drifting") score += 1;

  if (session.activeMode === "trading" && (daily.energyLevel <= 5 || score >= 4)) {
    score += 1;
  }

  if (isOverloaded(text, session)) score += 2;

  const recentLow = (session.messages || [])
    .slice(-5)
    .filter((m) => /(kimerült|exhaust|low energy|epuiz|fáradt)/i.test(String(m.text || "")))
    .length;
  if (recentLow >= 2) score += 1;

  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

/**
 * @param {object} session
 * @param {'low'|'medium'|'high'} risk
 */
function canDisciplineMode(session, risk) {
  if (risk === "high") return false;
  const daily = session.dailyState || {};
  const e = daily.energyLevel;
  const sleep = daily.sleepQuality;
  if (typeof e === "number" && e < 6) return false;
  if (typeof sleep === "number" && sleep < 5) return false;
  const m = getStreaks(session).morning?.current || 0;
  if (m < 3) return false;
  if (session.nervousSystemState === "overloaded") return false;
  return risk === "low" || (risk === "medium" && e >= 7);
}

/**
 * @param {object} session
 * @param {'low'|'medium'|'high'} risk
 */
function shouldSuggestRecoveryDay(session, risk) {
  const streaks = getStreaks(session);
  const daily = session.dailyState || {};
  const morningDrop =
    (streaks.morning?.current || 0) <= 1 &&
    (streaks.morning?.best || 0) >= 3;
  const energyDrop = typeof daily.energyLevel === "number" && daily.energyLevel <= 4;
  const overloadRepeat =
    daily.screenDiscipline === "high" ||
    session.nervousSystemState === "overloaded";
  return risk === "high" || (risk === "medium" && (morningDrop || energyDrop) && overloadRepeat);
}

/**
 * @param {string} text
 * @param {string} lang
 * @param {object} session
 * @param {string|number} userId
 */
function tryAdaptiveCorrectionReply(text, lang, session, userId) {
  const risk = computeRelapseRisk(session, text);
  const daily = getOrCreateDailyState(session, userId, lang);
  const ctx = {
    exhausted: typeof daily.energyLevel === "number" && daily.energyLevel <= 3,
    lowEnergy: typeof daily.energyLevel === "number" && daily.energyLevel <= 4,
    scatter: daily.focusDrift === true || session.disciplineState === "drifting",
    focusDrift: daily.focusDrift,
    inactive: daysSinceLastAny(getStreaks(session)) >= 2
  };

  updateSession(userId, {
    relapseRisk: risk,
    lastRelapseCheck: Date.now()
  });

  if (isChaoticConversation(text, session)) {
    return {
      body: buildChaoticInterruption(lang),
      suggestedCommand: "/morning",
      category: "path_correction"
    };
  }

  if (isOverloaded(text, session) || (risk === "high" && ctx.scatter)) {
    return {
      body: buildOverloadCorrection(lang),
      suggestedCommand: "/reset",
      category: "path_correction"
    };
  }

  if (
    risk === "low" &&
    canDisciplineMode(session, risk) &&
    /(mission|küldetés|fókusz|focus|task|feladat|execute|végre)/i.test(text)
  ) {
    return {
      body: buildDisciplineNudge(lang, session),
      suggestedCommand: "/focus",
      category: "path_correction"
    };
  }

  if (risk === "low") return null;

  let body = pickMicroCorrection(lang, session, risk, ctx);
  let cmd = "/reset";

  if (ctx.exhausted || ctx.lowEnergy) {
    body = lines(body, "", formatMiniReset(lang));
    cmd = "/energy";
  } else if (shouldSuggestRecoveryDay(session, risk)) {
    body = lines(body, "", formatRecoveryDay(lang));
    cmd = "/evening";
  }

  return {
    body,
    suggestedCommand: cmd,
    category: "path_correction"
  };
}

module.exports = {
  computeRelapseRisk,
  canDisciplineMode,
  shouldSuggestRecoveryDay,
  tryAdaptiveCorrectionReply,
  formatRecoveryDay
};
