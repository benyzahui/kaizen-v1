/**
 * Wall-clock band for companion guidance (no external TZ API).
 * Uses optional session.companionHourOffset (minutes from UTC); else language-based guess.
 */

/**
 * @param {object} session
 * @returns {number} minutes east of UTC (e.g. 60 ≈ CET winter)
 */
function guessOffsetMinutes(session) {
  const raw = session?.companionHourOffset;
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    return Math.max(-720, Math.min(840, Math.round(raw)));
  }
  const pref = session?.preferredLanguage;
  if (pref === "hu" || pref === "ro") return 60;
  return 0;
}

/**
 * Approximate local hour [0..23] from UTC + offset.
 * @param {object} session
 * @param {Date} [now]
 */
function localHour(session, now = new Date()) {
  const off = guessOffsetMinutes(session);
  const totalMin = now.getUTCHours() * 60 + now.getUTCMinutes() + off;
  let h = Math.floor(totalMin / 60) % 24;
  if (h < 0) h += 24;
  return h;
}

/**
 * @typedef {'morning'|'midday'|'evening'|'late_night'} TimeSlot
 * @param {object} session
 * @param {Date} [now]
 * @returns {TimeSlot}
 */
function getTimeSlot(session, now = new Date()) {
  const h = localHour(session, now);
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "midday";
  if (h >= 17 && h < 22) return "evening";
  if (h >= 22 || h < 5) return "late_night";
  return "late_night";
}

module.exports = {
  guessOffsetMinutes,
  localHour,
  getTimeSlot
};
