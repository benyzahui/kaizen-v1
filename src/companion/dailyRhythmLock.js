/**
 * Daily rhythm lock — calm return cadence, no notification-spam energy.
 * Morning: clarity + direction · Midday: focus correction · Evening: release + recovery
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { dedupeLines } = require("./humanVoiceGuard");

const HYPE_RE =
  /\b(crush it|you got this|beast mode|10x|unlock|hustle|no excuses|győzd le|warrior|elite zone)\b/i;

const WISDOM_RE =
  /\b(chaos grows|identity is forged|nervous system remembers|elite zone|kovácsolódik)\b/i;

const SPAM_RE =
  /\b(!!!|🔥|💪|LET'S GO|GYERÜNK|don't forget to|ne felejtsd)\b/i;

const COACH_STACK_RE =
  /\b(protocol|framework|minimum victory|stabilizáló lépés|one block today|egy blokk mára)\b/i;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * @param {string} body
 * @param {'morning'|'midday'|'evening'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [session]
 */
function finalizeRhythmReply(body, slot, lang, session) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  parts = parts.filter((line) => {
    if (HYPE_RE.test(line) || WISDOM_RE.test(line) || SPAM_RE.test(line)) return false;
    if (COACH_STACK_RE.test(line) && line.length > 55) return false;
    return true;
  });

  const maxLines = slot === "morning" ? 3 : 2;
  if (parts.length > maxLines) parts = parts.slice(0, maxLines);

  let b = dedupeLines(parts.join("\n"));
  if (b.length > 220) {
    b = parts.slice(0, 2).join("\n");
  }

  if (!b) {
    const r = getResponses(lang);
    const fallback = r.rhythmLock?.[slot] || r.microRituals?.[slot] || [];
    if (fallback.length) {
      b = pickSeeded(fallback, `rhythm_fb_${slot}_${session?.userId || "0"}`);
    }
  }

  return b.trim();
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmMorning(message, session, lang) {
  const r = getResponses(lang);
  const uid = String(message?.from?.id ?? message?.chat?.id ?? "0");
  const mission = session?.currentMission?.trim();

  let pool = r.rhythmLock?.morning || r.microRituals?.morning || [];
  if (mission && r.rhythmLock?.morningWithMission?.length) {
    pool = r.rhythmLock.morningWithMission.map((line) =>
      line.replace(/\{mission\}/g, mission)
    );
  }

  const body =
    pool.length > 0
      ? pickSeeded(pool, `rhythm_m_${todayKey()}_${uid}`)
      : "Reggel.\nEgy irány elég ma.";

  return finalizeRhythmReply(body, "morning", lang, session);
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmMidday(session, lang) {
  const r = getResponses(lang);
  const uid = String(session?.userId || session?.messages?.length || "0");
  const pool = r.rhythmLock?.midday || r.microRituals?.midday || [];

  const body =
    pool.length > 0
      ? pickSeeded(pool, `rhythm_md_${todayKey()}_${uid}`)
      : r.rhythmMidday || "Dél.\nMég azon a sávon vagy?";

  return finalizeRhythmReply(body, "midday", lang, session);
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmEvening(message, session, lang) {
  const r = getResponses(lang);
  const uid = String(message?.from?.id ?? message?.chat?.id ?? "0");
  const pool = r.rhythmLock?.evening || r.microRituals?.evening || [];

  const body =
    pool.length > 0
      ? pickSeeded(pool, `rhythm_ev_${todayKey()}_${uid}`)
      : r.rhythmEvening || "Este.\nLeeresztés — nem új sprint.";

  return finalizeRhythmReply(body, "evening", lang, session);
}

module.exports = {
  buildRhythmMorning,
  buildRhythmMidday,
  buildRhythmEvening,
  finalizeRhythmReply
};
