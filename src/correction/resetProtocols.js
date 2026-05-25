/**
 * Small recovery routes — mini reset, recovery day.
 */

const { lines } = require("../personality/kaizenVoice");
const { getCorrectionCopy } = require("./i18n/getCorrectionCopy");

/**
 * @param {string} lang
 */
function formatMiniReset(lang) {
  const c = getCorrectionCopy(lang);
  const steps = c.miniReset.steps.map((s) => `- ${s}`);
  return lines(c.miniReset.title, "", ...steps);
}

/**
 * @param {string} lang
 */
function formatRecoveryDay(lang) {
  const c = getCorrectionCopy(lang);
  return lines(c.recoveryDay.title, "", ...c.recoveryDay.lines);
}

module.exports = { formatMiniReset, formatRecoveryDay };
