/**
 * Energy of the Day — symbolic atmospheric guidance (not prediction).
 */

const { lines, pickSeeded } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { resolveRhythmContext } = require("../rhythm/rhythmPicker");
const { enforceHardLanguageLock } = require("../i18n/languageHardLock");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { updateSession } = require("../session/sessionStore");
const { resolveAtmosphereContext } = require("../atmosphere/atmosphereEngine");
const { pickSymbolicLine } = require("../atmosphere/energyAtmosphereMap");

const ASTRO_SPAM_RE =
  /\b(horoscope|zodiac|mercury retrograde|universe wants|the stars|asztrológ|numerolog|predicț|jóslás|univerzum üzen)\b/i;
const GURU_RE =
  /\b(manifest|abundance|divine|cosmic alignment|twin flame|5d|guru|spirit guide)\b/i;

/**
 * @param {object} sectionBlock
 * @param {object} ctx
 */
function pickTierPool(sectionBlock, ctx) {
  if (!sectionBlock) return [];
  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    if (sectionBlock.low?.length) return sectionBlock.low;
  }
  if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    if (sectionBlock.overloaded?.length) return sectionBlock.overloaded;
  }
  if (ctx.activeMode === "warrior") {
    if (sectionBlock.warrior?.length) return sectionBlock.warrior;
  }
  if (
    (ctx.disciplineState === "drifting" || ctx.disciplineState === "inconsistent") &&
    sectionBlock.drifting?.length
  ) {
    return sectionBlock.drifting;
  }
  return sectionBlock.default || [];
}

/**
 * @param {string} section
 * @param {object} ctx
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'en'|'hu'|'ro'} lang
 */
function pickAtmosphereLine(section, ctx, session, userId, dateKey, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const atmCtx = resolveAtmosphereContext(session, locked);
  if (
    section === "nervous" &&
    (ctx.nervousSystemState === "overloaded" ||
      ctx.nervousSystemState === "anxious" ||
      atmCtx.atmosphere === "overloaded")
  ) {
    const sym = pickSymbolicLine(locked, "overloaded", "nervous", userId, dateKey);
    if (sym) return sym;
  }
  if (section === "recovery" && (atmCtx.tone?.timeSlot === "evening" || atmCtx.tone?.timeSlot === "late_night")) {
    const sym = pickSymbolicLine(locked, "recovery", "recovery", userId, dateKey);
    if (sym && locked !== "en") return sym;
  }

  const r = getResponses(lang);
  const block = r.energyAtmosphere?.[section];
  const pool = pickTierPool(block, ctx);
  if (!pool.length) return "";
  const seed = `${userId}|${dateKey}|energy|${section}`;
  return pickUnseenVariant(session, seed, pool) || pickSeeded(pool, seed);
}

function sanitizeEnergyCopy(text) {
  return String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => line && !ASTRO_SPAM_RE.test(line) && !GURU_RE.test(line))
    .join("\n");
}

/**
 * Symbolic energy-of-the-day read (5 lines).
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} [dateKey] YYYY-MM-DD
 * @param {string|number} [userId]
 */
function energyOfTheDay(session, lang, dateKey, userId = "0") {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const dk =
    dateKey || new Date().toISOString().slice(0, 10);
  const ctx = resolveRhythmContext(session, locked);

  const atmosphere = pickAtmosphereLine("atmosphere", ctx, session, userId, dk, locked);
  const nervous = pickAtmosphereLine("nervous", ctx, session, userId, dk, locked);
  const focus = pickAtmosphereLine("focus", ctx, session, userId, dk, locked);
  const discipline = pickAtmosphereLine("discipline", ctx, session, userId, dk, locked);
  const recovery = pickAtmosphereLine("recovery", ctx, session, userId, dk, locked);

  let body = lines(atmosphere, nervous, focus, discipline, recovery);
  body = sanitizeEnergyCopy(body);
  body = enforceHardLanguageLock(body, locked, session, userId);

  const used = new Set(session?.recentEnergyReads || []);
  used.add(dk);
  updateSession(userId, { recentEnergyReads: [...used].slice(-14) });

  return body.trim();
}

module.exports = {
  energyOfTheDay,
  pickAtmosphereLine,
  sanitizeEnergyCopy,
  pickTierPool
};
