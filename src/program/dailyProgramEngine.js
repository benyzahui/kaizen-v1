/**
 * Dragon Program — daily flow control (morning → midday → evening).
 */

const { lines } = require("../personality/kaizenVoice");
const { updateSession, getSession } = require("../session/sessionStore");
const { getProgramFlowCopy } = require("./i18n/getProgramFlowCopy");
const { getOrCreateDailyState, todayKey } = require("../tracking/dailyStateModel");
const {
  energyDisplayKey
} = require("../tracking/dailyStateAdaptation");
const { getDailyTrackingCopy } = require("../tracking/i18n/getDailyTrackingCopy");
const OVERLOAD_RE =
  /(szétesek|szetesek|szétes|szetes|szét|scatter|overwhelm|túl sok|panik|stressz|epuiz|kimerül|sodród)/i;

function isOverloadText(text) {
  return OVERLOAD_RE.test(String(text || ""));
}

const PHASES = ["morning", "midday", "evening", "completed"];

/**
 * @param {object} session
 */
function isProgramActive(session) {
  return session?.programMode === "active";
}

/**
 * @param {object} session
 */
function getNextProgramCommand(session) {
  if (!isProgramActive(session)) return "/program";
  if (session.programPaused) return "/resume";
  const phase = session.dailyPhase || "morning";
  if (phase === "completed") return "/program";
  if (phase === "morning") return "/morning";
  if (phase === "midday") return "/midday";
  return "/evening";
}

/**
 * @param {string} userId
 * @param {string} lang
 */
function activateProgram(userId, lang) {
  updateSession(userId, {
    programMode: "active",
    dailyPhase: "morning",
    programPaused: false,
    completedPhases: [],
    programDayKey: todayKey()
  });
  return buildProgramActivateReply(lang);
}

/**
 * @param {string} lang
 */
function buildProgramActivateReply(lang) {
  const c = getProgramFlowCopy(lang);
  return lines(
    c.activateTitle,
    "",
    c.activateRhythm,
    ...c.activateSteps,
    "",
    c.activateStart,
    c.activateStartCmd
  );
}

/**
 * @param {object} session
 * @param {string} lang
 * @param {string} userId
 */
function buildWhereAmIReply(session, lang, userId) {
  const c = getProgramFlowCopy(lang);
  const track = getDailyTrackingCopy(lang);
  const daily = getOrCreateDailyState(session, userId, lang);
  const phase = session.dailyPhase || "morning";
  const phaseLabel = c.phaseLabels[phase] || phase;
  const energyKey = energyDisplayKey(daily);
  const energyLabel = track.energyLabels[energyKey] || energyKey;
  const mission =
    daily.todayMission?.trim() || session.currentMission?.trim() || "—";
  const next = isProgramActive(session)
    ? getNextProgramCommand(session)
    : "/program";

  const done =
    Array.isArray(session.completedPhases) && session.completedPhases.length
      ? session.completedPhases.join(", ")
      : "—";

  return lines(
    c.whereamiTitle,
    "",
    `${c.whereamiPhase}: ${phaseLabel}`,
    `${c.whereamiMission}: ${mission}`,
    `${c.whereamiEnergy}: ${energyLabel}`,
    ...(isProgramActive(session) ? [`${c.completedPhases}: ${done}`] : []),
    `${c.whereamiNext}: ${next}`,
    "",
    session.programPaused ? c.pausedHint : ""
  ).replace(/\n\n\n/g, "\n\n");
}

/**
 * @param {string} userId
 * @param {'morning'|'midday'|'evening'} flow
 * @param {string} lang
 */
