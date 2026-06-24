/**
 * Dragon Blueprint command builders — /today /reflection /challenge
 */

const { lines } = require("../personality/kaizenVoice");
const { getTimeSlot } = require("../core/timeContext");
const { buildDailyPhasePresence } = require("../program/dailyProgramPresence");
const { buildDailyStatusSnapshot } = require("../tracking/statusEngine");
const { getDragonBlueprintCompanionLine } = require("./dragonBlueprintCompanion");
const {
  pickKnowledgeReflection,
  pickKnowledgeChallenge,
  pickKnowledgeQuote,
  pickKnowledgeMantra
} = require("./knowledgeSelector");
const { KNOWLEDGE_CATEGORIES } = require("./knowledgeSchema");

/**
 * @param {string|number} userId
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {Date} [now]
 */
function buildTodayCommand(userId, session, lang, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = getTimeSlot(session, now);
  const dk = now.toISOString().slice(0, 10);
  const companion = getDragonBlueprintCompanionLine(locked, phase, userId, dk);
  const mantra = pickKnowledgeMantra(phase, locked, session, userId, dk);
  const quote = pickKnowledgeQuote(locked, session, userId, dk, phase);
  const status = buildDailyStatusSnapshot(session, locked, userId);

  const labels =
    locked === "hu"
      ? { today: "Ma", mantra: "Mantra", path: "Út" }
      : locked === "ro"
        ? { today: "Azi", mantra: "Mantra", path: "Drum" }
        : { today: "Today", mantra: "Mantra", path: "Path" };

  return lines(
    "🐉 Dragon Blueprint",
    companion,
    "",
    `${labels.today}: ${phase}`,
    mantra?.text ? `${labels.mantra}: ${mantra.text}` : "",
    quote?.text ? `⚔ ${quote.text}` : "",
    "",
    status
  ).trim();
}

/**
 * @param {string|number} userId
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {Date} [now]
 */
function buildReflectionCommand(userId, session, lang, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = getTimeSlot(session, now);
  const dk = now.toISOString().slice(0, 10);
  const reflection = pickKnowledgeReflection(locked, session, userId, dk, phase);

  const header =
    locked === "hu"
      ? "🌘 Reflexió"
      : locked === "ro"
        ? "🌘 Reflecție"
        : "🌘 Reflection";

  const footer =
    locked === "hu"
      ? "Egy őszinte sor elég."
      : locked === "ro"
        ? "O linie sinceră e suficientă."
        : "One honest line is enough.";

  return lines(
    header,
    reflection?.text || footer,
    "",
    footer
  ).trim();
}

/**
 * @param {string|number} userId
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {Date} [now]
 */
function buildChallengeCommand(userId, session, lang, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const phase = getTimeSlot(session, now);
  const dk = now.toISOString().slice(0, 10);
  const challenge = pickKnowledgeChallenge(locked, session, userId, dk, phase);

  const header =
    locked === "hu"
      ? "⚔ Mikro kihívás"
      : locked === "ro"
        ? "⚔ Micro provocare"
        : "⚔ Micro challenge";

  return lines(header, challenge?.text || getDragonBlueprintCompanionLine(locked, phase, userId, dk)).trim();
}

/**
 * Phase command body — uses existing daily presence + knowledge mantra priority.
 */
function buildPhaseKnowledgeBlock(phase, lang, session, userId, dateKey, now = new Date()) {
  return buildDailyPhasePresence(phase, lang, session, userId, dateKey, now);
}

module.exports = {
  buildTodayCommand,
  buildReflectionCommand,
  buildChallengeCommand,
  buildPhaseKnowledgeBlock,
  KNOWLEDGE_CATEGORIES
};
