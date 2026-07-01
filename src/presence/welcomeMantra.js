/**
 * Köszöntő + Dragon Blueprint mantra — /start és visszatérő üdvözlés.
 */

const { pickSeeded, lines } = require("../personality/kaizenVoice");
const { pickKnowledgeMantra } = require("../knowledgeCore/knowledgeSelector");
const { pickExpandedMantra } = require("../mantras/expandedMantraEngine");
const { pickWarriorMantra } = require("../mantras/dragonWarriorMantraBank");
const { RETURNING, MANTRA_INTRO, RETURN_FOOTER } = require("../personality/v2/sergeantVoice");

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {'morning'|'midday'|'evening'} [phase]
 */
function pickWelcomeMantra(lang, session, userId, phase = "morning") {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const dk = new Date().toISOString().slice(0, 10);

  const warrior = pickWarriorMantra(locked, session, userId, dk, phase);
  if (warrior) return warrior;

  const fromCore = pickKnowledgeMantra(phase, locked, session, userId, dk);
  if (fromCore?.text) return fromCore.text;

  const expanded = pickExpandedMantra(phase, locked, session, userId, dk, {
    atmosphere: "warrior",
    energyState: session?.energyState || "stable"
  });
  if (expanded?.text) return expanded.text;

  const fallbacks = {
    hu: "A figyelem ritkább erőforrás, mint az idő. Ma egy irány.",
    en: "Attention is rarer than time. One direction today.",
    ro: "Atenția e mai rară decât timpul. O direcție azi."
  };
  return fallbacks[locked] || fallbacks.en;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function buildReturningStartReply(lang, session, userId) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const name = session?.userName;
  const greet = (RETURNING[locked] || RETURNING.en)(name);
  const mantra = pickWelcomeMantra(locked, session, userId, "morning");
  const intro = MANTRA_INTRO[locked] || MANTRA_INTRO.en;
  const footer = RETURN_FOOTER[locked] || RETURN_FOOTER.en;
  return lines(greet, intro, `"${mantra}"`, "", footer);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function buildWelcomeWithMantra(lang, session, userId) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const mantra = pickWelcomeMantra(locked, session, userId, "morning");
  const intro = MANTRA_INTRO[locked] || MANTRA_INTRO.en;
  return lines("", intro, `"${mantra}"`);
}

module.exports = {
  pickWelcomeMantra,
  buildReturningStartReply,
  buildWelcomeWithMantra
};
