/**
 * Tropical sun-season context by calendar date (UTC).
 * Archetypal quality only — no charts, no individual fate.
 */

const { seasonForDate, seasonMeaning } = require("../wisdom/astrologyBasics");

/**
 * @param {Date} [date]
 * @returns {{ sign: string|null, element: string|null, theme: string|null, note: string|null }}
 */
function getAstrologicalSeason(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const sign = seasonForDate(d);
  const info = sign ? seasonMeaning(sign) : null;
  if (!info) {
    return { sign: null, element: null, theme: null, note: null };
  }
  return {
    sign: info.sign,
    element: info.element,
    theme: info.theme,
    note: info.note
  };
}

module.exports = { getAstrologicalSeason };
