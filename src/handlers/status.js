/**
 * /status — session snapshot + optional KaiZen profile (24h memory).
 * Architecture: pure string builder; extend when profile persists to DB.
 */

const { getResponses } = require("../i18n/getResponses");
const { lines, disclaimer } = require("../personality/kaizenVoice");
const { pathLabel, obstacleLabel } = require("./onboarding");
const { suggestedProgramCommand } = require("./programFlow");

const HIGH_INTENSITY = [
  "chaos_loop",
  "immediate_recovery",
  "pattern_blocked",
  "session_loop",
  "cooldown",
  "emotional_repeat_triple"
];
const MID_INTENSITY = [
  "trading_impulse",
  "trading_context",
  "emotional_reflection",
  "focus_drift",
  "work_focus"
];

function intensityLabel(cat, r) {
  if (HIGH_INTENSITY.includes(cat)) return r.statusIntensityHigh;
  if (MID_INTENSITY.includes(cat)) return r.statusIntensityMedium;
  return r.statusIntensityLow;
}

function nextStepHint(cat, lastCmd, r) {
  if (cat === "companion_paused") return r.statusNextResume;
  if (cat === "companion_active" || cat === "companion_flow")
    return r.statusNextCompanionContinue;
  if (["chaos_loop", "immediate_recovery", "pattern_blocked", "session_loop"].includes(cat))
    return r.statusNextRecovery;
  if (cat === "trading_impulse") return r.statusNextTrade;
  if (cat === "trading_context") return r.statusNextTrade;
  if (cat === "emotional_reflection" || cat === "emotional_repeat_triple")
    return r.statusNextEmotional;
  if (cat === "focus_drift") return r.statusNextDrift;
  if (cat === "body_energy") return r.statusNextBody;
  if (cat === "help_intent") return r.statusNextGuide;
  if (cat === "energy_question") return r.statusNextEnergyAsk;
  if (cat === "clarity_protocol") return r.statusNextClarity;
  if (cat === "easter_creator") return r.statusNextCreator;
  if (cat === "reflective_open" || cat === "general_curiosity")
    return r.statusNextReflect;
  if (cat === "plan_tracking") return r.statusNextPlan;
  if (cat === "work_focus") return r.statusNextDrift;
  if (cat === "self_development") return r.statusNextPlan;
  if (
    lastCmd &&
    ![
      "/status",
      "/help",
      "/guide",
      "/start",
      "/profile",
      "/setup",
      "/skip",
      "/language",
      "/clear",
      "/program",
      "/today",
      "/mission",
      "/done",
      "/morning",
      "/mantra",
      "/evening",
      "/procrastination",
      "/lettinggo",
      "/resistance",
      "/business",
      "/admin",
      "/sales",
      "/analytics",
      "/moon",
      "/numerology",
      "/astro",
      "/pulse",
      "/mirror",
      "/energy",
      "/focus",
      "/trade",
      "/plan",
      "/reset",
      "/commands",
      "/map",
      "/mode",
      "/off",
      "/pause",
      "/resume",
      "/whereami"
    ].includes(lastCmd)
  )
    return r.statusNextLastCommand;
  return r.statusNextDefault;
}

function pathBasedNext(session, r) {
  if (!session.onboardingCompleted || !session.userPrimaryPath) return null;
  const p = session.userPrimaryPath;
  const map = {
    trading: r.statusNextPathTrading,
    business: r.statusNextPathBusiness,
    physical: r.statusNextPathPhysical,
    emotional: r.statusNextPathEmotional,
    spiritual: r.statusNextPathSpiritual,
    selfdev: r.statusNextPathSelfdev,
    mixed: r.statusNextPathMixed,
    other: r.statusNextPathOther
  };
  return map[p] || r.statusNextPathOther;
}

