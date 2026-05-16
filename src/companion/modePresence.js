/**
 * Phase 2 presence — conversation mode beats (replaces heavy mood layering).
 */

const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {string} coreBody
 * @param {string} mode ConversationMode
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string} category
 * @param {boolean} skipLead
 */
function applyModePresence(coreBody, mode, lang, session, category, skipLead = false) {
  const r = getResponses(lang);
  const turns = session?.messages?.length || 0;
  const parts = [];

  if (!skipLead) {
    const beats = r.modeBeats?.[mode];
    if (beats?.length) {
      parts.push(pickSeeded(beats, `${mode}_${category}_${turns}`));
    }
    if (turns > 0 && turns % 5 === 0 && r.patternAcks?.length) {
      parts.push(pickSeeded(r.patternAcks, `pat_${turns}`));
    }
  }

  parts.push(coreBody);

  const closes = r.modeCloses?.[mode];
  if (closes?.length) {
    parts.push("", pickSeeded(closes, `${mode}_c_${turns}`));
  }

  return lines(...parts.filter(Boolean));
}

module.exports = { applyModePresence };
