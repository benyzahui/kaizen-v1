/**
 * In-memory plan map and /focus capture. Resets on cold start.
 * Not long-term storage — honest with the user in copy.
 */

const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { formatFullRecovery } = require("./balanceProtocol");

/** @type {Map<string, { work: string, selfDev: string, body: string, trading: string, focus60: string }>} */
const plans = new Map();

/** @type {Set<string>} */
const pendingFocus = new Set();

function uid(message) {
  return String(message.from?.id ?? message.chat?.id ?? "unknown");
}

function getPlan(userId) {
  return (
    plans.get(userId) || {
      work: "",
      selfDev: "",
      body: "",
      trading: "",
      focus60: ""
    }
  );
}

function setPlan(userId, patch) {
  const cur = { ...getPlan(userId), ...patch };
  plans.set(userId, cur);
}

function clearPending(userId) {
  pendingFocus.delete(String(userId));
}

function clearAllPendingForUser(message) {
  clearPending(uid(message));
}

function formatPlan(lang, userId) {
  const r = getResponses(lang);
  const p = getPlan(userId);
  const d = (s) => (s && s.trim() ? s.trim() : r.planEmpty);
  return lines(
    r.planIntro,
    "",
    `${r.planFieldWork}: ${d(p.work)}`,
    `${r.planFieldSelf}: ${d(p.selfDev)}`,
    `${r.planFieldBody}: ${d(p.body)}`,
    `${r.planFieldTrading}: ${d(p.trading)}`,
    `${r.planFieldFocus}: ${d(p.focus60)}`
  );
}

function normalizeCommandText(text) {
  return String(text || "")
    .trim()
    .replace(/^(\/\w+)@\w+/i, "$1");
}

/**
 * /plan [work|self|body|trading] <text>
 */
function handlePlanCommand(message, lang) {
  const userId = uid(message);
  const norm = normalizeCommandText(message.text || "");
  const r = getResponses(lang);
  const parts = norm.split(/\s+/);
  if (parts.length <= 1) {
    return formatPlan(lang, userId);
  }

  const area = (parts[1] || "").toLowerCase();
  const rest = parts.slice(2).join(" ").trim();
  if (!rest) {
    return formatPlan(lang, userId);
  }

  const keyMap = {
    work: "work",
    self: "selfDev",
    "self-development": "selfDev",
    body: "body",
    energy: "body",
    trading: "trading"
  };
  const key = keyMap[area];
  if (!key) {
    return lines(formatPlan(lang, userId), "", r.unknown);
  }
  setPlan(userId, { [key]: rest.slice(0, 400) });
  return formatPlan(lang, userId);
}

/**
 * /focus or /focus <line>
 */
function handleFocusCommand(message, lang) {
  const userId = uid(message);
  const norm = normalizeCommandText(message.text || "");
  const r = getResponses(lang);
  const m = norm.match(/^\/focus\s+(.+)/i);
  if (m && m[1].trim()) {
    clearPending(userId);
    const line = m[1].trim().slice(0, 400);
    setPlan(userId, { focus60: line });
    return r.focusSaved(line);
  }
  pendingFocus.add(userId);
  return r.focusPrompt;
}

function handleResetCommand(lang) {
  return formatFullRecovery(lang, { includeLoopIntro: false });
}

/**
 * If user is replying to /focus prompt, consume one line.
 * @returns {string|null}
 */
function tryConsumeFocusReply(message, lang) {
  const userId = uid(message);
  if (!pendingFocus.has(userId)) return null;
  const line = String(message.text || "").trim();
  if (!line || line.startsWith("/")) {
    return null;
  }
  pendingFocus.delete(userId);
  const r = getResponses(lang);
  setPlan(userId, { focus60: line.slice(0, 400) });
  return r.focusSaved(line.slice(0, 400));
}

module.exports = {
  handlePlanCommand,
  handleFocusCommand,
  handleResetCommand,
  tryConsumeFocusReply,
  clearAllPendingForUser,
  formatPlan
};
