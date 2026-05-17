/**
 * Occasional micro-WOW observations — unexpected clarity, not lectures.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const WOW_SKIP = new Set(["onboarding", "help_intent", "cooldown", "energy_question"]);

/**
 * @param {string} text
 * @param {object} state
 * @param {object} session
 */
function detectWowSlot(text, state, session) {
  const t = String(text || "");
  if (/(túl sok|too much|overwhelm|szét|scattered|tabs)/i.test(t)) return "overload";
  if (/(ötlet|idea|project|projekt|új|new).*(sok|many|túl)/i.test(t)) return "ideas";
  if (/(motiváció|motivation|lazy|lustas)/i.test(t)) return "motivation";
  if (state?.energyLevel <= 4 || /(kimerült|exhausted|fáradt)/i.test(t)) return "body";
  if (session?.userPrimaryPath === "trading" || /(trade|keresked)/i.test(t)) return "trading";
  return "general";
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} state
 * @param {string} text
 * @param {string} category
 */
function maybeMicroWow(session, lang, state, text, category) {
  if (WOW_SKIP.has(category)) return null;
  if (!session?.onboardingCompleted) return null;
  if ((session.messages || []).length < 2) return null;
  if (Math.random() > 0.14) return null;

  const used = session.microWowsUsed || [];
  const slot = detectWowSlot(text, state, session);
  const r = getResponses(lang);
  const pool = (r.microWow?.[slot] || r.microWow?.general || []).filter(Boolean);
  const fresh = pool.filter(
    (p) => !used.includes(String(p).slice(0, 48).toLowerCase())
  );
  const pickFrom = fresh.length ? fresh : pool;
  if (!pickFrom.length) return null;

  return pickSeeded(pickFrom, `wow_${slot}_${category}_${session.messages.length}`);
}

/**
 * @param {object} session
 * @param {string} line
 */
function trackMicroWow(session, line) {
  if (!line) return { microWowsUsed: session.microWowsUsed || [] };
  const key = String(line).slice(0, 48).toLowerCase();
  const used = [...(session.microWowsUsed || []), key].slice(-10);
  return { microWowsUsed: used };
}

module.exports = { maybeMicroWow, detectWowSlot, trackMicroWow };
