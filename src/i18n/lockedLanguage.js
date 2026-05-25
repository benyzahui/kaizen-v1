/**
 * Single source for outbound language — preferredLanguage always wins when set.
 */

const {
  resolveLanguageWithSession,
  fromTelegramCode
} = require("./languageDetect");

/**
 * Locked reply language for any handler (commands, energy, rhythm, open chat).
 * @param {object} session
 * @param {object} [message]
 * @param {string} [text]
 * @returns {'en'|'hu'|'ro'}
 */
function getLockedLang(session, message, text = "") {
  const pref = session?.preferredLanguage;
  if (pref === "hu" || pref === "ro" || pref === "en") {
    return pref;
  }
  if (session?.onboardingCompleted && session?.lang) {
    const l = session.lang;
    if (l === "hu" || l === "ro" || l === "en") return l;
  }
  const fromCode = fromTelegramCode(message?.from?.language_code);
  if (session?.onboardingCompleted && fromCode) return fromCode;
  return resolveLanguageWithSession(text, session);
}

module.exports = { getLockedLang };
