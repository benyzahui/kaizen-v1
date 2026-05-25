/**
 * Morning / midday / evening check-in flow + natural reply capture.
 */

const { lines } = require("../personality/kaizenVoice");
const { updateSession, getSession } = require("../session/sessionStore");
const { getDailyTrackingCopy } = require("./i18n/getDailyTrackingCopy");
const {
  getOrCreateDailyState,
  pushCompletedAction,
  syncProtocolFieldsFromDaily,
  todayKey
} = require("./dailyStateModel");
const { buildDailyStatusSnapshot } = require("./statusEngine");
const { advancePhaseAfterCheckIn, isProgramActive } = require("../program/dailyProgramEngine");
const { recordCheckInCompletion } = require("../consistency/streakEngine");
const { buildDailyPhasePresence } = require("../program/dailyProgramPresence");

function buildCheckInCompleteReply(userId, flow, lang, daily, session) {
  const streakBlock = recordCheckInCompletion(userId, flow, lang, daily, session);
  const snap = buildDailyStatusSnapshot(
    { dailyState: daily, currentMission: daily.todayMission },
    lang,
    userId
  );
  const s = getSession(userId);
  const prog =
    isProgramActive(s) || s.programMode === "active"
      ? advancePhaseAfterCheckIn(userId, flow, lang)
      : "";
  return lines(streakBlock, "", snap, prog);
}
const {
  parseScale1to10,
  parseScaleAt,
  parseYesNo,
  parseScreenDiscipline,
  parseBodyAnchors,
  parseMorningBundle,
  parseMiddayBundle,
  parseEveningBundle
} = require("./dailyStateParser");

const MORNING_STEPS = ["morning_energy", "morning_sleep", "morning_mission", "morning_anchors"];
const MIDDAY_STEPS = [
  "midday_focus",
  "midday_hydration",
  "midday_movement",
  "midday_screen",
  "midday_correction"
];
const EVENING_STEPS = [
  "evening_completed",
  "evening_leak",
  "evening_release",
  "evening_recovery"
];

/**
 * @param {'morning'|'midday'|'evening'} flow
 */
function stepsForFlow(flow) {
  if (flow === "morning") return MORNING_STEPS;
  if (flow === "midday") return MIDDAY_STEPS;
  return EVENING_STEPS;
}

function startCheckIn(userId, session, flow, lang) {
  updateSession(userId, {
    dailyCheckInPending: { flow, step: 0, lang, startedAt: Date.now() }
  });
}

/**
 * @param {string} lang
 * @param {'morning'|'midday'|'evening'} flow
 * @param {object} session
 * @param {string|number} userId
 * @param {Date} [now]
 */
function buildCheckInPrompt(lang, flow, session, userId, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const dk = todayKey(now);
  return buildDailyPhasePresence(flow, locked, session, userId, dk, now);
}

/**
 * @param {string} userId
 * @param {'morning'|'midday'|'evening'} flow
 * @param {object} session
 * @param {string} lang
 */
function buildMorningCheckInCommand(userId, session, lang) {
  startCheckIn(userId, session, "morning", lang);
  const today = todayKey();
  if (session.lastMorningCheckin !== today) {
    updateSession(userId, { lastMorningCheckin: today });
  }
  return buildCheckInPrompt(lang, "morning", session, userId);
}

function buildMiddayCheckInCommand(userId, session, lang) {
  startCheckIn(userId, session, "midday", lang);
  return buildCheckInPrompt(lang, "midday", session, userId);
}

function buildEveningCheckInCommand(userId, session, lang) {
  startCheckIn(userId, session, "evening", lang);
  const today = todayKey();
  updateSession(userId, { lastEveningMirror: today });
  return buildCheckInPrompt(lang, "evening", session, userId);
}

/**
 * @param {object} daily
 * @param {string} stepKey
 * @param {string} text
 */
function applyStepToDaily(daily, stepKey, text) {
  const next = { ...daily };
  switch (stepKey) {
    case "morning_energy":
      next.energyLevel = parseScale1to10(text) ?? parseScaleAt(text, 0);
      break;
    case "morning_sleep":
      next.sleepQuality = parseScale1to10(text) ?? parseScaleAt(text, 0);
      break;
    case "morning_mission":
      next.todayMission = String(text || "").trim().slice(0, 200);
      break;
    case "morning_anchors": {
      const a = parseBodyAnchors(text);
      next.hydrationDone = a.hydrationDone;
      next.movementDone = a.movementDone;
      next.breathworkDone = a.breathworkDone;
      if (a.hydrationDone) next = pushCompletedAction(next, "hydration");
      if (a.movementDone) next = pushCompletedAction(next, "movement");
      if (a.breathworkDone) next = pushCompletedAction(next, "breathwork");
      break;
    }
    case "midday_focus": {
      next.focusDrift = parseYesNo(text);
      if (next.focusDrift === true) next.disciplineState = "drifting";
      if (next.focusDrift === false) next.disciplineState = "focused";
      break;
    }
    case "midday_hydration": {
      const yn = parseYesNo(text);
      next.hydrationDone = yn === true || /\b(víz|viz|water|igen)\b/i.test(text);
      break;
    }
    case "midday_movement": {
      const yn = parseYesNo(text);
      next.movementDone = yn === true || /\b(mozg|movement|mișcare|igen)\b/i.test(text);
      break;
    }
    case "midday_screen":
      next.screenDiscipline = parseScreenDiscipline(text);
      break;
    case "midday_correction":
      next.middayCorrection = String(text || "").trim().slice(0, 200);
      break;
    case "evening_completed":
      next.eveningReflection = String(text || "").trim().slice(0, 300);
      next = pushCompletedAction(next, "evening_reflection");
      break;
    case "evening_leak":
      next.energyLeak = String(text || "").trim().slice(0, 200);
      break;
    case "evening_release":
      next.eveningRelease = String(text || "").trim().slice(0, 200);
      break;
    case "evening_recovery":
      next.recoveryAction = String(text || "").trim().slice(0, 200);
      break;
    default:
      break;
  }
  return next;
}

