/**
 * Micro emotional intelligence — human cadence, no therapy voice.
 */

const { pickUnseenVariant } = require("../conversation/responseVariation");
const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const TRUST_CATEGORIES = new Set([
  "natural_conversation",
  "emotional_reflection",
  "life_flow",
  "light_conversation",
  "accountability_followup",
  "chaos_loop",
  "focus_drift",
  "body_energy"
]);

/**
 * @param {string} text
 */
function detectMicroSlot(text) {
  const t = String(text || "");
  if (/(magány|lonely|alone|singur|singurătate)/i.test(t)) return "lonely";
  if (/(kudarc|failed|failure|elbukott|didn't work|nem sikerült)/i.test(t)) return "failure";
  if (/(ambíció|ambitious|nagy cél|big goal|végig akarom|all in)/i.test(t)) return "ambitious";
  if (/(szégyen|shame|ashamed|rușine)/i.test(t)) return "shame";
  if (/(frustrált|frustrated|düh|furios|annoyed)/i.test(t)) return "frustration";
  if (/(kimerült|exhausted|burned out|epuizat|no energy)/i.test(t)) return "exhaustion";
  if (/(overwhelm|túl sok|szétes|chaos|telített)/i.test(t)) return "overwhelm";
  if (/(szétszórt|scattered|tabs|can't focus|fókusz)/i.test(t)) return "scattered";
  if (/(stressz|stress|nyomaszt|anxious)/i.test(t)) return "stress";
  if (/(fáradt|tired|mental fatigue|levert)/i.test(t)) return "fatigue";
  return null;
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function buildMicroEmotionalReply(text, lang, session, userId) {
  const slot = detectMicroSlot(text);
  if (!slot) return null;

  const r = getResponses(lang);
  const realism = r.emotionalRealism?.[slot] || [];
  const micro = r.microEmotional?.[slot] || r.humanLines?.[slot] || [];
  const pool = realism.length ? [...realism, ...micro] : micro;
  if (!pool.length) return null;

  let line = pickUnseenVariant(session, userId, pool);
  const questions = r.lowEgoQuestions?.[slot] || r.lowEgoQuestions?.general;
  if (questions?.length && Math.random() < 0.1) {
    const q = pickUnseenVariant(session, userId, questions);
    if (q && !line.includes(q)) line = `${line}\n${q}`;
  }
  return line;
}

/**
 * Light human reaction prefix — very rare.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} text
 * @param {string} category
 */
function maybeMicroReaction(session, lang, text, category) {
  if (!session?.onboardingCompleted) return null;
  if (!TRUST_CATEGORIES.has(category)) return null;
  const t = String(text || "").trim();
  if (t.length < 8) return null;
  if (Math.random() > 0.2) return null;

  const r = getResponses(lang);
  const pool = [...(r.humanImperfections || []), ...(r.microReactions || [])];
  if (!pool.length) return null;
  return pickSeeded(pool, `mreact_${category}_${session.messages?.length || 0}_${t.slice(0, 16)}`);
}

module.exports = {
  detectMicroSlot,
  buildMicroEmotionalReply,
  maybeMicroReaction,
  TRUST_CATEGORIES
};
