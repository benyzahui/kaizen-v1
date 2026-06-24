/**
 * Midday energy reply capture — Low / Stable / High → protocol.
 */

const { updateSession, getSession } = require("../session/sessionStore");
const { buildMiddayProtocolForEnergy } = require("./middayStabilization");
const { syncProtocolFieldsFromDaily } = require("../tracking/dailyStateModel");
const { getOrCreateDailyState } = require("../tracking/dailyStateModel");

/**
 * @param {string} raw
 * @returns {'low'|'stable'|'high'|null}
 */
function parseMiddayEnergyChoice(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /\b(low|alacsony|scăzut|scazut|gyenge)\b/.test(t)) return "low";
  if (n === 3 || /\b(high|magas|ridicat|erős|eros)\b/.test(t)) return "high";
  if (n === 2 || /\b(stable|stabil|közepes|kozepes)\b/.test(t)) return "stable";
  return null;
}

/**
 * @param {string|number} userId
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @returns {string|null}
 */
function tryConsumeMiddayEnergyReply(userId, text, lang, session) {
  if (!session?.middayEnergyPending) return null;

  const energy = parseMiddayEnergyChoice(text);
  if (!energy) return null;

  const dateKey = session.middayEnergyDateKey || new Date().toISOString().slice(0, 10);
  const locked = session.middayEnergyLang || lang;

  const daily = getOrCreateDailyState(session, userId, locked);
  const energyLevel = energy === "low" ? 3 : energy === "high" ? 8 : 6;
  const proto = syncProtocolFieldsFromDaily(session, {
    ...daily,
    energyLevel,
    focusDrift: energy === "low" ? 7 : energy === "high" ? 2 : 4
  });

  updateSession(userId, {
    middayEnergyPending: false,
    middayEnergyDateKey: null,
    middayEnergyLang: null,
    energyState: energy,
    dailyState: { ...daily, energyLevel },
    ...proto
  });

  return buildMiddayProtocolForEnergy(
    energy,
    locked,
    getSession(userId),
    userId,
    dateKey
  );
}

module.exports = { parseMiddayEnergyChoice, tryConsumeMiddayEnergyReply };
