/**
 * /guide and /map — premium grouped layout (not a command wall).
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildGuideReply(lang, session = null) {
  const r = getResponses(lang);
  if (r.guideCompactBody) return r.guideCompactBody;
  if (r.guideBody) return r.guideBody;

  const sections = r.guideSections || [];
  const parts = sections.map((s) =>
    lines(`${s.emoji} ${s.title}`, s.commands)
  );
  parts.push("", r.guideNaturalFooter || "You can always speak naturally too.");
  return parts.join("\n\n");
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
