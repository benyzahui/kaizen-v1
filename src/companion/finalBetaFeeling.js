/**
 * Final beta feeling — return state, presence-first, humanization lock (phases 206–209).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { dedupeLines, stripAIPoetic } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { applyQuietPremiumEnergy, applyPremiumSpacing } = require("./premiumFeeling");
const { stripHypeLines, softenRepeatedOpeners } = require("./atmospherePresence");

const ROBOT_TRANSITION_RE =
  /^(más irány:|ugyanaz a szál|one sec\.|altă direcție:|egy másodperc\.|different thread:)/i;

const OVER_GUIDANCE_RE =
  /\b(próbáld|try this|javaslom|you should|következő lépés|one block today|egy blokk mára|minimum victory|stabilizáló lépés|do this now)\b/i;

const INTERNET_SELF_HELP_RE =
  /\b(motivációs|self[- ]?help|healing journey|unlock your|manifest|10x|beast mode|crush it|no excuses|hero'?s journey|grind set|sigma)\b/i;

const EMOTIONAL_REFRAME_RE =
  /(érződik hogy|sounds like you|se simte că|ez most soknak|that sounds like a lot|feels like you)/i;

const OVER_POLISHED_RE =
  /\b(remarkable|fascinating|absolutely|incredibly|nagyon fontos hogy|it's worth noting|lényegében|in conclusion|összefoglalva)\b/i;

/**
 * One calm line beats five smart ones.
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function presenceBeforeInsight(body, ctx, category, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(
    String(ctx.lastUserText || "")
  );

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (OVER_GUIDANCE_RE.test(line) && !askedHelp) return false;
    if (OVER_POLISHED_RE.test(line)) return false;
    if (line.length > 130) return false;
    return true;
  });

  let max = COHERENT_FLOW.has(category) ? 2 : 3;
  if (timing === "quiet" || timing === "presence") max = 1;
  if (timing === "soften" || timing === "simplify") max = 2;

  if (parts.length > max) {
    const statements = parts.filter((l) => !/\?$/.test(l));
    const questions = parts.filter((l) => /\?$/.test(l));
    if (statements.length >= max) {
      parts = statements.slice(0, max);
    } else {
      parts = [...statements, ...questions].slice(0, max);
    }
  }

  if (parts.length === 1) return parts[0];
  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} seed
 */
function stripHumanizationTraces(body, lang, seed) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (!line) return false;
    if (ROBOT_TRANSITION_RE.test(line)) return false;
    if (INTERNET_SELF_HELP_RE.test(line)) return false;
    if (OVER_GUIDANCE_RE.test(line) && line.length > 55) return false;
    return true;
  });

  const reframeSeen = new Set();
  parts = parts.filter((line) => {
    if (!EMOTIONAL_REFRAME_RE.test(line)) return true;
    const key = line.slice(0, 28).toLowerCase();
    if (reframeSeen.has(key)) return false;
    reframeSeen.add(key);
    return true;
  });

  let b = parts.join("\n");
  b = stripAIPoetic(b, lang, seed);
  b = dedupeLines(b);
  return applyPremiumSpacing(b);
}

/**
 * @param {string} body
 * @param {string} category
 */
function applyPremiumAtmosphere(body, category) {
  let b = applyQuietPremiumEnergy(body, category);
  b = stripHypeLines(b);
  b = softenRepeatedOpeners(b);
  return b.replace(/\s{2,}/g, " ").trim();
}

/**
 * Leave user calmer — grounded exit, not upward coach energy.
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function ensureReturnState(body, ctx, category) {
  if (category === "onboarding") return body;

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!parts.length) return body;

  const t = String(ctx.lastUserText || "");
  const emotional =
    (ctx.state?.emotionalIntensity || 0) >= 4 ||
    /(nehéz|stress|félek|magányos|kimerült|overwhelm|túl sok|exhausted|lonely)/i.test(t);

  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (/\?$/.test(last) && last.length > 50 && !/(mit|what|care|how)/i.test(t)) {
      parts = parts.slice(0, -1);
    }
    if (OVER_GUIDANCE_RE.test(last)) {
      parts = parts.slice(0, -1);
    }
  }

  if (!emotional || parts.length >= 2) {
    return parts.join("\n");
  }

  const r = getResponses(ctx.lang);
  const pool = r.returnStateClosings || r.quietConfidence || [];
  if (!pool.length) return parts.join("\n");

  const last = parts[parts.length - 1] || "";
  const groundedEnd =
    /(elég|enough|lassan|slow|pihen|rest|tested|body|ground|nyugod)/i.test(last);
  if (groundedEnd) return parts.join("\n");

  if (Math.random() > 0.16) return parts.join("\n");

  const close = pickSeeded(pool, `return_${category}_${ctx.userId}`);
  if (body.includes(close.slice(0, 12))) return parts.join("\n");
  return parts.length ? `${parts.join("\n")}\n${close}` : close;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 * @param {{ texture?: string }} [alive]
 */
function finalizeFinalBetaFeeling(body, ctx, category, timing, alive) {
  if (category === "onboarding") return body;

  const seed = `final_${category}_${ctx.userId}_${ctx.session?.messages?.length || 0}`;

  let b = stripHumanizationTraces(body, ctx.lang, seed);
  b = applyPremiumAtmosphere(b, category);
  b = presenceBeforeInsight(b, ctx, category, timing);

  if (alive?.texture === "quiet" || alive?.texture === "presence") {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length > 1) b = parts[0];
  }

  b = ensureReturnState(b, ctx, category);
  return b.trim();
}

module.exports = {
  finalizeFinalBetaFeeling,
  presenceBeforeInsight,
  stripHumanizationTraces,
  ensureReturnState,
  applyPremiumAtmosphere
};
