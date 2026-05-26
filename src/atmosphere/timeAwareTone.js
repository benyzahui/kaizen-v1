/**
 * Wall-clock tone bands — morning / midday / evening / late night.
 */

const { getTimeSlot, localHour } = require("../core/timeContext");

const BANDS = {
  morning: {
    clarity: "high",
    softness: "low",
    pacing: "activate",
    rhythmMode: "activate",
    maxLines: 5,
    presenceChance: 0.04
  },
  midday: {
    clarity: "high",
    softness: "medium",
    pacing: "execute",
    rhythmMode: "execute",
    maxLines: 5,
    presenceChance: 0.05
  },
  evening: {
    clarity: "medium",
    softness: "high",
    pacing: "stabilize",
    rhythmMode: "stabilize",
    maxLines: 4,
    presenceChance: 0.07
  },
  late_night: {
    clarity: "low",
    softness: "high",
    pacing: "recover",
    rhythmMode: "recover",
    maxLines: 3,
    presenceChance: 0.1
  }
};

/**
 * @param {object} session
 * @param {Date} [now]
 */
function resolveTimeAwareTone(session, now = new Date()) {
  const slot = getTimeSlot(session, now);
  const hour = localHour(session, now);
  const band = BANDS[slot] || BANDS.evening;
  return {
    timeSlot: slot,
    hour,
    ...band
  };
}

module.exports = { BANDS, resolveTimeAwareTone };
