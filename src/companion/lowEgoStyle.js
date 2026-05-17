/**
 * Low ego — notice, stay present, one good question max. No mini-lectures.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const LOW_EGO_CATEGORIES = new Set([
  "natural_conversation",
  "emotional_reflection",
  "reflective_open",
  "life_flow",
  "light_conversation",
  "casual_greeting",
  "focus_drift",
  "body_energy"
]);

const COACH_BLOCK_RE =
  /\b(one lane|one block|stabiliz|protocol|framework|discipline routine|grounded action|minimum victory|ne build|do not build|ne construi|túl sok nyitott kör egyszerre\.|huszonöt perc|twenty.?five minutes)\b/i;

const LECTURE_LINE_RE =
  /\b(you do not need|you don't need|not laziness|not weakness|nem gyengeség|nem lene|victorie minimă|premium|system wants)\b/i;

/**
 * First paragraph only when reply was a stacked coach template.
 */
function collapseCoachWall(text) {
  const t = String(text || "").trim();
  if (!t.includes("\n\n")) return t;
  const blocks = t.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length <= 1) return t;
  if (blocks.some((b) => COACH_BLOCK_RE.test(b)) || blocks.length >= 3) {
    return blocks[0];
  }
  return t;
}

/**
 * Keep at most one question line; drop coaching questions.
 */
function limitToOneQuestion(text, lang) {
  const lines = String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const questions = lines.filter((l) => /\?$/.test(l));
  if (questions.length <= 1) return lines.join("\n");

  const keep = [];
  let keptQ = false;
  for (const line of lines) {
    if (!/\?$/.test(line)) {
      keep.push(line);
      continue;
    }
    if (LECTURE_LINE_RE.test(line) || line.length > 72) continue;
    if (!keptQ) {
      keep.push(line);
      keptQ = true;
    }
  }
  return keep.join("\n") || lines[0] || "";
}

/**
 * Strip lines that sound like life-coach mode.
 */
function stripCoachLines(text) {
  return String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l && !LECTURE_LINE_RE.test(l) && !(COACH_BLOCK_RE.test(l) && l.length > 50))
    .join("\n");
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} userText
 * @param {object} [state]
 */
function applyLowEgoPass(body, lang, category, userText, state = {}) {
  if (!LOW_EGO_CATEGORIES.has(category)) return body;

  let b = collapseCoachWall(body);
  b = stripCoachLines(b);
  b = limitToOneQuestion(b, lang);

  const lines = b.split(/\n/).filter(Boolean);
  if (lines.length > 3) {
    b = lines.slice(0, 3).join("\n");
  }

  const emotional = state.emotionalIntensity >= 6;
  const exhausted = state.energyLevel <= 4 || state.mentorMode === "recovery_mode";

  if ((emotional || exhausted) && lines.length > 2) {
    b = lines.slice(0, 2).join("\n");
  }

  if (!b.trim() && category !== "onboarding") {
    const r = getResponses(lang);
    const pool = r.silenceBeats || r.oneLineBeats || [];
    if (pool.length) {
      b = pickSeeded(pool, `silence_${category}_${String(userText).slice(0, 20)}`);
    }
  }

  return b.trim();
}

/**
 * Flatten intent pool item to one low-ego line.
 * @param {string[]} pool
 * @param {string} seed
 */
function pickLowEgoFromPool(pool, seed) {
  if (!pool?.length) return null;
  const item = pickSeeded(pool, seed);
  if (typeof item !== "string") return item;
  if (item.includes("\n\n")) return item.split(/\n\n+/)[0].trim();
  if (item.includes("\n")) return item.split(/\n/)[0].trim();
  return item;
}

module.exports = {
  LOW_EGO_CATEGORIES,
  applyLowEgoPass,
  pickLowEgoFromPool,
  collapseCoachWall,
  limitToOneQuestion
};
