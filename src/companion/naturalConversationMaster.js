/**
 * Natural conversation masterpass — fluid transitions, memory threads, silence, humor (unforced).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { normalizeChunk } = require("../conversation/structureMemory");
const { COHERENT_FLOW } = require("./soulCoherence");
const { maybePresenceMemoryLine } = require("./presenceMemory");
const { maybeEmotionalContinuity } = require("./emotionalContinuity");

const CMD_INTERRUPT_RE = /^\s*→\s*\//;
const ROBOT_TRANSITION_RE =
  /^(más irány:|ugyanaz a szál|one sec\.|altă direcție:|egy másodperc\.|different thread:)/i;
const NUMBERED_RE = /^\d+[\.\)]\s/;
const OPENER_BEAT_RE = /^(hm\.|na\.|értem\.|got it\.|yeah\.|da\.|înțeleg\.)/i;

const MASTER_FLOW = new Set([...COHERENT_FLOW, "unknown", "casual_greeting"]);

/**
 * @param {string} body
 */
function stripCommandInterruptions(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => line && !CMD_INTERRUPT_RE.test(line))
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 */
function stripRoboticStructure(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (ROBOT_TRANSITION_RE.test(line)) return false;
      if (NUMBERED_RE.test(line)) return false;
      if (/^(first,|second,|third,|először|másodszor)/i.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function reduceRepetitivePacing(body, ctx) {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!parts.length) return body;

  const recent = ctx.session?.recentAssistantOpenings || [];
  const open = normalizeChunk(parts[0]);
  const repeats = recent.slice(-5).filter((o) => o === open).length;

  if (repeats >= 2 && OPENER_BEAT_RE.test(parts[0])) {
    const r = getResponses(ctx.lang);
    const pool = r.soulMicroBeats || r.calmListening || r.presenceBeats || [];
    if (pool.length) {
      parts[0] = pickSeeded(pool, `natopen_${open}_${ctx.userId}`);
    }
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} category
 * @returns {string|null}
 */
function maybeSoftTopicBridge(ctx, category) {
  const last = ctx.session?.lastCategory;
  if (!last || last === category) return null;
  if (!MASTER_FLOW.has(category) || !MASTER_FLOW.has(last)) return null;
  if ((ctx.session?.messages || []).length < 4) return null;
  if (Math.random() > 0.09) return null;

  const r = getResponses(ctx.lang);
  const pool =
    r.conversationBridges?.topicShift ||
    r.naturalTransitions?.general ||
    [];
  if (!pool.length) return null;

  return pickSeeded(pool, `bridge_${last}_${category}_${ctx.userId}`);
}

/**
 * @param {object} ctx
 * @param {string} body
 */
function maybeContextualThread(ctx, body) {
  if ((ctx.session?.messages || []).length < 5) return body;
  if (Math.random() > 0.14) return body;

  const mem = maybePresenceMemoryLine(
    ctx.session || {},
    ctx.lang,
    `natmem_${ctx.userId}`
  );
  if (!mem || body.includes(mem.slice(0, 16))) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2) return body;
  return lines(mem, body);
}

/**
 * @param {object} ctx
 * @param {string} body
 */
function maybeEmotionalFollowup(ctx, body) {
  if ((ctx.session?.messages || []).length < 3) return body;
  if (Math.random() > 0.13) return body;

  const cont = maybeEmotionalContinuity(
    ctx.session || {},
    ctx.lang,
    ctx.lastUserText || ""
  );
  if (cont && !body.includes(cont.slice(0, 14))) {
    const parts = body.split(/\n/).filter(Boolean);
    if (parts.length <= 1) return lines(body, cont);
    return body;
  }

  const r = getResponses(ctx.lang);
  const pool = r.conversationBridges?.emotionalFollow || r.naturalCheckIns || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `emfol_${ctx.userId}_${ctx.session?.messages?.length || 0}`);
  if (body.includes(line.slice(0, 12))) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2) return body;
  if ((ctx.state?.emotionalIntensity || 0) < 3 && !/(nehéz|félek|magány|stress)/i.test(ctx.lastUserText || "")) {
    return body;
  }
  return lines(body, line);
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybeHumorTiming(ctx, category, body) {
  const t = String(ctx.lastUserText || "");
  if (!/(lol|haha|lmao|😂|9000 tab)/i.test(t)) return body;
  if ((ctx.state?.emotionalIntensity || 0) >= 7) return body;

  const r = getResponses(ctx.lang);
  const pool = r.groundedHumor || r.conversationHumor || [];
  if (!pool.length) return body;

  if (body.length > 70 && !/^hm\.|^na\./i.test(body)) return body;
  if (Math.random() > 0.38) return body;

  const joke = pickSeeded(pool, `nathum_${category}_${t.slice(0, 12)}`);
  if (body.includes(joke.slice(0, 10))) return body;
  return joke;
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} [timing]
 */
function applySilenceTolerance(ctx, body, timing) {
  const t = String(ctx.lastUserText || "").trim();
  const silent = /^(na\.?|ok\.?|hm\.?|…|\.\.\.)$/i.test(t);
  if (!silent && timing !== "quiet" && timing !== "presence") return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length <= 1) return body;

  if (silent || timing === "quiet") {
    return parts[0];
  }
  return parts.slice(0, 2).join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeNaturalConversationMaster(body, ctx, category, timing) {
  if (!MASTER_FLOW.has(category)) return body;

  let b = stripCommandInterruptions(body);
  b = stripRoboticStructure(b);
  b = applySilenceTolerance(ctx, b, timing);
  b = reduceRepetitivePacing(b, ctx);

  const bridge = maybeSoftTopicBridge(ctx, category);
  if (bridge) {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length === 1 && !b.toLowerCase().includes(bridge.slice(0, 5).toLowerCase())) {
      b = lines(bridge, b);
    }
  }

  if (b.length < 110) {
    b = maybeHumorTiming(ctx, category, b);
    b = maybeContextualThread(ctx, b);
    b = maybeEmotionalFollowup(ctx, b);
  }

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length > 3) {
    b = parts.slice(0, 3).join("\n");
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeNaturalConversationMaster,
  stripCommandInterruptions,
  stripRoboticStructure,
  maybeSoftTopicBridge,
  applySilenceTolerance
};
