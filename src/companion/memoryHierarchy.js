/**
 * Memory Hierarchy — permanent / session / short-term layers.
 *
 * PERMANENT: survives /clear, persisted to Supabase when available.
 * SESSION: 24h TTL, today's rhythm and emotional trend.
 * SHORT: last N turns for continuity and anti-repetition.
 */

const SHORT_MEMORY_LIMIT = 15;

/**
 * @typedef {object} PermanentMemory
 * @property {string|null} userName
 * @property {string|null} preferredLanguage
 * @property {string|null} userPrimaryPath
 * @property {string|null} userPurpose
 * @property {string|null} userGoal30Days
 * @property {string|null} userMainObstacle
 * @property {string|null} userIntensityPreference
 * @property {string|null} currentMission
 * @property {number} seriousnessScore
 * @property {number} dragonLevel
 * @property {string|null} membershipTier
 */

/**
 * @typedef {object} SessionMemory
 * @property {string|null} todayFocus
 * @property {string|null} emotionalTrend
 * @property {string|null} activeMission
 * @property {string|null} timeSlot
 * @property {string|null} lastMentorMode
 * @property {string|null} rhythmPhase
 */

/**
 * @typedef {object} ShortMemory
 * @property {{ text: string, category: string|null, ts: number }[]} turns
 * @property {string|null} lastCategory
 * @property {string|null} lastTopic
 * @property {string} momentum
 * @property {object[]} responseStructures
 */

/**
 * @param {object} session
 */
function loadMemoryHierarchy(session) {
  const s = session || {};
  const turns = (s.messages || []).slice(-SHORT_MEMORY_LIMIT);

  const permanent = {
    userName: s.userName ?? s.first_name ?? null,
    preferredLanguage: s.preferredLanguage ?? null,
    userPrimaryPath: s.userPrimaryPath ?? null,
    userPurpose: s.userPurpose ?? null,
    userGoal30Days: s.userGoal30Days ?? null,
    userMainObstacle: s.userMainObstacle ?? null,
    userMainObstacleNote: s.userMainObstacleNote ?? null,
    userIntensityPreference: s.userIntensityPreference ?? null,
    currentMission: s.currentMission ?? null,
    seriousnessScore: Number(s.seriousnessScore) ?? 50,
    dailyStreak: Number(s.dailyStreak) || 0,
    dragonLevel: Number(s.dragonLevel) || 1,
    membershipTier: s.membershipTier ?? "free",
    onboardingCompleted: Boolean(s.onboardingCompleted)
  };

  const sessionMem = {
    todayFocus: s.sessionTodayFocus ?? s.currentMission ?? null,
    emotionalTrend: s.sessionEmotionalTrend ?? inferTrend(turns, s),
    activeMission: s.currentMission ?? null,
    timeSlot: null,
    lastMentorMode: s.lastMentorMode ?? null,
    rhythmPhase: s.rhythmPhase ?? null
  };

  const short = {
    turns,
    lastCategory: s.lastCategory ?? null,
    lastTopic: s.lastTopic ?? null,
    momentum: s.emotionalMomentum ?? "stable",
    responseStructures: s.responseStructures || [],
    recentCategories: turns.map((m) => m.category).filter(Boolean)
  };

  return { permanent, session: sessionMem, short };
}

function inferTrend(turns, session) {
  const heavy = ["emotional_reflection", "chaos_loop", "focus_drift", "avoidance_mirror"];
  const recent = turns.slice(-3).map((t) => t.category);
  const heavyCount = recent.filter((c) => heavy.includes(c)).length;
  if (heavyCount >= 2) return "heavy";
  if (session.lastEmotionalIntensity >= 7) return "intense";
  if (recent.includes("casual_greeting")) return "light";
  return "steady";
}

/**
 * Patch session fields from an interaction (session + short layers).
 * @param {object} ev
 */
function patchSessionMemory(ev) {
  const patch = {};
  if (ev.todayFocus !== undefined) patch.sessionTodayFocus = ev.todayFocus;
  if (ev.emotionalTrend !== undefined) patch.sessionEmotionalTrend = ev.emotionalTrend;
  if (ev.rhythmPhase !== undefined) patch.rhythmPhase = ev.rhythmPhase;
  return patch;
}

module.exports = {
  SHORT_MEMORY_LIMIT,
  loadMemoryHierarchy,
  patchSessionMemory,
  inferTrend
};
