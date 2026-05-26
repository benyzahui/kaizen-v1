/**
 * Human touch finalization — light presence, no over-empathy, silence confidence.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { getTimeSlot } = require("../core/timeContext");
const { HYPE_RE, GUILT_RE, MARKETING_RE } = require("../retention/retentionRhythmEngine");
const {
  POSSESSIVE_RE,
  DEPENDENCY_RE,
  FAKE_DEEP_RE,
  CRINGE_RE
} = require("./hopePresenceEngine");
const { LIGHT_PRESENCE_MOMENTS } = require("./lightPresenceMoments");

const THERAPY_RE =
  /\b(therapy|terápia|terapeut|how does that make you feel|tell me more about your feelings|validating your feelings|emotional support session|mesélj mindenről|érzelmileg támog|önismereti beszélgetés)\b/i;

const OVER_EMPATHY_RE =
  /\b(i'm so sorry you feel|that must be devastating|you're not alone in this pain|veled érzem|mindig itt vagyok neked|i feel your pain|your feelings are so valid)\b/i;

const HUMAN_CLAIM_RE =
  /\b(as your friend|valódi emberként|i personally feel|i cried with you|soul connection)\b/i;

const PRESENCE_DUPE_RE =
  /^(Itt vagyok\.|I'm here\.|Sunt aici\.|Lassan\.|Slowly\.|Încet\.)$/i;

/**
 * @param {string} text
 */
function isPremiumLightPresence(text) {
  if (!text || text.length < 2 || text.length > 80) return false;
  if (HYPE_RE.test(text) || GUILT_RE.test(text) || MARKETING_RE.test(text)) return false;
  if (POSSESSIVE_RE.test(text) || DEPENDENCY_RE.test(text) || FAKE_DEEP_RE.test(text)) return false;
  if (CRINGE_RE.test(text) || THERAPY_RE.test(text) || OVER_EMPATHY_RE.test(text)) return false;
  if (HUMAN_CLAIM_RE.test(text)) return false;
  return true;
}

/**
 * @param {string} body
 */
function stripOverEmpathy(body) {
  return String(body || "")
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (THERAPY_RE.test(t) || OVER_EMPATHY_RE.test(t) || HUMAN_CLAIM_RE.test(t)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Collapse duplicate ultra-short presence lines.
 * @param {string} body
 */
function dedupeLightPresence(body) {
  const seen = new Set();
  const out = [];
  for (const line of String(body || "").split(/\n/)) {
    const t = line.trim();
    if (!t) {
      out.push("");
      continue;
    }
    const key = t.toLowerCase().slice(0, 24);
    if (t.length <= 42 && PRESENCE_DUPE_RE.test(t)) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * @param {string} body
 */
function countShortPresenceLines(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.length <= 48).length;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {string} phase
 * @param {number} [chance]
 */
function maybeLightPresenceMoment(lang, session, userId, dateKey, phase, chance = 0.035) {
  const seed = `${userId}|lp|${dateKey}|${phase}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 22 >= Math.floor(chance * 22)) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const slot = phase === "late_night" ? "evening" : phase;
  const used = new Set(session?.recentLightPresenceIds || []);

  let pool = LIGHT_PRESENCE_MOMENTS.filter((m) => {
    if (m.language !== locked) return false;
    if (used.has(m.id)) return false;
    if (!isPremiumLightPresence(m.text)) return false;
    if (m.timeOfDay?.length && !m.timeOfDay.includes(slot) && !m.timeOfDay.includes(phase)) {
      return false;
    }
    return true;
  });

  if (!pool.length) {
    pool = LIGHT_PRESENCE_MOMENTS.filter(
      (m) => m.language === locked && isPremiumLightPresence(m.text)
    );
  }
  if (!pool.length) return null;

  const entry = pickSeeded(pool, seed);
  if (!entry) return null;
  const recent = [...used, entry.id].slice(-14);
  updateSession(userId, { recentLightPresenceIds: recent });
  return entry.text;
}

/**
 * Final human-touch pass — strip therapy tone, dedupe, optional one light line.
 */
function applyLightPresenceFinalize(body, lang, session, userId, meta = {}) {
  if (!session?.onboardingCompleted || meta.lightPresence === false) {
    return stripOverEmpathy(dedupeLightPresence(body));
  }

  let out = stripOverEmpathy(body);
  out = dedupeLightPresence(out);

  const shortCount = countShortPresenceLines(out);
  if (shortCount >= 3) return out;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = meta.phase || getTimeSlot(session, meta.now || new Date());
  const dateKey = meta.dateKey || new Date().toISOString().slice(0, 10);

  let chance = meta.lightPresenceChance ?? 0.032;
  if (phase === "evening" || phase === "late_night") chance += 0.012;
  if (meta.inboundText && meta.inboundText.length < 30) chance += 0.01;

  const line = maybeLightPresenceMoment(locked, session, userId, dateKey, phase, chance);
  if (!line || out.includes(line)) return out;

  const lineCount = out.split(/\n/).filter(Boolean).length;
  if (lineCount >= (meta.maxLinesBeforeLight ?? 15)) return out;

  return [out, "", line].filter(Boolean).join("\n").trim();
}

/**
 * Analyze outbound for smoke / report.
 * @param {string} body
 */
function analyzePresenceQuality(body) {
  const lines = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let therapyHits = 0;
  let dependencyHits = 0;
  let hustleHits = 0;
  let cringeHits = 0;
  let supportHits = 0;

  for (const line of lines) {
    if (THERAPY_RE.test(line) || OVER_EMPATHY_RE.test(line)) therapyHits += 1;
    if (DEPENDENCY_RE.test(line) || POSSESSIVE_RE.test(line)) dependencyHits += 1;
    if (HYPE_RE.test(line)) hustleHits += 1;
    if (CRINGE_RE.test(line)) cringeHits += 1;
    if (/ritmus|lépés|stabil|pihen|kör|here|sunt aici|lassan|slow/i.test(line)) supportHits += 1;
  }

  const shortLines = lines.filter((l) => l.length <= 48).length;
  const calm =
    lines.some((l) => /lassan|pihen|elég|slow|rest|stabil|🌘|🫀/i.test(l)) || shortLines >= 1;

  let premiumScore = 70;
  if (lines.length >= 3 && lines.length <= 14) premiumScore += 10;
  if (body.length > 900) premiumScore -= 25;
  if (therapyHits + dependencyHits + hustleHits > 0) premiumScore -= 20;
  premiumScore = Math.max(0, Math.min(100, premiumScore));

  return {
    lineCount: lines.length,
    shortLines,
    therapyHits,
    dependencyHits,
    hustleHits,
    cringeHits,
    supportHits,
    calm,
    premiumScore,
    isPremium: !therapyHits && !dependencyHits && !hustleHits && !cringeHits
  };
}

function lightPresencePoolStats() {
  return { moments: LIGHT_PRESENCE_MOMENTS.length };
}

module.exports = {
  THERAPY_RE,
  OVER_EMPATHY_RE,
  isPremiumLightPresence,
  stripOverEmpathy,
  dedupeLightPresence,
  countShortPresenceLines,
  maybeLightPresenceMoment,
  applyLightPresenceFinalize,
  analyzePresenceQuality,
  lightPresencePoolStats
};
