/**
 * Beta immersion hardening — stress survival, ego strip, grounding, micro imperfection (199–203).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { detectUserChaosMode } = require("./betaSurvival");

const EGO_INTELLECT_RE =
  /\b(fontos megérteni|lényegében|strategically|the key insight|worth noting|it's important to understand|în esență|cheia este|insight:|framework|protocol|optimize your|identitásod|hero'?s journey)\b/i;

const AI_STRESS_FALLBACK_RE =
  /\b(overload state|let me suggest|you should try|as an AI|three steps|következő lépések|validating your feelings)\b/i;

const GROUNDING_ALREADY_RE =
  /(túlterhelés|overwhelm|testedbe|your body|nem új terv|not a new plan|prea multă încărcare|pihenj|rest first)/i;

const MICRO_IMPERFECTION_RE = /^(hm\.|na várj|na\.|értem\.|az mondjuk sok\.)/i;

/**
 * @param {object} ctx
 * @param {string} category
 * @returns {'overload'|'anger'|'loneliness'|'exhaustion'|'frustration'|'overthink'|'silence'|'humor'|'steady'}
 */
function detectStressProfile(ctx, category) {
  const t = String(ctx.lastUserText || "").trim();
  const state = ctx.state || {};
  const chaos = detectUserChaosMode(t, state);

  if (chaos === "joking") return "humor";
  if (chaos === "quiet" || /^(na\.?|ok\.?|hm\.?|…|\.\.\.)$/i.test(t)) return "silence";
  if (/(düh|mérges|rage|furious|furios)/i.test(t)) return "anger";
  if (/(magányos|lonely|singur|senki nincs)/i.test(t)) return "loneliness";
  if (/(nem aludtam|sleep dep|kimerült|exhausted|obosit)/i.test(t)) return "exhaustion";
  if (/(elegem|frustrált|frustrated|enough of this|ideges vagyok)/i.test(t)) return "frustration";
  if (/(túlgondolom|overthink|miért vagyok|why am i|de ce sunt)/i.test(t)) return "overthink";
  if (
    (state.scatter || 0) >= 6 ||
    (state.emotionalIntensity || 0) >= 6 ||
    /(túl sok|szétes|overwhelm|minden szétesik|can't cope)/i.test(t)
  ) {
    return "overload";
  }
  if (category === "relational_flow" || (state.emotionalIntensity || 0) >= 5) {
    return "overload";
  }
  return "steady";
}

/**
 * @param {string} body
 */
function stripResponseEgo(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (EGO_INTELLECT_RE.test(line)) return false;
      if (line.length > 95 && /\b(therefore|tehát|în concluzie|in conclusion)\b/i.test(line)) {
        return false;
      }
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} stress
 */
function applyEmotionalGrounding(body, ctx, stress) {
  const needsGround = new Set([
    "overload",
    "anger",
    "exhaustion",
    "frustration",
    "overthink"
  ]);
  if (!needsGround.has(stress)) return body;

  let b = String(body || "").trim();
  if (GROUNDING_ALREADY_RE.test(b)) return b;

  const r = getResponses(ctx.lang);
  const pool =
    r.emotionalGrounding ||
    r.quietConfidence ||
    r.naturalEmotionalSupport ||
    [];
  if (!pool.length) return b;

  const line = pickSeeded(pool, `ground_${stress}_${ctx.userId}_${ctx.session?.messages?.length || 0}`);
  const parts = b.split(/\n/).filter((l) => l.trim());

  if (stress === "overload" && parts.length > 2) {
    return lines(line, parts.slice(0, 1).join("\n"));
  }
  if (parts.length === 0 || (parts.length === 1 && parts[0].length < 20)) {
    return line;
  }
  if (parts.length <= 2 && !GROUNDING_ALREADY_RE.test(parts[0])) {
    return lines(line, b);
  }
  return b;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} stress
 */
function maybeMicroImperfection(body, ctx, stress, category) {
  if (!COHERENT_FLOW.has(category)) return body;
  const r = getResponses(ctx.lang);
  const pool =
    r.microHumanityAlive ||
    r.soulMicroBeats ||
    r.presenceBeats ||
    [];
  if (!pool.length) return body;

  let chance = 0.14;
  if (stress === "silence") chance = 0.32;
  if (stress === "humor") chance = 0.22;
  if (stress === "loneliness") chance = 0.18;
  if (Math.random() > chance) return body;

  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (MICRO_IMPERFECTION_RE.test(parts[0] || "")) return body;
  if (parts.length > 2) return body;

  const beat = pickSeeded(pool, `microimp_${stress}_${ctx.userId}`);
  if (body.includes(beat)) return body;
  return lines(beat, body);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} stress
 */
function capUnderStress(body, ctx, category, stress) {
  const heavy = new Set(["overload", "anger", "exhaustion", "frustration", "loneliness"]);
  if (!heavy.has(stress) && stress !== "overthink") return body;

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const max = stress === "silence" || stress === "humor" ? 2 : 3;
  if (parts.length > max) parts = parts.slice(0, max);
  if (COHERENT_FLOW.has(category) && heavy.has(stress) && parts.length > 2) {
    parts = parts.slice(0, 2);
  }
  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeBetaImmersionHarden(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const stress = detectStressProfile(ctx, category);
  ctx.category = category;

  let b = stripResponseEgo(body);
  b = dedupeLines(b);

  if (AI_STRESS_FALLBACK_RE.test(b)) {
    const r = getResponses(ctx.lang);
    const pool = r.emotionalGrounding || r.presenceBeats || ["Értem."];
    b = pickSeeded(pool, `stress_fb_${ctx.userId}`);
  }

  b = applyEmotionalGrounding(b, ctx, stress);
  b = maybeMicroImperfection(b, ctx, stress, category);
  b = capUnderStress(b, ctx, category, stress);

  if (timing === "quiet" || timing === "presence" || stress === "silence") {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length > 2) b = parts.slice(0, 2).join("\n");
  }

  return b.trim();
}

module.exports = {
  finalizeBetaImmersionHarden,
  detectStressProfile,
  stripResponseEgo,
  applyEmotionalGrounding,
  maybeMicroImperfection
};
