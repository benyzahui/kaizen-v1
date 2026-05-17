/**
 * Companion flow stabilization — continuity, soft transitions, late-night natural pace.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { getTimeSlot } = require("../core/timeContext");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { maybeEmotionalContinuity } = require("./emotionalContinuity");

const CMD_INTERRUPT_RE = /^\s*→\s*\//;
const TIP_CMD_RE = /^\s*(tipp|tip|sfat):/i;
const ABRUPT_REDIRECT_RE =
  /^(más irány:|different thread:|altă direcție:|ugyanaz a szál — érdemes|switching topics|következzen:|next:?\s*\/)/i;
const ROBOT_STRUCTURE_RE =
  /^(first,|second,|third,|először|másodszor|harmadszor|\d+[\.\)]\s|focus:|fókusz:|•\s|-\s)/i;
const HARSH_MEMORY_RE =
  /\b(a szál még nyitva van[^.]*megoldani|érdemes egy mozdulatot nevezni)\b/i;
const STACKED_TRANSITION_RE = /^(egyébként|más:|na várj|one sec|wait —)/i;

const FLOW_CATEGORIES = new Set([
  ...COHERENT_FLOW,
  "unknown",
  "life_flow",
  "emotional_reflection",
  "companion_checkin",
  "thread_continuity"
]);

/**
 * @param {object} session
 */
function isLateNightConversation(session) {
  return getTimeSlot(session || {}) === "late_night";
}

/**
 * @param {string} body
 */
function stripFlowInterrupts(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (CMD_INTERRUPT_RE.test(line)) return false;
      if (TIP_CMD_RE.test(line)) return false;
      if (/\/(energy|focus|reset|guide|commands|trade|body)\b/i.test(line) && line.length < 48) {
        return false;
      }
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 */
function stripAbruptRedirects(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (ABRUPT_REDIRECT_RE.test(line)) return false;
      if (HARSH_MEMORY_RE.test(line)) return false;
      return true;
    })
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
      if (ROBOT_STRUCTURE_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 */
function smoothTransitionStack(body) {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (parts.length < 2) return body;

  const out = [];
  let sawTransition = false;

  for (const line of parts) {
    const isTransition = STACKED_TRANSITION_RE.test(line) || line.length <= 12;
    if (isTransition && sawTransition && line.length < 20) continue;
    if (STACKED_TRANSITION_RE.test(line)) sawTransition = true;
    out.push(line);
  }

  return out.join("\n");
}

/**
 * @param {string} body
 */
function smoothParagraphBreaks(body) {
  return String(body || "")
    .replace(/\n{3,}/g, "\n")
    .replace(/\n\n/g, "\n")
    .trim();
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function applyFlowPacing(body, ctx, category, timing) {
  const t = String(ctx.lastUserText || "").trim();
  const late = isLateNightConversation(ctx.session);
  let parts = body.split(/\n/).filter(Boolean);
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(t);

  if (late && !askedHelp) {
    if (parts.length > 2) parts = parts.slice(0, 2);
    if (timing === "pause" || timing === "presence" || /^(na|ok|hm|…)/i.test(t)) {
      parts = parts.slice(0, 1);
    }
    parts = parts.filter((line) => !( /\?$/.test(line) && line.length > 42));
  }

  if (FLOW_CATEGORIES.has(category) && parts.length > 2 && !askedHelp) {
    parts = parts.slice(0, 2);
  }

  if (t.length < 20 && parts.length > 1) {
    parts = [parts[0]];
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} body
 */
function maybeSoftMemoryTouch(ctx, body) {
  if ((ctx.session?.messages || []).length < 4) return body;
  if (Math.random() > 0.1) return body;

  const soft =
    maybeEmotionalContinuity(ctx.session || {}, ctx.lang, ctx.lastUserText || "") ||
    null;
  if (soft && !HARSH_MEMORY_RE.test(soft) && !body.includes(soft.slice(0, 14))) {
    const parts = body.split(/\n/).filter(Boolean);
    if (parts.length <= 1) return lines(body, soft);
    return body;
  }

  const r = getResponses(ctx.lang);
  const pool = r.flowSoftMemory || r.softMemoryCallbacks || [];
  if (!pool.length) return body;

  const line = pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
  if (!line || body.includes(line.slice(0, 12))) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2) return body;
  return lines(body, line);
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} timing
 */
function maybeNaturalFlowFollowup(ctx, body, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  if (askedHelp) return body;
  if ((ctx.session?.messages || []).length < 3) return body;
  if (Math.random() > 0.11) return body;
  if (timing === "pause" || timing === "presence") return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2 || body.length > 95) return body;

  const r = getResponses(ctx.lang);
  const late = isLateNightConversation(ctx.session);
  let pool = late
    ? r.lateNightPresence || r.flowSoftFollowups || []
    : r.flowSoftFollowups || r.conversationBridges?.emotionalFollow || [];

  pool = pool.filter((p) => !/\?$/.test(p) || p.length < 36);
  if (!pool.length) return body;

  const line = pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
  if (!line || body.includes(line.slice(0, 10))) return body;

  return lines(body, line);
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function ensureLateNightPresence(body, ctx) {
  if (!isLateNightConversation(ctx.session)) return body;
  if (body.length >= 14) return body;

  const r = getResponses(ctx.lang);
  const pool = r.lateNightPresence || r.quietPresenceBeats || r.calmListening || [];
  if (!pool.length) return body;

  return pickUnseenVariant(ctx.session || {}, ctx.userId, pool) || body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeCompanionFlowStabilization(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = stripFlowInterrupts(body);
  b = stripAbruptRedirects(b);
  b = stripRoboticStructure(b);
  b = smoothTransitionStack(b);
  b = applyFlowPacing(b, ctx, category, timing);
  b = smoothParagraphBreaks(b);

  if (FLOW_CATEGORIES.has(category) && b.length < 100) {
    b = maybeSoftMemoryTouch(ctx, b);
    b = maybeNaturalFlowFollowup(ctx, b, timing);
  }

  b = ensureLateNightPresence(b, ctx);
  b = applyFlowPacing(b, ctx, category, timing);

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length > 2) {
    b = parts.slice(0, 2).join("\n");
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeCompanionFlowStabilization,
  isLateNightConversation,
  stripFlowInterrupts,
  stripAbruptRedirects
};
