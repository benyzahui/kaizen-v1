/**
 * Fresh user / activation mode — first ~15 messages: calm, varied, no companion pressure.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");

const FRESH_MSG_CAP = 15;

/**
 * Activation overrides companion, energy, natural chat, etc.
 * @param {object} session
 */
function isFreshUserExperience(session) {
  if (session?.onboardingCompleted) return false;
  return Boolean(session?.activationMode ?? true);
}

/**
 * @param {object} session
 */
function isActivationMode(session) {
  return isFreshUserExperience(session);
}

/**
 * @param {string|number} userId
 */
function enterActivationMode(userId) {
  updateSession(userId, {
    activationMode: true,
    freshUserMessageCount: 0,
    freshPhrasesUsed: [],
    onboardingActive: true
  });
}

/**
 * @param {string|number} userId
 * @param {object} session
 */
function trackFreshAssistantReply(userId, session, reply) {
  if (!isFreshUserExperience(session)) return;
  const count = (session.freshUserMessageCount || 0) + 1;
  const key = String(reply || "")
    .slice(0, 120)
    .toLowerCase()
    .replace(/\s+/g, " ");
  const used = [...(session.freshPhrasesUsed || []), key].slice(-12);
  updateSession(userId, {
    freshUserMessageCount: count,
    freshPhrasesUsed: used
  });
}

/**
 * Pick copy variant avoiding recent fresh-session phrases.
 * @param {object} session
 * @param {string[]} pool
 * @param {string} seed
 */
function pickFreshVariant(session, pool, seed = "") {
  if (!pool?.length) return "";
  const used = session?.freshPhrasesUsed || [];
  const fresh = pool.filter((p) => {
    const k = String(p).slice(0, 80).toLowerCase();
    return !used.some((u) => u.includes(k.slice(0, 40)) || k.includes(u.slice(0, 40)));
  });
  const pickFrom = fresh.length ? fresh : pool;
  return pickSeeded(pickFrom, `${seed}_${session?.freshUserMessageCount || 0}`);
}

/**
 * Short “this understands me” beat after intro extraction.
 * @param {object} insights from extractInvisibleProfile
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function buildWowMoment(insights, lang, session) {
  const r = getResponses(lang);
  const pool = [];

  if (insights?.chaosLevel === "high") {
    pool.push(...(r.freshWowOverload || []));
  } else if (insights?.emotionalTone === "tired") {
    pool.push(...(r.freshWowTired || []));
  } else if (insights?.path === "trading") {
    pool.push(...(r.freshWowTrading || []));
  } else if (insights?.path === "business") {
    pool.push(...(r.freshWowBusiness || []));
  }
  pool.push(...(r.freshWowGeneral || []));

  if (!pool.length) return null;
  return pickFreshVariant(session, pool, `wow_${insights?.path || "gen"}`);
}

module.exports = {
  FRESH_MSG_CAP,
  isFreshUserExperience,
  isActivationMode,
  enterActivationMode,
  trackFreshAssistantReply,
  pickFreshVariant,
  buildWowMoment
};
