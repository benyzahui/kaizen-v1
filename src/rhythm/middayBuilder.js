/**
 * Midday Stabilization — Dragon Blueprint structure.
 */

const { lines } = require("../personality/kaizenVoice");
const {
  pickRhythmLine,
  pickRhythmMantra,
  resolveRhythmContext
} = require("./rhythmPicker");

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} [ctx]
 */
function buildMiddayBlueprint(session, lang, userId, dateKey, ctx) {
  const context = ctx || resolveRhythmContext(session, lang);

  const attention = pickRhythmLine(
    "midday",
    "attention",
    context,
    session,
    userId,
    dateKey
  );
  const nervous = pickRhythmLine("midday", "nervous", context, session, userId, dateKey);
  const bodyCue = pickRhythmLine("midday", "bodyCue", context, session, userId, dateKey);
  const focusFix = pickRhythmLine("midday", "focusFix", context, session, userId, dateKey);
  const mantra = pickRhythmMantra(context, session, userId, `${dateKey}|mid`);

  return lines(attention, nervous, bodyCue, focusFix, mantra);
}

module.exports = { buildMiddayBlueprint };
