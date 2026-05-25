/**
 * /weekly — calm weekly snapshot from streak data + today's state.
 */

const { lines } = require("../personality/kaizenVoice");
const { getStreakCopy } = require("./i18n/getStreakCopy");
const { getStreaks, STREAK_KEYS } = require("./streakModel");
const { resolveConsistencyTitle } = require("./streakEngine");
const { getOrCreateDailyState } = require("../tracking/dailyStateModel");

const RHYTHM_KEYS = ["morning", "midday", "evening"];
const ANCHOR_KEYS = ["hydration", "movement", "focus", "meditation", "fasting"];

/**
 * @param {number} n
 */
function qualFromStreak(n, copy) {
  if (n >= 5) return copy.weeklyQual.strong;
  if (n >= 3) return copy.weeklyQual.stable;
  if (n >= 1) return copy.weeklyQual.weak;
  return copy.weeklyQual.missing;
}

/**
 * @param {object} session
 * @param {string} lang
 * @param {string} userId
 */
function buildWeeklySummary(session, lang, userId) {
  const copy = getStreakCopy(lang);
  const streaks = getStreaks(session);
  const daily = getOrCreateDailyState(session, userId, lang);
  const L = copy.weeklyLabels;

  const scored = STREAK_KEYS.map((k) => ({
    key: k,
    current: streaks[k]?.current || 0
  }));
  const sorted = [...scored].sort((a, b) => b.current - a.current);
  const strongest = sorted[0];
  const weakest = [...scored].sort((a, b) => a.current - b.current)[0];

  let nextFocus = copy.weeklySuggest.stabilization;
  if (typeof daily.energyLevel === "number" && daily.energyLevel <= 4) {
    nextFocus = copy.weeklySuggest.recovery;
  } else if (daily.screenDiscipline === "high" || daily.focusDrift === true) {
    nextFocus = copy.weeklySuggest.lessNoise;
  } else if (!daily.movementDone) {
    nextFocus = copy.weeklySuggest.movement;
  } else if (weakest.key === "focus") {
    nextFocus = copy.weeklySuggest.focusLock;
  }

  const title = resolveConsistencyTitle(streaks);
  const morningN = streaks.morning?.current || 0;
  const movementQ =
    (streaks.movement?.current || 0) >= 3
      ? copy.weeklyQual.stable
      : qualFromStreak(streaks.movement?.current || 0, copy);
  const focusQ =
    daily.focusDrift === true
      ? copy.weeklyQual.scattered
      : qualFromStreak(streaks.focus?.current || 0, copy);
  const recoveryQ =
    typeof daily.energyLevel === "number" && daily.energyLevel <= 4
      ? copy.weeklyQual.weak
      : qualFromStreak(streaks.evening?.current || 0, copy);

  const dayWord = lang === "hu" ? "nap" : lang === "ro" ? "zile" : "days";

  return lines(
    copy.weeklyTitle,
    "",
    `${L.morning}: ${morningN} ${dayWord}`,
    `${L.movement}: ${movementQ}`,
    `${L.focus}: ${focusQ}`,
    `${L.regeneration}: ${recoveryQ}`,
    "",
    `${L.strongest}: ${L[strongest.key] || strongest.key}`,
    `${L.weakest}: ${L[weakest.key] || weakest.key}`,
    "",
    `${L.nextFocus}:`,
    nextFocus,
    "",
    copy.titleLine(title)
  );
}

module.exports = { buildWeeklySummary };
