/**
 * If the last two assistant replies had the same shape as this candidate, shift copy.
 * Works with session.lastAssistantPrints (see sessionStore.recordInteraction).
 */

const { replyFingerprint } = require("./replyFingerprint");

/**
 * @param {object} session
 * @param {string} candidateBody
 * @param {{ antiLoopRewrite?: string }} r responses bundle
 */
function variateIfSameShape(session, candidateBody, r) {
  const fp = replyFingerprint(candidateBody);
  const p = session.lastAssistantPrints || [];
  if (p.length >= 2 && p[0] === p[1] && p[1] === fp && r.antiLoopRewrite) {
    return r.antiLoopRewrite;
  }
  return candidateBody;
}

module.exports = { variateIfSameShape };
