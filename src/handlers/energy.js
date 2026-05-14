/**
 * /energy — short daily energy reflection.
 *
 * Composes a strict 4-section message:
 *   1. Energy of the day
 *   2. Watch
 *   3. Aligned action
 *   4. Reminder
 *
 * No fortune-telling, no absolutes, no fear-based predictions.
 * Energy is always paired with a concrete, practical action.
 */

const tone = require("../personality/tone");
const { dayNumber, reduceNumber } = require("../wisdom/numerology");
const { seasonForDate, seasonMeaning } = require("../wisdom/astrologyBasics");

const ENERGY_LINES = Object.freeze({
  1: "Today supports clean beginnings and honest direction.",
  2: "Today supports patience, listening, and quiet cooperation.",
  3: "Today supports honest expression — words have weight.",
  4: "Today supports structure and steady, repeatable work.",
  5: "Today supports adaptable movement without scattering.",
  6: "Today supports caring with clear boundaries.",
  7: "Today supports simplification and emotional honesty.",
  8: "Today supports execution where the ground is already laid.",
  9: "Today supports integration — closing what is already done.",
  11: "Today supports vision anchored by simple structure.",
  22: "Today supports quiet building of something durable.",
  33: "Today supports calm leadership without losing yourself."
});

const WATCH_LINES = Object.freeze({
  1: "Don't confuse a new idea with a finished plan.",
  2: "Don't override your intuition to keep the peace.",
  3: "Watch for performance instead of truth.",
  4: "Don't mistake stiffness for discipline.",
  5: "Don't let movement become avoidance.",
  6: "Watch for over-giving that drains you.",
  7: "Do not scatter your attention.",
  8: "Don't force outcomes through pressure.",
  9: "Don't keep carrying what is already complete.",
  11: "Watch for inspiration without a grounded step.",
  22: "Don't announce work that isn't done yet.",
  33: "Watch the line between helping and self-erasure."
});

const ACTION_LINES = Object.freeze({
  1: "Take one clean first step. Quietly.",
  2: "Listen fully to one person before responding.",
  3: "Say the true thing you've been softening.",
  4: "Build one small structural piece, then stop.",
  5: "Move your body, then re-decide from a steadier place.",
  6: "Honor one boundary you've been bending.",
  7: "Finish one thing fully before opening a new loop.",
  8: "Execute the next obvious step. No theatrics.",
  9: "Close one open loop before adding anything new.",
  11: "Translate one insight into a 10-minute action.",
  22: "Do an hour of the boring foundational work.",
  33: "Help where it costs you nothing essential."
});

const REMINDER_LINES = Object.freeze({
  1: "Beginnings deserve patience, not pressure.",
  2: "Strength can be soft.",
  3: "Honest words land deeper than clever ones.",
  4: "Structure is care, repeated.",
  5: "Anchored people move faster, in the end.",
  6: "You can care and still say no.",
  7: "Your energy is not here to be wasted on noise.",
  8: "Discipline compounds quietly.",
  9: "Letting go is also a form of mastery.",
  11: "Vision without ground burns out.",
  22: "The boring work is the real work.",
  33: "Calm leadership starts inside."
});

function pickByDay(map, n) {
  if (map[n]) return map[n];
  const reduced = reduceNumber(n, false);
  return map[reduced] || "";
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function seasonAddendum(date) {
  const sign = seasonForDate(date);
  if (!sign) return "";
  const info = seasonMeaning(sign);
  if (!info) return "";
  return `${capitalize(info.sign)} season favors ${info.theme}.`;
}

function buildEnergyReply(date = new Date()) {
  const num = dayNumber(date);

  const energy = pickByDay(ENERGY_LINES, num);
  const watch = pickByDay(WATCH_LINES, num);
  const action = pickByDay(ACTION_LINES, num);
  const reminder = pickByDay(REMINDER_LINES, num);

  const season = seasonAddendum(date);
  const energyLine = season ? `${energy} ${season}` : energy;

  return tone.lines(
    "Energy of the day:",
    energyLine,
    "",
    "Watch:",
    watch,
    "",
    "Aligned action:",
    action,
    "",
    "Reminder:",
    reminder
  );
}

async function handleEnergy(_message) {
  return buildEnergyReply(new Date());
}

module.exports = {
  handleEnergy,
  buildEnergyReply,
  ENERGY_LINES,
  WATCH_LINES,
  ACTION_LINES,
  REMINDER_LINES
};
