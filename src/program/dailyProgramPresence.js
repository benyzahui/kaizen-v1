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
  maybeLightCheckInLine,
  maybeIdentityWhisper
} = require("../retention/retentionRhythmEngine");
const {
  maybeContextualPresence,
  maybeOneThingForSession,
  maybeContinuityWhisper,
  resolveRhythmProfile
} = require("../rhythm/rhythmIntelligenceEngine");
const { maybeHumanMoment } = require("../content/dailyContentEngine");
const { pickHopePresenceBundle } = require("../presence/hopePresenceEngine");
const { pickCommunityPresenceBundle } = require("../community/originStoryAtmosphere");
const { syncRebuildingMode } = require("../rebuilding/rebuildingMode");
const { pickRebuildingBundle } = require("../rebuilding/rebuildingEngine");
const { shouldReducePressure } = require("../lifeBalance/pressureReduction");
const { pickLifeBalanceBundle } = require("../lifeBalance/lifeBalanceEngine");
const {
  maybeLightActivation,
  resolveAwarenessContext
} = require("../challenges/challengeSelector");
const { formatPremiumDailyMessage } = require("../atmosphere/programAtmosphere");
const { resolvePrimaryPathId, pickPathCue } = require("../path/dailyPathEngine");

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
  const pathId = resolvePrimaryPathId(session);
  const pathCue = pickPathCue(pathId, phase, locked, userId, dateKey);
  const micro = selectMicroProtocol(slot, locked, session, userId, dateKey, now);
  let actionBlock = "";
  if (micro) {
    recordMicroProtocolUse(micro, userId);
    actionBlock = formatMicroProtocol(micro, session);
  } else {
    actionBlock = `${L.todayAction}: ${pickDailyAction(phase, locked, userId, dateKey)}`;
  }
  const rhythmProfile = resolveRhythmProfile(session, "", now);
  const rebuildingCtx = syncRebuildingMode(session, "", now, userId, dateKey);
  const rebuildingLine = rebuildingCtx.active
    ? pickRebuildingBundle(locked, session, userId, dateKey, phase, now)
    : null;
  const lifeBalanceLine = pickLifeBalanceBundle(
    locked,
    session,
    userId,
    dateKey,
    phase,
    now
  );
  const underPressure = shouldReducePressure(session, "", now);
  let touchChance = rhythmProfile.protocolIntensity === "low" ? 0.14 : 0.2;
  if (underPressure) touchChance = 0.08;
  const touch = maybeMicroTouch(locked, session, userId, dateKey, touchChance, now);
  const lightCheck = maybeLightCheckInLine(locked, session, userId, dateKey, phase, 0.1);
  const identityWhisper = maybeIdentityWhisper(locked, session, userId, dateKey, slot, 0.07);
  const smartPresence = maybeContextualPresence(
    locked,
    session,
    userId,
    dateKey,
    "",
    rhythmProfile.signals.overloaded ? 0.16 : 0.1,
    now
  );
  const oneThing =
    rhythmProfile.signals.overloaded || rhythmProfile.signals.chaotic
      ? maybeOneThingForSession(locked, session, userId, dateKey, "", now)
      : null;
  const continuity = maybeContinuityWhisper(locked, session, userId, dateKey, 0.06);
  const humanMoment =
    phase === "evening"
      ? maybeHumanMoment(locked, session, userId, dateKey, slot, 0.1)
      : maybeHumanMoment(locked, session, userId, dateKey, slot, 0.06);
  const hopePresence = pickHopePresenceBundle(locked, session, userId, dateKey, phase, now);
  const communityPresence = pickCommunityPresenceBundle(
    locked,
    session,
    userId,
    dateKey,
    phase,
    now
  );

  let body = "";

  if (phase === "morning") {
    const m = copy.morning;
    body = lines(
      copy.programTag,
      identity,
      pathCue || "",
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
      smartPresence || oneThing || "",
      touch || "",
      lightCheck || "",
      identityWhisper || continuity || "",
      humanMoment || "",
      hopePresence || "",
      communityPresence || "",
      rebuildingLine || "",
      lifeBalanceLine || ""
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
      smartPresence || oneThing || "",
      touch || "",
      lightCheck || "",
      identityWhisper || continuity || "",
      humanMoment || "",
      hopePresence || "",
      communityPresence || "",
      rebuildingLine || "",
      lifeBalanceLine || ""
    );
  } else {
    const e = copy.evening;
    body = lines(
      copy.programTag,
      identity,
      pathCue || "",
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
      smartPresence || oneThing || "",
      touch || "",
      lightCheck || "",
      identityWhisper || continuity || "",
      humanMoment || "",
      hopePresence || "",
      communityPresence || "",
      rebuildingLine || "",
      lifeBalanceLine || ""
    );
  }

  const activation = maybeLightActivation({
    slot,
    lang: locked,
    session,
    userId,
    dateKey,
    contextKey: resolveAwarenessContext(session),
    challengeChance: underPressure ? 0.04 : 0.08,
    awarenessChance: underPressure ? 0.05 : 0.1,
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

  const maxLines =
    rhythmProfile.verbosity === "minimal"
      ? Math.min(12, rhythmProfile.maxLines + 4)
      : 17;
  return formatPremiumDailyMessage(body, {
    maxLines,
    maxChars: rhythmProfile.verbosity === "minimal" ? 620 : MAX_PHASE_CHARS
  });
}

module.exports = {
  HYPE_RE,
  MAX_PHASE_CHARS,
  pickProgramIdentityLine,
  pickDailyAction,
  buildDailyPhasePresence
};
