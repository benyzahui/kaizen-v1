/**
 * Native Romanian pools — re-export from experience module (single source).
 */

const pools = require("../i18n/ro/romanianExperiencePools");

module.exports = {
  greetings: pools.greetings,
  eveningRecovery: pools.eveningRecovery,
  warriorMode: pools.warriorMode,
  stabilization: pools.stabilization,
  emotionalReset: pools.emotionalReset,
  morningActivation: pools.morningActivation,
  middayCorrection: pools.middayCorrection,
  overload: pools.overload,
  discipline: pools.discipline,
  tradingPsychology: pools.tradingPsychology,
  programContinuity: pools.programContinuity,
  symbolicEnergy: pools.symbolicEnergy,
  getRomanianPool: pools.getPool
};
