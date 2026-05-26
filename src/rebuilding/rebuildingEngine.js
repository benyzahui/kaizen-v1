/**
 * Rebuilding engine — atmosphere, awareness, comeback, mini protocols, finalize.
 */

const { pickSeeded, lines } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { HYPE_RE, GUILT_RE, MARKETING_RE, isInactiveUser } = require("../retention/retentionRhythmEngine");
const {
  POSSESSIVE_RE,
  DEPENDENCY_RE,
  FAKE_DEEP_RE,
  CRINGE_RE
} = require("../presence/hopePresenceEngine");
const { VICTIM_RE, CULT_RE, FAKE_INSPIRATION_RE, MOTIVATION_SPAM_RE } = require("../community/originStoryAtmosphere");
const { MEDICAL_ADVICE_RE } = require("./physicalRecoveryAwareness");
const { REBUILDING_ATMOSPHERE } = require("./rebuildingAtmosphere");
const { PHYSICAL_RECOVERY_AWARENESS } = require("./physicalRecoveryAwareness");
const { COMEBACK_LINES } = require("./comebackLines");
const { MINI_RECOVERY_PROTOCOLS } = require("./miniRecoveryProtocols");
const { BELONGING_LINES } = require("../community/belongingLines");
const {
  resolveRebuildingContext,
  isRebuildingModeActive,
  syncRebuildingMode
} = require("./rebuildingMode");

const TOXIC_POSITIVITY_RE =
  /\b(everything happens for a reason|just stay positive|smile more|cheer up|csak pozitív|good vibes only)\b/i;

const AGGRESSIVE_MASC_RE =
  /\b(alpha male|dominate|no pain no gain|be a man|grind harder|sigma|beast mode|crush your)\b/i;

const HUMAN_CLAIM_RE =
  /\b(i went through the same|as your friend|valódi ember vagyok|I feel exactly like you)\b/i;

/**
 * @param {string} text
 */
