/**
 * Daily connection rhythm — touchpoints, light check-ins, identity, soft return.
 * Low frequency, anti-repeat, no guilt or marketing tone.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { resolveRhythmContext } = require("../rhythm/rhythmPicker");
const { updateSession } = require("../session/sessionStore");
const { daysSinceLastAny, getStreaks } = require("../consistency/streakModel");
const { RETENTION_TOUCHPOINTS } = require("./touchpointPools");
const { LIGHT_CHECK_INS } = require("./lightCheckIns");
const { PROGRAM_IDENTITY_LINES } = require("./programIdentity");
const { RETURN_NUDGES } = require("./returnNudges");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|10x|unlock your|hajrá|sigma|limitless|motivációs guru|don't miss out|limited time)\b/i;

const GUILT_RE =
  /\b(you failed|you should have|why did you stop|disappointed|shame on|kellett volna|csalód|rusine|you're behind)\b/i;

const MARKETING_RE =
  /\b(subscribe now|buy now|premium offer|unlock pro|free trial|click here)\b/i;

const INACTIVE_MS = 48 * 60 * 60 * 1000;
const RETURN_NUDGE_COOLDOWN_MS = 5 * 24 * 60 * 60 * 1000;
const LIGHT_CHECKIN_COOLDOWN_MS = 6 * 60 * 60 * 1000;

/**
 * @param {string} text
 */