/**
 * Try full-bundle parse when user answers all at once.
 */
function tryBundleParse(flow, text, daily) {
  if (flow === "morning") {
    const b = parseMorningBundle(text);
    const filled =
      b.energyLevel != null ||
      b.sleepQuality != null ||
      b.todayMission ||
      b.hydrationDone ||
      b.movementDone ||
      b.breathworkDone;
    if (!filled) return null;
    return {
      ...daily,
      energyLevel: b.energyLevel ?? daily.energyLevel,
      sleepQuality: b.sleepQuality ?? daily.sleepQuality,
      todayMission: b.todayMission || daily.todayMission,
      hydrationDone: b.hydrationDone || daily.hydrationDone,
      movementDone: b.movementDone || daily.movementDone,
      breathworkDone: b.breathworkDone || daily.breathworkDone
    };
  }
  if (flow === "midday") {
    const b = parseMiddayBundle(text);
    return {
      ...daily,
      focusDrift: b.focusDrift ?? daily.focusDrift,
      hydrationDone: b.hydrationDone ?? daily.hydrationDone,
      movementDone: b.movementDone ?? daily.movementDone,
      screenDiscipline: b.screenDiscipline ?? daily.screenDiscipline,
      middayCorrection: b.middayCorrection || daily.middayCorrection
    };
  }
  if (flow === "evening") {
    const b = parseEveningBundle(text);
    return {
      ...daily,
      eveningReflection: b.eveningReflection || daily.eveningReflection,
      energyLeak: b.energyLeak || daily.energyLeak,
      eveningRelease: b.eveningRelease || daily.eveningRelease,
      recoveryAction: b.recoveryAction || daily.recoveryAction
    };
  }
  return null;
}

function isBundleComplete(flow, daily) {
  if (flow === "morning") {
    return (
      daily.energyLevel != null &&
      daily.sleepQuality != null &&
      daily.todayMission &&
      (daily.hydrationDone || daily.movementDone || daily.breathworkDone)
    );
  }
  if (flow === "midday") {
    return (
      daily.focusDrift != null &&
      daily.screenDiscipline != null &&
      daily.middayCorrection
    );
  }
  return Boolean(daily.eveningReflection && daily.recoveryAction);
}

/**
 * @param {string} userId
 * @param {string} text
 * @param {string} lang
 * @param {object} session
 * @returns {string|null}
 */
function tryConsumeDailyCheckInReply(userId, text, lang, session) {
  const pending = session.dailyCheckInPending;
  if (!pending?.flow) return null;

  const flow = pending.flow;
  const copy = getDailyTrackingCopy(lang);
  let daily = getOrCreateDailyState(session, userId, lang);

  const bundled = tryBundleParse(flow, text, daily);
  if (bundled) {
    daily = bundled;
    if (isBundleComplete(flow, daily)) {
      const proto = syncProtocolFieldsFromDaily(session, daily);
      updateSession(userId, {
        dailyState: daily,
        dailyCheckInPending: null,
        ...proto
      });
      return buildCheckInCompleteReply(
        userId,
        flow,
        lang,
        daily,
        getSession(userId)
      );
    }
  }

  const stepList = stepsForFlow(flow);
  const stepKey = stepList[pending.step];
  if (!stepKey) {
    updateSession(userId, { dailyCheckInPending: null });
    return null;
  }

  daily = applyStepToDaily(daily, stepKey, text);
  const nextStep = pending.step + 1;

  if (nextStep >= stepList.length) {
    const proto = syncProtocolFieldsFromDaily(session, daily);
    updateSession(userId, {
      dailyState: daily,
      dailyCheckInPending: null,
      ...proto
    });
    return buildCheckInCompleteReply(userId, flow, lang, daily, getSession(userId));
  }

  updateSession(userId, {
    dailyState: daily,
    dailyCheckInPending: { ...pending, step: nextStep }
  });

  const nextQ = copy.steps[stepList[nextStep]];
  return lines(copy.saved.partial, nextQ);
}

module.exports = {
  buildMorningCheckInCommand,
  buildMiddayCheckInCommand,
  buildEveningCheckInCommand,
  buildCheckInPrompt,
  tryConsumeDailyCheckInReply,
  startCheckIn,
  stepsForFlow
};
