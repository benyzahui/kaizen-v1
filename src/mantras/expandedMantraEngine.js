/**
 * Pick from expanded mantra pools with category + anti-repeat.
 */

const { getExpandedForLang, totalExpandedCount } = require("./expandedPools");
const {
  resolvePreferredCategories,
  entryMatchesCategory
} = require("./categoryMap");
const { updateSession } = require("../session/sessionStore");

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 */
function pickExpandedMantra(slot, lang, session, userId, dateKey, ctx = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = slot === "late_night" ? "evening" : slot;
  const all = getExpandedForLang(locked);
  if (!all.length) return { text: "One lane.", id: null };

  const preferred = resolvePreferredCategories(ctx, slot);
  const usedIds = new Set(session?.recentMantraIds || []);

  let pool = all.filter(
    (e) =>
      e.phases.includes(phase) && entryMatchesCategory(e, preferred, ctx)
  );
  if (pool.length < 8) {
    pool = all.filter((e) => e.phases.includes(phase));
  }
  if (pool.length < 4) pool = all;

  let candidates = pool.filter((e) => !usedIds.has(e.id));
  if (candidates.length < 3) candidates = pool;

  const seed = `${userId}|${dateKey}|${slot}|exp|${locked}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const entry = candidates[h % candidates.length];

  return { text: entry.text, id: entry.id, category: entry.category };
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 */
function expandedPoolSize(slot, lang) {
  const phase = slot === "late_night" ? "evening" : slot;
  return getExpandedForLang(lang).filter((e) => e.phases.includes(phase)).length;
}

module.exports = {
  pickExpandedMantra,
  expandedPoolSize,
  totalExpandedCount
};
