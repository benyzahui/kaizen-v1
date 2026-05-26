/**
 * Life balance engine — real life rhythm, flexible discipline, non-toxic performance.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { getTimeSlot } = require("../core/timeContext");
const { resolveBehaviorSignals } = require("../rhythm/behaviorSignals");
const { HYPE_RE, GUILT_RE, MARKETING_RE } = require("../retention/retentionRhythmEngine");
const { FAKE_INSPIRATION_RE, MOTIVATION_SPAM_RE } = require("../community/originStoryAtmosphere");
const { AGGRESSIVE_MASC_RE } = require("../rebuilding/rebuildingEngine");
const { isRebuildingModeActive } = require("../rebuilding/rebuildingMode");
const { LIFE_AWARENESS_LINES } = require("./lifeAwarenessLines");
const { FLEXIBLE_DISCIPLINE_LINES } = require("./flexibleDisciplineLines");
const { LIFE_BALANCE_REMINDERS } = require("./lifeBalanceReminders");
const {
  WORK_STRESS_RE,
  STUDY_STRESS_RE,
  BUSY_SCHEDULE_RE,
  RELATIONSHIP_LOAD_RE,
  shouldReducePressure,
  resolvePressureLevel
} = require("./pressureReduction");

const HUSTLE_RE =
  /\b(hustle|grindset|rise and grind|10x|beast mode|no excuses|sigma|alpha male|crush it|sleep when dead|outwork|dominate|monk mode|warrior day only)\b/i;

const MONK_FANTASY_RE =
  /\b(perfect routine|minden nap 5|every day 5am|zero rest|no rest days|teljes tökéletesség)\b/i;

/**
 * @param {string} text
 */
function isPremiumLifeBalanceLine(text) {
  if (!text || text.length < 3 || text.length > 220) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  if (HUSTLE_RE.test(text) || AGGRESSIVE_MASC_RE.test(text)) return false;
  if (FAKE_INSPIRATION_RE.test(text) || MOTIVATION_SPAM_RE.test(text)) return false;
  if (MONK_FANTASY_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function resolveLifeContext(session, text = "", now = new Date()) {
  const signals = resolveBehaviorSignals(session, text, now);
  const slot = getTimeSlot(session, now);
  const energy = session?.energyState || "stable";
  const t = String(text || "");
  const pressure = resolvePressureLevel(session, text, now);

  const scenes = [];
  if (WORK_STRESS_RE.test(t) || WORK_STRESS_RE.test(recentText(session))) {
    scenes.push("stressed_worker");
  }
  if (STUDY_STRESS_RE.test(t) || STUDY_STRESS_RE.test(recentText(session))) {
    scenes.push("exhausted");
  }
  if (BUSY_SCHEDULE_RE.test(t) || signals.frantic) scenes.push("busy", "busy_entrepreneur");
  if (RELATIONSHIP_LOAD_RE.test(t)) scenes.push("stressed_worker");
  if (energy === "exhausted" || energy === "low") scenes.push("exhausted");
  if (isRebuildingModeActive(session) || session?.activeMode === "recovery") {
    scenes.push("recovery_day");
  }
  if (
    (slot === "evening" || slot === "late_night") &&
    (signals.overloaded || energy === "exhausted")
  ) {
    scenes.push("overloaded_evening");
  }
  if (signals.overloaded || signals.chaotic) scenes.push("overloaded_evening", "busy");
  if (!scenes.length) scenes.push("stressed_worker");

  return {
    scenes: [...new Set(scenes)],
    signals,
    slot,
    pressure,
    reducePressure: shouldReducePressure(session, text, now)
  };
}

/**
 * @param {object} session
 */
function recentText(session) {
  return (session?.messages || [])
    .slice(-4)
    .map((m) => m.text || "")
    .join(" ");
}

/**
 * @param {object} session
 * @param {string} id
 * @param {string|number} userId
 */
function recordLifeBalanceUse(session, id, userId) {
  const used = new Set(session?.recentLifeBalanceLineIds || []);
  updateSession(userId, { recentLifeBalanceLineIds: [...used, id].slice(-20) });
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
    if (!isPremiumLifeBalanceLine(e.text)) return false;
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
  const used = new Set(session?.recentLifeBalanceLineIds || []);
  let candidates = pool.filter((e) => !used.has(e.id));
  if (!candidates.length) candidates = pool;
  const entry = pickSeeded(candidates, seed);
  if (!entry) return null;
  recordLifeBalanceUse(session, entry.id, userId);
  return entry.text;
}

function maybeLifeAwareness(lang, session, userId, dateKey, ctx, chance = 0.07) {
  const seed = `${userId}|la|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return null;
  const used = new Set(session?.recentLifeBalanceLineIds || []);
  let pool = filterPool(LIFE_AWARENESS_LINES, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = LIFE_AWARENESS_LINES.filter(
      (e) => e.language === (lang === "hu" || lang === "ro" ? lang : "en") && isPremiumLifeBalanceLine(e.text)
    );
  }
  return pickLine(pool, session, userId, `${seed}|a`);
}

function maybeFlexibleDiscipline(lang, session, userId, dateKey, ctx, chance = 0.065) {
  const seed = `${userId}|fd|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 13 >= Math.floor(chance * 13)) return null;
  const used = new Set(session?.recentLifeBalanceLineIds || []);
  let pool = filterPool(FLEXIBLE_DISCIPLINE_LINES, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = FLEXIBLE_DISCIPLINE_LINES.filter(
      (e) => e.language === (lang === "hu" || lang === "ro" ? lang : "en") && isPremiumLifeBalanceLine(e.text)
    );
  }
  return pickLine(pool, session, userId, `${seed}|fd`);
}

function maybeBalanceReminder(lang, session, userId, dateKey, ctx, chance = 0.06) {
  let c = chance;
  if (ctx.reducePressure) c += 0.04;
  const seed = `${userId}|lbr|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 15 >= Math.floor(c * 15)) return null;
  const used = new Set(session?.recentLifeBalanceLineIds || []);
  let pool = filterPool(LIFE_BALANCE_REMINDERS, lang, ctx.scenes, used);
  if (!pool.length) {
    pool = LIFE_BALANCE_REMINDERS.filter(
      (e) => e.language === (lang === "hu" || lang === "ro" ? lang : "en") && isPremiumLifeBalanceLine(e.text)
    );
  }
  return pickLine(pool, session, userId, `${seed}|br`);
}

/**
 * One rare line for daily rhythm when real-life pressure is present.
 */
function pickLifeBalanceBundle(lang, session, userId, dateKey, phase, now = new Date(), inboundText = "") {
  if (!session?.onboardingCompleted) return null;

  const ctx = resolveLifeContext(session, inboundText, now);
  if (ctx.pressure === "low" && !ctx.reducePressure) return null;

  const seed = `${userId}|lbb|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 10 >= 3 && ctx.pressure !== "critical") return null;

  if (ctx.reducePressure) {
    const rem = maybeBalanceReminder(lang, session, userId, dateKey, ctx, 0.12);
    if (rem) return rem;
  }

  if (ctx.scenes.includes("overloaded_evening") || ctx.scenes.includes("exhausted")) {
    const aw = maybeLifeAwareness(lang, session, userId, dateKey, ctx, 0.1);
    if (aw) return aw;
  }

  const roll = h % 3;
  if (roll === 0) return maybeFlexibleDiscipline(lang, session, userId, dateKey, ctx, 0.09);
  if (roll === 1) return maybeLifeAwareness(lang, session, userId, dateKey, ctx, 0.08);
  return maybeBalanceReminder(lang, session, userId, dateKey, ctx, 0.08);
}

