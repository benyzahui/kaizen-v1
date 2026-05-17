/**
 * Adaptive energy reads — personal, alive, path-aware (not generic almanac).
 */

const { pickSeeded } = require("../personality/tone");
const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { resolveContextualEnergyLens } = require("./contextualEnergy");

/**
 * @param {object} session
 * @param {object} state
 * @param {'general'|'trading'|'body'|'emotion'|'work'} lens
 * @param {'en'|'hu'|'ro'} lang
 */
function buildAdaptiveEnergyLead(session, state, lens, lang) {
  const r = getResponses(lang);
  const pm = session?.presenceMemory || {};
  const path = session?.userPrimaryPath;
  const pool = [];

  if (
    pm.emotionalState === "overloaded" ||
    state?.emotionalIntensity >= 7 ||
    pm.overloadActive
  ) {
    pool.push(...(r.adaptiveEnergy?.overload || []));
  } else if (lens === "trading" || path === "trading") {
    pool.push(...(r.adaptiveEnergy?.trader || []));
  } else if (lens === "body" || path === "physical" || state?.energyLevel <= 4) {
    pool.push(...(r.adaptiveEnergy?.body || []));
  } else if (path === "business" || lens === "work") {
    pool.push(...(r.adaptiveEnergy?.business || []));
  } else if (state?.mentorMode === "disciplined_push") {
    pool.push(...(r.adaptiveEnergy?.discipline || []));
  } else if (path === "physical") {
    pool.push(...(r.adaptiveEnergy?.athlete || []));
  } else {
    pool.push(...(r.adaptiveEnergy?.general || []));
  }

  if (!pool.length) return null;
  return pickSeeded(pool, `aelead_${lens}_${path}_${state?.energyLevel || 5}`);
}

/**
 * Compact personal energy read (replaces wall when adaptive path wins).
 * @param {Date} date
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} ctx
 */
function buildAdaptiveEnergyRead(date, lang, ctx = null) {
  const session = ctx?.session || ctx?.memory?.permanent || {};
  const state = ctx?.state || {};
  const lens = resolveContextualEnergyLens(session, state, ctx?.lens || "general");
  const r = getResponses(lang);
  const lead = buildAdaptiveEnergyLead(session, state, lens, lang);
  const bodyPool = r.adaptiveEnergy?.pulse || r.adaptiveEnergy?.general || [];
  const pulse = pickSeeded(
    bodyPool,
    `aepulse_${lens}_${date.toISOString().slice(0, 10)}_${ctx?.userId || ""}`
  );

  if (!lead) return pulse || "";
  return lines(lead, pulse ? "" : null, pulse).trim();
}

module.exports = { buildAdaptiveEnergyLead, buildAdaptiveEnergyRead };