function isPremiumRetentionTone(text) {
  if (!text || text.length < 4) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 */
function msSinceLastInteraction(session) {
  const last = session?.lastAt || 0;
  if (!last) return Infinity;
  return Date.now() - last;
}

/**
 * @param {object} session
 */
function isInactiveUser(session) {
  if (msSinceLastInteraction(session) >= INACTIVE_MS) return true;
  const streaks = getStreaks(session);
  return daysSinceLastAny(streaks) >= 2;
}

/**
 * @param {object} touch
 * @param {object} ctx
 * @param {string} phase
 */
function touchMatches(touch, ctx, phase) {
  const slot = phase === "late_night" ? "evening" : phase;
  if (!touch.phases.includes(slot) && !touch.phases.includes(phase)) return false;

  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    if (touch.kind === "focus_block" || touch.kind === "loops") return false;
  }
  if (slot === "evening" || slot === "late_night") {
    if (touch.kind === "focus_block" || touch.kind === "loops") return false;
  }
  if (touch.energy?.length && !touch.energy.includes(ctx.energyState)) {
    if (touch.kind !== "stable_step" && touch.kind !== "breath") return false;
  }
  return true;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {number} [chance] 0–1
 * @param {Date} [now]
 * @returns {string|null}
 */
function maybeMicroTouchpoint(lang, session, userId, dateKey, slot, chance = 0.2, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const seed = `${userId}|retTouch|${dateKey}|${slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 10 > Math.floor(chance * 10)) return null;

  const ctx = resolveRhythmContext(session, locked);
  const phase = slot === "late_night" ? "evening" : slot;
  const used = new Set(session?.recentTouchIds || []);

  let pool = RETENTION_TOUCHPOINTS.filter(
    (t) =>
      t.language === locked &&
      !used.has(t.id) &&
      touchMatches(t, ctx, phase) &&
      isPremiumRetentionTone(t.text)
  );
  if (!pool.length) {
    pool = RETENTION_TOUCHPOINTS.filter(
      (t) => t.language === locked && touchMatches(t, ctx, phase) && isPremiumRetentionTone(t.text)
    );
  }
  if (!pool.length) return null;

  const pick = pool[h % pool.length];
  const recent = [...used, pick.id];
  updateSession(userId, { recentTouchIds: recent.slice(-24) });
  return pick.text;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} contextKey daily | midday | evening | open | overloaded
 * @param {'morning'|'midday'|'evening'|'late_night'} [slot]
 */
function pickLightCheckIn(lang, session, userId, contextKey, slot = "midday") {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = slot === "late_night" ? "evening" : slot;
  const used = new Set(session?.recentLightCheckInIds || []);

  let pool = LIGHT_CHECK_INS.filter(
    (c) =>
      c.language === locked &&
      c.contexts.includes(contextKey) &&
      c.phases.includes(phase) &&
      !used.has(c.id) &&
      isPremiumRetentionTone(c.text)
  );
  if (!pool.length) {
    pool = LIGHT_CHECK_INS.filter(
      (c) =>
        c.language === locked &&
        c.contexts.includes(contextKey) &&
        c.phases.includes(phase) &&
        isPremiumRetentionTone(c.text)
    );
  }
  if (!pool.length) return null;

  const text = pickSeeded(
    pool.map((p) => p.text),
    `${userId}|lci|${contextKey}|${phase}|${Date.now()}`
  );
  const entry = pool.find((p) => p.text === text) || pool[0];
  const recent = [...used, entry.id];
  updateSession(userId, { recentLightCheckInIds: recent.slice(-16) });
  return text;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'} phase
 * @param {number} [chance]
 */
function maybeLightCheckInLine(lang, session, userId, dateKey, phase, chance = 0.1) {
  const now = Date.now();
  if (now - (session?.lastLightCheckInAt || 0) < LIGHT_CHECKIN_COOLDOWN_MS) return null;

  const seed = `${userId}|lciChance|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 10 > Math.floor(chance * 10)) return null;

  const ctxKey =
    session?.nervousSystemState === "overloaded" ? "overloaded" : "daily";
  const line = pickLightCheckIn(lang, session, userId, ctxKey, phase);
  if (line) updateSession(userId, { lastLightCheckInAt: now });
  return line;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {number} [chance]
 */
function maybeIdentityWhisper(lang, session, userId, dateKey, slot, chance = 0.07) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const seed = `${userId}|pid|${dateKey}|${slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 12 > Math.floor(chance * 12)) return null;

  const phase = slot === "late_night" ? "evening" : slot;
  const used = new Set(session?.recentIdentityWhisperIds || []);
  let pool = PROGRAM_IDENTITY_LINES.filter(
    (l) =>
      l.language === locked &&
      l.phases.includes(phase) &&
      !used.has(l.id) &&
      isPremiumRetentionTone(l.text)
  );
  if (!pool.length) {
    pool = PROGRAM_IDENTITY_LINES.filter(
      (l) => l.language === locked && l.phases.includes(phase) && isPremiumRetentionTone(l.text)
    );
  }
  if (!pool.length) return null;

  const line = pool[h % pool.length];
  const recent = [...used, line.id];
  updateSession(userId, { recentIdentityWhisperIds: recent.slice(-12) });
  return line.text;
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} text
 * @returns {null | { body: string, category: string }}
 */
function tryRetentionReturn(session, lang, userId, text) {
  if (!session?.onboardingCompleted) return null;
  if (/^\s*\//.test(text)) return null;
  if (!isInactiveUser(session)) return null;

  const now = Date.now();
  if (now - (session.lastReturnNudgeAt || 0) < RETURN_NUDGE_COOLDOWN_MS) return null;

  const t = String(text || "").trim();
  if (t.length > 80) return null;
  if (
    /(kimerült|félek|nehéz|panic|overwhelm|remeg|suicid|kill myself|want to die)/i.test(t)
  ) {
    return null;
  }

  const greeting = /^(szia|hello|hey|hi|bună|salut|gm|jó reggelt|na\.?|ok\.?|back|vissza)$/i.test(
    t
  );
  const shortPing = t.length < 40;
  if (!greeting && !shortPing) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pool = RETURN_NUDGES.filter(
    (n) => n.language === locked && isPremiumRetentionTone(n.text)
  );
  if (!pool.length) return null;

  const body = pickSeeded(
    pool.map((n) => n.text),
    `${userId}|return|${now}`
  );
  updateSession(userId, { lastReturnNudgeAt: now });

  return { body, category: "retention_return" };
}

/**
 * Build optional daily connection extras (touch + check-in + identity).
 */
function buildDailyConnectionExtras(phase, lang, session, userId, dateKey, now = new Date()) {
  const slot = phase === "morning" ? "morning" : phase === "midday" ? "midday" : "evening";
  const parts = [];

  const touch = maybeMicroTouchpoint(lang, session, userId, dateKey, slot, 0.18, now);
  if (touch) parts.push(touch);

  const checkIn = maybeLightCheckInLine(lang, session, userId, dateKey, phase, 0.1);
  if (checkIn) parts.push(checkIn);

  const whisper = maybeIdentityWhisper(lang, session, userId, dateKey, slot, 0.06);
  if (whisper) parts.push(whisper);

  return parts.filter(Boolean);
}

/**
 * Pool size stats for tests.
 */
function retentionPoolStats() {
  return {
    touchpoints: RETENTION_TOUCHPOINTS.length,
    lightCheckIns: LIGHT_CHECK_INS.length,
    identityLines: PROGRAM_IDENTITY_LINES.length,
    returnNudges: RETURN_NUDGES.length
  };
}

module.exports = {
  HYPE_RE,
  GUILT_RE,
  MARKETING_RE,
  INACTIVE_MS,
  isPremiumRetentionTone,
  isInactiveUser,
  msSinceLastInteraction,
  maybeMicroTouchpoint,
  pickLightCheckIn,
  maybeLightCheckInLine,
  maybeIdentityWhisper,
  tryRetentionReturn,
  buildDailyConnectionExtras,
  retentionPoolStats
};
