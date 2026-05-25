/**
 * Daily program presence — Dragon Blueprint rhythm, one action, no spam.
 */

const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/kaizenVoice");
const { pickAdaptiveMantra } = require("../atmosphere/atmosphereEngine");
const { recordMantraUse } = require("../mantra/mantraEngine");
const { getDailyProgramPresenceCopy } = require("./i18n/getDailyProgramPresenceCopy");
const {
  selectMicroProtocol,
  formatMicroProtocol,
  recordMicroProtocolUse,
  maybeMicroTouch
} = require("../protocols/adaptiveProtocolSelector");
const {
  maybeLightActivation,
  resolveAwarenessContext
} = require("../challenges/challengeSelector");
const { formatPremiumDailyMessage } = require("../atmosphere/programAtmosphere");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|10x|unlock your|hajrá|sigma|limitless|motivációs guru)\b/i;

const MAX_PHASE_CHARS = 720;

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 */
function pickProgramIdentityLine(lang, userId, dateKey) {
  const copy = getDailyProgramPresenceCopy(lang);
  return pickSeeded(copy.programIdentity, `${userId}|progId|${dateKey}`);
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 */
function pickDailyAction(phase, lang, userId, dateKey) {
  const copy = getDailyProgramPresenceCopy(lang);
  const pool = copy.actions[phase] || copy.actions.morning;
  return pickSeeded(pool, `${userId}|action|${phase}|${dateKey}`);
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {Date} [now]
 */
function buildDailyPhasePresence(phase, lang, session, userId, dateKey, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const copy = getDailyProgramPresenceCopy(locked);
  const L = copy.labels;
  const slot = phase === "morning" ? "morning" : phase === "midday" ? "midday" : "evening";

  const mantraPick = pickAdaptiveMantra(slot, locked, session, userId, dateKey, now);
  recordMantraUse(userId, mantraPick, session);
  const mantraText =
    mantraPick?.text && !HYPE_RE.test(mantraPick.text)
      ? mantraPick.text
      : copy[slot]?.fallbackMantra || copy.morning.fallbackMantra;

  const identity = pickProgramIdentityLine(locked, userId, dateKey);
  const micro = selectMicroProtocol(slot, locked, session, userId, dateKey, now);
  let actionBlock = "";
  if (micro) {
    recordMicroProtocolUse(micro, userId);
    actionBlock = formatMicroProtocol(micro);
  } else {
    actionBlock = `${L.todayAction}: ${pickDailyAction(phase, locked, userId, dateKey)}`;
  }
  const touch = maybeMicroTouch(locked, session, userId, dateKey, 0.2);

  let body = "";

  if (phase === "morning") {
    const m = copy.morning;
    body = lines(
      copy.programTag,
      identity,
      "",
      m.title,
      "",
      ...m.lines,
      "",
      `${L.mantra}:`,
      mantraText,
      "",
      `${L.body}:`,
      m.bodyAnchor,
      "",
      `${L.mission}:`,
      m.missionQuestion,
      "",
      actionBlock,
      touch || ""
    );
  } else if (phase === "midday") {
    const md = copy.midday;
    body = lines(
      copy.programTag,
      identity,
      "",
      md.title,
      "",
      ...md.lines,
      "",
      `${L.mantra}:`,
      mantraText,
      "",
      `${L.now}:`,
      md.nowLines.join(", "),
      "",
      actionBlock,
      touch || ""
    );
  } else {
    const e = copy.evening;
    body = lines(
      copy.programTag,
      identity,
      "",
      e.title,
      "",
      ...e.lines,
      "",
      `${L.mantra}:`,
      mantraText,
      "",
      `${L.question}:`,
      e.releaseQuestion,
      "",
      actionBlock,
      touch || ""
    );
  }

  const activation = maybeLightActivation({
    slot,
    lang: locked,
    session,
    userId,
    dateKey,
    contextKey: resolveAwarenessContext(session),
    challengeChance: 0.08,
    awarenessChance: 0.1,
    now
  });
  if (activation) {
    body = lines(body, "", activation);
  }

  const footer = copy.checkInFooter[phase];
  if (footer) {
    body = lines(body, "", footer);
  }

  if (body.length > MAX_PHASE_CHARS) {
    body = body.split("\n").slice(0, 18).join("\n");
  }

  return formatPremiumDailyMessage(body, { maxLines: 17, maxChars: MAX_PHASE_CHARS });
}

module.exports = {
  HYPE_RE,
  MAX_PHASE_CHARS,
  pickProgramIdentityLine,
  pickDailyAction,
  buildDailyPhasePresence
};
