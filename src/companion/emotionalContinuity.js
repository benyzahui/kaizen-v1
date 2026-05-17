/**
 * Light emotional direction continuity — not full memory AI.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} text
 */
function maybeEmotionalContinuity(session, lang, text) {
  if (!session?.onboardingCompleted) return null;
  const pm = session.presenceMemory;
  if (!pm || (session.messages || []).length < 2) return null;
  if (Math.random() > 0.22) return null;

  const r = getResponses(lang);
  const pool = [];

  if (pm.overloadActive && pm.emotionalState === "grounded") {
    pool.push(...(r.emotionalContinuity?.groundedAfterOverload || []));
  }
  if (pm.emotionalState === "overloaded" && session.lastEmotionalIntensity >= 5) {
    pool.push(...(r.emotionalContinuity?.stillHeavy || []));
  }
  if (pm.emotionalState === "tired" || pm.energyPattern === "mental fatigue") {
    pool.push(...(r.emotionalContinuity?.bodyFirst || []));
  }
  if (session.lastCategory === "natural_conversation" && pm.lastImportantTopic) {
    pool.push(...(r.emotionalContinuity?.thread || r.threadContinuity || []));
  }

  if (!pool.length) return null;
  return pickSeeded(pool, `econt_${pm.emotionalState}_${session.messages.length}`);
}

module.exports = { maybeEmotionalContinuity };
