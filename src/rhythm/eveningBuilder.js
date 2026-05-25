/**
 * Evening Reset — Dragon Blueprint structure.
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
 * @param {'evening'|'late_night'} slot
 * @param {object} [ctx]
 */
function buildEveningBlueprintCore(session, lang, userId, dateKey, slot, ctx) {
  const context = ctx || resolveRhythmContext(session, lang);

  const release = pickRhythmLine(slot, "release", context, session, userId, dateKey);
  const screen = pickRhythmLine(slot, "screen", context, session, userId, dateKey);
  const reflection = pickRhythmLine(slot, "reflection", context, session, userId, dateKey);
  const recovery = pickRhythmLine(slot, "recovery", context, session, userId, dateKey);
  const mantra = pickRhythmMantra(context, session, userId, `${dateKey}|${slot}`);

  return lines(release, screen, reflection, recovery, mantra);
}

function buildEveningBlueprint(session, lang, userId, dateKey, ctx) {
  return buildEveningBlueprintCore(session, lang, userId, dateKey, "evening", ctx);
}

function buildLateNightBlueprint(session, lang, userId, dateKey, ctx) {
  return buildEveningBlueprintCore(session, lang, userId, dateKey, "late_night", ctx);
}

module.exports = {
  buildEveningBlueprint,
  buildLateNightBlueprint,
  buildEveningBlueprintCore
};
