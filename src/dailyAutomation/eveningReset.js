/**
 * Evening reset — 21:00 reflection + mantra + recovery.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickDailyPresenceLine } = require("../personality/v2/dailyPresenceV2");
const {
  pickPhaseMantra,
  pickReflectionQuestion,
  pickRecoveryRecommendation
} = require("./contentRouter");

const LABELS = {
  en: {
    title: "🐉 Evening reset.",
    reflection: "🪞 Reflection:",
    mantra: "Evening mantra:",
    recovery: "💧 Recovery:"
  },
  hu: {
    title: "🐉 Este — reset.",
    reflection: "🪞 Reflexió:",
    mantra: "Esti mantra:",
    recovery: "💧 Regeneráció:"
  },
  ro: {
    title: "🐉 Seară — reset.",
    reflection: "🪞 Reflecție:",
    mantra: "Mantra de seară:",
    recovery: "💧 Recuperare:"
  }
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 */
function buildEveningReset(lang, session, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const L = LABELS[locked] || LABELS.en;
  const opener = pickDailyPresenceLine(locked, "evening", userId, dateKey, session).split("\n")[0];

  const question =
    pickReflectionQuestion(locked, session, userId, dateKey, "evening") ||
    (locked === "hu"
      ? "Mit engedsz el ma estére?"
      : locked === "ro"
        ? "Ce lași în urmă diseară?"
        : "What do you release tonight?");

  const mantraPick = pickPhaseMantra("evening", locked, session, userId, dateKey);
  const mantra =
    mantraPick?.text ||
    (locked === "hu"
      ? "Elég volt mára."
      : locked === "ro"
        ? "Destul pentru azi."
        : "Enough for today.");

  const recovery = pickRecoveryRecommendation(locked, session, userId, dateKey, "evening");

  return lines(
    opener || L.title,
    "",
    L.reflection,
    question,
    "",
    L.mantra,
    `"${mantra}"`,
    "",
    L.recovery,
    recovery
  );
}

module.exports = { buildEveningReset, LABELS };
