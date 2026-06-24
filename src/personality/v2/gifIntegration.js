/**
 * GIF outbound hook — delegates to media/gifSelector.
 */

const { selectGif, stageGifForContext, clearPendingGif } = require("../../media/gifSelector");

const PHASE_TO_GIF_CATEGORY = {
  morning: "morning_activation",
  midday: "discipline",
  evening: "evening_reset",
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
  const context =
    meta.gifContext ||
    (phase ? PHASE_TO_GIF_CATEGORY[phase] : null) ||
    (meta.category === "celebration" ? "celebration" : null);

  if (!context) return null;

  const userId = meta.userId || session?.userId || "0";
  const picked = selectGif(context, userId, session, {
    category: meta.gifCategory,
    dateKey: meta.dateKey,
    force: meta.forceGif
  });
  return picked?.url || null;
}

/**
 * @param {string|number} userId
 * @param {string|null} url
 */
function stagePendingGif(userId, url) {
  if (!url) return;
  const { updateSession } = require("../../session/sessionStore");
  updateSession(userId, { pendingGifUrl: url });
}

/**
 * @param {string|number} userId
 */
function clearPendingGifHook(userId) {
  clearPendingGif(userId);
}

/**
 * @param {object} session
 * @param {object} meta
 * @param {number} [chance=0.08]
 */
function maybeStageGif(userId, session, meta = {}, chance = 0.08) {
  if (meta.forceGif) {
    const url = resolveGifForOutbound(session, { ...meta, userId, forceGif: true });
    if (url) {
      const { updateSession } = require("../../session/sessionStore");
      updateSession(userId, { pendingGifUrl: url });
    }
    return url;
  }

  const phase = meta.phase || session?.protocolState?.phase;
  const context = phase ? PHASE_TO_GIF_CATEGORY[phase] : "recovery_encouragement";
  const picked = stageGifForContext(userId, session, context, {
    dateKey: meta.dateKey,
    chance
  });
  return picked?.url || null;
}

module.exports = {
  resolveGifForOutbound,
  stagePendingGif,
  clearPendingGif: clearPendingGifHook,
  maybeStageGif,
  PHASE_TO_GIF_CATEGORY
};
