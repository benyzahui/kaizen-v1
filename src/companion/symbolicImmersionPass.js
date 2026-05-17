/**
 * Symbolic immersion — language lock, visual rhythm, symbolic companion moments (269–274).
 */

const { dedupeLines } = require("./humanVoiceGuard");
const { enforceHardLanguageLock } = require("../i18n/languageHardLock");
const { lines } = require("../personality/kaizenVoice");
const {
  applySymbolicTiming,
  maybeSymbolicCompanionMoment,
  normalizeSymbolicDensity
} = require("./symbolicEmotionSystem");

/**
 * @param {string} body
 */
function applyPremiumVisualRhythm(body) {
  return String(body || "")
    .replace(/\n{3,}/g, "\n")
    .replace(/\n\n/g, "\n")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (/^(focus:|fókusz:|body:|test:|energy:|watch:)/i.test(line)) return false;
      return true;
    })
    .slice(0, 3)
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeSymbolicImmersion(body, ctx, category, timing) {
  if (category === "onboarding") {
    return enforceHardLanguageLock(
      body,
      ctx.lang,
      ctx.session,
      ctx.userId
    );
  }

  let b = enforceHardLanguageLock(body, ctx.lang, ctx.session, ctx.userId);
  b = applyPremiumVisualRhythm(b);
  b = applySymbolicTiming(b, ctx, timing);

  const moment = maybeSymbolicCompanionMoment(ctx, timing);
  if (moment && !b.includes(moment.slice(0, 16))) {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length <= 1 && b.length < 95) {
      b = parts.length === 0 ? moment : lines(b, moment);
    }
  }

  b = normalizeSymbolicDensity(b);
  return dedupeLines(b).trim();
}

module.exports = {
  finalizeSymbolicImmersion,
  applyPremiumVisualRhythm
};
