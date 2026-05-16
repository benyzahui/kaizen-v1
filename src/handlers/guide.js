/**
 * /guide and /map — user-facing help (copy in i18n onboarding bundle).
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildGuideReply(lang) {
  const r = getResponses(lang);
  return r.guideBody;
}

/**
 * Full command map — only when user asks (/map).
 * @param {'en'|'hu'|'ro'} lang
 */
function buildMapReply(lang) {
  const r = getResponses(lang);
  return lines(r.mapBody, "", r.mapFooter);
}

module.exports = { buildGuideReply, buildMapReply };
