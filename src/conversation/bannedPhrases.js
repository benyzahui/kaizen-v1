/**
 * Session-scoped caps on a few comfort-template phrases (anti-loop with copy).
 */

const COMFORT_RE = /(i am with you|\bitt vagyok\b|sunt aici)\b/i;
const SMALL_STEP_RE = /what is one small|mi egy kis lépés|care e un mic pas/i;

/**
 * @param {object} session
 * @param {string} body
 * @param {{ bannedPhraseAltComfort?: string, bannedPhraseAltSmallStep?: string }} r
 */
function applyBannedPhraseRotation(session, body, r) {
  let out = String(body || "");
  const comfortUses = session?.comfortOpenerUses || 0;
  const smallUses = session?.smallStepAskUses || 0;
  if (comfortUses >= 1 && r.bannedPhraseAltComfort) {
    out = out
      .split("\n")
      .map((line) => (COMFORT_RE.test(line) ? r.bannedPhraseAltComfort : line))
      .join("\n");
  }
  if (smallUses >= 1 && r.bannedPhraseAltSmallStep) {
    out = out
      .split("\n")
      .map((line) => (SMALL_STEP_RE.test(line) ? r.bannedPhraseAltSmallStep : line))
      .join("\n");
  }
  return out;
}

function countBannedPhraseHits(reply) {
  const s = String(reply || "");
  return {
    comfort: COMFORT_RE.test(s) ? 1 : 0,
    smallStep: SMALL_STEP_RE.test(s) ? 1 : 0
  };
}

module.exports = {
  applyBannedPhraseRotation,
  countBannedPhraseHits,
  COMFORT_RE,
  SMALL_STEP_RE
};
