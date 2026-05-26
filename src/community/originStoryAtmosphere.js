/**
 * Origin story + community presence — earned, human, no cult or victim tone.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { resolveBehaviorSignals } = require("../rhythm/behaviorSignals");
const { isInactiveUser } = require("../retention/retentionRhythmEngine");
const { HYPE_RE, GUILT_RE, MARKETING_RE } = require("../retention/retentionRhythmEngine");
const { getTimeSlot } = require("../core/timeContext");
const {
  POSSESSIVE_RE,
  DEPENDENCY_RE,
  FAKE_DEEP_RE,
  CRINGE_RE
} = require("../presence/hopePresenceEngine");
const { BELONGING_LINES } = require("./belongingLines");
const { REBUILDING_LINES } = require("./rebuildingLines");
const { RECOVERY_STRENGTH_LINES } = require("./recoveryStrengthLines");

const VICTIM_RE =
  /\b(poor me|so unfair|why me|miért én|áldozat|victim mentality|sajnálatban|so alone in this world|senki sem ért meg)\b/i;

const CULT_RE =
  /\b(join us or|only we understand|exclusive tribe|titkos társaság|family forever|blood oath|loyalty or leave)\b/i;

const MELODRAMA_RE =
  /\b(devastat|destroyed my life|never recover|örökre tönkre|teljesen összeomlottam|my world ended)\b/i;

const HUMAN_CLAIM_RE =
  /\b(i am human|as a real person|valódi emberként|I personally went through|mesélem az életem)\b/i;

const FAKE_INSPIRATION_RE =
  /\b(you are limitless|unleash your potential|10x your life|sigma grindset|rise and grind|hustle harder)\b/i;

const MOTIVATION_SPAM_RE =
  /\b(crush it|beast mode|no excuses|just do it|feel the burn|motivációs beszéd)\b/i;

/**
 * @param {string} text
 */