/**
 * Strip hustle / grind lines from outbound body.
 * @param {string} body
 */
function stripHustleLines(body) {
  return String(body || "")
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      return !HUSTLE_RE.test(t) && !MONK_FANTASY_RE.test(t);
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function applyLifeBalanceFinalize(body, lang, session, userId, meta = {}) {
  if (!session?.onboardingCompleted || meta.lifeBalance === false) return body;

  let out = stripHustleLines(body);
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const now = meta.now || new Date();
  const dateKey = meta.dateKey || now.toISOString().slice(0, 10);
  const ctx = resolveLifeContext(session, meta.inboundText || "", now);

  if (!ctx.reducePressure && ctx.pressure === "low") return out;

  let chance = meta.lifeBalanceChance ?? 0.05;
  if (ctx.reducePressure) chance += 0.04;

  const seed = `${userId}|lbf|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 14 >= Math.floor(chance * 14)) return out;

  let line = null;
  if (ctx.reducePressure) {
    line = maybeBalanceReminder(locked, session, userId, dateKey, ctx, 0.1);
  }
  if (!line) line = maybeFlexibleDiscipline(locked, session, userId, dateKey, ctx, 0.07);
  if (!line) line = maybeLifeAwareness(locked, session, userId, dateKey, ctx, 0.06);

  if (!line || out.includes(line.slice(0, 12))) return out;
  if (out.split(/\n/).filter(Boolean).length >= (meta.maxLinesBeforeLifeBalance ?? 16)) return out;

  return [out, "", line].filter(Boolean).join("\n").trim();
}

function lifeBalancePoolStats() {
  return {
    awareness: LIFE_AWARENESS_LINES.length,
    flexibleDiscipline: FLEXIBLE_DISCIPLINE_LINES.length,
    reminders: LIFE_BALANCE_REMINDERS.length
  };
}

module.exports = {
  HUSTLE_RE,
  MONK_FANTASY_RE,
  isPremiumLifeBalanceLine,
  resolveLifeContext,
  maybeLifeAwareness,
  maybeFlexibleDiscipline,
  maybeBalanceReminder,
  pickLifeBalanceBundle,
  stripHustleLines,
  applyLifeBalanceFinalize,
  lifeBalancePoolStats
};
