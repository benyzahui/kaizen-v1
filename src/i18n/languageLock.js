/**
 * Language lock — after onboarding only /language changes preference.
 * Natural "speak Hungarian" requests confirm or redirect, never drift locale.
 */

const { detectLanguageSwitchIntent } = require("../brain/intentEngine");
const { getResponses } = require("./getResponses");
const { updateSession } = require("../session/sessionStore");
const { lines } = require("../personality/kaizenVoice");

/**
 * @param {string|number} userId
 * @param {string} text
 * @param {object} session
 * @param {'en'|'hu'|'ro'} activeLang locked reply language
 * @returns {null | { reply: string, category: 'language_switch', suggestedAction: string|null }}
 */
function resolveNaturalLanguageRequest(userId, text, session, activeLang) {
  const sw = detectLanguageSwitchIntent(text);
  if (!sw?.lang) return null;

  const r = getResponses(activeLang);
  const pref = session?.preferredLanguage;

  if (
    (session?.languageLocked || session?.onboardingCompleted) &&
    (pref === "en" || pref === "hu" || pref === "ro")
  ) {
    if (sw.lang === pref) {
      return {
        reply: r.langAlreadyActive,
        category: "language_switch",
        suggestedAction: null
      };
    }
    return {
      reply: lines(r.langChangeViaCommand, "", r.cmdLanguageMenu),
      category: "language_switch",
      suggestedAction: "/language"
    };
  }

  updateSession(userId, {
    preferredLanguage: sw.lang,
    lang: sw.lang
  });
  const r2 = getResponses(sw.lang);
  return {
    reply: r2.brainLangSwitchConfirm,
    category: "language_switch",
    suggestedAction: null
  };
}

module.exports = { resolveNaturalLanguageRequest };
