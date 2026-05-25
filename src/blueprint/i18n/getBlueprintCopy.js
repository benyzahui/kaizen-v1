/**
 * Locale blueprint copy — hard lock: no cross-locale fallback.
 */

const en = require("./blueprintCopy.en");
const hu = require("./blueprintCopy.hu");
const ro = require("./blueprintCopy.ro");

const BY_LANG = { en, hu, ro };

/**
 * @param {string} lang
 */
function getBlueprintCopy(lang) {
  const key = String(lang || "en").toLowerCase();
  return BY_LANG[key] || en;
}

module.exports = { getBlueprintCopy, BY_LANG };
