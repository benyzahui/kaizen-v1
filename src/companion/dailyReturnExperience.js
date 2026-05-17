/**
 * Daily return experience — emotional rhythm for morning / midday / evening / late night.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { dedupeLines } = require("./humanVoiceGuard");
const { getTimeSlot } = require("../core/timeContext");
const { pickUnseenVariant } = require("../conversation/responseVariation");

const NOTIFICATION_RE =
  /\b(don't forget|ne felejtsd|remember to check|napi emlékeztető|notification|push alert|gyere vissza holnap)\b/i;

const HYPE_RE =
  /\b(crush it|you got this|beast mode|10x|hustle|no excuses|warrior|elite zone|!!!|💪)\b/i;

const COACH_STACK_RE =
  /\b(protocol|framework|minimum victory|stabilizáló lépés|következő lépés)\b/i;

const QUESTIONNAIRE_RE =
  /^(mi a leg|what is the (one|first)|care e (primul|cel mai))/i;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function pickDailyReturnLine(slot, lang, session) {
  const r = getResponses(lang);
  const uid = String(session?.userId || session?.messages?.length || "0");

  let pool = [
    ...(r.dailyReturnRhythm?.[slot] || []),
    ...(r.rhythmLock?.[slot] || []),
    ...(r.microRituals?.[slot] || []),
    ...(r.emotionalDailyRhythm?.[slot] || [])
  ].filter(Boolean);

  if (slot === "morning" && session?.currentMission?.trim()) {
    const withMission = r.rhythmLock?.morningWithMission || [];
    pool = [
      ...withMission.map((line) =>
        line.replace(/\{mission\}/g, session.currentMission.trim().slice(0, 80))
      ),
      ...pool
    ];
  }

  if (!pool.length) return null;
  return pickUnseenVariant(session || {}, uid, pool);
}

/**
 * Soft return when user comes back after a gap — not streak guilt.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function maybeSoftDayReturn(session, lang) {
  if (!session?.onboardingCompleted) return null;
  if (Math.random() > 0.35) return null;

  const last = session.lastMorningCheckin;
  const today = todayKey();
  const yest = yesterdayKey();
  const gap = last && last !== today && last !== yest;

  if (!gap && (session.messages || []).length >= 2) return null;

  const r = getResponses(lang);
  const pool = r.dailyReturnRhythm?.dayReturn || [];
  if (!pool.length) return null;

  return pickSeeded(pool, `dayret_${last || "new"}_${session.userId || "0"}`);
}

/**
 * @param {string} body
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [session]
 */
function finalizeDailyReturnReply(body, slot, lang, session) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (NOTIFICATION_RE.test(line)) return false;
      if (HYPE_RE.test(line)) return false;
      if (COACH_STACK_RE.test(line) && line.length > 50) return false;
      if (QUESTIONNAIRE_RE.test(line)) return false;
      return true;
    });

  const maxLines = slot === "morning" ? 3 : 2;
  if (parts.length > maxLines) parts = parts.slice(0, maxLines);

  let b = dedupeLines(parts.join("\n"));
  if (b.length > 200) {
    b = parts.slice(0, 2).join("\n");
  }

  if (!b || b.length < 8) {
    const pick = pickDailyReturnLine(slot, lang, session || {});
    if (pick) b = pick;
  }

  const soft = maybeSoftDayReturn(session || {}, lang);
  if (soft && b && !b.includes(soft.slice(0, 12)) && slot === "morning" && Math.random() < 0.25) {
    const lines = b.split(/\n/).filter(Boolean);
    if (lines.length <= 2) {
      b = `${soft}\n${b}`;
      const all = b.split(/\n/).filter(Boolean);
      if (all.length > 3) b = all.slice(0, 3).join("\n");
    }
  }

  return b.trim();
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildLateNightGrounding(session, lang) {
  const body =
    pickDailyReturnLine("late_night", lang, session) ||
    "Késő van.\nNem kell ma mindent lezárni.";
  return finalizeDailyReturnReply(body, "late_night", lang, session);
}

/**
 * Resolve evening vs late-night slot for ritual copy.
 * @param {object} session
 * @returns {'evening'|'late_night'}
 */
function resolveEveningSlot(session) {
  return getTimeSlot(session || {}) === "late_night" ? "late_night" : "evening";
}

module.exports = {
  finalizeDailyReturnReply,
  pickDailyReturnLine,
  maybeSoftDayReturn,
  buildLateNightGrounding,
  resolveEveningSlot
};
