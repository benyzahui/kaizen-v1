/**
 * Knowledge Core selector — language, level, energy, phase aware.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { resolveProtocolLevel } = require("../blueprint/protocolLevels");
const { enrichRhythmContext } = require("../path/dailyPathEngine");
const { getKnowledgeEntries } = require("./knowledgeRegistry");
const {
  knowledgeMatches,
  knowledgeText,
  KNOWLEDGE_CATEGORIES
} = require("./knowledgeSchema");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|10x|sigma|therapy|guru|limitless)\b/i;

/**
 * @param {string} text
 */
function isPremiumKnowledgeText(text) {
  if (!text || text.length < 2 || text.length > 420) return false;
  if (HYPE_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 * @param {string} [text]
 * @param {'en'|'hu'|'ro'} lang
 */
function buildKnowledgeContext(session, lang, text = "") {
  const rhythm = enrichRhythmContext(session, lang);
  return {
    ...rhythm,
    protocolLevel: resolveProtocolLevel(session),
    inboundText: text
  };
}

/**
 * @param {string} category
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {object} [extraCtx]
 */
function selectKnowledge(category, lang, session, userId, dateKey, phase, extraCtx = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const ctx = { ...buildKnowledgeContext(session, locked), ...extraCtx };
  const slot = phase === "late_night" ? "evening" : phase;
  const used = new Set(session?.recentKnowledgeIds || []);

  let pool = getKnowledgeEntries({ category }).filter(
    (e) => knowledgeMatches(e, ctx, slot) && !used.has(e.id)
  );
  if (!pool.length) {
    pool = getKnowledgeEntries({ category }).filter((e) => knowledgeMatches(e, ctx, slot));
  }
  if (!pool.length) return null;

  const entry = pickSeeded(pool, `${userId}|kb|${category}|${dateKey}|${slot}`);
  if (!entry) return null;

  const text = knowledgeText(entry, locked);
  if (!isPremiumKnowledgeText(text)) return null;

  recordKnowledgeUse(userId, session, entry.id);
  return formatKnowledgePick(entry, locked);
}

function recordKnowledgeUse(userId, session, id) {
  const used = new Set(session?.recentKnowledgeIds || []);
  updateSession(userId, { recentKnowledgeIds: [...used, id].slice(-32) });
}

/**
 * @param {object} entry
 * @param {'en'|'hu'|'ro'} lang
 */
function formatKnowledgePick(entry, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const text = knowledgeText(entry, locked);
  const result = {
    id: entry.id,
    text,
    category: entry.category,
    phase: entry.phase,
    tags: entry.tags,
    emotionalTone: entry.tags?.includes("evening_release") ? "release" : "calm"
  };

  if (entry.actions) {
    const acts = entry.actions[locked] || entry.actions.en || [];
    result.title = text;
    result.actions = acts;
    result.kind = "micro_protocol";
  } else {
    result.kind = "mantra";
  }
  return result;
}

/**
 * Mantra pick for daily rhythm phases.
 */
function pickKnowledgeMantra(phase, lang, session, userId, dateKey, extraCtx = {}) {
  const slot = phase === "late_night" ? "evening" : phase;
  const category =
    slot === "morning"
      ? KNOWLEDGE_CATEGORIES.MORNING_MANTRA
      : slot === "midday"
        ? KNOWLEDGE_CATEGORIES.MIDDAY_MANTRA
        : KNOWLEDGE_CATEGORIES.EVENING_MANTRA;
  return selectKnowledge(category, lang, session, userId, dateKey, slot, extraCtx);
}

/**
 * Protocol pick — low or high energy from Knowledge Core.
 */
function pickKnowledgeProtocol(phase, lang, session, userId, dateKey, extraCtx = {}) {
  const ctx = buildKnowledgeContext(session, lang);
  const energy = extraCtx.energyState || ctx.energyState || "stable";
  const category =
    energy === "exhausted" || energy === "low"
      ? KNOWLEDGE_CATEGORIES.LOW_ENERGY_PROTOCOL
      : energy === "high"
        ? KNOWLEDGE_CATEGORIES.HIGH_ENERGY_PROTOCOL
        : energy === "overstimulated"
          ? KNOWLEDGE_CATEGORIES.LOW_ENERGY_PROTOCOL
          : null;

  if (!category) return null;
  return selectKnowledge(category, lang, session, userId, dateKey, phase, extraCtx);
}

function pickKnowledgeReflection(lang, session, userId, dateKey, phase = "evening") {
  return selectKnowledge(
    KNOWLEDGE_CATEGORIES.REFLECTION,
    lang,
    session,
    userId,
    dateKey,
    phase
  );
}

function pickKnowledgeChallenge(lang, session, userId, dateKey, phase = "midday") {
  return selectKnowledge(
    KNOWLEDGE_CATEGORIES.MICRO_CHALLENGE,
    lang,
    session,
    userId,
    dateKey,
    phase
  );
}

function pickKnowledgeQuote(lang, session, userId, dateKey, phase = "midday") {
  return selectKnowledge(
    KNOWLEDGE_CATEGORIES.DRAGON_QUOTE,
    lang,
    session,
    userId,
    dateKey,
    phase
  );
}

module.exports = {
  HYPE_RE,
  isPremiumKnowledgeText,
  buildKnowledgeContext,
  selectKnowledge,
  pickKnowledgeMantra,
  pickKnowledgeProtocol,
  pickKnowledgeReflection,
  pickKnowledgeChallenge,
  pickKnowledgeQuote,
  formatKnowledgePick,
  recordKnowledgeUse
};
