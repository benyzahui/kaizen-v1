/**
 * Scheduler session hydration — merge Supabase profile into in-memory session.
 */

const { getSession, updateSession } = require("../session/sessionStore");
const { userRowToSessionPatch } = require("../db/userProfileStore");
const { fetchSessionRow, sessionRowToPatch } = require("../db/sessionStore");
const { maybeResetProgramForNewDay } = require("../program/dailyProgramEngine");

/**
 * @param {string|number} userId
 * @param {object} [userRow]
 * @returns {Promise<object>}
 */
async function hydrateSchedulerSession(userId, userRow = null) {
  const uid = String(userId);
  let session = getSession(uid);

  if (userRow) {
    updateSession(uid, userRowToSessionPatch(userRow));
    session = getSession(uid);
  }

  try {
    const sessRow = await fetchSessionRow(uid);
    if (sessRow) {
      updateSession(uid, sessionRowToPatch(sessRow));
      session = getSession(uid);
    }
  } catch {
    // session row optional
  }

  maybeResetProgramForNewDay(session, uid);
  return getSession(uid);
}

/**
 * Build session override from kaizen_users row for scheduled pushes.
 * @param {object} profile
 */
function profileToSchedulerSession(profile) {
  const patch = userRowToSessionPatch(profile);
  return {
    ...patch,
    onboardingCompleted: patch.onboardingCompleted !== false,
    languageLocked: Boolean(patch.preferredLanguage),
    notificationOptIn: Boolean(profile.notification_opt_in ?? patch.notificationOptIn),
    programMode: profile.program_mode || patch.programMode || "active"
  };
}

module.exports = { hydrateSchedulerSession, profileToSchedulerSession };
