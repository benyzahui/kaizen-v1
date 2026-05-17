/**
 * Premium atmosphere lock — calm confidence, restraint, clarity (final polish).
 */

const { getResponses } = require("../i18n/getResponses");
const { dedupeLines } = require("./humanVoiceGuard");
const { applyPremiumSpacing } = require("./premiumFeeling");
const { COHERENT_FLOW } = require("./soulCoherence");
const { pickUnseenVariant } = require("../conversation/responseVariation");

const MOTIVATIONAL_RE =
  /\b(crush it|you got this|beast mode|10x|unlock|manifest|hustle|no excuses|győzd le|go hard|grind|warrior|elite zone|limitless|hajrá|motivációs guru)\b/i;

const SELF_HELP_RE =
  /\b(optimize your|level up|productivity hack|unlock your potential|be your best self|high performance mindset|maximize output|grind set|alpha mindset|sigma|self[- ]?help|healing journey|hero'?s journey)\b/i;

const INTERNET_HYPE_RE =
  /\b(absolutely amazing|life-changing|game[- ]?changer|transform your life|change your life|mindset shift|manifest abundance)\b/i;

const OVER_POLISH_RE =
  /\b(remarkable|fascinating|incredibly important|it's worth noting|fontos megérteni|în concluzie|összefoglalva|allow me to)\b/i;

const LABEL_NOISE_RE = /^(focus:|fókusz:|body:|test:|energy:|watch:|veszély:)/i;

const FORMAT_NOISE_RE = /(\*\*|__|→\s*\/|^[•\-*]\s|^\d+[\.\)]\s)/m;

/**
 * @param {string} body
 */
function stripFormattingNoise(body) {
  return String(body || "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/!{2,}/g, ".")
    .replace(/\?{2,}/g, "?")
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
function stripMotivationalTone(body, askedHelp) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (!askedHelp && MOTIVATIONAL_RE.test(line)) return false;
      if (INTERNET_HYPE_RE.test(line)) return false;
      if (OVER_POLISH_RE.test(line)) return false;
      if (SELF_HELP_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 */
function applyPremiumReadability(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) =>
      l
        .trim()
        .replace(/\s{2,}/g, " ")
        .replace(/\s+([,.!?])/g, "$1")
    )
    .filter(Boolean);

  parts = parts.map((line) => {
    if (line.length > 110) return `${line.slice(0, 107).trim()}…`;
    return line;
  });

  return parts.join("\n").trim();
}

/**
 * @param {string} body
 * @param {string} category
 * @param {string} timing
 */
function applyIntentionalPacing(body, category, timing) {
  let parts = body.split(/\n/).filter(Boolean);
  const maxDefault = COHERENT_FLOW.has(category) ? 2 : 2;

  if (timing === "pause" || timing === "presence" || timing === "quiet") {
    if (parts.length > 1) parts = [parts[0]];
  } else if (parts.length > maxDefault) {
    parts = parts.slice(0, maxDefault);
  }

  const questions = parts.filter((l) => /\?/.test(l));
  if (questions.length > 1) {
    const keep = questions[0];
    parts = parts.filter((l) => !/\?/.test(l) || l === keep);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 */
function stripLabelNoise(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => line && !LABEL_NOISE_RE.test(line))
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function ensureCalmConfidence(body, ctx, category) {
  if (category === "onboarding") return body;
  if (body.length >= 12) return body;

  const r = getResponses(ctx.lang);
  const pool = [
    ...(r.premiumAtmosphereLock || []),
    ...(r.structuredCalm || []),
    ...(r.eliteAtmosphereCalm || []),
    ...(r.quietPresenceBeats || [])
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
function finalizePremiumAtmosphereLock(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(
    String(ctx.lastUserText || "")
  );

  let b = stripFormattingNoise(body);
  if (FORMAT_NOISE_RE.test(b)) {
    b = stripFormattingNoise(b);
  }
  b = stripLabelNoise(b);
  b = stripMotivationalTone(b, askedHelp);
  b = dedupeLines(b);
  b = applyPremiumReadability(b);
  b = applyIntentionalPacing(b, category, timing);
  b = applyPremiumSpacing(b);
  b = ensureCalmConfidence(b, ctx, category);

  return dedupeLines(b).trim();
}

module.exports = {
  finalizePremiumAtmosphereLock,
  stripFormattingNoise,
  stripMotivationalTone,
  applyPremiumReadability
};
