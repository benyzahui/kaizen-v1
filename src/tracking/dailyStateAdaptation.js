/**
 * Adaptation rules from dailyState — next step + mode hints.
 */

const { getDailyTrackingCopy } = require("./i18n/getDailyTrackingCopy");

/**
 * @param {object} daily
 * @param {string} lang
 */
function computeDailyAdaptation(daily, lang) {
  const copy = getDailyTrackingCopy(lang);
  const a = copy.adapt;
  const hints = [];

  const e = daily.energyLevel;
  const sleep = daily.sleepQuality;

  if (typeof e === "number" && e <= 4) {
    hints.push(a.recovery);
    hints.push(a.stabilization);
  } else if (typeof e === "number" && e >= 7 && typeof sleep === "number" && sleep >= 6) {
    hints.push(a.discipline);
    hints.push(a.warrior);
  } else if (typeof e === "number" && e >= 5) {
    hints.push(a.discipline);
  }

  if (daily.movementDone === false) {
    hints.unshift(a.movement_first);
  }

  if (daily.screenDiscipline === "high") {
    hints.push(a.digital_detox);
  }

  if (daily.fastingActive) {
    hints.push(a.fasting_hydrate);
  }

  if (daily.eveningReflection || daily.eveningRelease) {
    hints.push(a.evening_recovery);
  }

  return hints[0] || a.stabilization;
}

/**
 * @param {object} daily
 */
function energyDisplayKey(daily) {
  const e = daily.energyLevel;
  if (e == null) return "unknown";
  if (e <= 2) return "depleted";
  if (e <= 4) return "low";
  if (e >= 7) return "high";
  return "stable";
}

/**
 * @param {object} daily
 */
function disciplineDisplayKey(daily) {
  if (daily.focusDrift === true) return "drifting";
  if (daily.focusDrift === false) return "focused";
  if (daily.disciplineState === "drifting") return "drifting";
  return "unknown";
}

/**
 * @param {object} daily
 */
function bodyDisplayKey(daily) {
  if (daily.hydrationDone && daily.movementDone && daily.breathworkDone) return "ok";
  if (!daily.hydrationDone && !daily.movementDone && !daily.breathworkDone) {
    return "anchors_missing";
  }
  if (!daily.hydrationDone) return "hydration_missing";
  if (!daily.movementDone) return "movement_missing";
  if (!daily.breathworkDone) return "breath_missing";
  return "ok";
}

module.exports = {
  computeDailyAdaptation,
  energyDisplayKey,
  disciplineDisplayKey,
  bodyDisplayKey
};
