/**
 * Load / persist KaiZen profile + rolling session via Supabase (with in-memory cache).
 */

const { getSupabaseAdmin } = require("./supabaseClient");
const {
  fetchUserRow,
  upsertUserFromSession,
  userRowToSessionPatch
} = require("./userProfileStore");
const {
  fetchSessionRow,
  upsertSessionFromSession,
  deleteSessionRow,
  sessionRowToPatch
} = require("./sessionStore");
const { getSession, updateSession, resetEphemeralKeepProfile } = require("../session/sessionStore");

/**
 * @param {string|number} telegramId
 * @param {object} message
 */
async function hydrateFromSupabase(telegramId, message) {
  if (!getSupabaseAdmin()) return;

  const uid = String(telegramId);
  const userRow = await fetchUserRow(uid);
  const pref = userRow?.preferred_language;

  if (userRow) {
    const patch = userRowToSessionPatch(userRow);
    updateSession(uid, patch);
  }

  const sessRow = await fetchSessionRow(uid);
  if (sessRow) {
    const exp = sessRow.expires_at ? new Date(sessRow.expires_at) : null;
    if (exp && exp.getTime() < Date.now()) {
      await deleteSessionRow(uid);
    } else {
      updateSession(uid, sessionRowToPatch(sessRow));
    }
  }

  if (pref === "hu" || pref === "ro" || pref === "en") {
    updateSession(uid, { lang: pref });
  }
}

/**
 * @param {string|number} telegramId
 * @param {object} message
 */
async function persistToSupabase(telegramId, message) {
  if (!getSupabaseAdmin()) return;
  const uid = String(telegramId);
  const session = getSession(uid);
  await upsertUserFromSession(uid, message, session);
  await upsertSessionFromSession(uid, session);
}

/**
 * @param {string|number} telegramId
 */
async function clearRemoteSession(telegramId) {
  await deleteSessionRow(telegramId);
  resetEphemeralKeepProfile(telegramId);
}

module.exports = {
  hydrateFromSupabase,
  persistToSupabase,
  clearRemoteSession
};
