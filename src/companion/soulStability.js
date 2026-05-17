/**
 * Soul stability — emotional coherence, immersion pacing, presence over performance (245–250).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { maybeEmotionalContinuity } = require("./emotionalContinuity");
const { maybeRelationshipContinuity } = require("./relationshipPresence");
const { getTimeSlot } = require("../core/timeContext");

const DEEP_PERFORMANCE_RE =
  /\b(profound|transformative|healing journey|hero'?s journey|life-changing|remarkable|lélektani|transzformáció|gyógyulás útja|identity is forged|chaos grows)\b/i;

const WISDOM_PERFORM_RE =
  /\b(fontos megérteni|key insight|worth noting|let me explain|remember that|tanulság|bölcsesség|strategically|the truth is|nagyon fontos hogy)\b/i;

const REFRAME_SPAM_RE =
  /\b(másik szemszög|reframe|on the bright side|valójában ez azt jelenti|érdekes módon nézve)\b/i;

const OVER_GUIDE_RE =
  /\b(következő lépés|three steps|first,.*second|először.*másodszor|protocol|minimum victory|egy blokk mára|stabilizáló lépés)\b/i;

const UPBEAT_MISMATCH_RE =
  /\b(crush it|you got this|nagyszerű nap|szuper nap|lets go|let's go|manifest|10x)\b/i;

const COACH_THREAD_RE = /\b(a szál még nyitva van[^.]*megoldani|érdemes egy mozdulatot nevezni)\b/i;

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function stabilizeEmotionalTone(body, ctx, timing) {
  const pm = ctx.session?.presenceMemory || {};
  const heavy = pm.emotionalState === "overloaded" || pm.emotionalState === "scattered";
  const tired = pm.emotionalState === "tired" || pm.energyPattern === "mental fatigue";
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");

  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (DEEP_PERFORMANCE_RE.test(line)) return false;
      if (WISDOM_PERFORM_RE.test(line)) return false;
      if (!askedHelp && REFRAME_SPAM_RE.test(line)) return false;
      if (!askedHelp && OVER_GUIDE_RE.test(line) && line.length > 35) return false;
      if (heavy && UPBEAT_MISMATCH_RE.test(line)) return false;
      if ((heavy || tired) && /(discipline now|fegyelem most|no excuses)/i.test(line)) return false;
      if (COACH_THREAD_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function reducePerformance(body, ctx, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  let parts = body.split(/\n/).filter(Boolean);
  let preachCount = 0;

  parts = parts.filter((line) => {
    if (WISDOM_PERFORM_RE.test(line) || DEEP_PERFORMANCE_RE.test(line)) return false;
    if (/^(fontos|remember|ne felejts|it is important)/i.test(line)) {
      preachCount += 1;
      return askedHelp || preachCount <= 1;
    }
    return true;
  });

  if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
  if ((timing === "pause" || timing === "presence") && parts.length > 1 && !askedHelp) {
    parts = parts.slice(0, 1);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function applyImmersionPacing(body, ctx, category, timing) {
  let parts = String(body || "")
    .trim()
    .split(/\n/)
    .filter(Boolean);
  if (!parts.length) return "";

  const t = String(ctx.lastUserText || "").trim();
  if (t.length < 20 && parts.length > 1) {
    return parts[0];
  }

  parts = parts.map((line) => (line.length > 95 ? `${line.slice(0, 92).trim()}…` : line));

  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    parts = parts.slice(0, 2);
  }

  const heavyTiming = timing === "pause" || timing === "presence" || timing === "soften";
  if (heavyTiming && parts.length > 1 && t.length < 40) {
    parts = parts.slice(0, 1);
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} timing
 */
function maybeComfortableSilence(ctx, body, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  if (askedHelp) return body;

  const spacious =
    timing === "pause" ||
    timing === "presence" ||
    timing === "soften" ||
    /^(…|\.\.\.|ok\.?|hm\.?|na\.?)$/i.test(String(ctx.lastUserText || "").trim());

  if (!spacious) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length <= 1 && (parts[0] || "").length < 58) return body;
  if (Math.random() > 0.22) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.comfortableSilence || []),
    ...(r.presenceOnlyBeats || []),
    ...(r.soulMicroBeats || [])
  ].filter((p) => String(p).length < 62);
  if (!pool.length) return body;

  return pickSeeded(pool, `csil_${ctx.userId}_${ctx.session?.messages?.length || 0}`);
}

/**
 * @param {object} ctx
 * @param {string} category
 * @returns {string|null}
 */
function maybeSoulMemoryFlow(ctx, category) {
  if (!ctx.session?.onboardingCompleted) return null;
  if ((ctx.session.messages || []).length < 5) return null;
  if (Math.random() > 0.11) return null;

  const rel = maybeRelationshipContinuity(ctx.session, ctx.lang, category);
  if (rel) return rel;

  const emo = maybeEmotionalContinuity(ctx.session, ctx.lang, ctx.lastUserText || "");
  if (emo) return emo;

  const r = getResponses(ctx.lang);
  const pm = ctx.session.presenceMemory || {};
  const pool = [...(r.soulMemoryFlow || []), ...(r.softMemoryCallbacks || [])];
  if (!pool.length) return null;

  const rhythm = pm.relationshipRhythm || {};
  const slot = getTimeSlot(ctx.session);

  if (rhythm.lastScatteredSlot === slot) {
    const filtered = pool.filter((p) => /(múltkor|ilyenkor|last time|data trecută)/i.test(p));
    if (filtered.length) return pickSeeded(filtered, `smem_${slot}_${category}`);
  }
  if (pm.previousEmotionalState === "overloaded" && pm.emotionalState === "grounded") {
    const filtered = pool.filter((p) => /(nyugodtabb|pár nap|calmer|mai tisztább|mai ancorat)/i.test(p));
    if (filtered.length) return pickSeeded(filtered, `smem_calm_${category}`);
  }

  return pickSeeded(pool, `smem_${pm.emotionalState}_${category}`);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeSoulStability(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = stabilizeEmotionalTone(body, ctx, timing);
  b = reducePerformance(b, ctx, timing);
  b = applyImmersionPacing(b, ctx, category, timing);

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length >= 2 && Math.random() < 0.1) {
    const mem = maybeSoulMemoryFlow(ctx, category);
    if (mem && !b.includes(mem.slice(0, 12))) {
      b = lines(parts[0], mem);
    }
  } else if (parts.length <= 1 && Math.random() < 0.08) {
    const mem = maybeSoulMemoryFlow(ctx, category);
    if (mem && !b.includes(mem.slice(0, 12))) {
      b = b ? lines(b, mem) : mem;
    }
  }

  b = maybeComfortableSilence(ctx, b, timing);
  b = applyImmersionPacing(b, ctx, category, timing);

  const finalParts = b.split(/\n/).filter(Boolean);
  if (finalParts.length > 2) {
    b = finalParts.slice(0, 2).join("\n");
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeSoulStability,
  stabilizeEmotionalTone,
  reducePerformance,
  maybeComfortableSilence,
  maybeSoulMemoryFlow
};
