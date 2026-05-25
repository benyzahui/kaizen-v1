/**
 * Prevent endless folder hopping — one protocol per day focus.
 */

const { updateSession } = require("../session/sessionStore");
const { getPanelCopy } = require("./i18n/getPanelCopy");

const WINDOW_MS = 90_000;
const MAX_FOLDER_OPENS = 3;

/**
 * @param {string|number} userId
 * @param {string} command
 * @param {object} session
 * @returns {{ blocked: boolean, message?: string }}
 */
function guardFolderSurf(userId, command, session) {
  if (command === "/panel") {
    return { blocked: false };
  }

  const now = Date.now();
  const lang = session?.lang || session?.preferredLanguage || "en";
  const prev = Array.isArray(session?.recentPanelFolders)
    ? session.recentPanelFolders
    : [];

  const fresh = prev.filter((e) => now - e.at < WINDOW_MS);
  fresh.push({ cmd: command, at: now });

  updateSession(userId, {
    recentPanelFolders: fresh.slice(-12),
    lastPanelCommand: command,
    lastPanelAt: now
  });

  const unique = new Set(fresh.map((e) => e.cmd));
  if (unique.size > MAX_FOLDER_OPENS) {
    const copy = getPanelCopy(lang);
    return { blocked: true, message: copy.tooManyLanes };
  }

  return { blocked: false };
}

module.exports = { WINDOW_MS, MAX_FOLDER_OPENS, guardFolderSurf };
