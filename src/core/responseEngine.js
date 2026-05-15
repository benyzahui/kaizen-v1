/**
 * Core Response Engine — evaluates user state before every open reply.
 *
 * Future LLM: replace pickPresenceLine() bodies with model output;
 * keep analyzeUserState() as feature extraction feeding the prompt.
 */

const { classifyMessage } = require("../conversation/classify");
const { detectCoachState } = require("./stateDetector");
const { detectNaturalIntent } = require("../brain/intentEngine");
const { getTimeSlot } = require("./timeContext");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { pickSeeded } = require("../personality/tone");

/**
 * @typedef {'grounded_calm'|'sharp_focus'|'disciplined_push'|'recovery_mode'|'reflective_mode'|'warrior_mode'|'silent_stability'} MentorMode
 */

/**
 * @typedef {object} UserStateSnapshot
 * @property {string} category
 * @property {string} coachState
 * @property {string|null} intent
 * @property {MentorMode} mentorMode
 * @property {'short'|'medium'|'direct'} length
 * @property {number} emotionalIntensity 0-10
 * @property {number} energyLevel 0-10
 * @property {number} scatter 0-10
 * @property {number} seriousness
 * @property {'rising'|'falling'|'stable'} momentum
 * @property {string} timeSlot
 * @property {boolean} shouldAskQuestion
 * @property {boolean} useHumor
 * @property {number} groundedRatio 0-1
 * @property {number} mysticalRatio 0-1
 */

