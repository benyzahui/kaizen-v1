/**
 * /status — read-only snapshot of session + heuristics (no side effects).
 * Architecture: pure string builder; extend with DB fields when sessions persist.
 */

const { getResponses } = require("../i18n/getResponses");
const { lines, disclaimer } = require("../personality/kaizenVoice");

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
  if (["chaos_loop", "immediate_recovery", "pattern_blocked", "session_loop"].includes(cat))
    return r.statusNextRecovery;
  if (cat === "trading_impulse") return r.statusNextTrade;
  if (cat === "emotional_reflection" || cat === "emotional_repeat_triple")
    return r.statusNextEmotional;
  if (cat === "focus_drift") return r.statusNextDrift;
  if (cat === "body_energy") return r.statusNextBody;
  if (cat === "reflective_open" || cat === "general_curiosity")
    return r.statusNextReflect;
  if (cat === "plan_tracking") return r.statusNextPlan;
  if (cat === "work_focus") return r.statusNextDrift;
  if (cat === "self_development") return r.statusNextPlan;
  if (
    lastCmd &&
    !["/status", "/help", "/start"].includes(lastCmd)
  )
    return r.statusNextLastCommand;
  return r.statusNextDefault;
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
  const metaCmds = new Set(["/status", "/help", "/start"]);
  const mode =
    lastCmdRaw && !metaCmds.has(lastCmdRaw)
      ? r.statusModeStructured
      : r.statusModeOpen;
  const intensityCat = rawCat || "unknown";
  const intensity = intensityLabel(intensityCat, r);
  const next = nextStepHint(
    intensityCat,
    lastCmdRaw,
    r
  );

  const suggested = session.lastSuggestedAction;
  const suggestedLine =
    suggested && String(suggested).trim()
      ? `${r.statusLastSuggested}: ${suggested}`
      : null;

  const body = lines(
    r.statusTitle,
    "",
    `${r.statusLanguage}: ${lang}`,
    `${r.statusMode}: ${mode}`,
    `${r.statusLastCommand}: ${lastCmdDisplay}`,
    `${r.statusLastCategory}: ${lastCatDisplay}`,
    ...(suggestedLine ? [suggestedLine] : []),
    `${r.statusSessionTurns}: ${turns}`,
    `${r.statusIntensity}: ${intensity}`,
    "",
    `${r.statusNext}: ${next}`,
    "",
    r.statusCommandsHint,
    "",
    disclaimer(lang)
  );
  return body;
}

module.exports = { buildStatusReply };
