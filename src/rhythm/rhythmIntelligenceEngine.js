/**
 * Rhythm intelligence — timing, behavior signals, low verbosity, smart presence.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { resolveTimeAwareTone } = require("../atmosphere/timeAwareTone");
const { updateSession } = require("../session/sessionStore");
const { resolveBehaviorSignals, primaryPresenceSignal } = require("./behaviorSignals");
const { CONTEXTUAL_PRESENCE } = require("./contextualPresencePools");
const { ONE_THING_LINES } = require("./oneThingLines");
const { CONTINUITY_LINES } = require("./programContinuityLines");
const { HYPE_RE, GUILT_RE, MARKETING_RE } = require("../retention/retentionRhythmEngine");

const RHYTHM_MODE = {
  morning: "activate",
  midday: "execute",
  evening: "stabilize",
  late_night: "recover"
};

const GENERIC_RE =
  /\b(as an ai|language model|how can i help|happy to assist|feel free to ask)\b/i;

/**
 * @param {string} text
 */
function isPremiumRhythmLine(text) {
  if (!text || text.length < 4) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  if (GENERIC_RE.test(text)) return false;
  return true;
}

/**
 * @param {object} session
 * @param {string} [text]
 * @param {Date} [now]
 */
function resolveRhythmProfile(session, text = "", now = new Date()) {
  const tone = resolveTimeAwareTone(session, now);
  const signals = resolveBehaviorSignals(session, text, now);

  let maxLines = tone.maxLines;
  let protocolIntensity = "medium";
  let verbosity = "normal";

  if (signals.overloaded || signals.chaotic || signals.lateNightSpiral) {
    maxLines = Math.min(maxLines, 4);
    protocolIntensity = "low";
    verbosity = "minimal";
  }
  if (signals.frantic) {
    maxLines = Math.min(maxLines, 3);
    verbosity = "minimal";
    protocolIntensity = "low";
  }
  if (signals.inactive) {
    maxLines = Math.min(maxLines, 5);
    verbosity = "warm_short";
  }
  if (signals.disciplinedFlow && verbosity === "normal") {
    maxLines = Math.min(maxLines + 1, 6);
  }
  if (tone.timeSlot === "late_night") {
    maxLines = Math.min(maxLines, 4);
    protocolIntensity = "low";
  }

  return {
    tone,
    signals,
    maxLines,
    protocolIntensity,
    verbosity,
    timeSlot: tone.timeSlot,
    rhythmMode: RHYTHM_MODE[tone.timeSlot] || "stabilize",
    pacing: tone.pacing,
    softness: tone.softness
  };
}

/**
 * @param {string} body
 * @param {object} profile
 */
function applyVerbosityCap(body, profile) {
  const max = profile?.maxLines ?? 6;
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (parts.length <= max) return String(body || "").trim();

  if (profile.verbosity === "minimal") {
    return parts.slice(0, Math.min(2, max)).join("\n");
  }
  return parts.slice(0, max).join("\n");
}

/**
 * @param {object} profile
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} session
 */
function pickContextualPresence(profile, lang, userId, dateKey, session) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const signal = primaryPresenceSignal(profile.signals);
  if (!signal) return null;

  const used = new Set(session?.recentContextPresenceIds || []);
  let pool = CONTEXTUAL_PRESENCE.filter(
    (p) =>
      p.language === locked &&
      (p.signal === signal || (signal === "night_spiral" && p.signal === "night")) &&
      !used.has(p.id) &&
      isPremiumRhythmLine(p.text)
  );
  if (!pool.length) {
    pool = CONTEXTUAL_PRESENCE.filter(
      (p) => p.language === locked && p.signal === signal && isPremiumRhythmLine(p.text)
    );
  }
  if (!pool.length) return null;

  const line = pickSeeded(
    pool.map((p) => p.text),
    `${userId}|cp|${signal}|${dateKey}`
  );
  const entry = pool.find((p) => p.text === line) || pool[0];
  const recent = [...used, entry.id];
  updateSession(userId, { recentContextPresenceIds: recent.slice(-14) });
  return line;
}

/**
 * @param {object} profile
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 */
function pickOneThingLine(profile, lang, userId, dateKey) {
  const s = profile.signals;
  if (!s.overloaded && !s.chaotic && !s.lateNightSpiral && !s.stressLoop) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pool = ONE_THING_LINES.filter((l) => l.language === locked && isPremiumRhythmLine(l.text));
  if (!pool.length) return null;
  return pickSeeded(
    pool.map((p) => p.text),
    `${userId}|one|${dateKey}|${profile.timeSlot}`
  );
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} session
 */
