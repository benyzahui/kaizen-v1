/**
 * Daily Rhythm Engine — V2.1 psyche layer.
 *
 * Handles /morning, /midday, /evening (rich versions), /daily.
 * Also hosts /path, /level, /streak for Dragon Path display.
 *
 * NOTE: This is still rule-based copy + session state.
 * Future AI brain: replace body builders with LLM calls that receive
 * session profile + time slot and return the same string shape.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");
const { buildDailyEnergyMessage } = require("../energy/dailyEnergy");
const { pickMantra } = require("./dragonTraining");
const { getTimeSlot } = require("../core/timeContext");
const { pickSeeded } = require("../personality/tone");

const DRAGON_LEVELS = [
  null,           // 0 unused
  "Initiate",     // 1
  "Discipline",   // 2
  "Clarity",      // 3
  "Control",      // 4
  "Stability",    // 5
  "Execution",    // 6
  "Dragon Mind"   // 7
];

const DRAGON_LEVELS_HU = [
  null, "Kezdő", "Fegyelem", "Tisztánlátás", "Kontroll",
  "Stabilitás", "Végrehajtás", "Sárkány Elme"
];

const DRAGON_LEVELS_RO = [
  null, "Inițiat", "Disciplină", "Claritate", "Control",
  "Stabilitate", "Execuție", "Dragon Mind"
];

function levelName(n, lang) {
  const idx = Math.max(1, Math.min(7, Number(n) || 1));
  if (lang === "hu") return DRAGON_LEVELS_HU[idx];
  if (lang === "ro") return DRAGON_LEVELS_RO[idx];
  return DRAGON_LEVELS[idx];
}

function uid(msg) {
  return String(msg.from?.id ?? msg.chat?.id ?? "");
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Mark morning check-in and update streak.
 */
function recordMorningCheckin(userId, session) {
  const today = todayKey();
  if (session.lastMorningCheckin === today) return; // already done today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak =
    session.lastMorningCheckin === yesterday
      ? (Number(session.dailyStreak) || 0) + 1
      : 1;

  updateSession(userId, {
    lastMorningCheckin: today,
    dailyStreak: streak,
    programMode: session.programMode || "dragon_training"
  });
}

function recordEveningMirror(userId) {
  updateSession(userId, { lastEveningMirror: todayKey() });
}

/* ------------------------------------------------------------------ */
/*  /morning                                                            */
/* ------------------------------------------------------------------ */

function buildMorningReply(message, session, lang) {
  const { buildMorningProtocolReply } = require("./dailyProtocol");
  return buildMorningProtocolReply(message, session, lang);
}

/* ------------------------------------------------------------------ */
/*  /midday                                                             */
/* ------------------------------------------------------------------ */

function buildMiddayReply(session, lang) {
  const r = getResponses(lang);
  const ritual = r.microRituals?.midday || [];
  if (ritual.length) {
    return pickSeeded(ritual, `midday_cmd_${todayKey()}_${session.messages?.length || 0}`);
  }
  return r.rhythmMidday || r.tMiddayGateTitle || "Midday check.";
}

/* ------------------------------------------------------------------ */
/*  /evening (rich override)                                           */
/* ------------------------------------------------------------------ */

function buildEveningReply(message, session, lang) {
  const r = getResponses(lang);
  recordEveningMirror(uid(message));
  const ritual = r.microRituals?.evening || [];
  if (ritual.length) {
    return pickSeeded(ritual, `evening_cmd_${todayKey()}_${session.messages?.length || 0}`);
  }
  return r.rhythmEvening || r.tEveningGateTitle || "Evening mirror.";
}

/* ------------------------------------------------------------------ */
/*  /daily — full day summary                                          */
/* ------------------------------------------------------------------ */

function buildDailyReply(message, session, lang) {
  const r = getResponses(lang);
  const slot = getTimeSlot(session);
  const energySummary = buildDailyEnergyMessage(new Date(), lang, "general");

  let slotBlock = "";
  if (slot === "morning") slotBlock = r.tDailySlotMorning;
  else if (slot === "midday") slotBlock = r.tDailySlotMidday;
  else if (slot === "evening" || slot === "late_night") slotBlock = r.tDailySlotEvening;

  return lines(
    r.tDailyTitle,
    "",
    slotBlock,
    "",
    energySummary,
    "",
    r.tDailyNextPrompt
  );
}

/* ------------------------------------------------------------------ */
/*  Dragon Path commands                                               */
/* ------------------------------------------------------------------ */

function buildPathReply(session, lang) {
  const r = getResponses(lang);
  const level = Number(session.dragonLevel) || 1;
  const name = levelName(level, lang);
  const tier = session.membershipTier || "free";
  const streak = Number(session.dailyStreak) || 0;
  const mission = session.currentMission?.trim() || null;

  return lines(
    r.tPathTitle,
    "",
    `${r.tPathLevel}: ${level} — ${name}`,
    `${r.tPathTier}: ${tier}`,
    `${r.tPathStreak}: ${streak}`,
    mission ? `${r.tPathMission}: ${mission}` : r.tPathNoMission,
    "",
    r.tPathNextHint
  );
}

function buildLevelReply(session, lang) {
  const r = getResponses(lang);
  const level = Math.max(1, Math.min(7, Number(session.dragonLevel) || 1));
  const name = levelName(level, lang);
  const nextName = level < 7 ? levelName(level + 1, lang) : null;

  return lines(
    r.tLevelTitle,
    "",
    `${r.tLevelCurrent}: ${level} — ${name}`,
    nextName
      ? `${r.tLevelNext}: ${level + 1} — ${nextName}`
      : r.tLevelMaxReached,
    "",
    r.tLevelRequirement(level, lang)
  );
}

function buildStreakReply(session, lang) {
  const r = getResponses(lang);
  const streak = Number(session.dailyStreak) || 0;
  const lastCheckin = session.lastMorningCheckin || null;

  return lines(
    r.tStreakTitle,
    "",
    streak > 0
      ? r.tStreakCount(streak)
      : r.tStreakZero,
    lastCheckin ? `${r.tStreakLastCheckin}: ${lastCheckin}` : "",
    "",
    streak < 3 ? r.tStreakBuildHint : r.tStreakKeepHint
  );
}

module.exports = {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply,
  buildDailyReply,
  buildPathReply,
  buildLevelReply,
  buildStreakReply,
  recordMorningCheckin,
  recordEveningMirror,
  levelName
};
