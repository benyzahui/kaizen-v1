/**
 * ENERGY_ENGINE — symbolic energy-of-the-day facade (/energy + open text).
 */

const { energyOfTheDay } = require("../energy/energyEngine");
const { enforceHardLanguageLock } = require("../i18n/languageHardLock");
const { getLockedLang } = require("../i18n/lockedLanguage");

/**
 * @param {Date} [date]
 * @param {'en'|'hu'|'ro'} lang
 * @param {'general'|'trading'|'body'|'emotion'|'work'} [lens] legacy — mode may tune session before call
 * @param {object} [ctx]
 */
function buildEnergyRead(date, lang, lens = "general", ctx = null) {
  const session = ctx?.session || null;
  const locked =
    getLockedLang(session || {}, null, "") ||
    (lang === "hu" || lang === "ro" ? lang : "en");
  const userId = ctx?.userId != null ? String(ctx.userId) : "0";
  const dk = (date || new Date()).toISOString().slice(0, 10);

  const sessionForRead = {
    ...(session || {}),
    ...(ctx?.state
      ? {
          energyState:
            ctx.state.energyLevel <= 2
              ? "exhausted"
              : ctx.state.energyLevel <= 3
                ? "low"
                : session?.energyState,
          nervousSystemState:
            ctx.state.emotionalIntensity >= 7
              ? "overloaded"
              : session?.nervousSystemState
        }
      : {}),
    ...(lens === "trading" ? { activeMode: "trading" } : {}),
    ...(lens === "body" ? { activeMode: session?.activeMode || "recovery" } : {})
  };

  let out = energyOfTheDay(sessionForRead, locked, dk, userId);
  out = enforceHardLanguageLock(out, locked, sessionForRead, userId);
  return out;
}

module.exports = { buildEnergyRead, energyOfTheDay };
