/**
 * GIF selector — kulcsszó-tükör, ironia, hadnagy hang.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { lines } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { GIF_REGISTRY, resolveGifUrl } = require("./gifRegistry");
const { matchGifKeywords } = require("./gifKeywordEngine");

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
  completion: "celebration",
  mirror_irony: "mirror",
  mirror_comeback: "mirror"
};

const DEFAULT_CHANCES = {
  welcome: 1,
  first_welcome: 1,
  morning_activation: 0.22,
  evening_reset: 0.18,
  recovery_encouragement: 0.35,
  streak_milestone: 0.9,
  completion: 0.78,
  celebration: 0.8,
  mirror_irony: 0.65,
  mirror_comeback: 0.68,
  keyword_match: 0.7
};

/**
 * @param {object} entry
 * @param {string[]} [wantedTags]
 */
function entryTagScore(entry, wantedTags = []) {
  if (!wantedTags?.length) return 1;
  const tags = entry.tags || [];
  let score = 0;
  for (const t of wantedTags) {
    if (tags.includes(t)) score += 2;
  }
  return score;
}

/**
 * @param {string} category
 * @param {string|number} userId
 * @param {string} seed
 * @param {object} [session]
 * @param {object} [opts]
 */
function pickGif(category, userId, seed, session, opts = {}) {
  const energy = session?.energyState || "stable";
  let pool = GIF_REGISTRY.filter((g) => g.category === category);

  if (opts.tags?.length) {
    const scored = pool
      .map((e) => ({ e, s: entryTagScore(e, opts.tags) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (scored.length) pool = scored.map((x) => x.e);
  }

  if ((energy === "exhausted" || energy === "low") && category !== "mirror") {
    const recovery = GIF_REGISTRY.filter((g) => g.category === "recovery");
    if (recovery.length && !opts.tags?.includes("mirror")) pool = recovery;
  }
  if (!pool.length) {
    pool = GIF_REGISTRY.filter((g) => g.category === category);
  }
  if (!pool.length) return null;

  const entry = pickSeeded(pool, `${userId}|gif|${category}|${seed}|${(opts.tags || []).join(",")}`);
  if (!entry) return null;
  const url = resolveGifUrl(entry);
  if (!url) return null;
  return { id: entry.id, category: entry.category, url, tags: entry.tags };
}

/**
 * @param {string} context
 * @param {string|number} userId
 * @param {object} session
 * @param {object} [opts]
 */
function selectGif(context, userId, session, opts = {}) {
  const category = opts.category || CONTEXT_TO_CATEGORY[context] || context;
  if (!category) return null;

  const chance = opts.force ? 1 : (opts.chance ?? DEFAULT_CHANCES[context] ?? 0);
  if (chance < 1) {
    const seed = `${userId}|ch|${context}|${opts.dateKey || ""}|${opts.keywordId || ""}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    if (h % 20 >= Math.floor(chance * 20)) return null;
  }

  const dateKey = opts.dateKey || new Date().toISOString().slice(0, 10);
  return pickGif(category, userId, `${context}|${dateKey}`, session, opts);
}

/**
 * Kulcsszó-alapú GIF + tükör sor (ironikus, nem símogató).
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {object} session
 */
function selectGifFromKeywords(text, lang, userId, session) {
  const match = matchGifKeywords(text, lang);
  if (!match || match.score < 1) return null;

  const recent = session?.recentGifKeywordIds || [];
  if (recent.includes(match.id) && match.score < 2) return null;

  const picked = selectGif(match.context, userId, session, {
    tags: match.tags,
    chance: match.chance,
    keywordId: match.id,
    force: match.score >= 3
  });
  if (!picked?.url) return null;

  updateSession(userId, {
    recentGifKeywordIds: [...recent, match.id].slice(-12)
  });

  return {
    ...picked,
    keywordId: match.id,
    mirrorLine: match.mirrorLine,
    context: match.context
  };
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
  updateSession(userId, {
    pendingGifUrl: picked.url,
    lastGifContext: context,
    lastGifKeywordId: opts.keywordId || null
  });
  return picked;
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {object} session
 * @returns {{ mirrorLine: string }|null}
 */
function stageKeywordMirrorGif(userId, session, text, lang) {
  const picked = selectGifFromKeywords(text, lang, userId, session);
  if (!picked?.url) return null;

  updateSession(userId, {
    pendingGifUrl: picked.url,
    pendingMirrorLine: picked.mirrorLine || null,
    lastGifContext: picked.context,
    lastGifKeywordId: picked.keywordId
  });

  return { mirrorLine: picked.mirrorLine, gifId: picked.id };
}

/**
 * @param {string} body
 * @param {string|null} mirrorLine
 */
function appendMirrorLine(body, mirrorLine) {
  if (!mirrorLine || !body) return body;
  if (body.includes(mirrorLine.slice(0, 12))) return body;
  return lines(body, "", mirrorLine);
}

/**
 * @param {string|number} userId
 */
function clearPendingGif(userId) {
  updateSession(userId, { pendingGifUrl: null, lastGifContext: null });
}

module.exports = {
  CONTEXT_TO_CATEGORY,
  DEFAULT_CHANCES,
  selectGif,
  pickGif,
  selectGifFromKeywords,
  stageGifForContext,
  stageKeywordMirrorGif,
  appendMirrorLine,
  clearPendingGif
};
