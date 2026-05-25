/**
 * Morning Activation — Dragon Blueprint structure.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickRhythmLine, resolveRhythmContext } = require("./rhythmPicker");
const { pickMantraForSlot, recordMantraUse } = require("../mantra/mantraEngine");

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} [ctx]
 */
function buildMorningBlueprint(session, lang, userId, dateKey, ctx) {
  const context = ctx || resolveRhythmContext(session, lang);

  const opener = pickRhythmLine("morning", "opener", context, session, userId, dateKey);
  const energy = pickRhythmLine("morning", "energy", context, session, userId, dateKey);
  let focus = pickRhythmLine("morning", "focus", context, session, userId, dateKey);
  if (context.mission && focus) {
    focus = `${focus} — ${context.mission.slice(0, 72)}`;
  }
  const body = pickRhythmLine("morning", "body", context, session, userId, dateKey);
  const discipline = pickRhythmLine(
    "morning",
    "discipline",
    context,
    session,
    userId,
    dateKey
  );
  const mantra = pickMantraForSlot("morning", lang, session, userId, dateKey, context);
  recordMantraUse(userId, mantra, session);

  const parts = [opener, energy, focus, body, discipline, mantra].filter(Boolean);
  if (context.userName && parts[0]) {
    parts[0] = parts[0].replace(/\{name\}/g, context.userName);
  }

  return lines(...parts);
}

module.exports = { buildMorningBlueprint };
