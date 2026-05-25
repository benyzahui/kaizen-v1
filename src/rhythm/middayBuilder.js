/**
 * Midday Stabilization — Dragon Blueprint structure.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickRhythmLine, resolveRhythmContext } = require("./rhythmPicker");
const { recordMantraUse } = require("../mantra/mantraEngine");
const { pickAdaptiveMantra } = require("../atmosphere/atmosphereEngine");

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
  const mantra = pickAdaptiveMantra("midday", lang, session, userId, dateKey);
  recordMantraUse(userId, mantra, session);

  return lines(attention, nervous, bodyCue, focusFix, mantra.text);
}

module.exports = { buildMiddayBlueprint };
