/**
 * Dragon Blueprint content routing — pools, levels, energy, anti-repeat.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { getKnowledgeEntries } = require("../knowledgeCore/knowledgeRegistry");
const { knowledgeMatches, knowledgeText, KNOWLEDGE_CATEGORIES } = require("../knowledgeCore/knowledgeSchema");
const {
  pickKnowledgeMantra,
  pickKnowledgeChallenge,
  pickKnowledgeReflection,
  pickKnowledgeProtocol,
  pickKnowledgeQuote,
  buildKnowledgeContext,
  recordKnowledgeUse
} = require("../knowledgeCore/knowledgeSelector");
const { levelFocusPool } = require("./dragonProgression");

const QUOTE_TAG_POOLS = {
  dragon_path: ["dragon_path", "dragon", "path"],
  warrior: ["warrior", "warrior_push", "discipline"],
  stoic: ["stoic", "clarity", "structure"],
  samurai: ["samurai", "focus", "discipline"],
  trading: ["trading", "focus", "digital_control"],
  breathwork: ["breathwork", "breathing"],
  movement: ["movement", "hydration"],
  recovery: ["recovery", "evening_release", "regeneration"]
};

/**
 * @param {string} category
 * @param {string[]} tags
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'} phase
 * @param {object} [extraCtx]
 */
function pickTaggedKnowledge(category, tags, lang, session, userId, dateKey, phase, extraCtx = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const ctx = { ...buildKnowledgeContext(session, locked), ...extraCtx };
  const slot = phase === "late_night" ? "evening" : phase;
  const used = new Set(session?.recentKnowledgeIds || []);
  const tagSet = new Set(tags);

  let pool = getKnowledgeEntries({ category }).filter((e) => {
    if (!knowledgeMatches(e, ctx, slot)) return false;
    if (used.has(e.id)) return false;
    return e.tags?.some((t) => tagSet.has(t));
  });
  if (!pool.length) {
    pool = getKnowledgeEntries({ category }).filter((e) => {
      if (!knowledgeMatches(e, ctx, slot)) return false;
      return e.tags?.some((t) => tagSet.has(t));
    });
  }
  if (!pool.length) return null;

  const entry = pickSeeded(pool, `${userId}|tag|${category}|${dateKey}|${slot}`);
  if (!entry) return null;
  recordKnowledgeUse(userId, session, entry.id);
  return knowledgeText(entry, locked);
}

/**
 * @param {'dragon_path'|'warrior'|'stoic'|'samurai'|'trading'|'breathwork'|'movement'|'recovery'} poolKey
 */
function pickWisdomQuote(poolKey, lang, session, userId, dateKey, phase = "midday") {
  const tags = QUOTE_TAG_POOLS[poolKey] || QUOTE_TAG_POOLS.dragon_path;
  const tagged = pickTaggedKnowledge(
    KNOWLEDGE_CATEGORIES.DRAGON_QUOTE,
    tags,
    lang,
    session,
    userId,
    dateKey,
    phase
  );
  if (tagged) return tagged;
  const fallback = pickKnowledgeQuote(lang, session, userId, dateKey, phase);
  return fallback?.text || null;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 */
function pickDailyFocus(lang, session, userId, dateKey) {
  const pool = levelFocusPool(session, lang);
  return pickSeeded(pool, `${userId}|focus|${dateKey}`);
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 */
function pickPhaseMantra(phase, lang, session, userId, dateKey) {
  return pickKnowledgeMantra(phase, lang, session, userId, dateKey);
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 */
function pickPhaseChallenge(phase, lang, session, userId, dateKey) {
  const pick = pickKnowledgeChallenge(lang, session, userId, dateKey, phase);
  return pick?.text || null;
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {object} [extraCtx]
 */
function pickEnergyProtocol(phase, lang, session, userId, dateKey, extraCtx = {}) {
  return pickKnowledgeProtocol(phase, lang, session, userId, dateKey, extraCtx);
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 */
function pickReflectionQuestion(lang, session, userId, dateKey, phase = "evening") {
  const pick = pickKnowledgeReflection(lang, session, userId, dateKey, phase);
  return pick?.text || null;
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 */
function pickBreathworkPrompt(lang, session, userId, dateKey, phase = "midday") {
  return (
    pickTaggedKnowledge(
      KNOWLEDGE_CATEGORIES.LOW_ENERGY_PROTOCOL,
      QUOTE_TAG_POOLS.breathwork,
      lang,
      session,
      userId,
      dateKey,
      phase
    ) ||
    pickTaggedKnowledge(
      KNOWLEDGE_CATEGORIES.MICRO_CHALLENGE,
      QUOTE_TAG_POOLS.breathwork,
      lang,
      session,
      userId,
      dateKey,
      phase
    )
  );
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 */
function pickRecoveryRecommendation(lang, session, userId, dateKey, phase = "evening") {
  const proto = pickEnergyProtocol(phase, lang, session, userId, dateKey, {
    energyState: session?.energyState || "exhausted"
  });
  if (proto?.actions?.length) {
    return proto.actions.slice(0, 2).join(" · ");
  }
  return (
    pickTaggedKnowledge(
      KNOWLEDGE_CATEGORIES.LOW_ENERGY_PROTOCOL,
      QUOTE_TAG_POOLS.recovery,
      lang,
      session,
      userId,
      dateKey,
      phase
    ) || pickWisdomQuote("recovery", lang, session, userId, dateKey, phase)
  );
}

module.exports = {
  QUOTE_TAG_POOLS,
  pickTaggedKnowledge,
  pickWisdomQuote,
  pickDailyFocus,
  pickPhaseMantra,
  pickPhaseChallenge,
  pickEnergyProtocol,
  pickReflectionQuestion,
  pickBreathworkPrompt,
  pickRecoveryRecommendation
};
