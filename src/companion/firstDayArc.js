/**
 * First-day experience — one calm arc, not a command flood.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");

/**
 * @param {string|number} userId
 */
function markFirstDayStarted(userId) {
  updateSession(userId, {
    firstDayStartedAt: Date.now(),
    firstDayMilestones: []
  });
}

/**
 * @param {string} reply
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [opts]
 */
function wrapFirstDayActivation(reply, lang, opts = {}) {
  const r = getResponses(lang);
  const parts = [];
  if (opts.wow) parts.push(opts.wow);
  parts.push(reply);
  if (r.firstDayInsight) parts.push("", r.firstDayInsight);
  if (r.firstDayAction) parts.push("", r.firstDayAction);
  if (r.firstDayAccountability) parts.push("", r.firstDayAccountability);
  if (r.firstDayClosing) parts.push("", r.firstDayClosing);
  return lines(...parts.filter(Boolean));
}

/**
 * @param {string} summaryReply
 * @param {'en'|'hu'|'ro'} lang
 */
function wrapFirstDayStructureComplete(summaryReply, lang) {
  const r = getResponses(lang);
  return lines(
    summaryReply,
    "",
    r.firstDayGrounding || "",
    r.firstDayClosing || r.fcCompleteNext || ""
  ).trim();
}

module.exports = {
  markFirstDayStarted,
  wrapFirstDayActivation,
  wrapFirstDayStructureComplete
};
