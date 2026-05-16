/**
 * Daily protocol builders — /today /morning /reset /mirror
 * Uses stabilized copy + session-scoped anti-repeat.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");
const { pickUnseenVariant, snippetKey } = require("../conversation/responseVariation");
const { pickMantra } = require("./dragonTraining");
const { getUniversalDayVibration } = require("../energy/numerology");
const { recordMorningCheckin, recordEveningMirror } = require("./dailyRhythm");

function uid(message) {
  return String(message.from?.id ?? message.chat?.id ?? "");
}

function rememberSnippet(userId, session, reply) {
  const key = snippetKey(reply);
  const recent = [...(session.recentCoachSnippets || [])].slice(-14);
  if (key && !recent.includes(key)) recent.push(key);
  updateSession(userId, { recentCoachSnippets: recent.slice(-14) });
  return reply;
}

function bodyAnchor(session, lang) {
  const r = getResponses(lang);
  const path = session.userPrimaryPath;
  const byPath = r.protocolBodyByPath || {};
  return byPath[path] || r.protocolBodyDefault || "water + stand";
}

function toneOfDay(lang, session, userId) {
  const r = getResponses(lang);
  const pool = r.protocolToneLines || [];
  if (!pool.length) return "";
  const vib = getUniversalDayVibration(new Date()).vibration;
  const idx = Math.max(0, Math.min(pool.length - 1, vib - 1));
  return pickUnseenVariant(session, userId, [pool[idx], ...pool]) || pool[idx];
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildTodayReply(session, lang, userId = "0") {
  const r = getResponses(lang);
  const mission = session.currentMission?.trim();
  const missionLine = mission
    ? r.protocolTodayMissionSet(mission)
    : r.protocolTodayMissionOpen;
  const bodyLine = r.protocolTodayBody(bodyAnchor(session, lang));
  const reply = lines(
    r.protocolTodayTitle,
    "",
    r.protocolTodaySteps(missionLine, bodyLine),
    "",
    r.protocolTodayFooter
  );
  return rememberSnippet(userId, session, reply);
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildMorningProtocolReply(message, session, lang) {
  const r = getResponses(lang);
  const id = uid(message);
  recordMorningCheckin(id, session);

  const name = session.userName?.trim();
  const mantra = pickMantra(r, session, id);
  const tone = toneOfDay(lang, session, id);
  const anchor = bodyAnchor(session, lang);
  const title = name
    ? `${r.protocolMorningTitle}, ${name}.`
    : r.protocolMorningTitle;

  const bodyLabel =
    lang === "hu" ? "Test" : lang === "ro" ? "Corp" : "Body";

  const reply = lines(
    title,
    "",
    mantra,
    "",
    tone,
    "",
    `${bodyLabel}: ${anchor}`,
    "",
    r.protocolMissionQuestion,
    "",
    r.protocolMorningFooter
  );

  return rememberSnippet(id, session, reply);
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 */
function buildResetReply(session, lang, userId) {
  const r = getResponses(lang);
  const pool = r.protocolResetVariants || [];
  const body = pickUnseenVariant(session, userId, pool) || pool[0] || r.recoveryProtocolBody;
  return rememberSnippet(userId, session, body);
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildMirrorProtocolReply(message, session, lang) {
  const r = getResponses(lang);
  const id = uid(message);
  recordEveningMirror(id);

  const pool = r.protocolMirrorVariants || [r.mirror].filter(Boolean);
  const body = pickUnseenVariant(session, id, pool) || pool[0];
  return rememberSnippet(id, session, body);
}

module.exports = {
  buildTodayReply,
  buildMorningProtocolReply,
  buildResetReply,
  buildMirrorProtocolReply,
  bodyAnchor,
  rememberSnippet
};
