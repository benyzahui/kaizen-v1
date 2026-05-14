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

  if (hu > ro && hu >= 2) return "hu";
  if (ro > hu && ro >= 2) return "ro";
  return "en";
}

/**
 * Bare `/command` → use Telegram client language for hu/ro; else English.
 * @returns {'en'|'hu'|'ro'}
 */
function resolveLang(message, text) {
  const t = String(text || "").trim();
  const isBareCommand = /^\s*\/\w+(@\w+)?$/i.test(t);
  if (isBareCommand) {
    const fromCode = fromTelegramCode(message?.from?.language_code);
    if (fromCode) return fromCode;
    return "en";
  }
  return detectLanguage(t);
}

module.exports = { detectLanguage, resolveLang, fromTelegramCode };
