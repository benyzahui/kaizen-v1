/**
 * Streak records — session-ready for Supabase JSON column `streaks`.
 */

const { todayKey } = require("../tracking/dailyStateModel");

const STREAK_KEYS = [
  "morning",
  "midday",
  "evening",
  "hydration",
  "movement",
  "fasting",
  "meditation",
  "focus"
];

/**
 * @returns {Record<string, { current: number, best: number, lastDate: string|null }>}
 */
function emptyStreaks() {
  const o = {};
  for (const k of STREAK_KEYS) {
    o[k] = { current: 0, best: 0, lastDate: null };
  }
  return o;
}

/**
 * @param {object} session
 */
function getStreaks(session) {
  const base = emptyStreaks();
  const raw = session?.streaks;
  if (!raw || typeof raw !== "object") return base;
  for (const k of STREAK_KEYS) {
    if (raw[k]) {
      base[k] = {
        current: Number(raw[k].current) || 0,
        best: Number(raw[k].best) || 0,
        lastDate: raw[k].lastDate || null
      };
    }
  }
  return base;
}

function yesterdayKey(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * @param {{ current: number, best: number, lastDate: string|null }} rec
 * @param {string} today
 */
function bumpStreakRecord(rec, today) {
  const y = yesterdayKey();
  let current = rec.current || 0;
  if (rec.lastDate === today) {
    return { ...rec, current, best: Math.max(rec.best || 0, current) };
  }
  if (rec.lastDate === y) {
    current += 1;
  } else {
    current = 1;
  }
  const best = Math.max(rec.best || 0, current);
  return { current, best, lastDate: today };
}

/**
 * @param {object} streaks
 */
function daysSinceLastAny(streaks) {
  const today = todayKey();
  let latest = null;
  for (const k of STREAK_KEYS) {
    const d = streaks[k]?.lastDate;
    if (d && (!latest || d > latest)) latest = d;
  }
  if (!latest) return 999;
  const a = new Date(`${today}T12:00:00Z`).getTime();
  const b = new Date(`${latest}T12:00:00Z`).getTime();
  return Math.floor((a - b) / 86400000);
}

module.exports = {
  STREAK_KEYS,
  emptyStreaks,
  getStreaks,
  bumpStreakRecord,
  yesterdayKey,
  daysSinceLastAny,
  todayKey
};
