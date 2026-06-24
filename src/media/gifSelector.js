/**
 * GIF selector — rare, context-matched, silent fallback when unset.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { GIF_REGISTRY, resolveGifUrl } = require("./gifRegistry");

const CONTEXT_TO_CATEGORY = {
  welcome: "welcome",
  first_welcome: "welcome",
  morning: "morning",
  morning_activation: "morning",
  evening: "recovery",
  evening_reset: "recovery",
  recovery: "recovery",
  recovery_encouragement: "recovery",
  discipline: "discipline",
  celebration: "celebration",
  streak_milestone: "celebration",
  completion: "celebration"
};

const DEFAULT_CHANCES = {
  welcome: 1,
  first_welcome: 1,
  morning_activation: 0.12,
  evening_reset: 0.1,
  recovery_encouragement: 0.18,
  streak_milestone: 0.85,
  completion: 0.7,
  celebration: 0.75
};

/**
 * @param {string} category
 * @param {string|number} userId
 * @param {string} seed
 * @param {object} [session]
 */
function pickGif(category, userId, seed, session) {
  const energy = session?.energyState || "stable";
  let pool = GIF_REGISTRY.filter((g) => g.category === category);
  if (energy === "exhausted" || energy === "low") {
    const recovery = GIF_REGISTRY.filter((g) => g.category === "recovery");
    if (recovery.length) pool = recovery;
  }
  if (!pool.length) return null;

  const entry = pickSeeded(pool, `${userId}|gif|${category}|${seed}`);
  if (!entry) return null;
  const url = resolveGifUrl(entry);
  if (!url) return null;
  return { id: entry.id, category: entry.category, url };
}

/**
 * @param {string} context
 * @param {string|number} userId
 * @param {object} session
 * @param {object} [opts]
 * @returns {{ id: string, url: string }|null}
 */
function selectGif(context, userId, session, opts = {}) {
  const category = opts.category || CONTEXT_TO_CATEGORY[context] || context;
  if (!category) return null;

  const chance = opts.force ? 1 : (opts.chance ?? DEFAULT_CHANCES[context] ?? 0);
  if (chance < 1) {
    const seed = `${userId}|ch|${context}|${opts.dateKey || ""}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    if (h % 20 >= Math.floor(chance * 20)) return null;
  }

  const dateKey = opts.dateKey || new Date().toISOString().slice(0, 10);
  return pickGif(category, userId, `${context}|${dateKey}`, session);
}

/**
 * @param {string|number} userId
 * @param {object} session
 * @param {string} context
 * @param {object} [opts]
 */
function stageGifForContext(userId, session, context, opts = {}) {
  const picked = selectGif(context, userId, session, opts);
  if (!picked?.url) return null;
  updateSession(userId, { pendingGifUrl: picked.url, lastGifContext: context });
  return picked;
}

/**
 * @param {string|number} userId
 */
function clearPendingGif(userId) {
  updateSession(userId, { pendingGifUrl: null });
}

module.exports = {
  CONTEXT_TO_CATEGORY,
  DEFAULT_CHANCES,
  selectGif,
  pickGif,
  stageGifForContext,
  clearPendingGif
};
