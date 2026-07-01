/**
 * Morning activation — 06:00 Dragon Blueprint guidance.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickDailyPresenceLine } = require("../personality/v2/dailyPresenceV2");
const { dragonTierName } = require("./dragonProgression");
const { pickDailyFocus, pickPhaseMantra, pickPhaseChallenge } = require("./contentRouter");
const { pickWarriorMantra } = require("../mantras/dragonWarriorMantraBank");

const LABELS = {
  en: {
    reminder: "Today's reminder:",
    focus: "💧 Focus:",
    challenge: "🎯 Challenge:"
  },
  hu: {
    reminder: "Mai emlékeztető:",
    focus: "💧 Fókusz:",
    challenge: "🎯 Kihívás:"
  },
  ro: {
    reminder: "Reminder de azi:",
    focus: "💧 Focus:",
    challenge: "🎯 Provocare:"
  }
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {Date} [now]
 */
function buildMorningActivation(lang, session, userId, dateKey, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const L = LABELS[locked] || LABELS.en;
  const greeting = pickDailyPresenceLine(locked, "morning", userId, dateKey, session).split("\n")[0];
  const tier = dragonTierName(session, locked);

  const mantraPick = pickWarriorMantra(locked, session, userId, dateKey, "morning");
  const mantra =
    mantraPick ||
    pickPhaseMantra("morning", locked, session, userId, dateKey)?.text || (locked === "hu" ? "A fegyelem szabadságot ad." : locked === "ro" ? "Disciplina creează libertate." : "Discipline creates freedom.");
  const focus = pickDailyFocus(locked, session, userId, dateKey);
  const challenge =
    pickPhaseChallenge("morning", locked, session, userId, dateKey) ||
    (locked === "hu"
      ? "10 perc séta telefon nélkül."
      : locked === "ro"
        ? "10 minute de mers fără telefon."
        : "10 minute walk without your phone.");

  return lines(
    greeting,
    `⭐ ${tier}`,
    "",
    L.reminder,
    `"${mantra}"`,
    "",
    L.focus,
    focus,
    "",
    L.challenge,
    challenge
  );
}

module.exports = { buildMorningActivation, LABELS };
