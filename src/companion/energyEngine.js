/**
 * ENERGY_ENGINE — facade over daily energy compose.
 * Single entry for /energy and open-text energy reads.
 */

const { buildDailyEnergyMessage } = require("../energy/dailyEnergy");
const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const {
  resolveContextualEnergyLens,
  depletedEnergyOverlay
} = require("./contextualEnergy");
const { buildAdaptiveEnergyRead } = require("./adaptiveEnergy");
const { enforceHardLanguageLock } = require("../i18n/languageHardLock");
const { applySymbolicEnergyRead } = require("./symbolicEmotionSystem");
const { buildHumanizedEnergyCompact } = require("../energy/dailyEnergy");

/**
 * @param {Date} [date]
 * @param {'en'|'hu'|'ro'} lang
 * @param {'general'|'trading'|'body'|'emotion'|'work'} [lens]
 * @param {object} [ctx] companion context — optional lead from memory
 */
function buildEnergyRead(date, lang, lens = "general", ctx = null) {
  const r = getResponses(lang);
  const seed = ctx?.userId != null ? String(ctx.userId) : "";
  const session = ctx?.memory
    ? {
        ...ctx.memory.permanent,
        presenceMemory: ctx.memory.session?.presenceMemory,
        userPrimaryPath: ctx.memory.permanent?.userPrimaryPath
      }
    : ctx?.session || null;
  const state = ctx?.state || null;
  const resolved = resolveContextualEnergyLens(session, state, lens);

  if (state?.energyLevel <= 3 || session?.presenceMemory?.emotionalState === "overloaded") {
    const depleted = depletedEnergyOverlay(lang);
    const adaptive = buildAdaptiveEnergyRead(date, lang, {
      ...ctx,
      lens: resolved,
      session: ctx?.session || session
    });
    if (adaptive && adaptive.length < depleted.length) {
      return adaptive;
    }
    return depleted;
  }

  const useAdaptive =
    session?.onboardingCompleted ||
    state?.emotionalIntensity >= 4 ||
    session?.userPrimaryPath === "trading" ||
    Math.random() < 0.78;

  let out = "";

  if (useAdaptive) {
    out =
      buildAdaptiveEnergyRead(date, lang, {
        ...ctx,
        lens: resolved,
        session: ctx?.session || session
      }) || "";
  }

  if (!out || out.length > 320) {
    out =
      buildHumanizedEnergyCompact(date, lang, {
        ...ctx,
        lens: resolved,
        session: ctx?.session || session,
        state
      }) || out;
  }

  if (!out) {
    out = buildDailyEnergyMessage(date, lang, resolved, seed, { state, session });
  }

  const name = ctx?.memory?.permanent?.userName;
  if (name && r.energyPersonalLead && out.length < 400) {
    out = lines(r.energyPersonalLead.replace("{name}", name), "", out);
  }

  out = enforceHardLanguageLock(out, lang, ctx?.session || session, ctx?.userId || seed);
  if (ctx) {
    out = applySymbolicEnergyRead(out, { ...ctx, lang, state, session: ctx?.session || session });
  }
  return out;
}

module.exports = { buildEnergyRead, buildDailyEnergyMessage };