function scoreEmotionalIntensity(text, category) {
  const t = String(text || "").toLowerCase();
  let s = 0;
  if (/(panic|crisis|can't breathe|nem bírom|nu mai pot|breaking down)/i.test(t)) s += 8;
  else if (/(overwhelm|chaos|szétes|prăbuș|spiral|ruminat)/i.test(t)) s += 6;
  else if (/(sad|tired|fáradt|obosit|anxious|stress)/i.test(t)) s += 4;
  else if (/(frustrated|angry|düh|furios)/i.test(t)) s += 5;
  if (category === "emotional_reflection" || category === "chaos_loop") s += 2;
  if (t.length > 200) s += 1;
  return Math.min(10, s);
}

function scoreScatter(text, category, coachState) {
  let s = 0;
  if (category === "focus_drift" || coachState === "scattered_state") s += 7;
  if (/(too many|mind racing|szétszórt|prea multe|tabs|scroll)/i.test(text)) s += 4;
  if (/(also|and also|meg|și)/gi.test(text) && text.length > 120) s += 2;
  return Math.min(10, s);
}

function scoreEnergy(text, category) {
  const t = String(text || "").toLowerCase();
  if (/(exhausted|burned out|kimerült|epuizat|no energy|nincs energi)/i.test(t)) return 2;
  if (/(tired|fáradt|obosit)/i.test(t)) return 4;
  if (category === "body_energy") return 4;
  if (/(ready|focused|clear|kész|pregătit)/i.test(t)) return 7;
  return 5;
}

function detectMomentum(session, category) {
  const m = session.messages || [];
  if (m.length < 2) return "stable";
  const heavy = new Set([
    "emotional_reflection",
    "chaos_loop",
    "focus_drift",
    "plan_tracking"
  ]);
  const last = m[m.length - 1].category;
  const prev = m[m.length - 2].category;
  if (heavy.has(category) && heavy.has(last) && heavy.has(prev)) return "rising";
  if (category === "casual_greeting" || category === "light_conversation") return "falling";
  return "stable";
}

/**
 * @param {string} text
 * @param {object} session
 * @param {string} [classifyCategory]
 * @returns {UserStateSnapshot}
 */
function analyzeUserState(text, session, classifyCategory) {
  const category = classifyCategory || classifyMessage(text);
  const coachState = detectCoachState(text, session, category);
  const natural = detectNaturalIntent(text, category, session);
  const seriousness = Number(session.seriousnessScore) ?? 50;
  const emotionalIntensity = scoreEmotionalIntensity(text, category);
  const scatter = scoreScatter(text, category, coachState);
  const energyLevel = scoreEnergy(text, category);
  const momentum = detectMomentum(session, category);
  const timeSlot = getTimeSlot(session);

  let mentorMode = "grounded_calm";

  if (emotionalIntensity >= 7 || category === "chaos_loop") {
    mentorMode = "recovery_mode";
  } else if (scatter >= 6 || coachState === "scattered_state") {
    mentorMode = "sharp_focus";
  } else if (
    coachState === "procrastinating" ||
    coachState === "start_paralysis" ||
    seriousness < 35
  ) {
    mentorMode = "disciplined_push";
  } else if (
    coachState === "tired_push" ||
    coachState === "body_neglect"
  ) {
    mentorMode = "recovery_mode";
  } else if (
    category === "reflective_open" ||
    coachState === "seeking_clarity" ||
    coachState === "emotional_open"
  ) {
    mentorMode = "reflective_mode";
  } else if (
    coachState === "trading_impulse_lane" ||
    coachState === "trading_session_anchor"
  ) {
    mentorMode = "warrior_mode";
  } else if (
    category === "casual_greeting" ||
    category === "light_conversation"
  ) {
    mentorMode = "silent_stability";
  }

  let length = "medium";
  if (mentorMode === "sharp_focus" || mentorMode === "disciplined_push") length = "short";
  if (mentorMode === "reflective_mode" && emotionalIntensity >= 5) length = "medium";
  if (mentorMode === "silent_stability") length = "short";

  const shouldAskQuestion =
    mentorMode === "reflective_mode" &&
    emotionalIntensity >= 4 &&
  seriousness >= 40 &&
    scatter < 6;

  const useHumor =
    seriousness >= 35 &&
    seriousness <= 75 &&
    emotionalIntensity < 7 &&
    scatter >= 3 &&
    (coachState === "procrastinating" || coachState === "agreement_surface");

  const groundedRatio =
    mentorMode === "recovery_mode" || mentorMode === "grounded_calm" ? 0.85 : 0.7;
  const mysticalRatio = category === "energy_question" ? 0.15 : 0.08;

  return {
    category,
    coachState,
    intent: natural?.intent || null,
    mentorMode,
    length,
    emotionalIntensity,
    energyLevel,
    scatter,
    seriousness,
    momentum,
    timeSlot,
    shouldAskQuestion,
    useHumor,
    groundedRatio,
    mysticalRatio
  };
}

/**
 * Pick a presence lead line for the mentor mode (anti-template via session seed).
 * @param {UserStateSnapshot} state
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function pickPresenceLead(state, lang, session) {
  const r = getResponses(lang);
  const pool = r.presenceLeads?.[state.mentorMode];
  if (!pool?.length) return null;
  const seed = `${state.mentorMode}_${(session.messages || []).length}_${state.coachState}`;
  return pickSeeded(pool, seed);
}

/**
 * Pick a presence close (not a question) when we should guide directly.
 */
function pickPresenceClose(state, lang, session) {
  const r = getResponses(lang);
  const pool = r.presenceCloses?.[state.mentorMode];
  if (!pool?.length) return null;
  const seed = `${state.mentorMode}_close_${(session.messages || []).length}`;
  return pickSeeded(pool, seed);
}

/**
 * Wrap category body with presence layer — human first, template second.
 * @param {string} coreBody
 * @param {UserStateSnapshot} state
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {boolean} [skipLead]
 */
function humanizeReply(coreBody, state, lang, session, skipLead = false) {
  const lead = skipLead ? null : pickPresenceLead(state, lang, session);
  const close =
    state.shouldAskQuestion ? null : pickPresenceClose(state, lang, session);

  const parts = [];
  if (lead) parts.push(lead);
  parts.push(coreBody);
  if (close) parts.push("", close);
  return lines(...parts.filter(Boolean));
}

/**
 * Session patch to persist engine state for continuity.
 * @param {UserStateSnapshot} state
 */
function engineSessionPatch(state) {
  return {
    lastMentorMode: state.mentorMode,
    emotionalMomentum: state.momentum,
    lastEmotionalIntensity: state.emotionalIntensity
  };
}

module.exports = {
  analyzeUserState,
  humanizeReply,
  pickPresenceLead,
  pickPresenceClose,
  engineSessionPatch
};