function profileBlock(session, lang) {
  const r = getResponses(lang);
  const show =
    session.onboardingCompleted ||
    session.onboardingActive ||
    session.userPrimaryPath ||
    (session.userGoal30Days && String(session.userGoal30Days).trim()) ||
    session.userMainObstacle ||
    session.currentMission?.trim();
  if (!show) return null;
  const pref =
    session.preferredLanguage === "auto"
      ? r.obLangLabels.auto
      : r.obLangLabels[session.preferredLanguage] || r.profileNotSet;
  const setup =
    session.onboardingCompleted
      ? r.profileOnboardingDone
      : session.onboardingSkipped
        ? r.profileOnboardingSkipped
        : session.onboardingActive
          ? r.profileOnboardingPending
          : r.profileNotSet;
  return lines(
    r.profileTitle,
    `${r.profilePath}: ${pathLabel(session, r)}`,
    `${r.profileGoal}: ${
      session.userGoal30Days?.trim() || r.profileNotSet
    }`,
    `${r.profileObstacle}: ${obstacleLabel(session, r)}`,
    `${r.profileTone}: ${
      r.obIntensityLabels[session.userIntensityPreference] ||
      session.userIntensityPreference ||
      r.profileNotSet
    }`,
    `${r.profileLangPref}: ${pref}`,
    `${r.profileOnboarding}: ${setup}`,
    ...(session.currentMission?.trim()
      ? [`${r.tProfileMissionLine} ${session.currentMission.trim()}`]
      : [])
  );
}

/**
 * @param {object} message
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function buildStatusReply(message, session, lang) {
  const r = getResponses(lang);
  const rawCat = session.lastCategory;
  const lastCatDisplay = rawCat ?? "—";
  const lastCmdRaw = session.lastCommand;
  const lastCmdDisplay = lastCmdRaw ?? "—";
  const turns = (session.messages && session.messages.length) || 0;
  const metaCmds = new Set([
    "/status",
    "/help",
    "/guide",
    "/start",
    "/profile",
    "/setup",
    "/skip",
    "/language",
    "/clear",
    "/program",
    "/today",
    "/mission",
    "/done",
    "/morning",
    "/mantra",
    "/evening",
    "/procrastination",
    "/lettinggo",
    "/resistance",
    "/business",
    "/admin",
    "/sales",
    "/analytics",
    "/moon",
    "/numerology",
    "/astro",
    "/pulse",
    "/mirror",
    "/energy",
    "/focus",
    "/trade",
    "/plan",
    "/reset",
    "/commands",
    "/map",
    "/mode",
    "/off",
    "/pause",
    "/resume",
    "/whereami"
  ]);
  const mode =
    lastCmdRaw && !metaCmds.has(lastCmdRaw)
      ? r.statusModeStructured
      : r.statusModeOpen;
  const intensityCat = rawCat || "unknown";
  const intensity = intensityLabel(intensityCat, r);
  const pathHint = pathBasedNext(session, r);
  const coachingNext = pathHint || nextStepHint(intensityCat, lastCmdRaw, r);
  const progCmd = suggestedProgramCommand(session);
  const progStep =
    session.programMode === "dragon_training"
      ? session.currentProgramStep || r.tStatusProgramIdle
      : "—";

  const suggested = session.lastSuggestedAction;
  const suggestedLine =
    suggested && String(suggested).trim()
      ? `${r.statusLastSuggested}: ${suggested}`
      : null;

  const prof = profileBlock(session, lang);

  const body = lines(
    r.statusTitle,
    "",
    `${r.statusLanguage}: ${lang}`,
    ...(prof ? ["", prof] : []),
    "",
    `${r.statusMode}: ${mode}`,
    `${r.statusLastCommand}: ${lastCmdDisplay}`,
    `${r.statusLastCategory}: ${lastCatDisplay}`,
    ...(suggestedLine ? [suggestedLine] : []),
    `${r.statusSessionTurns}: ${turns}`,
    `${r.statusIntensity}: ${intensity}`,
    "",
    `${r.statusNext}: ${coachingNext}`,
    "",
    `${r.tStatusProgram}: ${session.programMode || "—"}`,
    `${r.tStatusProgramStep}: ${progStep}`,
    `${r.tStatusNextProgram}: ${progCmd}`,
    "",
    session.companionActive
      ? session.companionPaused
        ? r.tStatusCompanionPaused
        : r.tStatusCompanionLive
      : r.tStatusCompanionOff,
    "",
    r.statusCommandsHint,
    "",
    disclaimer(lang)
  );
  return body;
}

module.exports = { buildStatusReply };
