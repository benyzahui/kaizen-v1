const en = require("./panelCopy.en");
const hu = require("./panelCopy.hu");
const ro = require("./panelCopy.ro");

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function getPanelCopy(lang) {
  if (lang === "hu") return hu;
  if (lang === "ro") return ro;
  return en;
}

module.exports = { getPanelCopy };
