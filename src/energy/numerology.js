/**
 * Day numerology for Energy module (universal day vibration).
 * Wraps shared reduction logic — themes are framing, not prophecy.
 */

const {
  dayNumber,
  reduceNumber,
  dayMeaning
} = require("../wisdom/numerology");

/**
 * @param {Date} [date]
 * @returns {{ vibration: number, reduced: number, theme: string, note: string }}
 */
function getUniversalDayVibration(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const vibration = dayNumber(d);
  const m = dayMeaning(vibration);
  const reduced = m && m.number != null ? m.number : reduceNumber(vibration, false);
  return {
    vibration,
    reduced,
    theme: m ? m.theme : "reflection",
    note: m ? m.note : ""
  };
}

module.exports = {
  getUniversalDayVibration,
  dayNumber,
  reduceNumber
};
