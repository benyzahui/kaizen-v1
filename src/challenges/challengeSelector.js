/**
 * Mini challenge + awareness selector — low frequency, energy-adapted, anti-repeat.
 */

const { lines } = require("../personality/kaizenVoice");
const { MINI_CHALLENGES } = require("./miniChallenges");
const { AWARENESS_PROMPTS } = require("./awarenessPrompts");
const { resolveRhythmContext } = require("../rhythm/rhythmPicker");
const { resolveAtmosphereState } = require("../atmosphere/atmosphereEngine");
const { resolveTimeAwareTone } = require("../atmosphere/timeAwareTone");
const { updateSession, getSession } = require("../session/sessionStore");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|10x|unlock your|hajrá|sigma|limitless|guru|hero'?s journey)\b/i;

const CHALLENGE_COOLDOWN_MS = 8 * 60 * 60 * 1000;
const AWARENESS_COOLDOWN_MS = 4 * 60 * 60 * 1000;
const MAX_CHALLENGES_PER_DAY = 2;

/**
 * @param {object} session
 * @param {'challenge'|'awareness'} kind
 */
function isOnCooldown(session, kind) {
  const now = Date.now();
  if (kind === "challenge") {
    const last = session?.lastMiniChallengeAt || 0;
    if (now - last < CHALLENGE_COOLDOWN_MS) return true;
    const dk = new Date().toISOString().slice(0, 10);
    const count = session?.miniChallengesToday?.date === dk ? session.miniChallengesToday.count : 0;
    return count >= MAX_CHALLENGES_PER_DAY;
  }
  const lastA = session?.lastAwarenessPromptAt || 0;
  return now - lastA < AWARENESS_COOLDOWN_MS;
}

/**
 * @param {object} entry
 * @param {object} ctx
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function challengeMatches(entry, ctx, slot) {
  const phase = slot === "late_night" ? "evening" : slot;
  if (!entry.phases.includes(phase)) return false;

  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    if (entry.intensity === "medium" || entry.intensity === "high") return false;
  }

  if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    if (entry.category === "discipline" && entry.intensity !== "low") return false;
    if (entry.category === "nervous_system" || entry.category === "recovery") return true;
  }

  if (entry.modes?.length && ctx.activeMode && !entry.modes.includes(ctx.activeMode)) {
    if (entry.category !== "trading_discipline") return false;
  }

  if (entry.energy.includes(ctx.energyState)) return true;
  return entry.intensity === "low";
}

/**
 * @param {object} prompt
 * @param {object} ctx
 * @param {string} contextKey
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function awarenessMatches(prompt, ctx, contextKey, slot) {
  const phase = slot === "late_night" ? "evening" : slot;
  if (!prompt.phases.includes(phase)) return false;

  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    if (prompt.category === "control" && contextKey !== "overloaded") return false;
  }

  if (contextKey === "trading" || ctx.activeMode === "trading") {
    if (prompt.category === "trading") return true;
    if (prompt.modes?.includes("trading")) return true;
  }

  if (contextKey === "overloaded") {
    if (prompt.contexts.includes("overloaded") || prompt.category === "nervous_system") {
      return true;
    }
  }

  if (contextKey === "drifting" && prompt.contexts.includes("drifting")) return true;

  if (prompt.contexts.includes("default") && prompt.energy.includes(ctx.energyState)) {
    return true;
  }

  return false;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function challengesForLang(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return MINI_CHALLENGES.filter((c) => c.language === locked && !HYPE_RE.test(c.text));
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function promptsForLang(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return AWARENESS_PROMPTS.filter((p) => p.language === locked && !HYPE_RE.test(p.text));
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {Date} [now]
 */
