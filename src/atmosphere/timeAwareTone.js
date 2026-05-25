/**
 * Wall-clock tone bands — morning / midday / evening / late night.
 */

const { getTimeSlot, localHour } = require("../core/timeContext");

const BANDS = {
  morning: {
    clarity: "high",
    softness: "low",
    pacing: "activate",
    maxLines: 6,
    presenceChance: 0.04
  },
  midday: {
    clarity: "high",
    softness: "medium",
    pacing: "steady",
    maxLines: 5,
    presenceChance: 0.05
  },
  evening: {
    clarity: "medium",
    softness: "high",
    pacing: "reflect",
    maxLines: 5,
    presenceChance: 0.08
  },
  late_night: {
    clarity: "low",
    softness: "high",
    pacing: "slow",
    maxLines: 4,
    presenceChance: 0.12
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
