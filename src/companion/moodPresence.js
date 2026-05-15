/**
 * Mood-based presence — replaces generic mentor pools with branded cinematic voice.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { formatMoodOpening, pickMantraLine } = require("./moodEngine");

/**
 * @param {string} coreBody
 * @param {string} mood
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string} category
 * @param {object} plan
 * @param {boolean} skipLead
 */
function applyMoodPresence(coreBody, mood, lang, session, category, plan, skipLead = false) {
  const r = getResponses(lang);
  const parts = [];

  if (!skipLead) {
    parts.push(formatMoodOpening(mood, lang, session, category));
  }

  parts.push(coreBody);

  const closes = r.moodCloses?.[mood];
  if (closes?.length && plan?.action !== "ask") {
    const seed = `${mood}_close_${(session?.messages || []).length}`;
    parts.push("", pickSeeded(closes, seed));
  }

  if (category === "casual_greeting" || category === "plan_tracking") {
    const mantra = pickMantraLine(mood, lang, session);
    if (mantra) parts.push("", mantra);
  }

  return lines(...parts.filter(Boolean));
}

module.exports = { applyMoodPresence };
