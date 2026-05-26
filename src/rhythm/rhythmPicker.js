/**
 * Rhythm line + mantra selection (no builder imports).
 */

const { getResponses } = require("../i18n/getResponses");
const { pickSeeded } = require("../personality/kaizenVoice");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { enrichRhythmContext } = require("../path/dailyPathEngine");

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function resolveRhythmContext(session, lang) {
  return enrichRhythmContext(session, lang);
}

function resolveSectionPool(sectionBlock, ctx) {
  if (!sectionBlock || typeof sectionBlock !== "object") return [];

  if (ctx.energyState === "exhausted" && sectionBlock.exhausted?.length) {
    return sectionBlock.exhausted;
  }
  if (
    (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") &&
    sectionBlock.overloaded?.length
  ) {
    return sectionBlock.overloaded;
  }
  if (ctx.activeMode === "warrior" && sectionBlock.warrior?.length) {
    return sectionBlock.warrior;
  }
  if (sectionBlock[ctx.activeMode]?.length) {
    return sectionBlock[ctx.activeMode];
  }
  return sectionBlock.default || [];
}

function pickRhythmLine(slot, section, ctx, session, userId, dateKey) {
  const r = getResponses(ctx.lang);
  const blueprint = r.rhythmBlueprint || {};
  const slotBlock = blueprint[slot] || {};
  const pool = resolveSectionPool(slotBlock[section], ctx);
  if (!pool.length) return "";

  const seed = `${userId}|${dateKey}|${slot}|${section}`;
  const unseen = pickUnseenVariant(session, seed, pool);
  return unseen || pickSeeded(pool, seed);
}

function pickRhythmMantra(ctx, session, userId, dateKey) {
  const { pickAdaptiveMantra } = require("../atmosphere/atmosphereEngine");
  const slot = String(dateKey).includes("mid")
    ? "midday"
    : String(dateKey).includes("late") || String(dateKey).includes("evening")
      ? "evening"
      : "morning";
  return pickAdaptiveMantra(slot, ctx.lang, session, userId, dateKey);
}

module.exports = {
  resolveRhythmContext,
  resolveSectionPool,
  pickRhythmLine,
  pickRhythmMantra
};
