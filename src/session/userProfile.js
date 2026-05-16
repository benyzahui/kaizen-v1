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
  timezone: null,

  accountabilityMode: false,
  accountabilitySince: null,
  lastAccountabilityPromise: null,
  lastAccountabilityAt: null
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
  return (
    Boolean(session?.onboardingActive) &&
    !session?.onboardingCompleted &&
    !session?.onboardingSkipped
  );
}

module.exports = {
  DEFAULT_USER_PROFILE,
  profileDefaults,
  hasCompletedProfile,
  shouldInterceptOpenText
};
