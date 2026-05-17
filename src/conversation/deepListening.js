/**
 * Listening-first replies — presence before protocol.
 */

const { pickUnseenVariant } = require("./responseVariation");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {string} text
 */
function isListeningMoment(text) {
  return /(nem tudom mi van|mi van velem|mi történik velem|nem értem magam|elveszett vagyok|don't know what's wrong|what's wrong with me|confused about myself|nu știu ce am|nu mă înțeleg)/i.test(
    String(text || "")
  );
}

/**
 * @param {string} text
 */
function detectListeningSlot(text) {
  const t = String(text || "");
  if (isListeningMoment(t)) return "confusion";
  if (/(bizonytalan|uncertain|nem tudom mi lesz|don't know what will)/i.test(t)) return "uncertainty";
  if (/(nem tudom mit|elvesztett|don't know what|lost)/i.test(t)) return "lost";
  return null;
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function buildListeningReply(text, lang, session, userId) {
  const slot = detectListeningSlot(text);
  if (!slot) return null;

  const r = getResponses(lang);
  const questions = r.listeningQuestions?.[slot] || r.listeningQuestions?.general || [];
  if (!questions.length) return null;

  if (Math.random() < 0.62) {
    return pickUnseenVariant(session, userId, questions);
  }

  const ack = r.listeningAck || r.silenceBeats || [];
  const q = pickUnseenVariant(session, userId, questions);
  if (ack.length && Math.random() < 0.5) {
    const a = pickUnseenVariant(session, userId, ack);
    if (a && q && !a.includes(q)) return `${a}\n${q}`;
  }
  return q;
}

module.exports = { isListeningMoment, detectListeningSlot, buildListeningReply };
