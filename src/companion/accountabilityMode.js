/**
 * Optional accountability — follow-up, avoidance nudges, habit checks.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");

const ACCOUNTABILITY_ON =
  /\b(keep me accountable|hold me accountable|accountability mode|tarts felelősségre|tarts\s+számon|ține-mă responsabil|tine-ma responsabil|fă-mă responsabil)\b/i;

const ACCOUNTABILITY_OFF =
  /\b(stop accountability|no more check.?ins|kihagyod a check|oprește responsabilitatea)\b/i;

const PROMISE_RE =
  /\b(holnap|tomorrow|ma este|tonight|futni|run|edzek|train|alszom|sleep|meditat|journal|napló|trade discipline)\b/i;

function msgsLen(session) {
  return session?.messages?.length || 0;
}

/**
 * @param {string} text
 */
function detectAccountabilityToggle(text) {
  if (ACCOUNTABILITY_OFF.test(text)) return "off";
  if (ACCOUNTABILITY_ON.test(text)) return "on";
  return null;
}

/**
 * @param {string|number} userId
 * @param {'on'|'off'} mode
 * @param {'en'|'hu'|'ro'} lang
 */
function applyAccountabilityToggle(userId, mode, lang) {
  const r = getResponses(lang);
  updateSession(userId, {
    accountabilityMode: mode === "on",
    accountabilitySince: mode === "on" ? Date.now() : null
  });
  return mode === "on" ? r.accountabilityOn : r.accountabilityOff;
}

/**
 * @param {object} session
 * @param {string} text
 */
function maybeRecordPromise(session, text) {
  if (!session.accountabilityMode) return null;
  if (!PROMISE_RE.test(text)) return null;
  return String(text).trim().slice(0, 200);
}

/**
 * @param {object} session
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 */
function tryAccountabilityFollowUp(session, text, lang, userId) {
  if (!session.accountabilityMode || !session.onboardingCompleted) return null;
  const raw = String(text || "").trim();
  if (raw.length < 4 || /^\//.test(raw)) return null;

  const r = getResponses(lang);
  const last = session.lastAccountabilityPromise;
  const gap = Date.now() - (session.lastAt || 0);

  if (last && gap > 4 * 60 * 60 * 1000 && Math.random() < 0.28) {
    const pool = r.accountabilityFollowUps || r.accountabilitySoul?.followUp || [];
    if (!pool.length) return null;
    const line = pickSeeded(pool, `acc_${userId}_${last.slice(0, 20)}`);
    return {
      body: line.replace("{promise}", last.slice(0, 80)),
      category: "accountability_followup"
    };
  }

  if (session.accountabilityMode && msgsLen(session) >= 3 && Math.random() < 0.1) {
    const nudge = r.accountabilitySoul?.nudge || r.accountabilityNudges || [];
    if (nudge.length && raw.length < 100 && !last) {
      return {
        body: pickSeeded(nudge, `acc_nudge_${userId}_${msgsLen(session)}`),
        category: "accountability_followup"
      };
    }
  }

  const promise = maybeRecordPromise(session, text);
  if (promise) {
    updateSession(userId, {
      lastAccountabilityPromise: promise,
      lastAccountabilityAt: Date.now()
    });
  }

  if (/(didn't|did not|nem |nu am|failed|skipped|halog)/i.test(raw) && last) {
    const pool = r.accountabilitySoul?.avoidance || r.accountabilityAvoidance || [];
    if (pool.length && Math.random() < 0.32) {
      return {
        body: pickSeeded(pool, `acc_avoid_${userId}`),
        category: "accountability_followup"
      };
    }
  }

  return null;
}

module.exports = {
  detectAccountabilityToggle,
  applyAccountabilityToggle,
  tryAccountabilityFollowUp,
  maybeRecordPromise
};
