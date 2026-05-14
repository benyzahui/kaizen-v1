/**
 * Daily energy interpreter.
 *
 * Composes a short, grounded message from optional inputs:
 *   - date            (Date | string)         default: now
 *   - dayNum          (number)                default: derived from date
 *   - moonPhase       (string)                e.g. "full", "waning crescent"
 *   - zodiacSeason    (string)                e.g. "capricorn"
 *   - emotionalState  (string)                e.g. "tense", "tired", "steady"
 *   - focusArea       (string)                free text
 *
 * Output: 2–4 short lines, Telegram-sized, never deterministic.
 * Always ends on an action line. Never predicts.
 */

const { lines } = require("../personality/tone");
const { dayNumber, dayMeaning } = require("./numerology");
const { phaseMeaning } = require("./moonPhases");
const { seasonMeaning } = require("./astrologyBasics");
const { CORE_PHILOSOPHY } = require("./universalLaws");

const STATE_NOTES = Object.freeze({
  tense: "Soften the jaw and shoulders before you decide anything.",
  tired: "Slow is allowed. Pick one small thing and finish it.",
  scattered: "Land in one place. Five minutes, one task, no tabs.",
  flat: "You don't need to manufacture feeling. Move the body lightly.",
  steady: "Use this clarity for one decision you've been postponing.",
  sharp: "Edge is fuel. Direct it — don't fire it at people.",
  anxious: "Longer exhale than inhale. Then re-read your own plan.",
  heavy: "Heaviness is data, not identity. Walk, then decide."
});

function openerFor(num) {
  const m = dayMeaning(num);
  if (!m) return "";
  return `Today carries a ${m.theme} energy. ${m.note}`;
}

function layerLine(moonPhase, zodiacSeason) {
  const parts = [];
  if (moonPhase) {
    const p = phaseMeaning(moonPhase);
    if (p) parts.push(p.note);
  }
  if (zodiacSeason) {
    const s = seasonMeaning(zodiacSeason);
    if (s) parts.push(s.note);
  }
  return parts.join(" ");
}

function stateLine(emotionalState) {
  if (!emotionalState) return "";
  return STATE_NOTES[String(emotionalState).toLowerCase()] || "";
}

function actionLine(focusArea) {
  return focusArea
    ? `Choose one clean action toward ${focusArea}. Protect your nervous system.`
    : "Choose one clean action and protect your nervous system.";
}

function interpretDailyEnergy({
  date = new Date(),
  dayNum,
  moonPhase,
  zodiacSeason,
  emotionalState,
  focusArea
} = {}) {
  const num = dayNum ?? dayNumber(date);
  return lines(
    openerFor(num),
    layerLine(moonPhase, zodiacSeason),
    stateLine(emotionalState),
    actionLine(focusArea)
  );
}

module.exports = {
  CORE_PHILOSOPHY,
  STATE_NOTES,
  interpretDailyEnergy
};
