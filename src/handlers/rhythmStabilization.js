/**
 * Short stabilization open-text replies — command-first redirect.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { pickNonRepeatingVariant } = require("../memory/recentReplyMemory");

const SCATTER_RE =
  /(szétesek|szetesek|szétes|szetes|szét|scatter|overwhelm|túl sok|too much|haos|chaos|panik|anxious|stress|stressz|epuiz|exhaust|kimerül|drift|sodród)/i;

/**
 * @param {string} text
 */
function needsStabilizationRedirect(text) {
  return SCATTER_RE.test(String(text || ""));
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @returns {{ body: string, suggestedCommand: string }|null}
 */
function buildStabilizationRedirect(text, lang, session) {
  if (!needsStabilizationRedirect(text)) return null;

  const r = getResponses(lang);
  const block = r.rhythmStabilization || {};
  const variants = block.variants || [];
  if (!variants.length) return null;

  const { tryLightProtocolOpen } = require("../panel/lightOpenRedirect");
  const light = tryLightProtocolOpen(text, lang);
  if (light) {
    return {
      body: light.body,
      suggestedCommand: light.suggestedCommand
    };
  }

  const body = pickNonRepeatingVariant(variants, session);
  return {
    body: lines(body, "", block.commandHint || "→ /stabilization"),
    suggestedCommand: "/stabilization"
  };
}

module.exports = {
  needsStabilizationRedirect,
  buildStabilizationRedirect
};
