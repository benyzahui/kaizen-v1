/**
 * Recovery Balance Protocol — firm, compassionate, nervous-system first.
 */

const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

function needsImmediateRecovery(text) {
  return /(want to die|kill myself|end it all|can't cope|cant cope|totally hopeless|képtelen vagyok|végem van|nu mai pot deloc)/i.test(
    String(text || "")
  );
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {{ includeLoopIntro?: boolean }} opts
 */
function formatFullRecovery(lang, opts = {}) {
  const r = getResponses(lang);
  const parts = [];
  if (opts.includeLoopIntro) {
    parts.push(r.recoveryLoopIntro, "");
  }
  parts.push(
    r.recoveryPause,
    "",
    r.recoveryProtocolTitle,
    "",
    r.recoveryProtocolBody
  );
  return lines(...parts);
}

module.exports = { needsImmediateRecovery, formatFullRecovery };
