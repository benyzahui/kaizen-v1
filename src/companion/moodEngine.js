/**
 * Branded emotional modes — cinematic identity, not therapy labels.
 *
 * ⚔️ Discipline · 🌊 Recovery · 🔥 Momentum · 🌑 Reflection · 🐉 Dragon
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

/** @typedef {'discipline'|'recovery'|'momentum'|'reflection'|'dragon'} MoodMode */

const MOOD_META = {
  discipline: { emoji: "⚔️", label: "Discipline" },
  recovery: { emoji: "🌊", label: "Recovery" },
  momentum: { emoji: "🔥", label: "Momentum" },
  reflection: { emoji: "🌑", label: "Reflection" },
  dragon: { emoji: "🐉", label: "Dragon" }
};

/**
 * Map internal mentor mode → branded mood.
 * @param {object} state from analyzeUserState
 * @param {object} memory from loadMemoryHierarchy
 */
function resolveMoodMode(state, memory) {
  const streak = Number(memory?.permanent?.dailyStreak) || 0;
  const level = Number(memory?.permanent?.dragonLevel) || 1;
  const serious = Number(state.seriousness) ?? 50;

  if (
    streak >= 5 &&
    serious >= 55 &&
    state.energyLevel >= 6 &&
    memory?.permanent?.onboardingCompleted
  ) {
    return "dragon";
  }
  if (state.mentorMode === "recovery_mode" || state.energyLevel <= 4) {
    return "recovery";
  }
  if (
    state.mentorMode === "warrior_mode" ||
    state.momentum === "rising" && state.energyLevel >= 6
  ) {
    return "momentum";
  }
  if (
    state.mentorMode === "disciplined_push" ||
    state.mentorMode === "sharp_focus"
  ) {
    return "discipline";
  }
  if (state.mentorMode === "reflective_mode") {
    return "reflection";
  }
  if (state.mentorMode === "silent_stability") {
    return "momentum";
  }
  return "discipline";
}

function moodBadge(mood, lang) {
  const r = getResponses(lang);
  const meta = MOOD_META[mood] || MOOD_META.discipline;
  const labels = r.moodLabels || {};
  const label = labels[mood] || meta.label;
  return `${meta.emoji} ${label}`;
}

/**
 * Short cinematic beat — 1–2 lines max.
 */
function pickMoodBeat(mood, lang, session, category) {
  const r = getResponses(lang);
  const pool = r.moodBeats?.[mood];
  if (!pool?.length) return null;
  const seed = `${mood}_${category}_${(session?.messages || []).length}`;
  return pickSeeded(pool, seed);
}

/**
 * Optional mantra line (seeded daily).
 */
function pickMantraLine(mood, lang, session) {
  const r = getResponses(lang);
  const pool = r.moodMantras?.[mood] || r.moodMantras?.discipline;
  if (!pool?.length) return null;
  const day = new Date().toISOString().slice(0, 10);
  const seed = `${mood}_${day}_${session?.userName || "anon"}`;
  return pickSeeded(pool, seed);
}

/**
 * Compose mood header + optional beat (premium, short).
 */
function formatMoodOpening(mood, lang, session, category) {
  const beat = pickMoodBeat(mood, lang, session, category);
  const badge = moodBadge(mood, lang);
  if (!beat) return badge;
  return lines(badge, beat);
}

function moodSessionPatch(mood) {
  return { currentMoodMode: mood };
}

module.exports = {
  MOOD_META,
  resolveMoodMode,
  moodBadge,
  pickMoodBeat,
  pickMantraLine,
  formatMoodOpening,
  moodSessionPatch
};
