/**
 * User profile + onboarding state (24h session, no DB).
 * Field names are stable for a future Supabase row — keep renames rare.
 */

const DEFAULT_USER_PROFILE = {
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
  onboardingStep: 0
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
    !session?.onboardingSkipped &&
    Number(session?.onboardingStep || 0) >= 1
  );
}

module.exports = {
  DEFAULT_USER_PROFILE,
  profileDefaults,
  hasCompletedProfile,
  shouldInterceptOpenText
};
