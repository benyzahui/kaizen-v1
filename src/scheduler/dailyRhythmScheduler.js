/**
 * Scheduler-ready daily rhythm pushes (06:00 / 12:00 / 21:00 Europe/Bucharest).
 *
 * Wire later via:
 * - Netlify scheduled functions (netlify/functions/morning-dragon.js etc.)
 * - cron + Telegram Bot API
 * - Supabase pg_cron → edge function
 *
 * CURRENT: build message + optional send hook (no live cron in repo).
 */

const { getSession, updateSession } = require("../session/sessionStore");
const { finalizeOutboundReply } = require("../i18n/hardLanguageLock");
const { requireLockedLanguage } = require("../i18n/hardLanguageLock");
const {
  buildDailyAutomationMessage,
  sendDailyAutomation,
  simulateDailyAutomationDay
} = require("../dailyAutomation/dailyAutomationEngine");

const DEFAULT_TZ = "Europe/Bucharest";

/**
 * @param {object} session
 */
function resolveSchedulerLang(session) {
  const req = requireLockedLanguage(session);
  if (req.ok && req.lang) return req.lang;
  return null;
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {object} session
 * @param {string|number} userId
 * @param {string} [dateKey]
 * @param {Date} [now]
 */
function buildScheduledRhythmMessage(phase, session, userId, dateKey, now = new Date()) {
  return buildDailyAutomationMessage(phase, session, userId, dateKey, now);
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 */
function sendMorningActivation(userId, opts = {}) {
  const session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : getSession(userId);
  return sendDailyAutomation("morning", userId, { ...opts, session });
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 */
function sendMiddayStabilization(userId, opts = {}) {
  const session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : getSession(userId);
  return sendDailyAutomation("midday", userId, { ...opts, session });
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 */
function sendEveningReset(userId, opts = {}) {
  const session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : getSession(userId);
  return sendDailyAutomation("evening", userId, { ...opts, session });
}

/**
 * @param {string|number} userId
 */
function simulateDailyRhythmDay(userId) {
  return simulateDailyAutomationDay(userId, { force: true });
}

module.exports = {
  DEFAULT_TZ,
  buildScheduledRhythmMessage,
  sendMorningActivation,
  sendMiddayStabilization,
  sendEveningReset,
  simulateDailyRhythmDay
};
