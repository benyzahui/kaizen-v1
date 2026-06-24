/**
 * GIF outbound hook — rare, context-matched animations.
 */

const { pickGifForCategory } = require("./gifCatalog");
const { updateSession } = require("../../session/sessionStore");

const PHASE_TO_GIF_CATEGORY = {
  morning: "morning",
  midday: "discipline",
  evening: "recovery",
  late_night: "recovery"
};

/**
 * @param {object} session
 * @param {object} meta
 * @returns {string|null}
 */
function resolveGifForOutbound(session, meta = {}) {
  if (meta.skipGif) return null;
  if (session?.pendingGifUrl) return session.pendingGifUrl;

  const phase = meta.phase || session?.protocolState?.phase;
  const category =
    meta.gifCategory ||
    PHASE_TO_GIF_CATEGORY[phase] ||
    (meta.category === "celebration" ? "celebration" : null);

  if (!category) return null;

  const energy = session?.energyState || session?.protocolState?.energyState;
  const picked = pickGifForCategory(category, energy);
  return picked?.url || null;
}

/**
 * @param {string|number} userId
 * @param {string|null} url
 */
function stagePendingGif(userId, url) {
  if (!url) return;
  updateSession(userId, { pendingGifUrl: url });
}

/**
 * @param {string|number} userId
 */
function clearPendingGif(userId) {
  updateSession(userId, { pendingGifUrl: null });
}

/**
 * @param {object} session
 * @param {object} meta
 * @param {number} [chance=0.08]
 */
function maybeStageGif(userId, session, meta = {}, chance = 0.08) {
  if (meta.forceGif) {
    const url = resolveGifForOutbound(session, meta);
    if (url) stagePendingGif(userId, url);
    return url;
  }

  const seed = `${userId}|gif|${meta.dateKey || ""}|${meta.phase || ""}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 25 >= Math.floor(chance * 25)) return null;

  const url = resolveGifForOutbound(session, meta);
  if (url) stagePendingGif(userId, url);
  return url;
}

module.exports = {
  resolveGifForOutbound,
  stagePendingGif,
  clearPendingGif,
  maybeStageGif,
  PHASE_TO_GIF_CATEGORY
};
