/**
 * /guide — user-facing system map (copy lives in i18n onboarding bundle).
 */

const { getResponses } = require("../i18n/getResponses");

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildGuideReply(lang) {
  const r = getResponses(lang);
  return r.guideBody;
}

module.exports = { buildGuideReply };
