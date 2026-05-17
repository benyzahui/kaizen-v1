/**
 * Beta survival — chaos handling, emotional flexibility, AI reflex strip (phases 184–189).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW, applyUnifiedRhythm } = require("./soulCoherence");

const AI_REFLEX_RES = [
  /\b(here are \d|three steps|következő lépések|first,.*second,|először.*másodszor)/i,
  /\b(i understand how you feel|that must be really hard for you|validating your feelings)/i,
  /\b(let me suggest|allow me to|i recommend you|javaslom hogy)/i,
  /\b(you should try|you need to try|neked kellene|trebuie să încerci)/i,
  /\b(in conclusion|összefoglalva|to summarize)/i,
  /\b(instant solution|quick fix|gyors megoldás)\b/i
];

const ROBOT_EMPATHY_RE =
  /\b(i hear you and|your feelings are valid|érzéseid teljesen érvényesek|e normal să simți)\b/i;

const SOLUTION_RUSH_RE =
  /\b(do this now|most azonnal|right now you must|azonnal tedd)\b/i;

/**
 * @param {string} text
 * @param {object} state
 * @returns {'joking'|'emotional'|'focused'|'exhausted'|'chaotic'|'avoidant'|'skeptic'|'quiet'|'steady'}
 */
function detectUserChaosMode(text, state) {
  const t = String(text || "").trim();
  if (t.length < 6 && /^(na\.?|ok\.?|hm\.?|…)$/i.test(t)) return "quiet";
  if (/(lol|lmao|haha|9000 tab|vicces|ironikus|😂)/i.test(t) || state?.useHumor) return "joking";
  if (/(biztos vagy|yeah right|whatever|mindegy|oké akkor|really\?)/i.test(t)) return "skeptic";
  if (/(holnap megcsinálom|majd holnap|later i will|maybe tomorrow)/i.test(t) && t.length < 80) {
    return "avoidant";
  }
  if ((state?.scatter || 0) >= 6 || /(szétszórt|chaos|túl sok minden|minden szétesik)/i.test(t)) {
    return "chaotic";
  }
  if ((state?.energyLevel ?? 5) <= 3 || /(kimerült|exhausted|nem bírom)/i.test(t)) return "exhausted";
  if ((state?.emotionalIntensity || 0) >= 5) return "emotional";
  if (state?.mentorMode === "sharp_focus" || state?.mentorMode === "disciplined_push") {
    return "focused";
  }
  return "steady";
}

/**
 * @param {string} body
 * @param {string} chaosMode
 * @param {{ texture: string }} alive
 * @param {{ mode: string }} soulRhythm
 */
function applyEmotionalFlex(body, chaosMode, alive, soulRhythm) {
  let texture = alive.texture;
  let mode = soulRhythm.mode;

  switch (chaosMode) {
    case "joking":
      texture = "playful";
      mode = "short";
      break;
    case "emotional":
      texture = "quiet";
      mode = "slow";
      break;
    case "exhausted":
    case "quiet":
      texture = "presence";
      mode = "silent";
      break;
    case "chaotic":
      texture = "grounding";
      mode = "short";
      break;
    case "focused":
      texture = "direct";
      mode = "sharp";
      break;
    case "avoidant":
      texture = "direct";
      mode = "short";
      break;
    case "skeptic":
      texture = "warm";
      mode = "breath";
      break;
    default:
      break;
  }

  return applyUnifiedRhythm(body, { mode }, texture);
}

/**
 * @param {string} body
 */
function stripAIReflexes(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (AI_REFLEX_RES.some((re) => re.test(line))) return false;
      if (ROBOT_EMPATHY_RE.test(line)) return false;
      if (SOLUTION_RUSH_RE.test(line)) return false;
      if (/^\d+[\.\)]\s/.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybeSubtleRemember(ctx, category, body) {
  if (!COHERENT_FLOW.has(category)) return body;
  const msgs = ctx.session?.messages?.length || 0;
  if (msgs < 8 || Math.random() > 0.1) return body;

  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (parts.length >= 3) return body;

  const r = getResponses(ctx.lang);
  const pool = r.relationshipContinuity?.calmerThanBefore || r.naturalCheckIns || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `subrem_${ctx.userId}_${msgs}`);
  if (body.includes(line.slice(0, 14))) return body;
  return lines(body, "", line);
}

/**
 * @param {string} body
 * @param {string} category
 */
function balanceDisciplineTone(body, category) {
  if (category !== "accountability_followup" && category !== "light_accountability") {
    return body;
  }
  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (parts.length > 2) return parts.slice(0, 2).join("\n");
  return body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {{ texture: string }} alive
 * @param {{ mode: string }} soulRhythm
 */
function finalizeBetaSurvival(body, ctx, category, alive, soulRhythm) {
  if (category === "onboarding") return body;

  const chaosMode = detectUserChaosMode(ctx.lastUserText || "", ctx.state || {});

  let b = stripAIReflexes(body);
  b = dedupeLines(b);
  b = applyEmotionalFlex(b, chaosMode, alive, soulRhythm);
  b = balanceDisciplineTone(b, category);
  b = maybeSubtleRemember(ctx, category, b);

  if (COHERENT_FLOW.has(category) && b.split(/\n/).filter(Boolean).length > 3) {
    b = applyEmotionalFlex(
      b.split(/\n/).slice(0, 3).join("\n"),
      chaosMode,
      alive,
      soulRhythm
    );
  }

  return b.trim();
}

module.exports = {
  finalizeBetaSurvival,
  detectUserChaosMode,
  stripAIReflexes,
  applyEmotionalFlex
};
