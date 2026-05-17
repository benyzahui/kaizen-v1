/**
 * Daily rhythm lock — calm return cadence, no notification-spam energy.
 * Morning: clarity + direction · Midday: focus correction · Evening: release + recovery
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { dedupeLines } = require("./humanVoiceGuard");
const { blendEmotionalDailyRhythm } = require("./emotionalAttachment");
const {
  finalizeDailyReturnReply,
  pickDailyReturnLine,
  resolveEveningSlot,
  buildLateNightGrounding
} = require("./dailyReturnExperience");

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

  let b = dedupeLines(parts.join("\n"));
  const rhythmSlot = slot === "evening" ? resolveEveningSlot(session) : slot;
  return finalizeDailyReturnReply(b, rhythmSlot, lang, session);
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmMorning(message, session, lang) {
  const uid = String(message?.from?.id ?? message?.chat?.id ?? "0");

  const body =
    pickDailyReturnLine("morning", lang, { ...session, userId: uid }) ||
    "Reggel.\nEgy irány elég ma.";

  const blended = blendEmotionalDailyRhythm(body, "morning", lang, session);
  return finalizeRhythmReply(blended, "morning", lang, session);
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmMidday(session, lang) {
  const r = getResponses(lang);
  const uid = String(session?.userId || session?.messages?.length || "0");

  const body =
    pickDailyReturnLine("midday", lang, { ...session, userId: uid }) ||
    r.rhythmMidday ||
    "Dél.\nMég azon a sávon vagy?";

  const blended = blendEmotionalDailyRhythm(body, "midday", lang, session);
  return finalizeRhythmReply(blended, "midday", lang, session);
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildRhythmEvening(message, session, lang) {
  const r = getResponses(lang);
  const uid = String(message?.from?.id ?? message?.chat?.id ?? "0");
  const eveningSlot = resolveEveningSlot(session);
  const body =
    pickDailyReturnLine(eveningSlot, lang, { ...session, userId: uid }) ||
    r.rhythmEvening ||
    (eveningSlot === "late_night"
      ? "Késő van.\nNem kell ma mindent lezárni."
      : "Este.\nLeeresztés — nem új sprint.");

  const blended = blendEmotionalDailyRhythm(body, eveningSlot, lang, session);
  return finalizeRhythmReply(blended, "evening", lang, session);
}

module.exports = {
  buildRhythmMorning,
  buildRhythmMidday,
  buildRhythmEvening,
  buildLateNightGrounding,
  finalizeRhythmReply
};
