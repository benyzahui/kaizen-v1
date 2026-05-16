/**
 * Emotional pacing — lead the experience; do not therapy-loop.
 * Strips weak questions, caps wall length, favors short beats.
 */

const { lines } = require("../personality/kaizenVoice");

const THERAPY_QUESTION_RE =
  /\b(what do you feel|how do you feel|what are you feeling|how are you feeling|what is the smallest|what would you|what do you need|what matters most|mi érzel|hogy érzed|cum te simți|care e cel mai|legkisebb lépés|ce simți)\b/i;

const GENERIC_COACH_RE =
  /\b(one grounded action|stabilizing action|grounded sentence|no perfect explanation|name the situation, not the verdict)\b/i;

const MAX_LINES_OPEN = 8;
const MAX_CHARS_OPEN = 520;

/**
 * Count question marks in recent assistant replies (via structures).
 */
function recentQuestionPressure(session) {
  const hist = session?.responseStructures || [];
  const qEnds = hist.filter((h) => h.ending?.startsWith("question_close")).length;
  return qEnds;
}

/**
 * Convert trailing therapy question → directive close.
 */
function softenTherapyQuestions(text, lang) {
  let t = String(text || "");
  const parts = t.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const out = parts.map((line) => {
    if (!/\?$/.test(line)) return line;
    if (!THERAPY_QUESTION_RE.test(line) && line.length < 60) return line;
    const r = lang === "hu"
      ? "Egy lépés. Most."
      : lang === "ro"
        ? "Un pas. Acum."
        : "One step. Now.";
    return r;
  });
  return out.join("\n");
}

/**
 * Remove duplicate question blocks in body.
 */
function stripTherapyFraming(text) {
  return String(text || "")
    .split(/\n\n+/)
    .filter((block) => !GENERIC_COACH_RE.test(block))
    .join("\n\n");
}

/**
 * Cap length for open chat — premium = short.
 */
function capWallLength(text, maxLines = MAX_LINES_OPEN, maxChars = MAX_CHARS_OPEN) {
  const parts = String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  let kept = parts.slice(0, maxLines);
  let out = kept.join("\n");
  if (out.length > maxChars) {
    out = out.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
  }
  return out;
}

/**
 * Full pacing pass on outgoing reply.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {object} plan from selectResponsePlan
 */
const REFLECTIVE_MODES = new Set(["MODE_REFLECTIVE", "MODE_RECOVERY"]);

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {object} plan
 * @param {string} [conversationMode]
 * @param {string} [category]
 */
function applyEmotionalPacing(body, lang, session, plan, conversationMode, category) {
  let b = body;
  const qPressure = recentQuestionPressure(session);
  const reflective =
    REFLECTIVE_MODES.has(conversationMode) ||
    category === "reflective_open" ||
    category === "emotional_reflection";

  const keepOneQuestion =
    category === "natural_conversation" ||
    category === "emotional_reflection" ||
    category === "reflective_open";

  if ((qPressure >= 2 || plan?.action !== "ask" || !reflective) && !keepOneQuestion) {
    b = softenTherapyQuestions(b, lang);
    b = stripTherapyFraming(b);
  } else if (!reflective && !keepOneQuestion) {
    b = stripTherapyFraming(b);
  }

  if (plan?.depth === "short" || plan?.length === "short" || plan?.pressure === "high") {
    b = capWallLength(b, 4, 280);
  } else if (plan?.depth === "deep" && reflective) {
    b = capWallLength(b, 10, 680);
  } else if (!reflective) {
    b = capWallLength(b, 6, 420);
  } else {
    b = capWallLength(b);
  }

  return b;
}

module.exports = {
  THERAPY_QUESTION_RE,
  recentQuestionPressure,
  softenTherapyQuestions,
  stripTherapyFraming,
  capWallLength,
  applyEmotionalPacing
};
