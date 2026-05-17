/**
 * Human return pass — conversational gravity, reactions, mirroring, comfort (236–241).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");

const ASSISTANT_RE =
  /\b(how can i help|i'?m here to help|let me know if|feel free to|happy to help|ha bármiben segíthetek|szólj ha kell|nyugodtan írj|as an AI|language model|assistant vagyok|i can help you)\b/i;

const INSTRUCTIONAL_RE =
  /\b(you should|you need to|try to|make sure to|remember to|következő lépés|próbáld meg|fontos hogy|it is important to)\b/i;

const OPTIMIZE_RE =
  /\b(optimize|optimization|level up|maximize|unlock potential|10x|productivity hack|hatékonyság növelése)\b/i;

const GENERIC_SUPPORT_RE =
  /\b(i understand|i hear you and|validating|you'?re not alone|everything will be ok|minden rendben lesz|stay strong)\b/i;

const SMART_POSTURE_RE =
  /\b(remarkable|fascinating|brilliant|nagyon fontos|key insight|strategically|in my opinion)\b/i;

const REACTION_BEAT_RE = /^(hm\.|na\.|értem\.|jó\.|yeah\.|got it\.|da\.)/i;

const MICRO_BEAT_RE =
  /^(hm\.|na\.|értem\.|jó\.|az mondjuk sok|ez most őszintébb)/i;

/**
 * @param {string} body
 */
function stripAssistantFeel(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (ASSISTANT_RE.test(line)) return false;
      if (INSTRUCTIONAL_RE.test(line) && line.length > 45) return false;
      if (OPTIMIZE_RE.test(line)) return false;
      if (GENERIC_SUPPORT_RE.test(line)) return false;
      if (SMART_POSTURE_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} category
 */
function mirrorEmotionalTempo(ctx, body, category) {
  const t = String(ctx.lastUserText || "").trim();
  const state = ctx.state || {};
  let parts = body.split(/\n/).filter(Boolean);

  const userShort = t.length < 18;
  const userIntense = (state.emotionalIntensity || 0) >= 6 || t.length > 120;
  const userCalm = (state.emotionalIntensity || 0) <= 3 && t.length < 60;

  if (userShort) {
    return parts.slice(0, 1).join("\n") || body;
  }

  if (userCalm && parts.length > 2) {
    return parts.slice(0, 2).join("\n");
  }

  if (userIntense && !/(help|segít|mit csináljak)/i.test(t)) {
    parts = parts.filter((line) => !INSTRUCTIONAL_RE.test(line));
    if (parts.length > 2) parts = parts.slice(0, 2);
    return parts.join("\n");
  }

  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    return parts.slice(0, 2).join("\n");
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} [timing]
 */
function applyEmotionalComfort(ctx, body, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  if (askedHelp) return body;

  const comfort =
    timing === "pause" ||
    timing === "presence" ||
    timing === "soften" ||
    timing === "ground" ||
    /(magány|lonely|félek|nehéz|kimerült|exhausted)/i.test(ctx.lastUserText || "");

  if (!comfort) return body;

  let parts = String(body || "")
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (INSTRUCTIONAL_RE.test(t)) return false;
      if (/(discipline|fegyelem|challenge|no excuses)/i.test(t)) return false;
      return true;
    });

  if (!parts.length) {
    const r = getResponses(ctx.lang);
    const pool = r.presenceOnlyBeats || r.humanReactions || r.calmListening || [];
    if (pool.length) {
      return pickSeeded(pool, `comfort_${ctx.userId}`);
    }
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} body
 */
function maybeHumanReaction(ctx, body) {
  if (Math.random() > 0.16) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length > 2) return body;
  if (MICRO_BEAT_RE.test(parts[0] || "") || REACTION_BEAT_RE.test(parts[0] || "")) {
    return body;
  }

  const r = getResponses(ctx.lang);
  const pool = r.humanReactions || r.microHumanityAlive || r.soulMicroBeats || [];
  if (!pool.length) return body;

  const beat = pickSeeded(pool, `hreact_${ctx.userId}_${ctx.session?.messages?.length || 0}`);
  if (body.includes(beat)) return body;

  if (parts.length === 0 || parts.length === 1) {
    return lines(beat, body);
  }
  return body;
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function maybeQuietIntelligenceLine(ctx, category, timing) {
  if (Math.random() > 0.09) return null;
  if (timing === "pause" || timing === "presence") return null;

  const r = getResponses(ctx.lang);
  const pool = r.quietIntelligence || r.microConnections || r.presenceWowRhythm || [];
  if (!pool.length) return null;

  return pickSeeded(pool, `quieti_${category}_${ctx.userId}`);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeHumanReturnPass(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = stripAssistantFeel(body);
  b = applyEmotionalComfort(ctx, b, timing);
  b = mirrorEmotionalTempo(ctx, b, category);

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length <= 2 && Math.random() < 0.12) {
    const quiet = maybeQuietIntelligenceLine(ctx, category, timing);
    if (quiet && !b.includes(quiet.slice(0, 16))) {
      if (parts.length === 0) b = quiet;
      else if (parts.length === 1 && !SMART_POSTURE_RE.test(parts[0])) {
        b = lines(parts[0], quiet);
      }
    }
  }

  b = maybeHumanReaction(ctx, b);

  const finalParts = b.split(/\n/).filter(Boolean);
  if (finalParts.length > 2) {
    b = finalParts.slice(0, 2).join("\n");
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeHumanReturnPass,
  stripAssistantFeel,
  mirrorEmotionalTempo,
  maybeHumanReaction,
  applyEmotionalComfort
};
