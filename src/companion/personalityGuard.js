/**
 * Stable KaiZen identity — calm, grounded, warm under pressure. No tone whiplash copy.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { isDragonCringe } = require("./dragonTone");

const BREAKS_IDENTITY_RE =
  /\b(as an AI|language model|I cannot feel|I don't have feelings|motivation guru|alpha male|sigma grind|manifest the universe|you got this king|queen energy)\b/i;

const HYPE_RE =
  /\b(crush it|beast mode|10x your life|unlock your potential|limitless)\b/i;

const JUDGMENT_RE =
  /\b(you failed|failed your discipline|no excuses|weakness is|te vagy gyenge|kudarcot vallottál|lipsă de disciplină)\b/i;

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function applyPersonalityGuard(body, lang, category) {
  let t = String(body || "");
  if (!t) return t;

  const lines = t.split(/\n/).filter((line) => {
    const l = line.trim();
    if (!l) return true;
    if (BREAKS_IDENTITY_RE.test(l)) return false;
    if (HYPE_RE.test(l) && category !== "onboarding") return false;
    if (JUDGMENT_RE.test(l)) return false;
    if (isDragonCringe(l) && category !== "onboarding") return false;
    return true;
  });

  t = lines.join("\n").trim();
  if (t) return t;

  const r = getResponses(lang);
  const pool = r.groundedVoiceAlts || r.silenceBeats || [];
  if (!pool.length) return "";
  return pickSeeded(pool, `pg_${category}`);
}

module.exports = { applyPersonalityGuard, BREAKS_IDENTITY_RE };
