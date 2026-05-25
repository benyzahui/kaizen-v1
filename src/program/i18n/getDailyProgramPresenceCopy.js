const en = require("./dailyProgramPresenceCopy.en");
const hu = require("./dailyProgramPresenceCopy.hu");
const ro = require("./dailyProgramPresenceCopy.ro");

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function getDailyProgramPresenceCopy(lang) {
  if (lang === "hu") return hu;
  if (lang === "ro") return ro;
  return en;
}

module.exports = { getDailyProgramPresenceCopy };