function isPremiumCommunityLine(text) {
  if (!text || text.length < 3) return false;
  if (text.length > 220) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  if (POSSESSIVE_RE.test(text) || DEPENDENCY_RE.test(text) || FAKE_DEEP_RE.test(text)) return false;
  if (CRINGE_RE.test(text) || VICTIM_RE.test(text) || CULT_RE.test(text)) return false;
  if (MELODRAMA_RE.test(text) || HUMAN_CLAIM_RE.test(text)) return false;
  if (FAKE_INSPIRATION_RE.test(text) || MOTIVATION_SPAM_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 * @param {Date} [now]
 * @param {'morning'|'midday'|'evening'|'late_night'} [phase]
 */
function resolveCommunityContext(session, now = new Date(), phase) {
  const slot = phase || getTimeSlot(session, now);
  const signals = resolveBehaviorSignals(session, "", now);
  const energy = session?.energyState || "stable";
  const discipline = session?.disciplineState || "focused";
  const nervous = session?.nervousSystemState || "calm";
  const path = session?.activePrimaryPath || session?.userPrimaryPath;

  const beginner =
    !session?.onboardingCompleted ||
    (session?.messages || []).length <= 4 ||
    session?.dragonLevel === 1;

  const inactive = isInactiveUser(session) || signals.inactive;
  const comeback = inactive;
  const disciplineCollapse =
    discipline === "drifting" || discipline === "inconsistent";
  const injuryRecovery =
    session?.activeMode === "recovery" ||
    path === "recovery" ||
    path === "stabilization" ||
    nervous === "grounded" ||
    nervous === "overloaded";
  const stabilization =
    path === "stabilization" ||
    session?.activeMode === "stabilization" ||
    nervous === "grounded" ||
    slot === "evening";
  const lonelyEvening =
    (slot === "evening" || slot === "late_night") &&
    (energy === "exhausted" || energy === "low" || signals.lateNightSpiral);

  const scenes = [];
  if (beginner) scenes.push("beginner");
  if (injuryRecovery) scenes.push("injury_recovery");
  if (disciplineCollapse) scenes.push("discipline_collapse");
  if (comeback) scenes.push("comeback");
  if (lonelyEvening) scenes.push("lonely_evening");
  if (stabilization) scenes.push("stabilization");
  if (!scenes.length) scenes.push("stabilization");

  return {
    slot,
    signals,
    scenes,
    beginner,
    injuryRecovery,
    disciplineCollapse,
    comeback,
    lonelyEvening,
    stabilization
  };
}

/**
 * @param {Array} pool
 * @param {'en'|'hu'|'ro'} lang
 * @param {string[]} scenes
 * @param {Set<string>} used
 */
function filterCommunityPool(pool, lang, scenes, used) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return pool.filter((e) => {
    if (e.language !== locked) return false;
    if (used.has(e.id)) return false;
    if (!isPremiumCommunityLine(e.text)) return false;
    if (!e.scenes?.length) return true;
    return e.scenes.some((s) => scenes.includes(s));
  });
}

/**
 * @param {object} session
 * @param {string} id
 * @param {string|number} userId
 */
function recordCommunityUse(session, id, userId) {
  const used = new Set(session?.recentCommunityPresenceIds || []);
  const recent = [...used, id].slice(-20);
  updateSession(userId, { recentCommunityPresenceIds: recent });
}

/**
 * @param {Array} pool
 * @param {object} session
 * @param {string|number} userId
 * @param {string} seed
 */
function pickCommunityEntry(pool, session, userId, seed) {
  if (!pool.length) return null;
  const used = new Set(session?.recentCommunityPresenceIds || []);
  let candidates = pool.filter((e) => !used.has(e.id));
  if (!candidates.length) candidates = pool;
  const entry = pickSeeded(candidates, seed);
  if (!entry) return null;
  recordCommunityUse(session, entry.id, userId);
  return entry.text;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 * @param {number} [baseChance]
 */
function maybeCommunityBelonging(lang, session, userId, dateKey, ctx, baseChance = 0.04) {
  const seed = `${userId}|cbl|${dateKey}|${ctx.slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 16 >= Math.floor(baseChance * 16)) return null;

  const used = new Set(session?.recentCommunityPresenceIds || []);
  let pool = filterCommunityPool(BELONGING_LINES, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = BELONGING_LINES.filter(
      (e) =>
        e.language === (lang === "hu" || lang === "ro" ? lang : "en") &&
        isPremiumCommunityLine(e.text)
    );
  }
  return pickCommunityEntry(pool, session, userId, `${seed}|bel`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 * @param {number} [baseChance]
 */
function maybeRebuildingLine(lang, session, userId, dateKey, ctx, baseChance = 0.045) {
  let chance = baseChance;
  if (ctx.disciplineCollapse || ctx.comeback) chance += 0.03;

  const seed = `${userId}|reb|${dateKey}|${ctx.slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return null;

  const used = new Set(session?.recentCommunityPresenceIds || []);
  let pool = filterCommunityPool(REBUILDING_LINES, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = REBUILDING_LINES.filter(
      (e) =>
        e.language === (lang === "hu" || lang === "ro" ? lang : "en") &&
        isPremiumCommunityLine(e.text)
    );
  }
  return pickCommunityEntry(pool, session, userId, `${seed}|reb`);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} ctx
 * @param {number} [baseChance]
 */
function maybeRecoveryStrength(lang, session, userId, dateKey, ctx, baseChance = 0.045) {
  if (!ctx.injuryRecovery && !ctx.stabilization && !ctx.disciplineCollapse) {
    baseChance *= 0.65;
  }

  const seed = `${userId}|rs|${dateKey}|${ctx.slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 15 >= Math.floor(baseChance * 15)) return null;

  const used = new Set(session?.recentCommunityPresenceIds || []);
  let pool = filterCommunityPool(RECOVERY_STRENGTH_LINES, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = RECOVERY_STRENGTH_LINES.filter(
      (e) =>
        e.language === (lang === "hu" || lang === "ro" ? lang : "en") &&
        isPremiumCommunityLine(e.text)
    );
  }
  return pickCommunityEntry(pool, session, userId, `${seed}|rs`);
}

/**
 * One rare line for daily rhythm — origin + community, not stacked with hope spam.
 */
function pickCommunityPresenceBundle(lang, session, userId, dateKey, phase, now = new Date()) {
  if (!session?.onboardingCompleted) return null;

  const ctx = resolveCommunityContext(session, now, phase);
  const seed = `${userId}|cpb|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 11 >= 2) return null;

  if (ctx.injuryRecovery || ctx.stabilization) {
    const rs = maybeRecoveryStrength(lang, session, userId, dateKey, ctx, 0.12);
    if (rs) return rs;
  }
  if (ctx.disciplineCollapse || ctx.comeback) {
    const reb = maybeRebuildingLine(lang, session, userId, dateKey, ctx, 0.11);
    if (reb) return reb;
  }
  if (ctx.beginner || ctx.lonelyEvening) {
    const bel = maybeCommunityBelonging(lang, session, userId, dateKey, ctx, 0.1);
    if (bel) return bel;
  }

  const roll = h % 3;
  if (roll === 0) return maybeRebuildingLine(lang, session, userId, dateKey, ctx, 0.08);
  if (roll === 1) return maybeRecoveryStrength(lang, session, userId, dateKey, ctx, 0.08);
  return maybeCommunityBelonging(lang, session, userId, dateKey, ctx, 0.07);
}

/**
 * Append rare community/origin line to finalized outbound.
 */
function applyCommunityPresenceFinalize(body, lang, session, userId, meta = {}) {
  if (!session?.onboardingCompleted || meta.communityPresence === false) return body;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const dateKey = meta.dateKey || new Date().toISOString().slice(0, 10);
  const phase = meta.phase || getTimeSlot(session, meta.now || new Date());
  const now = meta.now || new Date();
  const ctx = resolveCommunityContext(session, now, phase);

  let chance = meta.communityChance ?? 0.038;
  if (ctx.injuryRecovery || ctx.disciplineCollapse) chance += 0.025;
  if (ctx.beginner) chance += 0.02;

  const seed = `${userId}|cpf|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return body;

  let line = null;
  if (ctx.injuryRecovery || ctx.stabilization) {
    line = maybeRecoveryStrength(locked, session, userId, dateKey, ctx, 0.1);
  }
  if (!line && (ctx.disciplineCollapse || ctx.comeback)) {
    line = maybeRebuildingLine(locked, session, userId, dateKey, ctx, 0.09);
  }
  if (!line && (ctx.beginner || ctx.lonelyEvening)) {
    line = maybeCommunityBelonging(locked, session, userId, dateKey, ctx, 0.08);
  }
  if (!line && h % 4 === 0) {
    line = maybeRebuildingLine(locked, session, userId, dateKey, ctx, 0.06);
  }

  if (!line || body.includes(line.slice(0, 14))) return body;

  const lineCount = body.split(/\n/).filter(Boolean).length;
  if (lineCount >= (meta.maxLinesBeforeCommunity ?? 15)) return body;

  return [body, "", line].filter(Boolean).join("\n").trim();
}

function communityPoolStats() {
  return {
    belonging: BELONGING_LINES.length,
    rebuilding: REBUILDING_LINES.length,
    recoveryStrength: RECOVERY_STRENGTH_LINES.length
  };
}

module.exports = {
  VICTIM_RE,
  CULT_RE,
  MELODRAMA_RE,
  HUMAN_CLAIM_RE,
  FAKE_INSPIRATION_RE,
  MOTIVATION_SPAM_RE,
  isPremiumCommunityLine,
  resolveCommunityContext,
  maybeCommunityBelonging,
  maybeRebuildingLine,
  maybeRecoveryStrength,
  pickCommunityPresenceBundle,
  applyCommunityPresenceFinalize,
  communityPoolStats
};
