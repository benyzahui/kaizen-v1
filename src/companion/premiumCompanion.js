/**
 * Premium companion polish — simplicity, natural support, human rhythm (phases 145–149).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { stripHypeLines } = require("./atmospherePresence");

const SIMPLE_CATEGORIES = new Set([
  "natural_conversation",
  "life_flow",
  "relational_flow",
  "light_conversation",
  "emotional_reflection",
  "casual_greeting"
]);

const GUIDANCE_HEAVY_RE =
  /\b(stabilizáló|következő lépés|nyitott kör|egy blokk mára|hegyet cipeld|protocol|manifest|unlock your|hero'?s journey|10x|grind set)\b/i;

const OVER_FRAME_RE =
  /\b(érdemes megfontolni|fontos hogy tudjad|remember that|it's worth noting|keep in mind that|ne feledd hogy)\b/i;

const BULLET_LINE_RE = /^[•\-*]\s+/;

/**
 * @param {string} body
 * @param {string} category
 * @param {string} texture
 */
function applyPremiumSimplicity(body, category, texture) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (OVER_FRAME_RE.test(line)) return false;
    if (GUIDANCE_HEAVY_RE.test(line) && texture !== "sharp") return false;
    if (line.length > 145 && /,.*,.*,/.test(line)) return false;
    if (BULLET_LINE_RE.test(line) && parts.length > 2) return false;
    return true;
  });

  const maxLines = SIMPLE_CATEGORIES.has(category)
    ? texture === "presence" || texture === "quiet"
      ? 2
      : 3
    : 4;

  if (parts.length > maxLines) {
    parts = parts.slice(0, maxLines);
  }

  return parts.join("\n").trim();
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} texture
 * @param {string} body
 */
function maybeNaturalEmotionalSupport(ctx, category, texture, body) {
  if (category === "onboarding") return body;
  if (!ctx.session?.onboardingCompleted) return body;

  const intensity = ctx.state?.emotionalIntensity || 0;
  const pm = ctx.session?.presenceMemory || {};
  const t = String(ctx.lastUserText || "");

  const heavy =
    intensity >= 5 ||
    pm.emotionalState === "overloaded" ||
    /(kimerült|exhausted|túl sok|overwhelm|magányos|lonely|nehéz|félek)/i.test(t);

  if (!heavy || Math.random() > 0.24) return body;

  const r = getResponses(ctx.lang);
  const pool = r.naturalEmotionalSupport || r.naturalComfort || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `nes_${category}_${ctx.userId}`);
  if (body.includes(line.slice(0, 14))) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 3) return body;

  return lines(line, "", body);
}

/**
 * @param {string} body
 * @param {{ mode: string }} soulRhythm
 * @param {string} texture
 */
function applyHumanRhythmSpacing(body, soulRhythm, texture) {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (parts.length < 2) return body;

  const mode = soulRhythm?.mode || "breath";

  if (mode === "slow" || texture === "reflective") {
    return parts.slice(0, 3).join("\n\n");
  }
  if (mode === "sharp" || texture === "sharp" || texture === "direct") {
    return parts.slice(0, 2).join("\n");
  }
  if (mode === "silent" || texture === "presence" || texture === "quiet") {
    return parts[0];
  }
  if (mode === "short") {
    return parts.slice(0, 2).join("\n");
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} texture
 * @param {string} body
 */
function maybeMicroPresenceDetail(ctx, category, texture, body) {
  if (category === "onboarding") return body;
  if (!ctx.session?.onboardingCompleted) return null;
  if (Math.random() > 0.2) return null;

  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (parts.length > 3) return null;

  const r = getResponses(ctx.lang);
  const pool =
    r.microPresencePremium ||
    r.microHumanityAlive ||
    r.microReactions ||
    [];
  if (!pool.length) return null;

  const weighted =
    texture === "warm" || ctx.state?.emotionalIntensity >= 5
      ? [...pool, ...(r.naturalEmotionalSupport || []).slice(0, 2)]
      : pool;

  const beat = pickSeeded(weighted, `mpd_${texture}_${category}`);
  if (body.includes(beat)) return null;
  return beat;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {{ texture: string }} alive
 * @param {{ mode: string }} soulRhythm
 */
function finalizePremiumPass(body, ctx, category, alive, soulRhythm) {
  const { texture } = alive;
  let b = stripHypeLines(body);
  b = applyPremiumSimplicity(b, category, texture);
  b = maybeNaturalEmotionalSupport(ctx, category, texture, b);
  b = applyHumanRhythmSpacing(b, soulRhythm, texture);

  const micro = maybeMicroPresenceDetail(ctx, category, texture, b);
  if (micro && b.split(/\n/).filter(Boolean).length < 4 && !b.startsWith(micro)) {
    b = lines(micro, "", b);
  }

  return b.trim();
}

module.exports = {
  finalizePremiumPass,
  applyPremiumSimplicity,
  maybeNaturalEmotionalSupport,
  applyHumanRhythmSpacing
};
