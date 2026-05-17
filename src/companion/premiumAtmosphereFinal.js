/**
 * Premium atmosphere finalization — restraint, calm confidence, quiet expensive feel.
 */

const { getResponses } = require("../i18n/getResponses");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { dedupeLines } = require("./humanVoiceGuard");
const { applyPremiumSpacing } = require("./premiumFeeling");
const { COHERENT_FLOW } = require("./soulCoherence");

const EXPLAIN_RE =
  /\b(let me explain|allow me to|the reason is|az oka|worth noting|fontos megérteni|it's important to understand|în esență|this means that|ami azt jelenti)\b/i;

const GUIDANCE_RE =
  /\b(próbáld|try this|javaslom|you should|következő lépés|one block today|egy blokk mára|stabilizáló|minimum victory|do this now|next step)\b/i;

const LABEL_STACK_RE = /^(focus:|fókusz:|body:|test:|energy:|veszély:|watch:)/i;

const FORMAT_NOISE_RE =
  /(\*\*|__|→\s*\/|^[•\-*]\s|^\d+[\.\)]\s)/m;

/**
 * @param {string} body
 */
function stripOverFormatting(body) {
  return String(body || "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/\n{3,}/g, "\n")
    .replace(/^[•\-*]\s+/gm, "")
    .replace(/^\d+[\.\)]\s+/gm, "")
    .replace(/\s+—\s+—/g, " — ")
    .trim();
}

/**
 * @param {string} body
 * @param {boolean} askedHelp
 */
function stripOverExplanation(body, askedHelp) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (!askedHelp && EXPLAIN_RE.test(line)) return false;
      if (line.length > 115 && /(because|mert|deci|therefore|tehát)/i.test(line)) return false;
      if (LABEL_STACK_RE.test(line) && line.length > 40) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {boolean} askedHelp
 */
function stripOverGuidance(body, askedHelp) {
  if (askedHelp) return body;
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => !GUIDANCE_RE.test(line) || line.length < 28)
    .join("\n")
    .trim();
}

/**
 * Short replies read cleaner as single block or one break.
 * @param {string} body
 */
function applyCalmReadability(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.map((line) =>
    line
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .trim()
  );

  if (parts.length <= 2 && parts.join(" ").length < 100) {
    return parts.join("\n");
  }

  if (parts.length > 2) {
    parts = parts.slice(0, 2);
  }

  return parts.join("\n\n").trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function ensureGroundedClarity(body, ctx, category) {
  if (category === "onboarding") return body;
  if (body.length >= 12) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.quietPresenceBeats || []),
    ...(r.emotionalGrounding || []),
    ...(r.calmListening || []),
    ...(r.quietConfidence || []).filter(
      (p) => !/túl sok terhelés egyszerre|too much load at once|prea multă încărcare deodată/i.test(p)
    ),
    ...(r.premiumQuiet || [])
  ].filter(Boolean);
  if (!pool.length) return body;
  return pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizePremiumAtmosphere(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(
    String(ctx.lastUserText || "")
  );

  let b = stripOverFormatting(body);
  if (FORMAT_NOISE_RE.test(b)) {
    b = stripOverFormatting(b);
  }
  b = stripOverExplanation(b, askedHelp);
  b = stripOverGuidance(b, askedHelp);
  b = dedupeLines(b);
  b = applyCalmReadability(b);
  b = applyPremiumSpacing(b);

  let maxLines = COHERENT_FLOW.has(category) ? 2 : 3;
  if (timing === "quiet" || timing === "presence") maxLines = 1;

  const parts = b.split(/\n/).filter((l) => l.trim());
  if (parts.length > maxLines) {
    b = parts.slice(0, maxLines).join("\n");
  }

  b = ensureGroundedClarity(b, ctx, category);
  return b.trim();
}

module.exports = {
  finalizePremiumAtmosphere,
  stripOverFormatting,
  stripOverExplanation,
  stripOverGuidance,
  applyCalmReadability
};
