/**
 * Human cadence + premium simplicity on outgoing replies.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { dedupeLines } = require("./humanVoiceGuard");

const SYNTHETIC_LINE_RES = [
  /\boverload state detected\b/i,
  /\bone task\.?\s*one focus\b/i,
  /\bone task\b.*\bone focus\b/i,
  /\bstabilizing action\b/i,
  /\bgrounded sentence\b/i,
  /\bsmallest (step|finish)\b/i,
  /\bwhat (is|are) the next\b/i,
  /\bmi az az egy dolog\b/i,
  /\bone honest movement\b/i,
  /\bhold\.?\s*then step\b/i
];

function isTherapyEnding(line) {
  return /\?$/.test(line) && line.length > 55;
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function stripSyntheticLines(body, lang, category) {
  const r = getResponses(lang);
  const alts = r.groundedVoiceAlts || [];
  let lines = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  lines = lines.filter((line) => {
    if (SYNTHETIC_LINE_RES.some((re) => re.test(line))) return false;
    if (isTherapyEnding(line) && category !== "onboarding") {
      return false;
    }
    return true;
  });

  if (lines.length === 0 && alts.length) {
    return pickSeeded(alts, `cadence_${category}`);
  }

  return lines.join("\n");
}

/**
 * Cap blocks for readable premium pacing.
 */
function capHumanLength(text, category) {
  const maxLines =
    category === "onboarding" ? 14 : category === "natural_conversation" ? 5 : 7;
  const maxChars = category === "natural_conversation" ? 420 : 520;

  const parts = String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  let out = parts.slice(0, maxLines).join("\n");
  if (out.length > maxChars) {
    out = out.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
  }
  return out;
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function applyHumanCadence(body, lang, category, seed = "") {
  let b = stripSyntheticLines(body, lang, category);
  b = dedupeLines(b);
  b = capHumanLength(b, category);
  return b.trim();
}

module.exports = {
  SYNTHETIC_LINE_RES,
  stripSyntheticLines,
  capHumanLength,
  applyHumanCadence
};
