/**
 * Dragon Blueprint daily automation — execution layer orchestrator.
 */

const { finalizeOutboundReply } = require("../i18n/hardLanguageLock");
const { requireLockedLanguage } = require("../i18n/hardLanguageLock");
const { isProgramActive } = require("../program/dailyProgramEngine");
const { getSession, updateSession } = require("../session/sessionStore");
const { buildMorningActivation } = require("./morningActivation");
const { buildMiddayStabilization } = require("./middayStabilization");
const { buildEveningReset } = require("./eveningReset");
const { maybePromoteDragon } = require("./dragonProgression");

/**
 * Broader eligibility for daily automation pushes.
 * @param {object} session
 * @param {object} [opts]
 */
function shouldSendDailyAutomation(session, opts = {}) {
  if (opts.force) return true;
  if (process.env.KAIZEN_SCHEDULER_ENABLED !== "true") return false;
  if (!session?.notificationOptIn) return false;
  if (session.programPaused) return false;
  if (!session?.onboardingCompleted && !session?.preferredLanguage) return false;
  const lang = session.preferredLanguage || session.lang;
  return lang === "hu" || lang === "ro" || lang === "en";
}

/**
 * @param {object} session
 * @param {string|number} userId
 */
function ensureProgramForAutomation(session, userId) {
  if (!isProgramActive(session)) {
    updateSession(userId, {
      programMode: "active",
      dailyPhase: session.dailyPhase || "morning",
      programPaused: false
    });
  }
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {object} session
 * @param {string|number} userId
 * @param {string} [dateKey]
 * @param {Date} [now]
 * @param {object} [opts]
 */
function buildDailyAutomationMessage(phase, session, userId, dateKey, now = new Date(), opts = {}) {
  const req = requireLockedLanguage(session);
  if (!req.ok || !req.lang) return null;

  const dk = dateKey || now.toISOString().slice(0, 10);
  const lang = req.lang;
  let body = null;

  if (phase === "morning") {
    body = buildMorningActivation(lang, session, userId, dk, now);
  } else if (phase === "midday") {
    body = buildMiddayStabilization(lang, session, userId, dk, {
      armPending: opts.armMiddayEnergy !== false
    });
  } else {
    body = buildEveningReset(lang, session, userId, dk);
  }

  if (!body) return null;

  return finalizeOutboundReply(body, lang, session, userId, {
    dateKey: dk,
    phase,
    openingId: `auto_${phase}_${dk}`,
    automation: true,
    dailyPresenceV2: false,
    quietPresence: false,
    programWhisper: false,
    hopePresence: false,
    communityPresence: false,
    rebuilding: false,
    lifeBalance: false,
    lightPresence: false,
    rhythmIntelligence: false,
    formatOpts: { maxLines: 14, maxChars: 520 }
  });
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {string|number} userId
 * @param {object} [opts]
 */
function sendDailyAutomation(phase, userId, opts = {}) {
  let session = opts.sessionOverride
    ? { ...getSession(userId), ...opts.sessionOverride }
    : opts.session || getSession(userId);

  if (!session) {
    return { sent: false, preview: null, lang: null, error: "no_session" };
  }

  if (!opts.force && !shouldSendDailyAutomation(session, opts)) {
    return { sent: false, preview: null, lang: null, error: "automation_not_eligible" };
  }

  if (phase === "morning") {
    ensureProgramForAutomation(session, userId);
    session = getSession(userId);
  }

  const lang = session.preferredLanguage || session.lang;
  const text = buildDailyAutomationMessage(phase, session, userId, opts.dateKey, opts.now, opts);
  if (!text) {
    return { sent: false, preview: null, lang, error: "build_failed" };
  }

  const stampKey =
    phase === "morning"
      ? "lastScheduledMorning"
      : phase === "midday"
        ? "lastScheduledMidday"
        : "lastScheduledEvening";
  updateSession(userId, { [stampKey]: Date.now() });
  maybePromoteDragon(userId, session);

  if (opts.sendFn) opts.sendFn(userId, text);

  return { sent: Boolean(opts.sendFn), preview: text, lang };
}

/**
 * @param {string|number} userId
 * @param {object} [opts]
 */
function simulateDailyAutomationDay(userId, opts = {}) {
  const dk = new Date().toISOString().slice(0, 10);
  return {
    morning: sendDailyAutomation("morning", userId, { ...opts, dateKey: dk }),
    midday: sendDailyAutomation("midday", userId, { ...opts, dateKey: dk }),
    evening: sendDailyAutomation("evening", userId, { ...opts, dateKey: dk })
  };
}

module.exports = {
  shouldSendDailyAutomation,
  ensureProgramForAutomation,
  buildDailyAutomationMessage,
  sendDailyAutomation,
  simulateDailyAutomationDay
};
