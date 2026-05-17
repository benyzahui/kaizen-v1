/**
 * Human depth refinement — calm listening, subtle EQ, no AI wisdom (non-dramatic).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");

const AI_WISDOM_RE =
  /\b(chaos grows|discipline disappear|nervous system|identity is forged|elite zone|energy leaks|devotion repeated|kovácsolódik|figyelem ritkább|hold the insight|less narrative|the truth is|az igazság az|sometimes the real|a lényeg az|the point is|pattern here|jelenség hogy|intensity without container|your future self)\b/i;

const INSIGHT_DENSITY_RE =
  /\b(valójában|actually what|fontos felismerni|worth remembering|érdemes megérteni|the reason is|az oka|deep down|mélyen|what this means is)\b/i;

const PERFORMATIVE_RE =
  /\b(i'm proud of you|nagyon bátor|you're so strong|you are so strong|validating your|fully understand how|teljes mértékben értem|beautifully said|csodálatosan)\b/i;

const COACH_PUSH_RE =
  /\b(próbáld|try this|javaslom|you should|következő lépés|one block today|egy blokk mára|stabilizáló|minimum victory)\b/i;

/**
 * @param {object} ctx
 * @param {string} [timing]
 * @returns {'listen'|'ground'|'reflect'|'steady'}
 */
function resolveListeningMode(ctx, timing) {
  const t = String(ctx.lastUserText || "").trim();

  if (timing === "quiet" || timing === "presence") return "listen";
  if (timing === "soften" || timing === "simplify") return "ground";
  if (/(félek|magányos|nehéz|kimerült|nem bírom|overwhelm|exhausted|lonely|szégyen)/i.test(t)) {
    return "ground";
  }
  if (t.length < 14 && !/\?/.test(t)) return "listen";
  if (/(miért vagyok|why am i|de ce sunt)/i.test(t)) return "reflect";
  return "steady";
}

/**
 * @param {string} body
 */
function stripAIWisdom(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (AI_WISDOM_RE.test(line)) return false;
      if (PERFORMATIVE_RE.test(line)) return false;
      if (COACH_PUSH_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * Keep at most one “insight-shaped” line.
 * @param {string} body
 */
function capInsightDensity(body) {
  let insightKept = false;
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return parts
    .filter((line) => {
      if (!INSIGHT_DENSITY_RE.test(line) && !AI_WISDOM_RE.test(line)) return true;
      if (insightKept) return false;
      insightKept = true;
      return true;
    })
    .join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} mode
 * @param {string} category
 */
function applyCalmListening(body, ctx, mode, category) {
  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(
    String(ctx.lastUserText || "")
  );
  if (askedHelp) return body;

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const r = getResponses(ctx.lang);

  if (mode === "listen") {
    if (parts.length > 1) parts = parts.slice(0, 1);
    if (parts.length === 0 || parts.some((l) => COACH_PUSH_RE.test(l) || l.length > 90)) {
      const pool = r.calmListening || r.presenceBeats || r.soulMicroBeats || [];
      if (pool.length) return pickSeeded(pool, `listen_${category}_${ctx.userId}`);
    }
    return parts.join("\n");
  }

  if (mode === "ground") {
    parts = parts.filter((line) => !(/\?$/.test(line) && line.length > 42));
    if (parts.length > 2) parts = parts.slice(0, 2);

    const hasGround = parts.some((l) =>
      /(túlterhelés|tested|pihen|elég|overload|body|nem kell)/i.test(l)
    );
    if (!hasGround && Math.random() < 0.22) {
      const pool = r.depthGrounding || r.emotionalGrounding || r.naturalEmotionalSupport || [];
      if (pool.length) {
        const g = pickSeeded(pool, `depth_${category}_${ctx.userId}`);
        if (!body.includes(g.slice(0, 14))) return lines(g, parts.join("\n"));
      }
    }
    return parts.join("\n");
  }

  if (mode === "reflect") {
    if (parts.length > 2) parts = parts.slice(0, 2);
    const questions = parts.filter((l) => /\?$/.test(l));
    if (questions.length > 1) {
      const keep = questions[0];
      parts = parts.filter((l) => !/\?$/.test(l) || l === keep);
    }
    return parts.join("\n");
  }

  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    return parts.slice(0, 2).join("\n");
  }
  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeHumanDepthRefinement(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const mode = resolveListeningMode(ctx, timing);

  let b = stripAIWisdom(body);
  b = capInsightDensity(b);
  b = dedupeLines(b);
  b = applyCalmListening(b, ctx, mode, category);

  const parts = b.split(/\n/).filter((l) => l.trim());
  const max = mode === "listen" ? 1 : mode === "ground" ? 2 : 2;
  if (parts.length > max) {
    b = parts.slice(0, max).join("\n");
  }

  return b.trim();
}

module.exports = {
  finalizeHumanDepthRefinement,
  resolveListeningMode,
  stripAIWisdom,
  capInsightDensity,
  applyCalmListening
};
