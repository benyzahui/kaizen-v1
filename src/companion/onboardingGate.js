/**
 * Hard onboarding gate — until onboardingCompleted, only onboarding may respond.
 */

const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");
const {
  detectLanguage,
  fromTelegramCode
} = require("../i18n/languageDetect");
const { FC_NATURAL } = require("./firstContactEngine");
const { enterActivationMode } = require("./freshUserExperience");

const SAFE_COMMANDS = new Set(["/start", "/language", "/guide", "/skip"]);

/**
 * @param {object} session
 */
function isOnboardingComplete(session) {
  return Boolean(session?.onboardingCompleted);
}

/**
 * @param {object} session
 */
function requiresOnboardingGate(session) {
  return !isOnboardingComplete(session);
}

/**
 * @param {string} command
 */
function isSafeOnboardingCommand(command) {
  const c = String(command || "").toLowerCase();
  if (SAFE_COMMANDS.has(c)) return true;
  if (c === "/help") return true;
  return false;
}

/**
 * Lock language on first meaningful open-text message during onboarding.
 * @param {string|number} userId
 * @param {string} text
 * @param {object} session
 * @returns {'en'|'hu'|'ro'|null} lang if newly locked
 */
function lockLanguageFromFirstMessage(userId, text, session) {
  if (isOnboardingComplete(session)) return null;
  const pref = session?.preferredLanguage;
  if (pref === "hu" || pref === "ro" || pref === "en") return pref;

  const t = String(text || "").trim();
  if (t.length < 8) return null;

  const lang = detectLanguage(t);
  updateSession(userId, { preferredLanguage: lang, lang });
  return lang;
}

/**
 * Language for all onboarding replies — locked pref only, no drift.
 * @param {object} session
 * @param {object} [message]
 * @param {string} [text]
 */
function resolveOnboardingLang(session, message, text = "") {
  const pref = session?.preferredLanguage;
  if (pref === "hu" || pref === "ro" || pref === "en") return pref;
  const fromCode = fromTelegramCode(message?.from?.language_code);
  if (fromCode) return fromCode;
  const t = String(text || "").trim();
  if (t.length >= 8) return detectLanguage(t);
  return session?.lang || "en";
}

/**
 * Ensure onboarding session is active (do not reset profile).
 * @param {string|number} userId
 */
function ensureOnboardingActive(userId) {
  const s = getSession(userId);
  if (isOnboardingComplete(s)) return s;
  if (!s.onboardingActive) {
    updateSession(userId, {
      onboardingActive: true,
      onboardingStep:
        typeof s.onboardingStep === "number" && s.onboardingStep > 0
          ? s.onboardingStep
          : FC_NATURAL
    });
  }
  enterActivationMode(userId);
  return getSession(userId);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} [attemptedCommand]
 */
function onboardingCommandRedirect(lang, attemptedCommand) {
  const r = getResponses(lang);
  const base = r.obGateCommandBlocked || r.helpTipOnboarding;
  if (attemptedCommand && r.obGateCommandBlocked) {
    return base.replace("{command}", attemptedCommand);
  }
  return base;
}

/**
 * Fallback when onboarding handler has no step match.
 * @param {'en'|'hu'|'ro'} lang
 */
function onboardingContinuePrompt(lang) {
  const r = getResponses(lang);
  return r.obGateContinueSetup || r.helpTipOnboarding;
}

module.exports = {
  SAFE_COMMANDS,
  isOnboardingComplete,
  requiresOnboardingGate,
  isSafeOnboardingCommand,
  lockLanguageFromFirstMessage,
  resolveOnboardingLang,
  ensureOnboardingActive,
  onboardingCommandRedirect,
  onboardingContinuePrompt
};
