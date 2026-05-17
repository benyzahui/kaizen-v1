/**
 * Natural conversation — presence, grounding, direction, one question.
 * No command redirect for normal emotional open text.
 */

const { pickUnseenVariant } = require("./responseVariation");
const { getResponses } = require("../i18n/getResponses");
const { buildMicroEmotionalReply } = require("../companion/emotionalMicro");

const NATURAL_CATEGORIES = new Set([
  "emotional_reflection",
  "focus_drift",
  "body_energy",
  "reflective_open",
  "self_development",
  "plan_tracking",
  "work_focus",
  "chaos_loop"
]);

function isSevereCrisis(text) {
  return /(want to die|kill myself|hopeless|can't cope|cant cope|panic|pánik|reménytelen|self harm|öngyilk)/i.test(
    String(text || "")
  );
}

function isNaturalEmotional(text) {
  return /(stressz|stresszes|nyomaszt|kifáradt|kimerült|fáradt|szét|széthúz|szét vagyok|csúszva|nem tudom mit|mit csináljak|elvesztett|overwhelmed|exhausted|burned out|don't know what|scattered|túl sok minden|too much at once|levert|túlpörög|nagyon stressz)/i.test(
    String(text || "")
  );
}

/**
 * @param {string} text
 */
function detectNaturalSlot(text) {
  const t = String(text || "");
  if (/(stressz|stresszes|nyomaszt|overwhelmed|túlpörög)/i.test(t)) return "stress";
  if (/(kifáradt|fáradt|kimerült|exhausted|burned|alvás|sleep)/i.test(t)) return "tired";
  if (/(nem tudom mit|mit csináljak|elvesztett|don't know what|lost|confused)/i.test(t))
    return "lost";
  if (/(szét|széthúz|scattered|túl sok|too many|lanes)/i.test(t)) return "scattered";
  return "general";
}

/**
 * @param {string} text
 * @param {string} category
 * @param {object} session
 */
function shouldUseNaturalConversation(text, category, session) {
  if (isSevereCrisis(text)) return false;
  if (NATURAL_CATEGORIES.has(category) && category !== "chaos_loop") return true;
  if (category === "chaos_loop" && isNaturalEmotional(text) && !isSevereCrisis(text)) {
    return true;
  }
  return isNaturalEmotional(text) && !/(^\/|help\b)/i.test(text);
}

/**
 * @param {string} text
 * @param {string} category
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @returns {null | { body: string, category: string }}
 */
function buildNaturalConversation(text, category, session, lang, userId) {
  if (!shouldUseNaturalConversation(text, category, session)) return null;

  const micro = buildMicroEmotionalReply(text, lang, session, userId);
  if (micro) {
    return {
      body: micro,
      category: category === "chaos_loop" ? "emotional_reflection" : category
    };
  }

  const r = getResponses(lang);
  const slot = detectNaturalSlot(text);
  const pool =
    r.humanLines?.[slot] ||
    r.humanPresence?.[slot] ||
    r.humanLines?.general ||
    r.humanPresence?.general ||
    [];
  if (!pool.length) return null;

  const body = pickUnseenVariant(session, userId, pool);
  return {
    body,
    category: category === "chaos_loop" ? "emotional_reflection" : category
  };
}

module.exports = {
  buildNaturalConversation,
  shouldUseNaturalConversation,
  detectNaturalSlot,
  isNaturalEmotional,
  isSevereCrisis
};
