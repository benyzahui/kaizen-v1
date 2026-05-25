/**
 * Dragon Blueprint — structured daily state (session-ready, Supabase-compatible).
 *
 * Persisted on session.dailyState (today's row). See docs/daily-state-tracking.md.
 */

/**
 * @returns {string} YYYY-MM-DD local (UTC date for smoke; prod uses user tz later)
 */
function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * @returns {import('./dailyStateTypes').DailyState}
 */
function emptyDailyState(userId, lang, date = todayKey()) {
  return {
    date,
    userId: String(userId),
    language: lang,
    energyLevel: null,
    sleepQuality: null,
    hydrationDone: false,
    movementDone: false,
    breathworkDone: false,
    fastingActive: false,
    screenDiscipline: null,
    emotionalState: null,
    disciplineState: null,
    todayMission: null,
    eveningReflection: null,
    completedActions: [],
    energyLeak: null,
    eveningRelease: null,
    focusDrift: null,
    middayCorrection: null,
    recoveryAction: null
  };
}

/**
 * @param {object} session
 * @param {string} userId
 * @param {string} lang
 */
function getOrCreateDailyState(session, userId, lang) {
  const today = todayKey();
  let ds = session?.dailyState;
  if (!ds || ds.date !== today) {
    ds = emptyDailyState(userId, lang, today);
  }
  if (ds.language !== lang) ds = { ...ds, language: lang };
  return ds;
}

/**
 * @param {object} daily
 * @param {string} action
 */
function pushCompletedAction(daily, action) {
  if (!action) return daily;
  const list = Array.isArray(daily.completedActions) ? [...daily.completedActions] : [];
  if (!list.includes(action)) list.push(action);
  return { ...daily, completedActions: list.slice(-20) };
}

/**
 * Map numeric energy/sleep into protocol session fields.
 * @param {object} session
 * @param {object} daily
 */
function syncProtocolFieldsFromDaily(session, daily) {
  const patch = {};
  const e = daily.energyLevel;
  if (typeof e === "number") {
    if (e <= 2) patch.energyState = "exhausted";
    else if (e <= 4) patch.energyState = "low";
    else if (e >= 7) patch.energyState = "high";
    else patch.energyState = "stable";
  }
  const sleep = daily.sleepQuality;
  if (typeof e === "number" && typeof sleep === "number") {
    if (e >= 7 && sleep >= 6) patch.activeMode = session.activeMode || "discipline";
    if (e <= 4) patch.activeMode = "recovery";
  }
  if (daily.focusDrift === true) patch.disciplineState = "drifting";
  else if (daily.focusDrift === false) patch.disciplineState = "focused";
  if (daily.screenDiscipline === "high") patch.nervousSystemState = "overloaded";
  if (daily.todayMission) patch.currentMission = daily.todayMission;
  return patch;
}

/**
 * @param {object} daily
 */
function dailyStateToSessionPatch(daily) {
  return {
    dailyState: daily,
    ...syncProtocolFieldsFromDaily({}, daily)
  };
}

module.exports = {
  todayKey,
  emptyDailyState,
  getOrCreateDailyState,
  pushCompletedAction,
  syncProtocolFieldsFromDaily,
  dailyStateToSessionPatch
};
