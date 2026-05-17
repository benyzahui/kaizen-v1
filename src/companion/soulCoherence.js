/**
 * Last soul polish — one presence, unified rhythm, immersion lock (phases 177–181).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { normalizeChunk } = require("../conversation/structureMemory");

const COHERENT_FLOW = new Set([
  "natural_conversation",
  "life_flow",
  "relational_flow",
  "light_conversation",
  "emotional_reflection",
  "companion_checkin",
  "casual_greeting"
]);

const PERFORMATIVE_RE =
  /\b(identity is|protocol|optimize|unlock|manifest|intensity without container|hero'?s journey|10x|grind|motivációhiány|not laziness|nem lustaság|nem gyengeség)\b/i;

const COACH_OPENER_RE =
  /^(one truth|one move|egy igaz|a fegyelem|discipline gets|identitás|focus is mostly)/i;

const MICRO_BEAT_RE = /^(hm\.|na\.|értem\.|jó\.|az sok\.|az kemény|yeah\.|got it\.)/i;

/**
 * One spacing rule — overrides stacked passes fighting each other.
 * @param {string} body
 * @param {{ mode: string }} soulRhythm
 * @param {string} texture
 */
function applyUnifiedRhythm(body, soulRhythm, texture) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!parts.length) return body;

  const mode = soulRhythm?.mode || "breath";

  if (mode === "silent" || texture === "quiet" || texture === "presence") {
    return parts[0];
  }
  if (mode === "slow" || texture === "reflective") {
    return parts.slice(0, 2).join("\n\n");
  }
  if (mode === "sharp" || texture === "sharp" || texture === "direct") {
    return parts.slice(0, 2).join("\n");
  }
  if (mode === "short") {
    return parts.slice(0, 2).join("\n");
  }

  return parts.slice(0, 3).join("\n");
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function stripPerformativeVoice(body, lang, session) {
  const r = getResponses(lang);
  const alts = r.listeningAck || r.soulMicroBeats || ["Értem.", "Hallom."];
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (PERFORMATIVE_RE.test(line)) return false;
    if (COACH_OPENER_RE.test(line)) return false;
    return true;
  });

  if (!parts.length) {
    return pickSeeded(alts, `soul_fb_${session?.messages?.length || 0}`);
  }

  const open = normalizeChunk(parts[0]);
  const recent = session?.recentAssistantOpenings || [];
  if (recent.slice(-4).filter((o) => o === open).length >= 2) {
    parts[0] = pickSeeded(alts, `soul_open_${open}`);
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 * @param {string} texture
 */
function maybeFinalMicroHumanity(ctx, category, body, texture) {
  if (!COHERENT_FLOW.has(category)) return body;
  if (!ctx.session?.onboardingCompleted) return body;

  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (parts.length > 3) return body;
  if (MICRO_BEAT_RE.test(parts[0] || "")) return body;

  let chance = 0.2;
  if (/^(na\.?|ok\.?|hm\.?)$/i.test(String(ctx.lastUserText || "").trim())) chance = 0.38;
  if (texture === "warm" || texture === "presence") chance = 0.26;
  if (Math.random() > chance) return body;

  const r = getResponses(ctx.lang);
  const pool =
    r.soulMicroBeats ||
    r.microPresencePremium ||
    r.microHumanityAlive ||
    [];
  if (!pool.length) return body;

  const beat = pickSeeded(pool, `smb_${texture}_${category}_${ctx.userId}`);
  if (body.includes(beat)) return body;
  return lines(beat, "", body);
}

/**
 * Final lock — one companion voice.
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {{ texture: string }} alive
 * @param {{ mode: string }} soulRhythm
 */
function finalizeSoulCoherence(body, ctx, category, alive, soulRhythm) {
  if (category === "onboarding") return body;

  let b = stripPerformativeVoice(body, ctx.lang, ctx.session || {});
  b = dedupeLines(b);

  if (COHERENT_FLOW.has(category)) {
    b = maybeFinalMicroHumanity(ctx, category, b, alive.texture);
    b = applyUnifiedRhythm(b, soulRhythm, alive.texture);
    const parts = b.split(/\n/).filter((l) => l.trim());
    if (parts.length > 3) {
      b = applyUnifiedRhythm(parts.slice(0, 3).join("\n"), soulRhythm, alive.texture);
    }
  } else {
    b = applyUnifiedRhythm(b, soulRhythm, alive.texture);
  }

  return b.trim();
}

module.exports = {
  finalizeSoulCoherence,
  applyUnifiedRhythm,
  COHERENT_FLOW
};
