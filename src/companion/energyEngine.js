/**
 * ENERGY_ENGINE — facade over daily energy compose.
 * Single entry for /energy and open-text energy reads.
 */

const { buildDailyEnergyMessage } = require("../energy/dailyEnergy");
const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {Date} [date]
 * @param {'en'|'hu'|'ro'} lang
 * @param {'general'|'trading'|'body'|'emotion'|'work'} [lens]
 * @param {object} [ctx] companion context — optional lead from memory
 */
function buildEnergyRead(date, lang, lens = "general", ctx = null) {
  const r = getResponses(lang);
  const core = buildDailyEnergyMessage(date, lang, lens);
  const name = ctx?.memory?.permanent?.userName;
  const lead =
    name && r.energyPersonalLead
      ? r.energyPersonalLead.replace("{name}", name)
      : r.brainEnergyPrimaryLead || null;
  if (!lead) return core;
  return lines(lead, "", core);
}

module.exports = { buildEnergyRead, buildDailyEnergyMessage };
