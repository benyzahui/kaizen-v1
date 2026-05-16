/**
 * In-memory per-user session (24h TTL). Not durable — no DB.
 * Cleared automatically after 24h without interaction.
 *
 * Architecture: hot path is synchronous Map reads/writes. For scale, swap this
 * module for Redis/Supabase while keeping the same exports used by the webhook.
 */

const TTL_MS = 24 * 60 * 60 * 1000;

const { profileDefaults } = require("./userProfile");

/** Profile + durable prefs preserved on /clear */
const PROFILE_AND_LOCK_KEYS = [
  "userPrimaryPath",
  "userPrimaryPathNote",
  "userGoal30Days",
  "userMainObstacle",
  "userMainObstacleNote",
  "userIntensityPreference",
  "preferredLanguage",
  "onboardingCompleted",
  "onboardingActive",
  "onboardingSkipped",
  "onboardingStep",
  "programLane",
  "currentMission",
  "preferredTrainingStyle",
  "meetKaiZenCompleted",
  "userName",
  "userPurpose",
  "membershipTier",
  "dragonLevel",
  "currentProgram",
  "dailyStreak",
  "lastMorningCheckin",
  "lastEveningMirror",
  "seriousnessScore",
  "notificationOptIn",
  "morningTime",
  "eveningTime",
  "timezone"
];
const { replyFingerprint } = require("../conversation/replyFingerprint");
const { countBannedPhraseHits } = require("../conversation/bannedPhrases");
const { snippetKey } = require("../conversation/responseVariation");
const { mapCategoryToConversationState } = require("../conversation/conversationState");
const { recordStructure } = require("../conversation/structureMemory");

/** @type {Map<string, any>} */
const store = new Map();

/**
 * @typedef {Object} UserSession
 * @property {'en'|'hu'|'ro'|null} lang
 * @property {string|null} lastEmotion
 * @property {string|null} lastCategory
 * @property {string|null} lastCommand
 * @property {{ text: string, category: string|null, ts: number }[]} messages
 * @property {string|null} userPrimaryPath
 * @property {string|null} userPrimaryPathNote
 * @property {string|null} userGoal30Days
 * @property {string|null} userMainObstacle
 * @property {string|null} userMainObstacleNote
 * @property {string|null} userIntensityPreference
 * @property {string|null} preferredLanguage
 * @property {boolean} onboardingCompleted
 * @property {boolean} onboardingActive
 * @property {boolean} onboardingSkipped
 * @property {number} onboardingStep
 * @property {string[]} lastAssistantPrints
 * @property {number} comfortOpenerUses
 * @property {number} smallStepAskUses
 * @property {string[]} recentCoachSnippets
 * @property {string[]} recentCommands
 * @property {string|null} conversationState
 * @property {string|null} lastTopic
 */

function emptySession() {
  return {
    ...profileDefaults(),
    lang: null,
    lastEmotion: null,
    lastCategory: null,
    lastCommand: null,
    messages: [],
    lastReplyByCategory: {},
    lastSuggestedAction: null,
    lastAssistantPrints: [],
    comfortOpenerUses: 0,
    smallStepAskUses: 0,
    recentCoachSnippets: [],
    recentCommands: [],
    conversationState: null,
    lastTopic: null,
    dailyTask: null,
    programMode: null,
    currentProgramStep: null,
    companionActive: false,
    companionPaused: false,
    companionAwaiting: null,
    companionFlowBody: null,
    companionFlowMind: null,
    companionLastMissionSnippet: null,
    companionLastProtocol: null,
    awaitingWhyHere: false,
    brainHumorCooldown: 0,
    brainHumorIndex: 0,
    responseStructures: [],
    lastMentorMode: null,
    currentMoodMode: null,
    conversationMode: null,
    emotionalMomentum: "stable",
    lastEmotionalIntensity: 0,
    lastMantraDate: null,
    lastMirrorDate: null,
    focusLocked: false,
    lastAt: Date.now()
  };
}

function clearExpiredSessions() {
  const now = Date.now();
  for (const [id, s] of store) {
    if (now - s.lastAt > TTL_MS) store.delete(id);
  }
}

/**
 * @param {string|number} userId
 */
function getSession(userId) {
  clearExpiredSessions();
  const id = String(userId);
  if (!store.has(id)) store.set(id, emptySession());
  return store.get(id);
}

/**
 * @param {string|number} userId
 * @param {Partial<UserSession>} data
 */
function updateSession(userId, data) {
  const id = String(userId);
  const cur = { ...getSession(userId), ...data, lastAt: Date.now() };
  store.set(id, cur);
  return cur;
}

/**
 * @param {string|number} userId
 */
function clearSession(userId) {
  store.delete(String(userId));
}

/**
 * Clear transient coaching memory; keep permanent profile fields and language lock.
 * @param {string|number} userId
 */
