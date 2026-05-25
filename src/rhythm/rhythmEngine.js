/**
 * Daily Rhythm Engine — finalize, record, slot routing.
 */

const { enforceHardLanguageLock } = require("../i18n/languageHardLock");
const { dedupeLines } = require("../companion/humanVoiceGuard");
const { getTimeSlot } = require("../core/timeContext");
const { updateSession } = require("../session/sessionStore");
const { snippetKey } = require("../conversation/responseVariation");
const { resolveRhythmContext } = require("./rhythmPicker");
const { buildMorningBlueprint } = require("./morningBuilder");
const { buildMiddayBlueprint } = require("./middayBuilder");
const {
  buildEveningBlueprint,
  buildLateNightBlueprint
} = require("./eveningBuilder");

const HYPE_RE =
  /\b(crush it|you got this|beast mode|10x|unlock|hustle|no excuses|!!!|💪|LET'S GO)\b/i;

const MAX_LINES = {
  morning: 10,
  midday: 6,
  evening: 8,
  late_night: 6
};

function todayKey(dateKey) {
  if (dateKey) return dateKey;
  return new Date().toISOString().slice(0, 10);
}

function recordRhythmLines(userId, lineList, session) {
  const used = new Set(session?.recentCoachSnippets || []);
  for (const line of lineList) {
    if (line) used.add(snippetKey(line));
  }
  const openers = session?.rhythmRecentOpeners || [];
  if (lineList[0]) {
    openers.push(snippetKey(lineList[0]));
    while (openers.length > 21) openers.shift();
  }
  updateSession(userId, {
    recentCoachSnippets: [...used].slice(-48),
    rhythmRecentOpeners: openers,
    lastRhythmAt: Date.now()
  });
}

function selectDailyRhythmSlot(session) {
  const slot = getTimeSlot(session || {});
  if (slot === "late_night") return "late_night";
  if (slot === "morning") return "morning";
  if (slot === "midday" || slot === "afternoon") return "midday";
  return "evening";
}

function finalizeBlueprintRhythm(body, slot, lang, session, userId) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => line && !HYPE_RE.test(line));

  const max = MAX_LINES[slot] || 8;
  if (parts.length > max) parts = parts.slice(0, max);

  let b = dedupeLines(parts.join("\n"));
  if (b.length > 560) {
    b = parts.slice(0, Math.min(max, 6)).join("\n");
  }

  b = enforceHardLanguageLock(b, lang, session, userId);
  return b.trim();
}

function buildRhythmForSlot(slot, session, lang, userId, dateKey) {
  const dk = todayKey(dateKey);
  const ctx = resolveRhythmContext(session, lang);
  let raw = "";
  if (slot === "morning") raw = buildMorningBlueprint(session, lang, userId, dk, ctx);
  else if (slot === "midday") raw = buildMiddayBlueprint(session, lang, userId, dk, ctx);
  else if (slot === "late_night") raw = buildLateNightBlueprint(session, lang, userId, dk, ctx);
  else raw = buildEveningBlueprint(session, lang, userId, dk, ctx);
  recordRhythmLines(userId, raw.split(/\n/).filter(Boolean), session);
  return finalizeBlueprintRhythm(raw, slot, lang, session, userId);
}

module.exports = {
  resolveRhythmContext,
  recordRhythmLines,
  selectDailyRhythmSlot,
  finalizeBlueprintRhythm,
  buildRhythmForSlot,
  todayKey,
  MAX_LINES
};
