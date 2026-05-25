/**
 * Single source for outbound language — preferredLanguage always wins when set.
 */

const { requireLockedLanguage } = require("./hardLanguageLock");

/**
 * Locked reply language — never drifts from preferredLanguage when set.
 * @param {object} session
 * @param {object} [message]
 * @param {string} [text]
 * @returns {'en'|'hu'|'ro'}
 */
function getLockedLang(session, message, text = "") {
  const req = requireLockedLanguage(session);
  if (req.ok && req.lang) return req.lang;
  return "en";
}

module.exports = { getLockedLang, requireLockedLanguage };
