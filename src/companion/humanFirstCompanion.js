/**
 * Human-first pass — emotional state over systems (phases 153–158).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

const HUMAN_FIRST_CATEGORIES = new Set([
  "natural_conversation",
  "life_flow",
  "relational_flow",
  "light_conversation",
  "emotional_reflection",
  "casual_greeting",
  "companion_checkin"
]);

const ASSISTANT_ENERGY_RE = [
  /\b(how can i help|let me know if you need|feel free to|i'?m here to help|as an AI|language model)\b/i,
  /\b(ha bármiben segíthetek|szólj ha kell|nyugodtan írj|assistant vagyok)\b/i,
  /\b(spune-mi dacă|sunt aici să te ajut)\b/i,
  /\badd one new fact you have not said\b/i,
  /\badj egy új részletet\b/i
];

const OVER_HELP_RE =
  /\b(itt van néhány tipp|here are some tips|steps you can take|következő lépések:|next steps:)\b/i;

/**
 * @param {string} body
 */
function stripAssistantEnergy(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (ASSISTANT_ENERGY_RE.some((re) => re.test(line))) return false;
    if (OVER_HELP_RE.test(line)) return false;
    return true;
  });

  return parts.join("\n").trim();
}

/**
 * Regulate reply shape to match user state (phase 156).
 * @param {string} body
 * @param {object} ctx
 * @param {{ mode: string }} soulRhythm
 * @param {string} texture
 * @param {string} category
 */
function applyEmotionalRegulation(body, ctx, soulRhythm, texture, category) {
  if (category === "onboarding") return body;

  const state = ctx.state || {};
  const scatter = state.scatter || 0;
  const intensity = state.emotionalIntensity || 0;
  const energy = state.energyLevel ?? 5;

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!parts.length) return body;

  if (scatter >= 6) {
    parts = parts.slice(0, 2);
    if (parts.length === 2 && Math.random() < 0.35) {
      const r = getResponses(ctx.lang);
      const pool = r.eliteAtmosphereCalm || r.quietConfidence || [];
      if (pool.length) {
        const calm = pickSeeded(pool, `reg_scatter_${ctx.userId}`);
        if (!parts.some((p) => p.includes(calm.slice(0, 12)))) {
          parts = [calm, parts[0]];
        }
      }
    }
  } else if (intensity >= 6) {
    parts = parts.filter((l) => !/\?$/.test(l) || l.length < 40).slice(0, 2);
  } else if (energy <= 3) {
    parts = parts.slice(0, 2);
    parts = parts.map((l) => l.replace(/\?+$/, "").trim()).filter(Boolean);
  } else if (state.mentorMode === "sharp_focus" || soulRhythm.mode === "sharp") {
    parts = parts.slice(0, 2);
  }

  if (HUMAN_FIRST_CATEGORIES.has(category) && parts.length > 3) {
    parts = parts.slice(0, 3);
  }

  return parts.join("\n").trim();
}

/**
 * Extra micro beat on silence / minimal (phase 157).
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybeHumanMicroBeat(ctx, category, body) {
  const t = String(ctx.lastUserText || "").trim();
  if (!/^(na\.?|ok\.?|hm\.?|…|\.\.\.)$/i.test(t)) return body;
  if (Math.random() > 0.35) return body;

  const r = getResponses(ctx.lang);
  const pool = r.microHumanityAlive || r.microPresencePremium || [];
  if (!pool.length) return body;

  const beat = pickSeeded(pool, `hmb_${category}_${t}`);
  if (body.includes(beat)) return body;
  return lines(beat, "", body);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {{ texture: string }} alive
 * @param {{ mode: string }} soulRhythm
 */
function finalizeHumanFirstPass(body, ctx, category, alive, soulRhythm) {
  let b = stripAssistantEnergy(body);
  b = applyEmotionalRegulation(b, ctx, soulRhythm, alive.texture, category);
  b = maybeHumanMicroBeat(ctx, category, b);
  return b.trim();
}

module.exports = {
  finalizeHumanFirstPass,
  stripAssistantEnergy,
  applyEmotionalRegulation,
  HUMAN_FIRST_CATEGORIES
};
