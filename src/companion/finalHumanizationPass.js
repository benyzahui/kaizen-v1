/**
 * Final humanization — strip last AI-assistant traces; alive, stable, believable.
 */

const { getResponses } = require("../i18n/getResponses");
const { dedupeLines, stripAIPoetic } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { snippetKey, pickUnseenVariant } = require("../conversation/responseVariation");
const { groundedPoolForUser } = require("./realEmotionalPresence");

const ASSISTANT_RE =
  /\b(how can i help|i'?m here to help|let me know if|feel free to|happy to help|as an AI|language model|assistant vagyok|ha bármiben segíthetek|i can help you|is there anything else)\b/i;

const OPTIMIZED_EMPATHY_RE =
  /\b(i understand that|i hear what you'?re saying|that must be (really )?hard|your feelings are valid|teljes mértékben|absolutely understandable|makes perfect sense|it'?s natural to feel|ez teljesen érthető|természetes hogy így érzed|i want you to know|sounds like you'?re going through)\b/i;

const REFRAME_STACK_RE =
  /\b(érződik hogy|sounds like you|se simte că|that sounds like a lot|feels like you have been|úgy tűnik hogy)\b/i;

const FAKE_DEPTH_RE =
  /\b(the truth is|a lényeg az|deep down|at a deeper level|mélyen|inner work|shadow work|growth mindset|fontos megérteni|key insight|worth noting|let me explain|identity is forged|chaos grows)\b/i;

const ROBOT_TRANSITION_RE =
  /^(egyébként|más:|na várj|one sec|wait —|different thread|ugyanaz a szál|más irány)/i;

const OVER_GUIDE_RE =
  /\b(következő lépés|you should|próbáld meg|try this|javaslom|one block today|egy blokk mára|stabilizáló|protocol|framework|minimum victory)\b/i;

const OVERUSED_PHRASE_RE =
  /túl sok terhelés egyszerre|ma nem kell mindent rendbe|előbb a tested|ez már túl sok terhelés|ez inkább túlterhelésnek|most nem több gondolat hiányzik/i;

const MECHANICAL_OPENER_RE = /^(jó\.|good\.|rendben\.|oké\.|sure\.|da\.)$/i;

/**
 * @param {object} ctx
 * @param {string} line
 */
function lineRecentlyUsed(ctx, line) {
  return new Set(ctx.session?.recentCoachSnippets || []).has(snippetKey(line));
}

/**
 * @param {string} body
 */
function stripAssistantTraces(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (ASSISTANT_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function stripOptimizedEmpathy(body, ctx) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  let reframeKept = 0;

  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (OPTIMIZED_EMPATHY_RE.test(line)) return false;
      if (!askedHelp && REFRAME_STACK_RE.test(line)) {
        reframeKept += 1;
        return reframeKept <= 1 && line.length < 55;
      }
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function stripFakeDepthAndGuidance(body, ctx) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");

  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (FAKE_DEPTH_RE.test(line)) return false;
      if (!askedHelp && OVER_GUIDE_RE.test(line) && line.length > 32) return false;
      if (ROBOT_TRANSITION_RE.test(line) && line.length < 28) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 */
function humanizeStructure(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (parts.length === 2 && MECHANICAL_OPENER_RE.test(parts[0]) && parts[1].length > 22) {
    parts = [parts[1]];
  }

  if (parts.length >= 2) {
    const a = parts[0].toLowerCase();
    const b = parts[1].toLowerCase();
    if (a === b || (a.length > 12 && b.includes(a.slice(0, 14)))) {
      parts = [parts[1]];
    }
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function rotateRepetitivePhrasing(body, ctx) {
  const pool = groundedPoolForUser(ctx, ctx.lastUserText || "");
  if (!pool.length) return body;

  const parts = body.split(/\n/).filter(Boolean);
  const next = parts.map((line) => {
    const repetitive =
      OVERUSED_PHRASE_RE.test(line) || lineRecentlyUsed(ctx, line);
    if (!repetitive) return line;
    return pickUnseenVariant(ctx.session || {}, ctx.userId, pool) || line;
  });

  return next.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function applyHumanPacing(body, ctx, category, timing) {
  let parts = body.split(/\n/).filter(Boolean);
  const t = String(ctx.lastUserText || "").trim();

  if (timing === "pause" || timing === "presence" || t.length < 20) {
    if (parts.length > 1) parts = [parts[0]];
  }

  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    parts = parts.slice(0, 2);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function ensureAliveMinimum(body, ctx) {
  if (body.length >= 8) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.humanAliveBeats || []),
    ...(r.subtlePresenceBeats || []),
    ...(r.calmListening || [])
  ].filter((p) => p && p.length < 36);

  if (!pool.length) return body;
  return pickUnseenVariant(ctx.session || {}, ctx.userId, pool) || body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeFinalHumanization(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = stripAIPoetic(body);
  b = stripAssistantTraces(b);
  b = stripOptimizedEmpathy(b, ctx);
  b = stripFakeDepthAndGuidance(b, ctx);
  b = humanizeStructure(b);
  b = rotateRepetitivePhrasing(b, ctx);
  b = applyHumanPacing(b, ctx, category, timing);
  b = ensureAliveMinimum(b, ctx);
  b = dedupeLines(b);

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length > 2) {
    b = parts.slice(0, 2).join("\n");
  }

  return b.trim();
}

module.exports = {
  finalizeFinalHumanization,
  stripAssistantTraces,
  stripOptimizedEmpathy,
  humanizeStructure,
  rotateRepetitivePhrasing
};
