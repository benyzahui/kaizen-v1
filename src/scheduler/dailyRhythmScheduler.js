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
const { buildDailyPhasePresence } = require("../program/dailyProgramPresence");
const { finalizeOutboundReply } = require("../i18n/hardLanguageLock");
const { requireLockedLanguage } = require("../i18n/hardLanguageLock");
const { shouldSendScheduledPush } = require("../program/dailyProgramEngine");

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
 */
/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {object} session
 * @param {string|number} userId
 * @param {string} [dateKey]
 * @param {Date} [now]
 */
function buildScheduledRhythmMessage(phase, session, userId, dateKey, now = new Date()) {
  const lang = resolveSchedulerLang(session);
  if (!lang) return null;

  const dk = dateKey || new Date().toISOString().slice(0, 10);
  const body = buildDailyPhasePresence(phase, lang, session, userId, dk, now);
  if (!body) return null;

  return finalizeOutboundReply(body, lang, session, userId, {
    openingId: `sched_${phase}_${dk}`
  });
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 * @returns {{ sent: boolean, preview: string|null, lang: string|null }}
 */
function sendMorningActivation(userId, opts = {}) {
  const session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : getSession(userId);
  if (!opts.force && !shouldSendScheduledPush(session)) {
    return { sent: false, preview: null, lang: null, error: "scheduler_not_eligible" };
  }
  const lang = resolveSchedulerLang(session);
  if (!lang) {
    return { sent: false, preview: null, lang: null, error: "language_not_set" };
  }
  const text = buildScheduledRhythmMessage("morning", session, userId, opts.dateKey);
  if (!text) return { sent: false, preview: null, lang, error: "build_failed" };
  updateSession(userId, { lastScheduledMorning: Date.now() });
  if (opts.sendFn) opts.sendFn(userId, text);
  return { sent: Boolean(opts.sendFn), preview: text, lang };
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 */
function sendMiddayStabilization(userId, opts = {}) {
  const session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : getSession(userId);
  if (!opts.force && !shouldSendScheduledPush(session)) {
    return { sent: false, preview: null, lang: null, error: "scheduler_not_eligible" };
  }
  const lang = resolveSchedulerLang(session);
  if (!lang) {
    return { sent: false, preview: null, lang: null, error: "language_not_set" };
  }
  const text = buildScheduledRhythmMessage("midday", session, userId, opts.dateKey);
  if (!text) return { sent: false, preview: null, lang, error: "build_failed" };
  updateSession(userId, { lastScheduledMidday: Date.now() });
  if (opts.sendFn) opts.sendFn(userId, text);
  return { sent: Boolean(opts.sendFn), preview: text, lang };
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 */
function sendEveningReset(userId, opts = {}) {
  const session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : getSession(userId);
  if (!opts.force && !shouldSendScheduledPush(session)) {
    return { sent: false, preview: null, lang: null, error: "scheduler_not_eligible" };
  }
  const lang = resolveSchedulerLang(session);
  if (!lang) {
    return { sent: false, preview: null, lang: null, error: "language_not_set" };
  }
  const text = buildScheduledRhythmMessage("evening", session, userId, opts.dateKey);
  if (!text) return { sent: false, preview: null, lang, error: "build_failed" };
  updateSession(userId, { lastScheduledEvening: Date.now() });
  if (opts.sendFn) opts.sendFn(userId, text);
  return { sent: Boolean(opts.sendFn), preview: text, lang };
}

/**
 * Run all three slots for one user (simulation / manual test).
 * @param {string|number} userId
 */
function simulateDailyRhythmDay(userId) {
  const dk = new Date().toISOString().slice(0, 10);
  return {
    morning: sendMorningActivation(userId, { dateKey: dk }),
    midday: sendMiddayStabilization(userId, { dateKey: dk }),
    evening: sendEveningReset(userId, { dateKey: dk })
  };
}

module.exports = {
  DEFAULT_TZ,
  buildScheduledRhythmMessage,
  sendMorningActivation,
  sendMiddayStabilization,
  sendEveningReset,
  simulateDailyRhythmDay
};
