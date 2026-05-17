/**
 * Hard language lock — outbound copy must match session language (HU / EN / RO only).
 */

const { scoreHungarian, scoreRomanian } = require("./languageDetect");
const { getResponses } = require("./getResponses");
const { pickUnseenVariant } = require("../conversation/responseVariation");

const EN_LEAK_RE =
  /\b(the |you |your |today'?s |tomorrow|morning\.|evening\.|try |feel free|how can i|one block|watch for|mental field|let me |i am |i'm )\b/i;

const RO_LEAK_RE = /\b(sunt |nu |pentru |astăzi|mâine|foarte |mulțumesc)\b/i;

const HU_LEAK_RE = /\b(nem |hogy |egy |ma |este |reggel|köszönöm|vagyok)\b/i;

/**
 * @param {string} line
 * @returns {'en'|'hu'|'ro'|null}
 */
function inferLineLanguage(line) {
  const t = String(line || "").trim();
  if (!t) return null;

  const hu = scoreHungarian(t);
  const ro = scoreRomanian(t);

  if (hu >= 2 && hu > ro + 1) return "hu";
  if (ro >= 2 && ro > hu + 1) return "ro";

  if (EN_LEAK_RE.test(t) && hu < 2 && ro < 2) return "en";
  if (RO_LEAK_RE.test(t) && hu < 2) return "ro";
  if (HU_LEAK_RE.test(t) && ro < 2 && !EN_LEAK_RE.test(t)) return "hu";

  return null;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [session]
 * @param {string|number} [userId]
 */
function fallbackLine(lang, session, userId) {
  const r = getResponses(lang);
  const pool = [
    ...(r.safeReturnBeats || []),
    ...(r.presenceOnlyBeats || []),
    ...(r.companionMicroBeats || [])
  ].filter(Boolean);
  if (!pool.length) {
    return lang === "hu"
      ? "Itt vagyok."
      : lang === "ro"
        ? "Sunt aici."
        : "I am here.";
  }
  return pickUnseenVariant(session || {}, String(userId || "0"), pool);
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [session]
 * @param {string|number} [userId]
 */
function enforceHardLanguageLock(body, lang, session, userId) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const kept = parts.filter((line) => {
    const inferred = inferLineLanguage(line);
    if (!inferred) return true;
    return inferred === locked;
  });

  if (kept.length) return kept.join("\n");
  return fallbackLine(locked, session, userId);
}

module.exports = {
  enforceHardLanguageLock,
  inferLineLanguage,
  fallbackLine
};