function isPremiumRebuildingLine(text) {
  if (!text || text.length < 3 || text.length > 240) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  if (POSSESSIVE_RE.test(text) || DEPENDENCY_RE.test(text) || FAKE_DEEP_RE.test(text)) return false;
  if (CRINGE_RE.test(text) || VICTIM_RE.test(text) || CULT_RE.test(text)) return false;
  if (FAKE_INSPIRATION_RE.test(text) || MOTIVATION_SPAM_RE.test(text)) return false;
  if (TOXIC_POSITIVITY_RE.test(text) || AGGRESSIVE_MASC_RE.test(text)) return false;
  if (HUMAN_CLAIM_RE.test(text) || MEDICAL_ADVICE_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 * @param {string} id
 * @param {string|number} userId
 */
function recordRebuildingUse(session, id, userId) {
  const used = new Set(session?.recentRebuildingLineIds || []);
  updateSession(userId, { recentRebuildingLineIds: [...used, id].slice(-22) });
}

/**
 * @param {Array} pool
 * @param {'en'|'hu'|'ro'} lang
 * @param {string[]} scenes
 * @param {Set<string>} used
 */
function filterPool(pool, lang, scenes, used) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return pool.filter((e) => {
    if (e.language !== locked) return false;
    if (used.has(e.id)) return false;
    if (!isPremiumRebuildingLine(e.text)) return false;
    if (!e.scenes?.length) return true;
    return e.scenes.some((s) => scenes.includes(s));
  });
}

/**
 * @param {Array} pool
 * @param {object} session
 * @param {string|number} userId
 * @param {string} seed
 */
function pickLine(pool, session, userId, seed) {
  if (!pool.length) return null;
  const used = new Set(session?.recentRebuildingLineIds || []);
  let candidates = pool.filter((e) => !used.has(e.id));
  if (!candidates.length) candidates = pool;
  const entry = pickSeeded(candidates, seed);
  if (!entry) return null;
  recordRebuildingUse(session, entry.id, userId);
  return entry.text;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 * @param {number} [chance]
 */
function maybeRebuildingAtmosphere(lang, session, userId, dateKey, ctx, chance = 0.08) {
  const seed = `${userId}|rba|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 12 >= Math.floor(chance * 12)) return null;

  const used = new Set(session?.recentRebuildingLineIds || []);
  let pool = filterPool(REBUILDING_ATMOSPHERE, lang, ctx.scenes || [], used);
  if (!pool.length) {
    pool = REBUILDING_ATMOSPHERE.filter(
      (e) => e.language === (lang === "hu" || lang === "ro" ? lang : "en") && isPremiumRebuildingLine(e.text)
    );
  }
  return pickLine(pool, session, userId, `${seed}|atm`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {number} [chance]
 */
function maybePhysicalAwareness(lang, session, userId, dateKey, chance = 0.07) {
  const seed = `${userId}|pra|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const used = new Set(session?.recentRebuildingLineIds || []);
  let pool = PHYSICAL_RECOVERY_AWARENESS.filter(
    (e) => e.language === locked && !used.has(e.id) && isPremiumRebuildingLine(e.text)
  );
  if (!pool.length) {
    pool = PHYSICAL_RECOVERY_AWARENESS.filter(
      (e) => e.language === locked && isPremiumRebuildingLine(e.text)
    );
  }
  return pickLine(pool, session, userId, `${seed}|body`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {number} [chance]
 */
function maybeComebackLine(lang, session, userId, dateKey, chance = 0.85) {
  const seed = `${userId}|cb|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 10 >= Math.floor(chance * 10)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const used = new Set(session?.recentRebuildingLineIds || []);
  let pool = COMEBACK_LINES.filter(
    (e) => e.language === locked && !used.has(e.id) && isPremiumRebuildingLine(e.text)
  );
  if (!pool.length) {
    pool = COMEBACK_LINES.filter((e) => e.language === locked && isPremiumRebuildingLine(e.text));
  }
  return pickLine(pool, session, userId, `${seed}|cb`);
}

/**
 * Rare community alignment — others rebuilding, no tribe hype.
 */
function maybeCommunityRebuildWhisper(lang, session, userId, dateKey, chance = 0.04) {
  const seed = `${userId}|crw|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 18 >= Math.floor(chance * 18)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pool = BELONGING_LINES.filter(
    (e) =>
      e.language === locked &&
      /közösség|community|comunitate|épül|building|construiesc/i.test(e.text) &&
      isPremiumRebuildingLine(e.text)
  );
  return pickLine(pool, session, userId, `${seed}|com`);
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {Date} [now]
 */
function selectRebuildingMicroProtocol(slot, lang, session, userId, dateKey, now = new Date()) {
  if (!isRebuildingModeActive(session)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = slot === "late_night" ? "evening" : slot;
  const used = new Set(session?.recentMicroProtocolIds || []);
  const energy = session?.energyState || "stable";

  let pool = MINI_RECOVERY_PROTOCOLS.filter(
    (p) =>
      p.language === locked &&
      !used.has(p.id) &&
      (p.phases.includes(phase) || p.phases.includes(slot)) &&
      (p.energy.includes(energy) || energy === "exhausted" || energy === "low")
  );
  if (!pool.length) {
    pool = MINI_RECOVERY_PROTOCOLS.filter(
      (p) => p.language === locked && (p.phases.includes(phase) || p.phases.includes(slot))
    );
  }
  if (!pool.length) return null;

  const pick = pickSeeded(pool, `${userId}|recproto|${dateKey}|${phase}`);
  if (!pick) return null;
  updateSession(userId, {
    recentMicroProtocolIds: [...used, pick.id].slice(-24)
  });
  return pick;
}

/**
 * @param {object} proto
 */
function formatRebuildingProtocol(proto) {
  if (!proto) return "";
  const acts = (proto.actions || []).map((a) => `• ${a}`).join("\n");
  return lines(proto.title, "", acts);
}

/**
 * One bundle when rebuilding mode active.
 */
function pickRebuildingBundle(lang, session, userId, dateKey, phase, now = new Date(), inboundText = "") {
  const ctx = resolveRebuildingContext(session, inboundText, now, userId, dateKey);
  if (!ctx.active) return null;

  if (ctx.comeback) {
    const cb = maybeComebackLine(lang, session, userId, dateKey, 0.9);
    if (cb) return cb;
  }

  if (ctx.physical) {
    const body = maybePhysicalAwareness(lang, session, userId, dateKey, 0.12);
    if (body) return body;
  }

  const atm = maybeRebuildingAtmosphere(lang, session, userId, dateKey, ctx, 0.11);
  if (atm) return atm;

  const seed = `${userId}|rbun|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 9 === 0) {
    return maybeCommunityRebuildWhisper(lang, session, userId, dateKey, 0.15);
  }

  return maybePhysicalAwareness(lang, session, userId, dateKey, 0.08);
}

/**
 * Comeback handler for retention-style returns.
 * @returns {null | { body: string, category: string }}
 */
function tryRebuildingComeback(session, lang, userId, text) {
  if (!session?.onboardingCompleted) return null;
  if (!isInactiveUser(session) && !session?.rebuildingModeActive) return null;
  if (/^\s*\//.test(text || "")) return null;

  const t = String(text || "").trim();
  if (t.length > 80) return null;
  if (/(suicid|kill myself|want to die)/i.test(t)) return null;

  const greeting = /^(szia|hello|hey|hi|bună|salut|gm|jó reggelt|na\.?|ok\.?|back|vissza)$/i.test(t);
  if (!greeting && t.length > 40) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const dk = new Date().toISOString().slice(0, 10);
  syncRebuildingMode(session, text, new Date(), userId, dk);
  const line = maybeComebackLine(locked, session, userId, `${dk}|return`, 0.95);
  if (!line) return null;

  return { body: line, category: "rebuilding_comeback" };
}

function applyRebuildingFinalize(body, lang, session, userId, meta = {}) {
  if (!session?.onboardingCompleted || meta.rebuilding === false) return body;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const now = meta.now || new Date();
  const dateKey = meta.dateKey || now.toISOString().slice(0, 10);
  const ctx = resolveRebuildingContext(session, meta.inboundText || "", now, userId, dateKey);
  if (!ctx.active) return body;

  let chance = meta.rebuildingChance ?? 0.06;
  if (ctx.comeback) chance += 0.04;
  if (ctx.burnout || ctx.injury) chance += 0.03;

  const seed = `${userId}|rbf|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 13 >= Math.floor(chance * 13)) return body;

  let line = maybeRebuildingAtmosphere(locked, session, userId, dateKey, ctx, 0.1);
  if (!line && ctx.physical) {
    line = maybePhysicalAwareness(locked, session, userId, dateKey, 0.09);
  }
  if (!line && ctx.comeback) {
    line = maybeComebackLine(locked, session, userId, dateKey, 0.12);
  }

  if (!line || body.includes(line.slice(0, 12))) return body;
  if (body.split(/\n/).filter(Boolean).length >= (meta.maxLinesBeforeRebuild ?? 16)) return body;

  return [body, "", line].filter(Boolean).join("\n").trim();
}

function rebuildingPoolStats() {
  return {
    atmosphere: REBUILDING_ATMOSPHERE.length,
    physicalAwareness: PHYSICAL_RECOVERY_AWARENESS.length,
    comeback: COMEBACK_LINES.length,
    miniProtocols: MINI_RECOVERY_PROTOCOLS.length
  };
}

module.exports = {
  TOXIC_POSITIVITY_RE,
  AGGRESSIVE_MASC_RE,
  isPremiumRebuildingLine,
  maybeRebuildingAtmosphere,
  maybePhysicalAwareness,
  maybeComebackLine,
  maybeCommunityRebuildWhisper,
  selectRebuildingMicroProtocol,
  formatRebuildingProtocol,
  pickRebuildingBundle,
  tryRebuildingComeback,
  applyRebuildingFinalize,
  rebuildingPoolStats,
  syncRebuildingMode,
  resolveRebuildingContext,
  isRebuildingModeActive
};