function pickContinuityLine(lang, userId, dateKey, session) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const used = new Set(session?.recentContinuityIds || []);
  let pool = CONTINUITY_LINES.filter(
    (c) => c.language === locked && !used.has(c.id) && isPremiumRhythmLine(c.text)
  );
  if (!pool.length) {
    pool = CONTINUITY_LINES.filter((c) => c.language === locked && isPremiumRhythmLine(c.text));
  }
  if (!pool.length) return null;
  const line = pickSeeded(
    pool.map((c) => c.text),
    `${userId}|cont|${dateKey}`
  );
  const entry = pool.find((c) => c.text === line) || pool[0];
  updateSession(userId, { recentContinuityIds: [...used, entry.id].slice(-10) });
  return line;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {string} [inboundText]
 * @param {number} [chance] 0–1
 * @param {Date} [now]
 */
function maybeContextualPresence(lang, session, userId, dateKey, inboundText = "", chance = 0.11, now = new Date()) {
  const seed = `${userId}|mcp|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 12 >= Math.floor(chance * 12)) return null;

  const profile = resolveRhythmProfile(session, inboundText, now);
  if (!primaryPresenceSignal(profile.signals)) return null;
  return pickContextualPresence(profile, lang, userId, dateKey, session);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {string} [inboundText]
 * @param {Date} [now]
 */
function maybeOneThingForSession(lang, session, userId, dateKey, inboundText = "", now = new Date()) {
  const profile = resolveRhythmProfile(session, inboundText, now);
  return pickOneThingLine(profile, lang, userId, dateKey);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {number} [chance]
 */
function maybeContinuityWhisper(lang, session, userId, dateKey, chance = 0.06) {
  const seed = `${userId}|contW|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 18 >= Math.floor(chance * 18)) return null;
  return pickContinuityLine(lang, userId, dateKey, session);
}

/**
 * Open-chat smart presence — single line prefix, rare.
 * @returns {null | { body: string, category: string }}
 */
function trySmartPresenceOpen(session, lang, userId, text, now = new Date()) {
  if (!session?.onboardingCompleted) return null;
  if (/^\s*\//.test(text)) return null;
  const t = String(text || "").trim();
  if (t.length > 100) return null;

  const profile = resolveRhythmProfile(session, text, now);
  const signal = primaryPresenceSignal(profile.signals);
  if (!signal || signal === "inactivity") return null;

  if (Math.random() > 0.14) return null;

  const dk = new Date().toISOString().slice(0, 10);
  const line = pickContextualPresence(profile, lang, userId, `${dk}|open`, session);
  if (!line) return null;

  return { body: line, category: "rhythm_presence" };
}

/**
 * Final polish — verbosity cap, optional one-thing prefix, continuity.
 */
function applyRhythmIntelligenceFinalize(body, lang, session, userId, meta = {}) {
  if (!session?.onboardingCompleted) return body;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const profile = resolveRhythmProfile(session, meta.inboundText || "", meta.now || new Date());
  const dateKey = meta.dateKey || new Date().toISOString().slice(0, 10);

  let out = applyVerbosityCap(body, profile);

  const formatOpts = {
    maxLines: profile.maxLines,
    maxChars: profile.verbosity === "minimal" ? 420 : meta.formatOpts?.maxChars,
    ...meta.formatOpts
  };

  if (meta.oneThing !== false && (profile.signals.overloaded || profile.signals.chaotic)) {
    const one = pickOneThingLine(profile, locked, userId, dateKey);
    if (one && !out.includes(one.slice(0, 10))) {
      out = [one, "", out].filter(Boolean).join("\n").trim();
    }
  }

  if (meta.continuity !== false) {
    const cont = maybeContinuityWhisper(locked, session, userId, dateKey, meta.continuityChance ?? 0.05);
    if (cont && !out.includes(cont.slice(0, 12))) {
      const lc = out.split(/\n/).filter(Boolean).length;
      if (lc < profile.maxLines) {
        out = [out, "", cont].filter(Boolean).join("\n");
      }
    }
  }

  out = applyVerbosityCap(out, profile);
  meta._rhythmFormatOpts = formatOpts;
  meta._rhythmProfile = profile;
  return out.trim();
}

function rhythmPoolStats() {
  return {
    contextualPresence: CONTEXTUAL_PRESENCE.length,
    oneThing: ONE_THING_LINES.length,
    continuity: CONTINUITY_LINES.length
  };
}

module.exports = {
  GENERIC_RE,
  RHYTHM_MODE,
  isPremiumRhythmLine,
  resolveRhythmProfile,
  applyVerbosityCap,
  pickContextualPresence,
  pickOneThingLine,
  pickContinuityLine,
  maybeContextualPresence,
  maybeOneThingForSession,
  maybeContinuityWhisper,
  trySmartPresenceOpen,
  applyRhythmIntelligenceFinalize,
  rhythmPoolStats
};
