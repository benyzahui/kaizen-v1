/**
 * /status — Dragon Blueprint daily snapshot.
 */

const { lines } = require("../personality/kaizenVoice");
const { getDailyTrackingCopy } = require("./i18n/getDailyTrackingCopy");
const {
  getOrCreateDailyState,
  todayKey
} = require("./dailyStateModel");
const {
  computeDailyAdaptation,
  energyDisplayKey,
  disciplineDisplayKey,
  bodyDisplayKey
} = require("./dailyStateAdaptation");

/**
 * @param {object} session
 * @param {string} lang
 * @param {string} userId
 */
function buildDailyStatusSnapshot(session, lang, userId) {
  const copy = getDailyTrackingCopy(lang);
  const daily = getOrCreateDailyState(session, userId, lang);
  const L = copy.labels;
  const el = copy.energyLabels[energyDisplayKey(daily)];
  const dl = copy.disciplineLabels[disciplineDisplayKey(daily)];
  const bl = copy.bodyLabels[bodyDisplayKey(daily)];
  const screen =
    daily.screenDiscipline != null
      ? copy.screenLabels[daily.screenDiscipline] || copy.screenLabels.unknown
      : copy.screenLabels.unknown;

  const recovery =
    daily.recoveryAction ||
    daily.eveningRelease ||
    (daily.eveningReflection ? String(daily.eveningReflection).slice(0, 60) : null) ||
    "—";

  const mission = daily.todayMission?.trim() || session.currentMission?.trim() || "—";
  const next = computeDailyAdaptation(daily, lang);

  return lines(
    copy.statusTitle,
    "",
    `${L.energy}: ${el}`,
    `${L.discipline}: ${dl}`,
    `${L.body}: ${bl}`,
    `${L.focus}: ${screen}`,
    `${L.recovery}: ${recovery}`,
    `${L.mission}: ${mission}`,
    `${L.next}: ${next}`,
    "",
    `📅 ${todayKey()}`
  );
}

module.exports = { buildDailyStatusSnapshot };
