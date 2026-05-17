/**
 * Light warmth — never cheesy, never cold-clinical.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const WARM_SKIP = new Set([
  "onboarding",
  "cooldown",
  "help_intent",
  "energy_question",
  "accountability_setup"
]);

/**
 * @param {object} state
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} text
 */
function maybeCompanionWarmth(state, session, lang, category, text) {
  if (WARM_SKIP.has(category)) return null;
  if (!session?.onboardingCompleted) return null;

  const t = String(text || "");
  const r = getResponses(lang);
  let pool = [];
  let chance = 0.12;

  if (/(kimondt|said it|spus asta|told you|bevall|honest|őszint)/i.test(t)) {
    pool = r.companionWarmth?.saidAloud || [];
    chance = 0.38;
  } else if (state?.emotionalIntensity >= 6) {
    pool = r.companionWarmth?.emotional || [];
    chance = 0.28;
  } else if (state?.energyLevel <= 4) {
    pool = r.companionWarmth?.tired || [];
    chance = 0.22;
  } else if (/(szégyen|shame|ashamed|ruș)/i.test(t)) {
    pool = r.companionWarmth?.shame || [];
    chance = 0.3;
  } else {
    pool = r.companionWarmth?.general || [];
  }

  if (!pool.length || Math.random() > chance) return null;
  return pickSeeded(pool, `warm_${category}_${session.messages?.length || 0}`);
}

/**
 * Presence without coaching — premium quiet.
 * @param {object} state
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} text
 */
function maybePremiumQuiet(state, session, lang, category, text) {
  if (WARM_SKIP.has(category)) return null;
  if (!session?.onboardingCompleted) return null;

  const t = String(text || "");
  const r = getResponses(lang);
  const pool = r.premiumQuiet || [];
  if (!pool.length) return null;

  let chance = 0.1;
  if (state?.emotionalIntensity >= 5) chance = 0.22;
  if (/(kimondt|said it|bevall|honest|őszint|kept inside|bent tart)/i.test(t)) chance = 0.28;
  if (state?.mentorMode === "recovery_mode") chance = 0.18;

  if (Math.random() > chance) return null;
  return pickSeeded(pool, `quiet_${category}_${session.messages?.length || 0}`);
}

module.exports = { maybeCompanionWarmth, maybePremiumQuiet, WARM_SKIP };
