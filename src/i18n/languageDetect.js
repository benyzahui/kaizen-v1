/**
 * Lightweight language guess: en | hu | ro.
 * Default English. No external APIs.
 */

const HU_CHARS = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/;
const RO_CHARS = /[ăâîșțĂÂÎȘȚ]/;

const HU_WORDS =
  /\b(hogy|nem|igen|vagyok|vagyunk|köszönöm|nagyon|már|csak|minden|most|jó|rossz|fáradt|segíts|kérem|nekem|veled|velem|élet|ma|holnap)\b/i;
const RO_WORDS =
  /\b(sunt|nu|da|mă|îmi|pentru|astăzi|mâine|foarte|mulțumesc|viață|ajutor|trist|obosit|vreau|totul|nimic)\b/i;

function fromTelegramCode(code) {
  if (!code) return null;
  const c = String(code).toLowerCase().split(/[-_]/)[0];
  if (c === "hu") return "hu";
  if (c === "ro") return "ro";
  return null;
}

function scoreHungarian(text) {
  let s = 0;
  if (HU_CHARS.test(text)) s += 3;
  if (HU_WORDS.test(text)) s += 2;
  return s;
}

function scoreRomanian(text) {
  let s = 0;
  if (RO_CHARS.test(text)) s += 3;
  if (RO_WORDS.test(text)) s += 2;
  return s;
}

/**
 * @param {string} text
 * @returns {'en'|'hu'|'ro'}
 */
function detectLanguage(text) {
  const t = String(text || "").trim();
  if (!t) return "en";

  const hu = scoreHungarian(t);
  const ro = scoreRomanian(t);

  if (hu > ro && hu >= 3) return "hu";
  if (ro > hu && ro >= 3) return "ro";
  return "en";
}

/** HU/RO clearly signaled (not default-English noise). */
function hasStrongNonEnglishSignal(text) {
  const t = String(text || "").trim();
  if (!t) return false;
  const hu = scoreHungarian(t);
  const ro = scoreRomanian(t);
  return hu >= 2 || ro >= 2;
}

/**
 * Open text language: profile lock wins when preferred_language is en|hu|ro.
 * `auto` or unset → detect + light session continuity.
 */
function resolveLanguageWithSession(text, session) {
  const t = String(text || "").trim();
  const detected = detectLanguage(t);
  const pref = session?.preferredLanguage;

  // Hard lock whenever preferred language is set (beta: no random switching).
  if (pref === "hu" || pref === "ro" || pref === "en") {
    return pref;
  }

  if (pref === "auto") {
    const sess = session?.lang;
    if (sess === "hu" || sess === "ro" || sess === "en") return sess;
    return detected;
  }

  const sess = session?.lang;
  if (sess === "hu" || sess === "ro" || sess === "en") {
    return sess;
  }

  if (session?.onboardingActive && hasStrongNonEnglishSignal(t)) {
    return detectLanguage(t);
  }

  return detected;
}

/**
 * Bare `/command` → session lang if set, else Telegram client code, else English.
 * @param {{ lang?: 'en'|'hu'|'ro'|null }} [session]
 */
function resolveLang(message, text, session) {
  const t = String(text || "").trim();
  if (session?.onboardingCompleted) {
    const pref = session?.preferredLanguage;
    if (pref === "hu" || pref === "ro" || pref === "en") return pref;
  }
  const isBareCommand = /^\s*\/\w+(@\w+)?$/i.test(t);
  if (isBareCommand) {
    const pref = session?.preferredLanguage;
    if (pref === "hu" || pref === "ro" || pref === "en") return pref;
    if (pref === "auto") {
      const fromCode = fromTelegramCode(message?.from?.language_code);
      if (fromCode) return fromCode;
    }
    if (session?.lang === "hu" || session?.lang === "ro" || session?.lang === "en") {
      return session.lang;
    }
    const fromCode = fromTelegramCode(message?.from?.language_code);
    if (fromCode) return fromCode;
    return "en";
  }
  return detectLanguage(t);
}

module.exports = {
  detectLanguage,
  resolveLang,
  fromTelegramCode,
  hasStrongNonEnglishSignal,
  resolveLanguageWithSession,
  scoreHungarian,
  scoreRomanian
};
