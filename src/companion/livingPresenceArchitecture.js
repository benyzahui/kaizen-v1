/**
 * Living presence architecture — emotional field, attention, breath, continuity (253–258).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { maybeEmotionalContinuity } = require("./emotionalContinuity");
const { maybeRelationshipContinuity } = require("./relationshipPresence");
const { getTimeSlot } = require("../core/timeContext");

const PSEUDO_DEPTH_RE =
  /\b(chaos grows|identity is forged|nervous system remembers|elite zone|kovácsolódik|hero'?s journey|healing journey|fontos megérteni|key insight|the truth is|a lényeg az|deep down|shadow work|growth mindset|manifest|10x)\b/i;

const COACH_INTERNET_RE =
  /\b(crush it|you got this|no excuses|unlock potential|beast mode|hustle culture|sigma|alpha mindset|productivity hack)\b/i;

const CLINICAL_RE =
  /\b(diagnos|symptom|disorder|klinik|terápiás protokoll|clinical|validate your feelings)\b/i;

const UPBEAT_IN_HEAVY_RE =
  /\b(crush|nagyszerű|remekül|let's go|gyerünk|amazing)\b/i;

/**
 * @param {object} ctx
 * @returns {'calm_ground'|'soft_attention'|'quiet_presence'|'warm_steady'}
 */
function resolveEmotionalField(ctx) {
  const state = ctx.state || {};
  const pm = ctx.session?.presenceMemory || {};
  const intensity = state.emotionalIntensity || 0;
  const scatter = state.scatter || 0;
  const energy = state.energyLevel ?? 5;

  if (intensity >= 6 || pm.emotionalState === "overloaded" || pm.emotionalState === "scattered") {
    return "calm_ground";
  }
  if (energy <= 3 || pm.emotionalState === "tired") {
    return "soft_attention";
  }
  if (intensity <= 3 && scatter <= 3 && pm.emotionalState === "grounded") {
    return "warm_steady";
  }
  if (getTimeSlot(ctx.session || {}) === "late_night") {
    return "quiet_presence";
  }
  return "soft_attention";
}

/**
 * @param {string} body
 * @param {string} field
 */
function applyEmotionalFieldConsistency(body, field) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (PSEUDO_DEPTH_RE.test(line) || COACH_INTERNET_RE.test(line)) return false;
      if (CLINICAL_RE.test(line)) return false;
      if ((field === "calm_ground" || field === "quiet_presence") && UPBEAT_IN_HEAVY_RE.test(line)) {
        return false;
      }
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {object} ctx
 * @param {'en'|'hu'|'ro'} lang
 * @returns {string|null}
 */
function pickAttentionLine(ctx, lang) {
  const state = ctx.state || {};
  const coach = state.coachState || "";
  const r = getResponses(lang);
  const att = r.presenceAttention || {};
  let key = null;

  if ((state.energyLevel ?? 5) <= 3 || /(kimerült|exhausted|fáradt)/i.test(ctx.lastUserText || "")) {
    key = "fatigue";
  } else if ((state.scatter || 0) >= 6 || /(tab|szétszórt|overwhelm|túl sok)/i.test(ctx.lastUserText || "")) {
    key = "overstimulation";
  } else if (
    coach === "procrastinating" ||
    coach === "start_paralysis" ||
    /(halaszt|procrastinat|nem csinálom|keep putting)/i.test(ctx.lastUserText || "")
  ) {
    key = "avoidance";
  } else if ((state.emotionalIntensity || 0) >= 6) {
    key = "pressure";
  } else {
    const pm = ctx.session?.presenceMemory || {};
    if (
      pm.previousEmotionalState === "overloaded" &&
      (pm.emotionalState === "grounded" || pm.emotionalState === "stable")
    ) {
      key = "calmer";
    }
  }

  if (!key || !att[key]?.length) return null;
  return pickSeeded(att[key], `patt_${key}_${ctx.userId}_${ctx.session?.messages?.length || 0}`);
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} field
 */
function maybeHumanAttention(ctx, body, field) {
  if (Math.random() > 0.14) return body;
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  if (askedHelp) return body;

  const line = pickAttentionLine(ctx, ctx.lang);
  if (!line || body.includes(line.slice(0, 14))) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2 && field !== "calm_ground") return body;
  if (parts.length === 0) return line;
  if (parts.length === 1 && parts[0].length < 55) return lines(parts[0], line);
  return body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function applyConversationalBreathing(body, ctx, timing) {
  let parts = body.split(/\n/).filter(Boolean);
  const t = String(ctx.lastUserText || "").trim();
  const silent = /^(na|ok|hm|…|\.\.\.)$/i.test(t);

  const dense = parts.some((l) => l.length > 85) || parts.length > 2;
  if (dense && !/(help|segít|mit csináljak)/i.test(t)) {
    parts = parts.slice(0, 2);
  }

  if (silent || timing === "pause" || timing === "presence") {
    if (parts.length > 1) parts = [parts[0]];
  }

  if (Math.random() < 0.1 && parts.length === 1 && parts[0].length > 50) {
    const r = getResponses(ctx.lang);
    const pool = (r.presenceQuietRealism || r.quietIntelligence || []).filter((p) => p.length < 55);
    if (pool.length) {
      const short = pickSeeded(pool, `breath_${ctx.userId}`);
      if (!body.includes(short.slice(0, 12))) {
        return short;
      }
    }
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybeRelationalContinuity(ctx, category, body) {
  if ((ctx.session?.messages || []).length < 5) return body;
  if (Math.random() > 0.1) return body;

  const rel =
    maybeRelationshipContinuity(ctx.session || {}, ctx.lang, category) ||
    maybeEmotionalContinuity(ctx.session || {}, ctx.lang, ctx.lastUserText || "");

  if (!rel || body.includes(rel.slice(0, 14))) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.presenceRelationalContinuity || []),
    ...(r.soulMemoryFlow || []),
    ...(r.flowSoftMemory || [])
  ];
  const line =
    rel ||
    (pool.length
      ? pickUnseenVariant(ctx.session || {}, ctx.userId, pool)
      : null);

  if (!line) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2) return body;
  return lines(body, line);
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} field
 */
function maybePresenceMoment(ctx, body, field) {
  if (Math.random() > 0.12) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length > 2 || (parts[0] || "").length > 75) return body;

  const r = getResponses(ctx.lang);
  let pool = r.humanPresenceMoments || r.presenceOnlyBeats || [];
  if (field === "quiet_presence") {
    pool = pool.filter((p) => p.length < 42);
  }
  if (!pool.length) return body;

  const moment = pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
  if (!moment || body.includes(moment.slice(0, 10))) return body;

  if (parts.length === 0) return moment;
  if (parts.length === 1 && field !== "calm_ground") return lines(moment, parts[0]);
  return body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeLivingPresenceArchitecture(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const field = resolveEmotionalField(ctx);
  let b = applyEmotionalFieldConsistency(body, field);
  b = applyConversationalBreathing(b, ctx, timing);
  b = maybeHumanAttention(ctx, b, field);
  b = maybeRelationalContinuity(ctx, category, b);
  b = maybePresenceMoment(ctx, b, field);

  const parts = b.split(/\n/).filter(Boolean);
  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    b = parts.slice(0, 2).join("\n");
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeLivingPresenceArchitecture,
  resolveEmotionalField,
  pickAttentionLine,
  applyEmotionalFieldConsistency
};
