/**
 * Light presence — short lines, no emotional AI theater.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { getPanelCopy } = require("./i18n/getPanelCopy");

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 */
function pickLightPresenceLine(lang, userId) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pool = getPanelCopy(locked).lightPresence || [];
  if (!pool.length) return "";
  return pickSeeded(pool, `${userId}|light|${Date.now() >> 11}`);
}

module.exports = { pickLightPresenceLine };
