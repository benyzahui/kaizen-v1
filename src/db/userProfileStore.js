/**
 * Supabase persistence for kaizen_users (permanent profile).
 */

const { getSupabaseAdmin } = require("./supabaseClient");

const TABLE = "kaizen_users";

/**
 * @param {string|null} path
 */
function deriveProgramLane(path) {
  const p = String(path || "").toLowerCase();
  const map = {
    trading: "trading",
    business: "business",
    physical: "physical",
    emotional: "emotional",
    mixed: "mixed"
  };
  return map[p] || "free";
}

/**
 * @param {object} row
 * @returns {object} patch for in-memory session
 */
function userRowToSessionPatch(row) {
  if (!row) return {};
  return {
    userPrimaryPath: row.primary_path ?? null,
    userPrimaryPathNote: row.primary_path_note ?? null,
    userGoal30Days: row.goal_30_days ?? null,
    userMainObstacle: row.main_obstacle ?? null,
    userMainObstacleNote: row.main_obstacle_note ?? null,
    userIntensityPreference: row.tone_preference ?? null,
    preferredLanguage: row.preferred_language ?? null,
    onboardingCompleted: Boolean(row.onboarding_completed),
    onboardingActive: Boolean(row.onboarding_active),
    onboardingSkipped: Boolean(row.onboarding_skipped),
    onboardingStep: Number(row.onboarding_step) || 0,
    programLane: row.program_lane ?? "free",
    currentMission: row.current_mission ?? null,
    preferredTrainingStyle: row.preferred_training_style ?? null,
    meetKaiZenCompleted: Boolean(row.meet_kaizen_completed),
    membershipTier: row.membership_tier ?? "free",
    dragonLevel: Number(row.dragon_level) || 1,
    currentProgram: row.current_program ?? null,
    dailyStreak: Number(row.daily_streak) || 0,
    lastMorningCheckin: row.last_morning_checkin ?? null,
    lastEveningMirror: row.last_evening_mirror ?? null,
    seriousnessScore: Number(row.seriousness_score) ?? 50,
    notificationOptIn: Boolean(row.notification_opt_in),
    morningTime: row.morning_time ?? "06:00",
    eveningTime: row.evening_time ?? "21:00",
    timezone: row.timezone ?? null
  };
}

/**
 * @param {string|number} telegramId
 * @param {object} message Telegram message.from subset
 * @param {object} session current merged session
 */
function sessionToUserUpsert(telegramId, message, session) {
  const lane =
    session.programLane && session.programLane !== "free"
      ? session.programLane
      : deriveProgramLane(session.userPrimaryPath);
  return {
    telegram_id: Number(telegramId),
    username: message?.from?.username ?? null,
    first_name: message?.from?.first_name ?? null,
    preferred_language: session.preferredLanguage ?? null,
    primary_path: session.userPrimaryPath ?? null,
    primary_path_note: session.userPrimaryPathNote ?? null,
    goal_30_days: session.userGoal30Days ?? null,
    main_obstacle: session.userMainObstacle ?? null,
    main_obstacle_note: session.userMainObstacleNote ?? null,
    tone_preference: session.userIntensityPreference ?? null,
    onboarding_completed: Boolean(session.onboardingCompleted),
    onboarding_active: Boolean(session.onboardingActive),
    onboarding_skipped: Boolean(session.onboardingSkipped),
    onboarding_step: Number(session.onboardingStep) || 0,
    program_lane: lane,
    current_mission: session.currentMission ?? null,
    preferred_training_style: session.preferredTrainingStyle ?? null,
    meet_kaizen_completed: Boolean(session.meetKaiZenCompleted),
    membership_tier: session.membershipTier ?? "free",
    dragon_level: Number(session.dragonLevel) || 1,
    current_program: session.currentProgram ?? null,
    daily_streak: Number(session.dailyStreak) || 0,
    last_morning_checkin: session.lastMorningCheckin ?? null,
    last_evening_mirror: session.lastEveningMirror ?? null,
    seriousness_score: Number(session.seriousnessScore) ?? 50,
    notification_opt_in: Boolean(session.notificationOptIn),
    morning_time: session.morningTime ?? "06:00",
    evening_time: session.eveningTime ?? "21:00",
    timezone: session.timezone ?? null,
    updated_at: new Date().toISOString()
  };
}

/**
 * @param {string|number} telegramId
 */
async function fetchUserRow(telegramId) {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("telegram_id", Number(telegramId))
    .maybeSingle();
  if (error) {
    console.warn("[kaizen] fetchUserRow", error.message);
    return null;
  }
  return data;
}

/**
 * @param {string|number} telegramId
 * @param {object} message
 * @param {object} session
 */
async function upsertUserFromSession(telegramId, message, session) {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const row = sessionToUserUpsert(telegramId, message, session);
  const { error } = await sb.from(TABLE).upsert(row, { onConflict: "telegram_id" });
  if (error) console.warn("[kaizen] upsertUserFromSession", error.message);
}

module.exports = {
  TABLE,
  fetchUserRow,
  upsertUserFromSession,
  userRowToSessionPatch,
  deriveProgramLane
};
