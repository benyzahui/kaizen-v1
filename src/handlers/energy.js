/**
 * Compatibility exports — V1.7 Energy Intelligence lives in energyHandler + src/energy/.
 */

const {
  handleEnergy,
  buildDailyEnergyReply
} = require("./energyHandler");

/** @deprecated Prefer buildDailyEnergyReply(date, lang, lens). */
function buildEnergyReply(date = new Date(), lang = "en") {
  return buildDailyEnergyReply(date, lang, "general");
}

module.exports = { handleEnergy, buildEnergyReply };
