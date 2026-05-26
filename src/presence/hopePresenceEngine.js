/**
 * Hope + presence reinforcement — rare, grounded, no dependency design.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { resolveBehaviorSignals } = require("../rhythm/behaviorSignals");
const { isInactiveUser } = require("../retention/retentionRhythmEngine");
const { HYPE_RE, GUILT_RE, MARKETING_RE } = require("../retention/retentionRhythmEngine");
const { getTimeSlot } = require("../core/timeContext");
const { SUPPORT_PRESENCE_POOL } = require("./supportPresencePool");
const { HOPE_LINES } = require("./hopeLines");
const { HARD_DAY_RESPONSES } = require("./hardDayResponses");
const { BELONGING_MESSAGES } = require("./belongingMessages");

const POSSESSIVE_RE =
  /\b(you need me|nélkülem|without me you|don't leave|ne hagyj|nu pleca|can't live without|legjobb barátod|best friend forever|soulmate|sótárs)\b/i;

const DEPENDENCY_RE =
  /\b(írj mindig|write me every|nu pleca niciodată|always message me|soha ne menj|i'll be lonely without|egyedül maradok ha)\b/i;

const FAKE_DEEP_RE =
  /\b(i understand how you feel|that must be so hard|validating your|mesélj mindenről|tell me everything|deep inside you|univerzum|manifest your)\b/i;

const CRINGE_RE =
  /\b(universe|manifest|twin flame|cosmic|guru|horoscope|motivációs guru|sigma|limitless|10x)\b/i;

const PRODUCTIVE_EVENING_RE =
  /\b(crush it|hustle|beast mode|teljesítmény|productivity sprint|grind|no excuses)\b/i;

/**
 * @param {string} text
 */