function resetEphemeralKeepProfile(userId) {
  const id = String(userId);
  const cur = getSession(userId);
  const keep = {};
  for (const k of PROFILE_AND_LOCK_KEYS) {
    keep[k] = cur[k];
  }
  store.delete(id);
  const base = emptySession();
  const merged = {
    ...base,
    ...keep,
    programLane: keep.programLane || "free",
    lastAt: Date.now()
  };
  const pref = merged.preferredLanguage;
  if (pref === "hu" || pref === "ro" || pref === "en") {
    merged.lang = pref;
  }
  store.set(id, merged);
  return merged;
}

const HEAVY = [
  "chaos_loop",
  "trading_impulse",
  "emotional_reflection",
  "focus_drift"
];

const TRIPLE_LOOP_CATEGORIES = ["emotional_reflection", "focus_drift"];

/**
 * Third consecutive heavy message in the same category → loop.
 * @param {UserSession} session
 * @param {string} category
 */
function isSessionCategoryLoop(session, category) {
  if (!HEAVY.includes(category)) return false;
  const m = session.messages || [];
  if (m.length < 2) return false;
  const a = m[m.length - 1].category;
  const b = m[m.length - 2].category;
  return a === category && b === category;
}

/** Normalize user text for repeat detection (anti-loop). */
function normalizeMessageKey(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Same emotional-class message text repeated 3× (before recording current turn).
 * Lightweight guard against infinite recursion / rumination loops in chat.
 */
function isTripleSameEmotionalText(session, text, category) {
  if (!TRIPLE_LOOP_CATEGORIES.includes(category)) return false;
  const key = normalizeMessageKey(text);
  if (key.length < 6) return false;
  const m = session.messages || [];
  if (m.length < 2) return false;
  const m1 = m[m.length - 1];
  const m2 = m[m.length - 2];
  if (m1.category !== category || m2.category !== category) return false;
  return (
    normalizeMessageKey(m1.text) === key && normalizeMessageKey(m2.text) === key
  );
}

/**
 * @param {string|number} userId
 * @param {{ text: string, reply: string, lang: string, category?: string|null, command?: string|null, suggestedAction?: string|null }} ev
 */
function recordInteraction(userId, ev) {
  const id = String(userId);
  const s = getSession(userId);
  const msg = {
    text: String(ev.text || "").slice(0, 500),
    category: ev.category ?? null,
    ts: Date.now()
  };
  const messages = [...(s.messages || []), msg].slice(-15);
  const lastReplyByCategory = { ...(s.lastReplyByCategory || {}) };
  if (ev.category) {
    lastReplyByCategory[ev.category] = String(ev.reply || "").slice(0, 400);
  }
  const fp = replyFingerprint(String(ev.reply || ""));
  const lastAssistantPrints = [...(s.lastAssistantPrints || []), fp].slice(-2);
  const hits = countBannedPhraseHits(ev.reply);
  const snippet = snippetKey(ev.reply);
  const recentCoachSnippets = [...(s.recentCoachSnippets || []), snippet].slice(-12);
  const convState = mapCategoryToConversationState(ev.category, {
    command: ev.command || null
  });
  const recentCommands =
    ev.command != null && String(ev.command).trim()
      ? [...(s.recentCommands || []), String(ev.command).trim()].slice(-8)
      : s.recentCommands || [];
  const structPatch = recordStructure(s, String(ev.reply || ""));
  const { trackAssistantReply } = require("../conversation/responseVariationEngine");
  const variationPatch = trackAssistantReply(s, String(ev.reply || ""));

  store.set(id, {
    ...s,
    ...structPatch,
    ...variationPatch,
    lang: ev.lang || s.lang,
    lastEmotion:
      ev.category === "chaos_loop" ||
      ev.category === "emotional_reflection" ||
      ev.category === "focus_drift"
        ? ev.category
        : s.lastEmotion,
    lastCategory: ev.category ?? s.lastCategory,
    lastCommand: ev.command ?? s.lastCommand,
    lastSuggestedAction:
      ev.suggestedAction !== undefined
        ? ev.suggestedAction
        : s.lastSuggestedAction,
    lastTopic: String(ev.text || "").trim().slice(0, 240) || s.lastTopic || null,
    messages,
    lastReplyByCategory,
    lastAssistantPrints,
    comfortOpenerUses: (s.comfortOpenerUses || 0) + hits.comfort,
    smallStepAskUses: (s.smallStepAskUses || 0) + hits.smallStep,
    recentCoachSnippets,
    recentCommands,
    conversationState: convState,
    lastAt: Date.now()
  });
}

module.exports = {
  TTL_MS,
  clearExpiredSessions,
  getSession,
  updateSession,
  clearSession,
  resetEphemeralKeepProfile,
  recordInteraction,
  isSessionCategoryLoop,
  isTripleSameEmotionalText,
  normalizeMessageKey,
  HEAVY,
  TRIPLE_LOOP_CATEGORIES
};
