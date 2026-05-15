/**
 * Interactive choices — rare, premium forks (not menus).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

const CHOICE_CATEGORIES = new Set([
  "focus_drift",
  "plan_tracking",
  "emotional_reflection",
  "reflective_open",
  "chaos_loop",
  "body_energy"
]);

/**
 * @param {string} mood
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string} category
 * @param {object} plan
 */
function maybeAppendChoices(mood, lang, session, category, plan) {
  if (!CHOICE_CATEGORIES.has(category)) return null;
  if (plan?.action === "observe") return null;
  const turns = session?.messages?.length || 0;
  if (turns % 4 !== 2) return null;

  const r = getResponses(lang);
  const sets = r.moodChoices?.[mood];
  if (!sets?.length) return null;
  const seed = `${mood}_${category}_${turns}`;
  const block = pickSeeded(sets, seed);
  return block;
}

function appendChoicesToReply(body, mood, lang, session, category, plan) {
  const choices = maybeAppendChoices(mood, lang, session, category, plan);
  if (!choices) return body;
  return lines(body, "", choices);
}

module.exports = { maybeAppendChoices, appendChoicesToReply, CHOICE_CATEGORIES };
