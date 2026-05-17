/**
 * Micro emotional intelligence — human cadence, no therapy voice.
 */

const { pickUnseenVariant } = require("../conversation/responseVariation");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {string} text
 */
function detectMicroSlot(text) {
  const t = String(text || "");
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
  const pool = r.microEmotional?.[slot] || r.humanLines?.[slot];
  if (!pool?.length) return null;

  return pickUnseenVariant(session, userId, pool);
}

module.exports = { detectMicroSlot, buildMicroEmotionalReply };
