/**
 * Daily rhythm lock — Dragon Blueprint engine (morning / midday / evening).
 */

const { blendEmotionalDailyRhythm } = require("./emotionalAttachment");
const {
  resolveEveningSlot,
  buildLateNightGrounding: legacyLateNight
} = require("./dailyReturnExperience");
const { buildMorningBlueprint } = require("../rhythm/morningBuilder");
const { buildMiddayBlueprint } = require("../rhythm/middayBuilder");
const {
  buildEveningBlueprint,
  buildLateNightBlueprint
} = require("../rhythm/eveningBuilder");
const {
  finalizeBlueprintRhythm,
  recordRhythmLines
} = require("../rhythm/rhythmEngine");

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmMorning(message, session, lang) {
  const uid = String(message?.from?.id ?? message?.chat?.id ?? "0");
  const raw = buildMorningBlueprint(session, lang, uid);
  const blended = blendEmotionalDailyRhythm(raw, "morning", lang, session);
  recordRhythmLines(uid, blended.split(/\n/).filter(Boolean), session);
  return finalizeBlueprintRhythm(blended, "morning", lang, session, uid);
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmMidday(session, lang) {
  const uid = String(session?.userId || session?.messages?.length || "0");
  const raw = buildMiddayBlueprint(session, lang, uid);
  const blended = blendEmotionalDailyRhythm(raw, "midday", lang, session);
  recordRhythmLines(uid, blended.split(/\n/).filter(Boolean), session);
  return finalizeBlueprintRhythm(blended, "midday", lang, session, uid);
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmEvening(message, session, lang) {
  const uid = String(message?.from?.id ?? message?.chat?.id ?? "0");
  const eveningSlot = resolveEveningSlot(session);
  const raw =
    eveningSlot === "late_night"
      ? buildLateNightBlueprint(session, lang, uid)
      : buildEveningBlueprint(session, lang, uid);
  const blended = blendEmotionalDailyRhythm(raw, eveningSlot, lang, session);
  recordRhythmLines(uid, blended.split(/\n/).filter(Boolean), session);
  return finalizeBlueprintRhythm(blended, eveningSlot, lang, session, uid);
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildLateNightGrounding(session, lang) {
  const uid = String(session?.userId || "0");
  const raw = buildLateNightBlueprint(session, lang, uid);
  if (!raw?.trim()) return legacyLateNight(session, lang);
  recordRhythmLines(uid, raw.split(/\n/).filter(Boolean), session);
  return finalizeBlueprintRhythm(raw, "late_night", lang, session, uid);
}

module.exports = {
  buildRhythmMorning,
  buildRhythmMidday,
  buildRhythmEvening,
  buildLateNightGrounding
};
