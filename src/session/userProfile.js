/**
 * User profile + onboarding state (24h session, no DB).
 * Field names are stable for a future Supabase row — keep renames rare.
 */

const DEFAULT_USER_PROFILE = {
  /** After first Meet KaiZen intro + self intro, setup questions begin. */
  meetKaiZenCompleted: false,
  userName: null,
  userPurpose: null,
  sessionTodayFocus: null,
  sessionEmotionalTrend: null,
  rhythmPhase: null,
  currentMission: null,
  preferredTrainingStyle: null,
  userPrimaryPath: null,
  userPrimaryPathNote: null,
  /** @type {'stabilization'|'discipline'|'energy'|'warrior'|'recovery'|'trading'|null} */
  activeMode: null,
  /** @type {'low'|'stable'|'high'|'overstimulated'|'exhausted'|null} */
  energyState: null,
  /** @type {'focused'|'drifting'|'inconsistent'|'locked_in'|null} */
  disciplineState: null,
  /** @type {'calm'|'overloaded'|'anxious'|'grounded'|null} */
  nervousSystemState: null,
  /** @type {object|null} */
  protocolState: null,
  /** Recent rhythm opener keys — anti-repetition */
  rhythmRecentOpeners: [],
  lastRhythmAt: null,
  recentMantras: [],
  recentEnergyReads: [],
  recentReplyBodies: [],
  recentMantraIds: [],
  recentMicroProtocolIds: [],
  recentTouchIds: [],
  recentOpeningIds: [],
  lastScheduledMorning: null,
  lastScheduledMidday: null,
  lastScheduledEvening: null,
  userGoal30Days: null,
  userMainObstacle: null,
  userMainObstacleNote: null,
  userIntensityPreference: null,
  preferredLanguage: null,
  onboardingCompleted: false,
  onboardingActive: false,
  onboardingSkipped: false,
  onboardingStep: 0,
  /** @type {'free'|'elite'|'dragon_path'|'trading'|'physical'|'emotional'|'business'|'mixed'|string|null} */
  programLane: "free",

  /** Dragon Path — V2.1 psyche layer */
  /** @type {'free'|'elite'|'dragon'} */
  membershipTier: "free",
  /** @type {1|2|3|4|5|6|7} 1=Initiate … 7=Dragon Mind */
  dragonLevel: 1,
  /** e.g. 'psyche_foundation' | null */
  currentProgram: null,
  /** number of consecutive days with at least one check-in */
  dailyStreak: 0,
  /** ISO date string of last morning check-in, e.g. '2026-05-15' */
  lastMorningCheckin: null,
  /** ISO date string of last evening mirror */
  lastEveningMirror: null,
  /** 0–100: drops when user avoids, rises when user completes */
  seriousnessScore: 50,
  /** whether to receive scheduled push messages */
  notificationOptIn: false,
  /** HH:MM local morning target, e.g. '06:00' */
  morningTime: "06:00",
  /** HH:MM local evening target */
  eveningTime: "21:00",
  /** IANA tz or offset string */
  timezone: "Europe/Bucharest",

  accountabilityMode: false,
  accountabilitySince: null,
  lastAccountabilityPromise: null,
  lastAccountabilityAt: null,

  /**
   * Dragon Blueprint daily state — see docs/daily-state-tracking.md
   * @type {object|null}
   */
  dailyState: null,
  /** Active check-in: { flow, step, lang, startedAt } */
  dailyCheckInPending: null,
  /** @type {'beginner'|'intermediate'|'advanced'|null} */
  protocolLevel: null,

  /** @type {'inactive'|'active'} Dragon daily program */
  programMode: "inactive",
  /** @type {'morning'|'midday'|'evening'|'completed'|null} */
  dailyPhase: null,
  programPaused: false,
  completedPhases: [],
  programDayKey: null,

  /** @type {Record<string, { current: number, best: number, lastDate: string|null }>|null} */
  streaks: null,
  consistencyTitle: null,
  lastStreakUpdate: null,

  /** @type {'low'|'medium'|'high'|null} */
  relapseRisk: null,
  lastRelapseCheck: null
};

/**
 * @returns {typeof DEFAULT_USER_PROFILE}
 */
function profileDefaults() {
  return { ...DEFAULT_USER_PROFILE };
}

/**
 * @param {object} session
 */
function hasCompletedProfile(session) {
  return Boolean(session?.onboardingCompleted);
}

/**
 * @param {object} session
 */
function shouldInterceptOpenText(session) {
  return !session?.onboardingCompleted;
}

module.exports = {
  DEFAULT_USER_PROFILE,
  profileDefaults,
  hasCompletedProfile,
  shouldInterceptOpenText
};
