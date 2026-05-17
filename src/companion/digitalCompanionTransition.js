/**
 * Digital companion transition — presence before function, rhythm, mirroring (261–265).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { resolvePresenceTiming } = require("./presenceEvolution");
const { pickUnseenVariant } = require("../conversation/responseVariation");

const FUNCTION_RE =
  /\b(→\s*\/|\/focus|\/reset|\/energy|\/trade|\/plan|protocol|framework|optimization|productivity hack|következő lépés|one block today)\b/i;

const SYSTEM_NUDGE_RE =
  /\b(focus lane|fókusz sáv|use \/|használd a \/|try \/|próbáld a \/)\b/i;

const PUSH_WHEN_SOFT_RE =
  /\b(no excuses|nincs kifogás|discipline now|fegyelem most|prove yourself)\b/i;

const MICRO_BEAT_RE = /^(hm\.|na\.|értem\.|got it\.|yeah\.|da\.)/i;

/**
 * @param {string} body
 * @param {object} ctx
 */
function presenceBeforeFunction(body, ctx) {
  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(
    ctx.lastUserText || ""
  );

  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (!askedHelp && FUNCTION_RE.test(line)) return false;
      if (!askedHelp && SYSTEM_NUDGE_RE.test(line)) return false;
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
function applyRhythmIntelligence(body, ctx, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  let parts = body.split(/\n/).filter(Boolean);

  switch (timing) {
    case "pause":
    case "presence":
    case "quiet":
      parts = parts.filter((l) => !PUSH_WHEN_SOFT_RE.test(l) && !FUNCTION_RE.test(l));
      if (parts.length > 1) parts = [parts[0]];
      break;
    case "soften":
    case "ground":
    case "simplify":
      parts = parts.filter((l) => !PUSH_WHEN_SOFT_RE.test(l));
      if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
      break;
    case "challenge":
      if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
      break;
    default:
      if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function applyHumanRealism(body, ctx, timing) {
  const t = String(ctx.lastUserText || "").trim();
  const spacious =
    timing === "pause" ||
    timing === "presence" ||
    timing === "quiet" ||
    /^(na|ok|hm|…|\.\.\.)$/i.test(t);

  if (!spacious && Math.random() > 0.14) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length > 2 || (parts[0] && parts[0].length > 72)) return body;
  if (MICRO_BEAT_RE.test(parts[0] || "")) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.companionMicroBeats || []),
    ...(r.humanPresenceMoments || []),
    ...(r.subtlePresenceBeats || [])
  ].filter((p) => p.length < 28);

  if (!pool.length) return body;

  const beat = pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
  if (!beat || body.includes(beat)) return body;

  if (parts.length === 0) return beat;
  if (parts.length === 1 && spacious) return lines(beat, parts[0]);
  if (parts.length === 1 && parts[0].length > 40 && Math.random() < 0.5) {
    return lines(beat, parts[0]);
  }
  return body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function mirrorEmotionalTempo(body, ctx, category) {
  const t = String(ctx.lastUserText || "").trim();
  const state = ctx.state || {};
  let parts = body.split(/\n/).filter(Boolean);

  if (t.length < 18 && parts.length > 1) {
    return parts[0];
  }

  if ((state.emotionalIntensity || 0) >= 6 && parts.length > 2) {
    parts = parts.slice(0, 2);
  }

  if ((state.energyLevel ?? 5) <= 3) {
    parts = parts.filter((l) => !PUSH_WHEN_SOFT_RE.test(l));
    if (parts.length > 1 && !/(help|segít)/i.test(t)) parts = parts.slice(0, 1);
  }

  if (/(lol|haha|9000 tab)/i.test(t) && parts.length > 1) {
    parts = parts.slice(0, 1);
  }

  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    parts = parts.slice(0, 2);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 */
function applyQuietPremium(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) =>
      l
        .trim()
        .replace(/\s{2,}/g, " ")
        .replace(/!{2,}/g, ".")
    )
    .filter(Boolean);

  parts = parts.map((line) => (line.length > 105 ? `${line.slice(0, 102).trim()}…` : line));

  if (parts.length > 2) parts = parts.slice(0, 2);
  return parts.join("\n").trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function ensureSafeReturnFeel(body, ctx) {
  if (body.length >= 10) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.safeReturnBeats || []),
    ...(r.quietPresenceBeats || []),
    ...(r.presenceOnlyBeats || [])
  ].filter(Boolean);

  if (!pool.length) return body;
  return pickUnseenVariant(ctx.session || {}, ctx.userId, pool) || body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeDigitalCompanionTransition(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const rhythmTiming = timing || resolvePresenceTiming(ctx, category);

  let b = presenceBeforeFunction(body, ctx);
  b = applyRhythmIntelligence(b, ctx, rhythmTiming);
  b = mirrorEmotionalTempo(b, ctx, category);
  b = applyHumanRealism(b, ctx, rhythmTiming);
  b = applyQuietPremium(b);
  b = ensureSafeReturnFeel(b, ctx);

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeDigitalCompanionTransition,
  presenceBeforeFunction,
  applyRhythmIntelligence,
  mirrorEmotionalTempo,
  ensureSafeReturnFeel
};
