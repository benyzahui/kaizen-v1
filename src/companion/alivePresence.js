/**
 * Alive pass — emotional texture, human timing, presence over insight.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

const TEXTURES = [
  "reflective",
  "quiet",
  "direct",
  "warm",
  "sharp",
  "playful",
  "grounding",
  "presence"
];

const INSIGHT_HEAVY_RE =
  /\b(identity|protocol|discipline|nervous system|optimize|insight|container|ego|manifest|unlock)\b/i;

/**
 * @param {object} state
 * @param {object} session
 * @param {string} text
 * @param {string} category
 * @param {{ mode: string, mirror: string }} soulRhythm
 */
function resolveEmotionalTexture(state, session, text, category, soulRhythm) {
  const msgs = session?.messages?.length || 0;
  const last = session?.lastEmotionalTexture;
  const pm = session?.presenceMemory || {};
  const t = String(text || "");

  let pool = [...TEXTURES];

  if (category === "relational_flow" || soulRhythm.mode === "silent") {
    return pickSeeded(["presence", "quiet", "warm"], `tex_${msgs}`);
  }
  if (state?.useHumor && state.emotionalIntensity < 5 && /(lol|haha|9000|tab)/i.test(t)) {
    return pickSeeded(["playful", "warm", "direct"], `tex_${msgs}`);
  }
  if (state?.emotionalIntensity >= 6 || pm.emotionalState === "overloaded") {
    pool = ["grounding", "quiet", "presence", "warm", "reflective"];
  } else if (state?.mentorMode === "sharp_focus" || soulRhythm.mode === "sharp") {
    pool = ["direct", "sharp", "grounding", "quiet"];
  } else if (state?.emotionalIntensity <= 3 && msgs > 4) {
    pool = ["reflective", "warm", "quiet", "presence", "playful"];
  }

  if (last && msgs > 2) {
    pool = pool.filter((x) => x !== last);
  }

  const texture = pickSeeded(pool.length ? pool : TEXTURES, `alive_tex_${msgs}_${category}`);
  return texture;
}

/**
 * @param {string} texture
 */
function textureSessionPatch(texture) {
  return { lastEmotionalTexture: texture };
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} texture
 * @param {string} category
 */
function applyPresenceOverIntelligence(body, lang, texture, category) {
  if (category === "onboarding") return body;

  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!parts.length) return body;

  const r = getResponses(lang);
  const presenceFirst = new Set(["presence", "quiet", "warm", "grounding"]);

  if (presenceFirst.has(texture) && parts.length >= 3 && Math.random() < 0.38) {
    const pool = r.presenceBeats || r.emotionalTextures?.presence || r.silenceBeats || [];
    if (pool.length) {
      const beat = pickSeeded(pool, `pbeat_${texture}_${category}`);
      const rest = parts.filter((p) => !INSIGHT_HEAVY_RE.test(p)).slice(0, 1);
      return rest.length ? lines(beat, "", rest.join("\n")) : beat;
    }
  }

  if (parts.length > 3) {
    const trimmed = parts.filter((p, i) => i === 0 || !INSIGHT_HEAVY_RE.test(p) || i < 2);
    return trimmed.slice(0, 3).join("\n");
  }

  return body;
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} texture
 * @param {string} seed
 */
function applyQuietConfidence(body, lang, texture, seed = "") {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (parts.length < 2) return body;
  if (!["direct", "sharp", "grounding", "quiet"].includes(texture)) return body;
  if (Math.random() > 0.14) return body;

  const r = getResponses(lang);
  const pool = r.quietConfidence || r.premiumAtmosphere || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, seed || `qconf_${texture}`);
  if (parts.some((p) => p.includes(line.slice(0, 18)))) return body;
  return lines(parts.slice(0, Math.max(1, parts.length - 1)).join("\n"), "", line);
}

/**
 * Human timing — less lecture, softer gaps.
 * @param {string} body
 * @param {string} texture
 */
function applyHumanTiming(body, texture) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (line.length > 130 && /,.*,.*,/.test(line)) return false;
    if (/^(first|second|third|először|másodszor)/i.test(line)) return false;
    return true;
  });

  if (texture === "reflective") {
    if (parts.length >= 2) return parts.join("\n\n");
  }
  if (texture === "quiet" || texture === "presence") {
    return parts.slice(0, 2).join("\n");
  }
  if (parts.length > 4) return parts.slice(0, 3).join("\n");
  return parts.join("\n");
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} texture
 */
function maybeMicroHumanity(session, lang, category, texture) {
  if (!session?.onboardingCompleted) return null;
  if (category === "onboarding") return null;
  if (Math.random() > 0.22) return null;

  const r = getResponses(lang);
  const pool =
    r.microHumanityAlive ||
    r.humanImperfections ||
    r.microReactions ||
  [];
  if (!pool.length) return null;

  const weighted =
    texture === "playful" || texture === "warm"
      ? [...pool, ...(r.emotionalTextures?.playful || [])]
      : pool;

  return pickSeeded(weighted, `mh_${texture}_${session.messages?.length || 0}`);
}

/**
 * Optional texture beat woven into thin replies.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} texture
 */
function maybeTextureBeat(body, lang, texture) {
  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (parts.length > 2) return body;
  if (Math.random() > 0.1) return body;

  const r = getResponses(lang);
  const pool = r.emotionalTextures?.[texture] || [];
  if (!pool.length) return body;
  const beat = pickSeeded(pool, `tbeat_${texture}`);
  if (body.includes(beat)) return body;
  return lines(beat, "", body);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {{ texture: string, soulRhythm: object }} alive
 */
function finalizeAlivePass(body, ctx, category, alive) {
  const { texture } = alive;
  let b = applyPresenceOverIntelligence(body, ctx.lang, texture, category);
  b = applyHumanTiming(b, texture);
  b = maybeTextureBeat(b, ctx.lang, texture);
  b = applyQuietConfidence(b, ctx.lang, texture, `alive_${category}_${ctx.userId}`);

  const micro = maybeMicroHumanity(ctx.session, ctx.lang, category, texture);
  if (micro && b.split(/\n/).length < 5 && !b.startsWith(micro)) {
    b = lines(micro, "", b);
  }

  return b.trim();
}

/**
 * Max prep layers (opening / transition / wow) for alive feel.
 * @param {string} texture
 */
function maxPrepLayers(texture) {
  if (texture === "presence" || texture === "quiet") return 0;
  if (texture === "grounding" || texture === "warm") return 1;
  return 1;
}

/**
 * @param {object} ctx
 * @param {object} soulRhythm
 * @param {string} category
 */
function resolveAliveContext(ctx, soulRhythm, category) {
  const texture = resolveEmotionalTexture(
    ctx.state,
    ctx.session || {},
    ctx.lastUserText || "",
    category,
    soulRhythm
  );
  return { texture, soulRhythm };
}

module.exports = {
  TEXTURES,
  resolveEmotionalTexture,
  textureSessionPatch,
  resolveAliveContext,
  maxPrepLayers,
  finalizeAlivePass,
  maybeMicroHumanity,
  applyHumanTiming,
  applyPresenceOverIntelligence
};
