const en = require("./responses.en");
const hu = require("./responses.hu");
const ro = require("./responses.ro");

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function getResponses(lang) {
  if (lang === "hu") return hu;
  if (lang === "ro") return ro;
  return en;
}

module.exports = { getResponses };
