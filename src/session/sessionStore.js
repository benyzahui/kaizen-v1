/**
 * In-memory per-user session (24h TTL). Not durable — no DB.
 * Cleared automatically after 24h without interaction.
 *
 * Architecture: hot path is synchronous Map reads/writes. For scale, swap this
 * module for Redis/Supabase while keeping the same exports used by the webhook.
 */

const TTL_MS = 24 * 60 * 60 * 1000;

const { profileDefaults } = require("./userProfile");

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
  const messages = [...(s.messages || []), msg].slice(-5);
  const lastReplyByCategory = { ...(s.lastReplyByCategory || {}) };
  if (ev.category) {
    lastReplyByCategory[ev.category] = String(ev.reply || "").slice(0, 400);
  }
  store.set(id, {
    ...s,
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
    messages,
    lastReplyByCategory,
    lastAt: Date.now()
  });
}

module.exports = {
  TTL_MS,
  clearExpiredSessions,
  getSession,
  updateSession,
  clearSession,
  recordInteraction,
  isSessionCategoryLoop,
  isTripleSameEmotionalText,
  normalizeMessageKey,
  HEAVY,
  TRIPLE_LOOP_CATEGORIES
};