function selectMiniChallenge(slot, lang, session, userId, dateKey, now = new Date()) {
  if (isOnCooldown(session, "challenge")) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const rhythm = resolveRhythmContext(session, locked);
  const ctx = {
    ...rhythm,
    atmosphere: resolveAtmosphereState(session, now)
  };

  const used = new Set(session?.recentChallengeIds || []);
  let pool = challengesForLang(locked).filter((c) => challengeMatches(c, ctx, slot));
  const pathCats = rhythm.pathChallengeCategories || [];
  if (pathCats.length) {
    const boosted = pool.filter((c) => pathCats.includes(c.category));
    if (boosted.length) pool = boosted;
  }
  if (!pool.length) pool = challengesForLang(locked).filter((c) => c.intensity === "low");

  let candidates = pool.filter((c) => !used.has(c.id));
  if (!candidates.length) candidates = pool;
  if (!candidates.length) return null;

  const seed = `${userId}|ch|${dateKey}|${slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return candidates[h % candidates.length];
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {string} [contextKey] default | overloaded | drifting | trading
 * @param {Date} [now]
 */
function selectAwarenessPrompt(
  slot,
  lang,
  session,
  userId,
  dateKey,
  contextKey = "default",
  now = new Date()
) {
  if (isOnCooldown(session, "awareness")) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const rhythm = resolveRhythmContext(session, locked);
  const ctx = {
    ...rhythm,
    atmosphere: resolveAtmosphereState(session, now)
  };

  const used = new Set(session?.recentAwarenessIds || []);
  let pool = promptsForLang(locked).filter((p) => awarenessMatches(p, ctx, contextKey, slot));
  if (contextKey === "trading") {
    const tradeOnly = pool.filter((p) => p.category === "trading");
    if (tradeOnly.length) pool = tradeOnly;
  }
  if (!pool.length) {
    pool = promptsForLang(locked).filter((p) => p.contexts.includes("default"));
  }

  let candidates = pool.filter((p) => !used.has(p.id));
  if (!candidates.length) candidates = pool;
  if (!candidates.length) return null;

  const seed = `${userId}|aw|${dateKey}|${slot}|${contextKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return candidates[h % candidates.length];
}

/**
 * @param {object} challenge
 * @param {string|number} userId
 */
function recordChallengeUse(challenge, userId) {
  if (!challenge?.id) return;
  const session = getSession(userId);
  const dk = new Date().toISOString().slice(0, 10);
  const prev = session?.miniChallengesToday;
  const count = prev?.date === dk ? prev.count + 1 : 1;
  const recent = [...(session?.recentChallengeIds || [])];
  if (!recent.includes(challenge.id)) recent.push(challenge.id);

  updateSession(userId, {
    lastMiniChallengeAt: Date.now(),
    miniChallengesToday: { date: dk, count },
    recentChallengeIds: recent.slice(-20)
  });
}

/**
 * @param {object} prompt
 * @param {string|number} userId
 */
function recordAwarenessUse(prompt, userId) {
  if (!prompt?.id) return;
  const recent = [...(getSession(userId)?.recentAwarenessIds || [])];
  if (!prompt.id || recent.includes(prompt.id)) {
    updateSession(userId, { lastAwarenessPromptAt: Date.now() });
    return;
  }
  recent.push(prompt.id);
  updateSession(userId, {
    lastAwarenessPromptAt: Date.now(),
    recentAwarenessIds: recent.slice(-24)
  });
}

/**
 * Low-frequency optional block for daily phase or open chat.
 * @param {object} opts
 */
function maybeLightActivation(opts) {
  const {
    slot,
    lang,
    session,
    userId,
    dateKey,
    contextKey = "default",
    challengeChance = 0.12,
    awarenessChance = 0.18,
    now = new Date()
  } = opts;

  const seed = `${userId}|act|${dateKey}|${slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const roll = h % 100;

  const parts = [];

  if (roll < Math.floor(challengeChance * 100)) {
    const ch = selectMiniChallenge(slot, lang, session, userId, dateKey, now);
    if (ch) {
      recordChallengeUse(ch, userId);
      parts.push(ch.text);
    }
  } else if (roll < Math.floor((challengeChance + awarenessChance) * 100)) {
    const aw = selectAwarenessPrompt(slot, lang, session, userId, dateKey, contextKey, now);
    if (aw) {
      recordAwarenessUse(aw, userId);
      parts.push(aw.text);
    }
  }

  if (!parts.length) return "";
  return lines(parts.join("\n")).trim();
}

/**
 * Context key from session + optional open text.
 * @param {object} session
 * @param {string} [text]
 */
function resolveAwarenessContext(session, text = "") {
  if (session?.activeMode === "trading") return "trading";
  if (session?.nervousSystemState === "overloaded" || session?.nervousSystemState === "anxious") {
    return "overloaded";
  }
  if (session?.disciplineState === "drifting" || session?.disciplineState === "inconsistent") {
    return "drifting";
  }
  if (/(trade|trading|pozíció|setup|FOMO|impulse)/i.test(text)) return "trading";
  if (/(szétesek|overwhelm|panik|stress)/i.test(text)) return "overloaded";
  return "default";
}

module.exports = {
  HYPE_RE,
  CHALLENGE_COOLDOWN_MS,
  AWARENESS_COOLDOWN_MS,
  MAX_CHALLENGES_PER_DAY,
  selectMiniChallenge,
  selectAwarenessPrompt,
  recordChallengeUse,
  recordAwarenessUse,
  maybeLightActivation,
  resolveAwarenessContext,
  challengeMatches,
  awarenessMatches,
  isOnCooldown
};
