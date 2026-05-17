/**
 * Occasional companion-initiated check-ins (not spam).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const MIN_GAP_MS = 5 * 60 * 60 * 1000;
const CHECKIN_COOLDOWN_MS = 12 * 60 * 60 * 1000;

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} text
 * @returns {null | { body: string, category: string }}
 */
function tryCompanionCheckIn(session, lang, userId, text) {
  if (!session.onboardingCompleted) return null;
  if (/^\s*\//.test(text)) return null;

  const now = Date.now();
  const gap = now - (session.lastAt || now);
  if (gap < MIN_GAP_MS) return null;

  const lastCheck = session.lastCompanionCheckin || 0;
  if (now - lastCheck < CHECKIN_COOLDOWN_MS) return null;

  const pm = session.presenceMemory || {};
  const shortMsg = String(text || "").trim().length < 50;
  const greeting = /^(szia|hello|hey|hi|bună|salut|gm|jó reggelt)/i.test(text);

  let trigger = false;
  if (gap > 8 * 60 * 60 * 1000 && (greeting || shortMsg)) trigger = true;
  if (pm.overloadActive && gap > MIN_GAP_MS && shortMsg && greeting) trigger = true;
  if (pm.mission && gap > 10 * 60 * 60 * 1000 && Math.random() < 0.12) trigger = true;

  if (!trigger) return null;
  if (Math.random() > 0.28) return null;

  const r = getResponses(lang);
  const pool = r.companionCheckIns || [];
  if (!pool.length) return null;

  return {
    body: pickSeeded(pool, `checkin_${userId}_${now}`),
    category: "companion_checkin"
  };
}

module.exports = { tryCompanionCheckIn, MIN_GAP_MS, CHECKIN_COOLDOWN_MS };
