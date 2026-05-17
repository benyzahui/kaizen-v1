/**
 * KaiZen inbound pipeline — single path for Telegram text.
 *
 * Flow:
 *   load session → language lock → command | onboarding | open → record → persist
 *
 * Commands route in handlers/commands.js.
 * Natural text routes in handlers/openConversation.js via companion core.
 */

const {
  getSession,
  recordInteraction,
  clearExpiredSessions
} = require("../session/sessionStore");
const { hydrateFromSupabase, persistToSupabase } = require("../db/syncState");
const {
  resolveLanguageWithSession,
  resolveLang
} = require("../i18n/languageDetect");
const { getResponses } = require("../i18n/getResponses");
const {
  isCommandText,
  routeCommandMessage,
  extractCommand
} = require("../handlers/commands");
const { handleOpenConversation } = require("../handlers/openConversation");
const { processOnboardingReply } = require("../handlers/onboarding");
const {
  requiresOnboardingGate,
  isSafeOnboardingCommand,
  lockLanguageFromFirstMessage,
  resolveOnboardingLang,
  ensureOnboardingActive,
  onboardingCommandRedirect,
  onboardingContinuePrompt
} = require("../companion/onboardingGate");
const { tryConsumeFocusReply } = require("../handlers/planTracking");
const { conversation: logConversation } = require("../logging/log");

function userIdFrom(message) {
  return message.from?.id ?? message.chat?.id;
}

/**
 * @param {object} message Telegram message
 * @returns {Promise<{ reply: string, branch: string, lang: string, category: string|null, command: string|null, suggestedAction?: string|null }>}
 */
async function processIncomingMessage(message) {
  const userId = userIdFrom(message);
  const text = message.text || "";
  const trimmed = String(text).trim();

  if (!trimmed) {
    const session = getSession(userId);
    const lang = resolveLanguageWithSession("", session);
    const r = getResponses(lang);
    return {
      reply: r.pipelineEmptyText || "Send a message when you are ready.",
      branch: "empty",
      lang,
      category: null,
      command: null
    };
  }

  let session = getSession(userId);

  if (isCommandText(text)) {
    const command = extractCommand(text);
    if (requiresOnboardingGate(session) && !isSafeOnboardingCommand(command)) {
      const lang = resolveOnboardingLang(session, message, trimmed);
      return {
        reply: onboardingCommandRedirect(lang, command),
        branch: "onboarding_gate_command",
        lang,
        category: "onboarding",
        command
      };
    }
    const lang = resolveOnboardingLang(session, message, trimmed);
    const reply = await routeCommandMessage(message, getSession(userId));
    return { reply, branch: "command", lang, category: null, command };
  }

  if (requiresOnboardingGate(session)) {
    lockLanguageFromFirstMessage(userId, trimmed, session);
    session = ensureOnboardingActive(userId);
    const lang = resolveOnboardingLang(session, message, trimmed);

    const ob = processOnboardingReply(userId, trimmed, session, lang);
    return {
      reply: ob?.reply || onboardingContinuePrompt(lang),
      branch: "onboarding",
      lang,
      category: "onboarding",
      command: null
    };
  }

  lockLanguageFromFirstMessage(userId, trimmed, session);
  session = getSession(userId);
  const lang = resolveLanguageWithSession(trimmed, session);

  const focused = tryConsumeFocusReply(message, lang);
  if (focused) {
    return {
      reply: focused,
      branch: "focus_reply",
      lang,
      category: "focus_reply",
      command: null
    };
  }

  const { reply, category, suggestedAction } = await handleOpenConversation(
    message,
    lang,
    session
  );

  return {
    reply,
    branch: "open",
    lang,
    category: category ?? null,
    command: null,
    suggestedAction: suggestedAction ?? null
  };
}

/**
 * Hydrate, process, record session, persist profile.
 * @returns {Promise<string>}
 */
async function processAndRecordMessage(message) {
  const userId = userIdFrom(message);
  const trimmed = String(message.text || "").trim();

  const result = await processIncomingMessage(message);

  const payload = {
    text: trimmed,
    reply: result.reply,
    lang: result.lang,
    category: result.category,
    command: result.command
  };
  if (result.suggestedAction) {
    payload.suggestedAction = result.suggestedAction;
  }
  recordInteraction(userId, payload);

  logConversation(
    JSON.stringify({
      path: "pipeline",
      branch: result.branch,
      lang: result.lang,
      category: result.category,
      command: result.command
    }),
    null
  );

  await persistToSupabase(userId, message);
  return result.reply;
}

/**
 * @param {object} message
 * @param {number} budgetMs
 */
async function processWithHydration(message, budgetMs = 9000) {
  const userId = userIdFrom(message);
  clearExpiredSessions();
  await hydrateFromSupabase(userId, message);

  const session = getSession(userId);
  const langHint = resolveLanguageWithSession(
    String(message.text || "").trim(),
    session
  );
  const r = getResponses(langHint);

  let timer;
  try {
    return await Promise.race([
      processAndRecordMessage(message),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(Object.assign(new Error("reply_budget"), { code: "TIMEOUT" })),
          budgetMs
        );
      })
    ]);
  } catch (err) {
    if (err && err.code === "TIMEOUT") {
      return r.recoveryTimeoutReply;
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

module.exports = {
  processIncomingMessage,
  processAndRecordMessage,
  processWithHydration,
  userIdFrom
};