function advancePhaseAfterCheckIn(userId, flow, lang) {
  const patch = { programPaused: false };
  const completed = flow;
  const session = getSession(userId);
  const prev = Array.isArray(session.completedPhases) ? session.completedPhases : [];
  if (!prev.includes(completed)) {
    patch.completedPhases = [...prev, completed];
  }

  if (flow === "morning") {
    patch.dailyPhase = "midday";
  } else if (flow === "midday") {
    patch.dailyPhase = "evening";
  } else if (flow === "evening") {
    patch.dailyPhase = "completed";
  }

  if (isProgramActive(session) || session.programMode === "active") {
    patch.programMode = "active";
  }

  updateSession(userId, patch);
  return formatProgramTransition(flow, lang, patch.dailyPhase);
}

/**
 * @param {'morning'|'midday'|'evening'} flow
 * @param {string} lang
 * @param {string} nextPhase
 */
function formatProgramTransition(flow, lang, nextPhase) {
  const c = getProgramFlowCopy(lang);
  if (flow === "morning") {
    return lines("", c.afterMorning, "→ /midday");
  }
  if (flow === "midday") {
    return lines("", c.afterMidday, "→ /evening");
  }
  return lines("", c.afterEvening);
}

function pauseProgram(userId, lang) {
  updateSession(userId, { programPaused: true });
  return getProgramFlowCopy(lang).pauseMsg;
}

function resumeProgram(userId, lang) {
  updateSession(userId, { programPaused: false });
  const c = getProgramFlowCopy(lang);
  const next = getNextProgramCommand(getSession(userId));
  return lines(c.resumeMsg, "", `${c.whereamiNext}: ${next}`);
}

function stopProgram(userId, lang) {
  updateSession(userId, {
    programMode: "inactive",
    programPaused: false,
    dailyPhase: null,
    completedPhases: []
  });
  return getProgramFlowCopy(lang).stopMsg;
}

/**
 * @param {string} text
 * @param {string} lang
 * @param {object} session
 */
function tryProgramOpenReply(text, lang, session) {
  if (!isProgramActive(session)) return null;
  if (session.programPaused) {
    const c = getProgramFlowCopy(lang);
    return {
      body: c.pausedHint,
      suggestedCommand: "/resume",
      category: "program_guidance"
    };
  }

  const c = getProgramFlowCopy(lang);
  const nextCmd = getNextProgramCommand(session);

  if (isOverloadText(text)) {
    return {
      body: lines(
        c.overloadTitle,
        ...c.overloadSteps,
        "",
        c.returnLabel,
        `→ ${nextCmd}`
      ),
      suggestedCommand: nextCmd,
      category: "program_guidance"
    };
  }

  return {
    body: lines(c.briefAck, "", c.returnLabel, `→ ${nextCmd}`),
    suggestedCommand: nextCmd,
    category: "program_guidance"
  };
}

/**
 * Scheduler eligibility (no send unless enabled + opt-in).
 * @param {object} session
 */
function shouldSendScheduledPush(session) {
  if (process.env.KAIZEN_SCHEDULER_ENABLED !== "true") return false;
  if (!isProgramActive(session)) return false;
  if (session.programPaused) return false;
  if (!session.notificationOptIn) return false;
  const lang = session.preferredLanguage || session.lang;
  return lang === "hu" || lang === "ro" || lang === "en";
}

/**
 * Reset daily program phase on new calendar day if active.
 * @param {object} session
 * @param {string} userId
 */
function maybeResetProgramForNewDay(session, userId) {
  if (!isProgramActive(session)) return;
  const last = session.programDayKey;
  const today = todayKey();
  if (last === today) return;
  updateSession(userId, {
    programDayKey: today,
    dailyPhase: "morning",
    completedPhases: []
  });
}

module.exports = {
  PHASES,
  isProgramActive,
  getNextProgramCommand,
  activateProgram,
  buildProgramActivateReply,
  buildWhereAmIReply,
  advancePhaseAfterCheckIn,
  pauseProgram,
  resumeProgram,
  stopProgram,
  tryProgramOpenReply,
  shouldSendScheduledPush,
  maybeResetProgramForNewDay
};
