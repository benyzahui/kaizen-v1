/**
 * Premium feeling — quiet confidence, grounded warmth, clean flow (phases 162–167).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

const FLOW_CATEGORIES = new Set([
  "natural_conversation",
  "life_flow",
  "relational_flow",
  "light_conversation",
  "emotional_reflection",
  "companion_checkin"
]);

const MOTIVATIONAL_RE =
  /\b(crush it|you got this|beast mode|10x|unlock|manifest|hustle|no excuses|győzd le|motivációs|go hard|grind)\b/i;

const THERAPEUTIC_SOFT_RE =
  /\b(validate your feelings|healing journey|inner child|nem gyengeség|önelfogadás|terápiás|self[- ]?care journey)\b/i;

const IMPRESS_RE =
  /\b(remarkable|fascinating|absolutely|incredibly important|nagyon fontos hogy tudjad|let me explain why)\b/i;

const QUESTIONNAIRE_OPENER_RE =
  /^(mi a leg|what is the (one|first)|care e (primul|cel mai)|one line:|egy sor:)/i;

/**
 * @param {string} body
 * @param {string} category
 */
function applyQuietPremiumEnergy(body, category) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (MOTIVATIONAL_RE.test(line)) return false;
    if (THERAPEUTIC_SOFT_RE.test(line)) return false;
    if (IMPRESS_RE.test(line)) return false;
    if (line.length > 160) return false;
    return true;
  });

  const questions = parts.filter((l) => /\?/.test(l));
  if (questions.length > 1) {
    const keepQ = questions[0];
    parts = parts.filter((l) => !/\?/.test(l) || l === keepQ);
  }

  if (FLOW_CATEGORIES.has(category) && parts.length > 2) {
    const hasStatement = parts.some((l) => !/\?/.test(l));
    if (hasStatement && questions.length) {
      parts = parts.filter((l) => !QUESTIONNAIRE_OPENER_RE.test(l));
    }
  }

  const max = FLOW_CATEGORIES.has(category) ? 2 : 3;
  return parts.slice(0, max).join("\n").trim();
}

/**
 * Subtle grounded warmth — not soft-clinical (phase 165).
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybeGroundedWarmth(ctx, category, body) {
  if (category === "onboarding") return body;
  if (!ctx.session?.onboardingCompleted) return body;
  if (!FLOW_CATEGORIES.has(category)) return body;

  const t = String(ctx.lastUserText || "");
  const intensity = ctx.state?.emotionalIntensity || 0;
  const emotional =
    intensity >= 4 ||
    /(nehéz|kimerült|félek|magányos|szégyen|stress|exhausted|lonely|shame|túl sok)/i.test(t);

  if (!emotional || Math.random() > 0.14) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 3) return body;

  const r = getResponses(ctx.lang);
  const pool = r.groundedWarmth || r.naturalEmotionalSupport || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `gw_${category}_${ctx.userId}`);
  if (body.includes(line.slice(0, 16))) return body;

  if (/(kimondt|bevall|said it|őszint)/i.test(t) && r.groundedWarmth?.length) {
    const said = pool.find((p) => /nyomtad el|didn't push|nu ai înăbușit/i.test(p)) || line;
    return lines(said, "", body);
  }

  return lines(line, "", body);
}

/**
 * Collapse over-formatting for premium calm.
 * @param {string} body
 */
function applyPremiumSpacing(body) {
  let t = String(body || "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[•\-*]\s+/gm, "")
    .trim();
  if (t.length < 120) {
    t = t.replace(/\n\n/g, "\n");
  }
  return t;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {{ texture: string }} alive
 */
function finalizePremiumFeelingPass(body, ctx, category, alive) {
  let b = applyQuietPremiumEnergy(body, category);
  b = maybeGroundedWarmth(ctx, category, b);
  b = applyPremiumSpacing(b);

  if (alive.texture === "quiet" || alive.texture === "presence") {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length > 2) b = parts.slice(0, 2).join("\n");
  }

  return b.trim();
}

module.exports = {
  finalizePremiumFeelingPass,
  applyQuietPremiumEnergy,
  maybeGroundedWarmth,
  applyPremiumSpacing
};
