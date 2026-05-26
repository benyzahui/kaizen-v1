/**
 * Pick from expanded mantra pools with category + anti-repeat.
 */

const { totalExpandedCount } = require("./expandedPools");
const { selectMantra, recordContentUse } = require("../content/dailyContentEngine");

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
  const pick = selectMantra(locked, ctx, session, userId, dateKey, slot);
  if (pick?.id) recordContentUse(userId, "mantra", pick.id);
  return pick;
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 */
function expandedPoolSize(slot, lang) {
  const { getMantras } = require("../content/contentCatalog");
  const phase = slot === "late_night" ? "evening" : slot;
  return getMantras(lang).filter((e) => e.phases.includes(phase)).length;
}

module.exports = {
  pickExpandedMantra,
  expandedPoolSize,
  totalExpandedCount
};