function isPremiumHopePresence(text) {
  if (!text || text.length < 3) return false;
  if (text.length > 220) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  if (POSSESSIVE_RE.test(text) || DEPENDENCY_RE.test(text) || FAKE_DEEP_RE.test(text)) return false;
  if (CRINGE_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 * @param {Date} [now]
 * @param {'morning'|'midday'|'evening'|'late_night'} [phase]
 */
function resolveHopeContext(session, now = new Date(), phase) {
  const slot = phase || getTimeSlot(session, now);
  const signals = resolveBehaviorSignals(session, "", now);
  const energy = session?.energyState || "stable";
  const discipline = session?.disciplineState || "focused";
  const nervous = session?.nervousSystemState || "calm";

  const inactive = isInactiveUser(session) || signals.inactive;
  const missedStreak = inactive || (session?.dailyStreak === 0 && (session?.messages || []).length > 0);
  const comeback = inactive || missedStreak;

  const eveningLow =
    (slot === "evening" || slot === "late_night") &&
    (energy === "exhausted" || energy === "low");
  const overload =
    nervous === "overloaded" || nervous === "anxious" || signals.overloaded;
  const collapse = discipline === "drifting" || discipline === "inconsistent";
  const fatigue = energy === "exhausted" || energy === "low";
  const stress = signals.stressLoop || overload;
  const recovery =
    session?.activeMode === "recovery" ||
    nervous === "grounded" ||
    slot === "evening";

  const hardDay = eveningLow || overload || collapse || fatigue || stress;
  const lonelyEvening =
    (slot === "evening" || slot === "late_night") &&
    (overload || eveningLow || signals.lateNightSpiral);

  const scenes = [];
  if (hardDay) scenes.push("hard_day");
  if (overload) scenes.push("overload");
  if (collapse) scenes.push("collapse");
  if (fatigue) scenes.push("fatigue");
  if (stress) scenes.push("stress");
  if (eveningLow || slot === "evening") scenes.push("evening");
  if (lonelyEvening) scenes.push("lonely_evening");
  if (comeback) scenes.push("comeback");
  if (missedStreak) scenes.push("missed_streak");
  if (recovery) scenes.push("recovery");

  let hardDayTrigger = "hard_day";
  if (lonelyEvening) hardDayTrigger = "lonely_evening";
  else if (overload) hardDayTrigger = "overload";
  else if (collapse) hardDayTrigger = "collapse";
  else if (fatigue) hardDayTrigger = "fatigue";
  else if (stress) hardDayTrigger = "stress";

  return {
    slot,
    signals,
    scenes,
    hardDay,
    lonelyEvening,
    comeback,
    recovery,
    hardDayTrigger,
    eveningLow
  };
}

/**
 * @param {Array<{ id: string, language: string, text: string, scenes?: string[] }>} pool
 * @param {'en'|'hu'|'ro'} lang
 * @param {string[]} scenes
 * @param {Set<string>} used
 */
function filterHopePool(pool, lang, scenes, used) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return pool.filter((e) => {
    if (e.language !== locked) return false;
    if (used.has(e.id)) return false;
    if (!isPremiumHopePresence(e.text)) return false;
    if (!e.scenes?.length) return true;
    return e.scenes.some((s) => scenes.includes(s));
  });
}

/**
 * @param {object} session
 * @param {string} id
 * @param {string|number} userId
 */
function recordHopeUse(session, id, userId) {
  const used = new Set(session?.recentHopePresenceIds || []);
  const recent = [...used, id].slice(-22);
  updateSession(userId, { recentHopePresenceIds: recent });
}

/**
 * @param {Array} pool
 * @param {object} session
 * @param {string|number} userId
 * @param {string} seed
 */
function pickHopeEntry(pool, session, userId, seed) {
  if (!pool.length) return null;
  const used = new Set(session?.recentHopePresenceIds || []);
  let candidates = pool.filter((e) => !used.has(e.id));
  if (!candidates.length) candidates = pool;
  const entry = pickSeeded(candidates, seed);
  if (!entry) return null;
  recordHopeUse(session, entry.id, userId);
  return entry.text;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx from resolveHopeContext
 * @param {number} [baseChance]
 */
function maybePresenceOrSupport(lang, session, userId, dateKey, ctx, baseChance = 0.05) {
  let chance = baseChance;
  if (ctx.comeback) chance += 0.04;
  if (ctx.hardDay) chance += 0.02;

  const seed = `${userId}|psp|${dateKey}|${ctx.slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return null;

  const used = new Set(session?.recentHopePresenceIds || []);
  let pool = filterHopePool(SUPPORT_PRESENCE_POOL, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = SUPPORT_PRESENCE_POOL.filter(
      (e) =>
        e.language === (lang === "hu" || lang === "ro" ? lang : "en") &&
        !used.has(e.id) &&
        isPremiumHopePresence(e.text)
    );
  }
  return pickHopeEntry(pool, session, userId, `${seed}|pick`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 * @param {number} [baseChance]
 */
function maybeQuietHope(lang, session, userId, dateKey, ctx, baseChance = 0.045) {
  if (!ctx.hardDay && !ctx.recovery && !ctx.comeback) {
    baseChance *= 0.6;
  }

  const seed = `${userId}|hope|${dateKey}|${ctx.slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 16 >= Math.floor(baseChance * 16)) return null;

  const used = new Set(session?.recentHopePresenceIds || []);
  let pool = filterHopePool(HOPE_LINES, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = HOPE_LINES.filter(
      (e) =>
        e.language === (lang === "hu" || lang === "ro" ? lang : "en") &&
        !used.has(e.id) &&
        isPremiumHopePresence(e.text)
    );
  }
  return pickHopeEntry(pool, session, userId, `${seed}|hope`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 * @param {number} [baseChance]
 */
function maybeHardDayResponse(lang, session, userId, dateKey, ctx, baseChance = 0.08) {
  if (!ctx.hardDay && !ctx.lonelyEvening) return null;

  let chance = baseChance;
  if (ctx.lonelyEvening) chance += 0.05;
  if (ctx.signals?.lateNightSpiral) chance += 0.03;

  const seed = `${userId}|hard|${dateKey}|${ctx.hardDayTrigger}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 10 >= Math.floor(chance * 10)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const used = new Set(session?.recentHopePresenceIds || []);
  let pool = HARD_DAY_RESPONSES.filter(
    (e) =>
      e.language === locked &&
      !used.has(e.id) &&
      (e.trigger === ctx.hardDayTrigger || e.trigger === "hard_day") &&
      isPremiumHopePresence(e.text)
  );
  if (!pool.length) {
    pool = HARD_DAY_RESPONSES.filter(
      (e) => e.language === locked && !used.has(e.id) && isPremiumHopePresence(e.text)
    );
  }
  if (!pool.length) return null;

  const entry = pickSeeded(pool, `${seed}|hd`);
  if (!entry) return null;
  if (ctx.eveningLow && PRODUCTIVE_EVENING_RE.test(entry.text)) return null;
  recordHopeUse(session, entry.id, userId);
  return entry.text;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {'morning'|'midday'|'evening'} phase
 * @param {number} [baseChance]
 */
function maybeBelongingWhisper(lang, session, userId, dateKey, phase, baseChance = 0.04) {
  const seed = `${userId}|bel|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 18 >= Math.floor(baseChance * 18)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const used = new Set(session?.recentHopePresenceIds || []);
  const slot = phase === "late_night" ? "evening" : phase;
  let pool = BELONGING_MESSAGES.filter(
    (e) =>
      e.language === locked &&
      !used.has(e.id) &&
      (!e.phases?.length || e.phases.includes(slot)) &&
      isPremiumHopePresence(e.text)
  );
  if (!pool.length) {
    pool = BELONGING_MESSAGES.filter(
      (e) => e.language === locked && isPremiumHopePresence(e.text)
    );
  }
  return pickHopeEntry(pool, session, userId, `${seed}|bel`);
}

/**
 * Pick at most one reinforcement line for daily rhythm blocks.
 */
function pickHopePresenceBundle(lang, session, userId, dateKey, phase, now = new Date()) {
  if (!session?.onboardingCompleted) return null;

  const ctx = resolveHopeContext(session, now, phase);
  const parts = [];

  const hard = maybeHardDayResponse(lang, session, userId, dateKey, ctx, ctx.hardDay ? 0.14 : 0.06);
  if (hard) parts.push(hard);

  if (parts.length === 0) {
    const support = maybePresenceOrSupport(
      lang,
      session,
      userId,
      dateKey,
      ctx,
      ctx.comeback ? 0.09 : 0.05
    );
    if (support) parts.push(support);
  }

  if (parts.length === 0 && (ctx.hardDay || ctx.recovery || ctx.comeback)) {
    const hope = maybeQuietHope(lang, session, userId, dateKey, ctx, 0.07);
    if (hope) parts.push(hope);
  }

  if (parts.length === 0) {
    const belSeed = `${userId}|belB|${dateKey}|${phase}`;
    let bh = 0;
    for (let i = 0; i < belSeed.length; i++) bh = (bh * 31 + belSeed.charCodeAt(i)) >>> 0;
    if (bh % 28 === 0) {
      const bel = maybeBelongingWhisper(lang, session, userId, dateKey, phase, 0.12);
      if (bel) parts.push(bel);
    }
  }

  return parts.length ? parts[0] : null;
}

/**
 * Append rare hope/presence to finalized outbound (max one block).
 */
function applyHopePresenceFinalize(body, lang, session, userId, meta = {}) {
  if (!session?.onboardingCompleted || meta.hopePresence === false) return body;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const dateKey = meta.dateKey || new Date().toISOString().slice(0, 10);
  const phase = meta.phase || getTimeSlot(session, meta.now || new Date());
  const now = meta.now || new Date();

  const ctx = resolveHopeContext(session, now, phase);
  let chance = meta.hopeChance ?? 0.055;
  if (ctx.hardDay) chance += 0.04;
  if (ctx.comeback) chance += 0.03;
  if (phase === "evening" || phase === "late_night") chance += 0.02;

  const seed = `${userId}|hpf|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 12 >= Math.floor(chance * 12)) return body;

  let line = null;
  if (ctx.hardDay || ctx.lonelyEvening) {
    line = maybeHardDayResponse(lang, session, userId, dateKey, ctx, 0.12);
  }
  if (!line) line = maybePresenceOrSupport(lang, session, userId, dateKey, ctx, 0.06);
  if (!line && (ctx.hardDay || ctx.recovery)) {
    line = maybeQuietHope(lang, session, userId, dateKey, ctx, 0.05);
  }
  if (!line && h % 5 === 0) {
    line = maybeBelongingWhisper(lang, session, userId, dateKey, phase, 0.08);
  }

  if (!line || body.includes(line.slice(0, 14))) return body;

  const lineCount = body.split(/\n/).filter(Boolean).length;
  if (lineCount >= (meta.maxLinesBeforeHope ?? 14)) return body;

  return [body, "", line].filter(Boolean).join("\n").trim();
}

function hopePresencePoolStats() {
  return {
    supportPresence: SUPPORT_PRESENCE_POOL.length,
    hopeLines: HOPE_LINES.length,
    hardDay: HARD_DAY_RESPONSES.length,
    belonging: BELONGING_MESSAGES.length
  };
}

module.exports = {
  POSSESSIVE_RE,
  DEPENDENCY_RE,
  FAKE_DEEP_RE,
  CRINGE_RE,
  isPremiumHopePresence,
  resolveHopeContext,
  maybePresenceOrSupport,
  maybeQuietHope,
  maybeHardDayResponse,
  maybeBelongingWhisper,
  pickHopePresenceBundle,
  applyHopePresenceFinalize,
  hopePresencePoolStats
};
