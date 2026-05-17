/**
 * Unified open-chat reply packaging — always passes through companion finalize.
 */

const { finalizeCompanionReply } = require("../companion/companionCore");
const { SKIP_PRESENCE } = require("../companion/presenceSystem");
const { resolveCommandHint } = require("../companion/commandPresence");

/**
 * @param {object} p
 * @param {string|number} p.userId
 * @param {object} p.session
 * @param {'en'|'hu'|'ro'} p.lang
 * @param {string} p.text
 * @param {string} p.category
 * @param {string} p.body
 * @param {object} p.r
 * @param {object|null} p.companionCtx
 * @param {string|null} [p.suggestedCommand]
 * @param {boolean} [p.skipRhythm]
 */
function packOpenReply(p) {
  const {
    category,
    body,
    r,
    companionCtx,
    suggestedCommand = null,
    skipRhythm = true
  } = p;

  if (!companionCtx) {
    return {
      reply: body,
      category,
      suggestedAction: suggestedCommand
    };
  }

  const session = companionCtx?.session || {};
  const hint = resolveCommandHint(
    category,
    companionCtx?.lastUserText || "",
    session,
    suggestedCommand
  );

  const reply = finalizeCompanionReply(
    companionCtx,
    category,
    body,
    r,
    {
      skipPresence: SKIP_PRESENCE.has(category),
      skipRhythm,
      suggestedCommand: hint,
      skipCommandHint: !hint
    }
  );

  return {
    reply,
    category,
    suggestedAction: hint
  };
}

module.exports = { packOpenReply };
