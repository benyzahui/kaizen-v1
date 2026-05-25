/**
 * Mantra engine — structured pools, adaptive tags, ID anti-repetition.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { getEntries } = require("./mantraPools/registry");
const { updateSession } = require("../session/sessionStore");

/**
 * @param {object} entry
 * @param {object} ctx
 */
function entryMatchesContext(entry, ctx) {
  const tags = entry.tags || [];
  if (ctx.energyState === "exhausted" && tags.includes("recovery")) return true;
  if (
    (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") &&
    (tags.includes("stabilization") || tags.includes("let_go"))
  ) {
    return true;
  }
  if (ctx.activeMode === "warrior" && tags.includes("warrior")) return true;
  if (
    (ctx.disciplineState === "drifting" || ctx.disciplineState === "inconsistent") &&
    tags.includes("focus")
  ) {
    return true;
  }
  if (tags.includes("discipline") || tags.includes("focus")) return true;
  return false;
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} [ctx]
 * @returns {{ text: string, id: string|null }}
 */
function pickMantraForSlot(slot, lang, session, userId, dateKey, ctx = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const all = getEntries(slot, locked);
  if (!all.length) return { text: "One lane.", id: null };

  const usedIds = new Set(session?.recentMantraIds || []);
  let pool = all.filter((e) => entryMatchesContext(e, ctx));
  if (pool.length < 10) pool = all;

  let candidates = pool.filter((e) => !usedIds.has(e.id));
  if (!candidates.length) candidates = pool;

  const seed = `${userId}|${dateKey}|${slot}|${locked}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const entry = candidates[h % candidates.length];

  return { text: entry.text, id: entry.id };
}

/**
 * @param {string|number} userId
 * @param {{ text: string, id?: string|null }} mantra
 * @param {object} session
 */
function recordMantraUse(userId, mantra, session) {
  const text = typeof mantra === "string" ? mantra : mantra?.text;
  const id = typeof mantra === "object" ? mantra?.id : null;
  if (!text) return;

  const recent = [...(session?.recentMantraIds || [])];
  if (id && !recent.includes(id)) recent.push(id);

  const snippets = new Set(session?.recentCoachSnippets || []);
  snippets.add(text.toLowerCase().slice(0, 96));

  updateSession(userId, {
    recentMantraIds: recent.slice(-30),
    recentCoachSnippets: [...snippets].slice(-48)
  });
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 */
function poolSize(slot, lang) {
  return getEntries(slot, lang).length;
}

module.exports = {
  pickMantraForSlot,
  recordMantraUse,
  poolSize,
  entryMatchesContext
};
