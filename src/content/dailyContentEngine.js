/**
 * Daily content engine — smart selection, anti-repeat, evening safety, human moments.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { contentMatches, normalizeContentEntry } = require("./contentSchema");
const { isEveningSafeContent, sortEveningPool } = require("./eveningSafety");
const { MICRO_HUMAN_MOMENTS } = require("./microHumanMoments");
const {
  getMantras,
  getMicroProtocols,
  getAwarenessPrompts,
  getCategoryPrompts,
  getCatalogStats
} = require("./contentCatalog");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|10x|sigma|hajrá|motivációs guru)\b/i;

const CRINGE_RE =
  /\b(hero'?s journey|unlock your potential|limitless|sigma male)\b/i;

/**
 * @param {object} session
 * @param {string} kind
 */
function recentIdsFor(session, kind) {
  if (kind === "mantra") return session?.recentMantraIds || [];
  if (kind === "micro_protocol") return session?.recentMicroProtocolIds || [];
  if (kind === "awareness") return session?.recentAwarenessIds || [];
  if (kind === "human_moment") return session?.recentHumanMomentIds || [];
  return session?.recentCategoryPromptIds || [];
}

/**
 * @param {string|number} userId
 * @param {string} kind
 * @param {string} id
 * @param {number} max
 */
function recordContentUse(userId, kind, id, max = 24) {
  if (!id) return;
  const key =
    kind === "mantra"
      ? "recentMantraIds"
      : kind === "micro_protocol"
        ? "recentMicroProtocolIds"
        : kind === "awareness"
          ? "recentAwarenessIds"
          : kind === "human_moment"
            ? "recentHumanMomentIds"
            : "recentCategoryPromptIds";
  const session = require("../session/sessionStore").getSession(userId);
  const recent = [...(session[key] || [])];
  if (!recent.includes(id)) recent.push(id);
  updateSession(userId, { [key]: recent.slice(-max) });

}

/**
 * @param {object[]} pool
 * @param {object} session
 * @param {string} kind
 */
function filterByVariety(pool, session, kind) {
  const used = new Set(recentIdsFor(session, kind));
  const lastTones = session?.recentEmotionalTones || [];

  let candidates = pool.filter((e) => !used.has(e.id));
  if (candidates.length < 4) candidates = pool;

  if (lastTones.length >= 2) {
    const avoid = lastTones[lastTones.length - 1];
    const varied = candidates.filter((c) => c.emotionalTone !== avoid);
    if (varied.length >= 3) candidates = varied;
  }

  return candidates;
}

/**
 * @param {object[]} pool
 * @param {object} ctx
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 */
function filterPool(pool, ctx, phase) {
  const slot = phase === "late_night" ? "evening" : phase;
  let filtered = pool.filter((e) => contentMatches(e, ctx, slot));
  if (slot === "evening" || slot === "late_night") {
    filtered = filtered.filter((e) => isEveningSafeContent(e, slot));
    filtered = sortEveningPool(filtered);
  }
  if (filtered.length) return filtered;
  const phaseOnly = pool.filter((e) => {
    const slot = phase === "late_night" ? "evening" : phase;
    return e.phases?.includes(slot) || e.timeOfDay?.includes(slot);
  });
  return phaseOnly.length ? phaseOnly : pool;
}

/**
 * @param {object[]} candidates
 * @param {string} seed
 */
function pickFromCandidates(candidates, seed) {
  if (!candidates.length) return null;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return candidates[h % candidates.length];
}

/**
 * @param {object[]} pool
 * @param {object} ctx
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {string} kind
 */
function selectContent(pool, ctx, session, userId, dateKey, phase, kind) {
  const filtered = filterPool(pool, ctx, phase);
  const varied = filterByVariety(filtered, session, kind);
  const seed = `${userId}|${kind}|${dateKey}|${phase}|${ctx.activeMode || ""}`;
  return pickFromCandidates(varied, seed);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} ctx
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function selectMantra(lang, ctx, session, userId, dateKey, slot) {
  const pool = getMantras(lang);
  const entry = selectContent(pool, ctx, session, userId, dateKey, slot, "mantra");
  if (!entry?.text) return { text: "One lane.", id: null, category: null };
  if (entry.emotionalTone) {
    const tones = [...(session?.recentEmotionalTones || []), entry.emotionalTone];
    updateSession(userId, { recentEmotionalTones: tones.slice(-6) });
  }
  return {
    text: entry.text,
    id: entry.id,
    category: entry.category,
    emotionalTone: entry.emotionalTone
  };
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} ctx
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function selectMicroProtocol(lang, ctx, session, userId, dateKey, slot) {
  const { LEGACY_MICRO_PROTOCOLS } = require("../protocols/microProtocols");
  const pool = getMicroProtocols(lang, LEGACY_MICRO_PROTOCOLS);
  return selectContent(pool, ctx, session, userId, dateKey, slot, "micro_protocol");
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} ctx
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function selectAwareness(lang, ctx, session, userId, dateKey, slot) {
  const { LEGACY_AWARENESS_PROMPTS } = require("../challenges/awarenessPrompts");
  const pool = getAwarenessPrompts(lang, LEGACY_AWARENESS_PROMPTS);
  return selectContent(pool, ctx, session, userId, dateKey, slot, "awareness");
}

/**
 * @param {string} category stabilization|discipline|recovery|trading
 */
function selectCategoryPrompt(category, lang, ctx, session, userId, dateKey, phase) {
  const pool = getCategoryPrompts(category, lang);
  return selectContent(pool, ctx, session, userId, dateKey, phase, `cat_${category}`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {number} [chance]
 */
function maybeHumanMoment(lang, session, userId, dateKey, phase, chance = 0.08) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const seed = `${userId}|hm|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 12 >= Math.floor(chance * 12)) return null;

  const slot = phase === "late_night" ? "evening" : phase;
  const pool = MICRO_HUMAN_MOMENTS.filter(
    (m) => m.language === locked && m.timeOfDay.includes(slot)
  );
  const used = new Set(session?.recentHumanMomentIds || []);
  let candidates = pool.filter((m) => !used.has(m.id));
  if (!candidates.length) candidates = pool;
  const pick = pickFromCandidates(candidates, seed);
  if (pick) recordContentUse(userId, "human_moment", pick.id, 16);
  return pick?.text || null;
}

/**
 * @param {string} text
 */
function isPremiumContent(text) {
  if (!text || HYPE_RE.test(text) || CRINGE_RE.test(text)) return false;
  if (text.length > 900) return false;
  return true;
}

module.exports = {
  HYPE_RE,
  CRINGE_RE,
  selectContent,
  selectMantra,
  selectMicroProtocol,
  selectAwareness,
  selectCategoryPrompt,
  maybeHumanMoment,
  recordContentUse,
  isPremiumContent,
  getCatalogStats,
  filterPool,
  filterByVariety
};
