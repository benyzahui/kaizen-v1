/**
 * Netlify Function entry: Telegram updates (POST) + health probe (GET).
 *
 * Architecture:
 * - Validate method + optional secret before parsing body (fail closed on bad secret).
 * - Commands (`/…`) route first — open conversation never replaces slash handlers.
 * - Reply generation is time-budgeted so Telegram + Netlify see a graceful string, not a hard crash.
 * - Always return 200 for Telegram delivery quirks where a non-2xx would retry storms;
 *   use logs for real failures.
 */

const { sendMessage } = require("../../src/telegram");
const {
  isCommandText,
  routeCommandMessage,
  extractCommand
} = require("../../src/handlers/commands");
const {
  resolveLanguageWithSession,
  resolveLang
} = require("../../src/i18n/languageDetect");
const { getResponses } = require("../../src/i18n/getResponses");
const {
  handleOpenConversation,
  classifyMessage
} = require("../../src/handlers/openConversation");
const { tryConsumeFocusReply } = require("../../src/handlers/planTracking");
const {
  clearExpiredSessions,
  getSession,
  recordInteraction
} = require("../../src/session/sessionStore");
const { shouldInterceptOpenText } = require("../../src/session/userProfile");
const { processOnboardingReply } = require("../../src/handlers/onboarding");
const log = require("../../src/logging/log");

require("../../src/handlers/balanceProtocol");
require("../../src/personality/kaizenVoice");

const REPLY_BUDGET_MS = 9000;

function isAuthorized(headers) {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected) return { ok: true, reason: "no_secret_configured" };

  const provided =
    headers["x-telegram-bot-api-secret-token"] ||
    headers["X-Telegram-Bot-Api-Secret-Token"];

  if (!provided) return { ok: false, reason: "missing_header" };
  return provided === expected
    ? { ok: true, reason: "matched" }
    : { ok: false, reason: "mismatch" };
}

function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  return JSON.parse(raw);
}

/**
 * @returns {Promise<string>}
 */
async function buildTelegramReply(message) {
  const userId = message.from?.id ?? message.chat.id;
  const text = message.text || "";
  const trimmed = String(text).trim();

  clearExpiredSessions();
  const session = getSession(userId);

  log.kaizen("incoming_text", {
    text: trimmed.slice(0, 240),
    length: trimmed.length
  });

  if (!trimmed) {
    log.kaizen("routing", { branch: "fallback", reason: "empty_text" });
    return "Send a message when you are ready.";
  }

  if (isCommandText(text)) {
    log.command("routing", { branch: "command", command: extractCommand(text) });
    const lang = resolveLang(message, text, session);
    log.kaizen("session_lang", { lang, command: extractCommand(text) });
    const reply = await routeCommandMessage(message, session);
    log.kaizen("chosen_handler", { handler: "commands.routeCommandMessage" });
    recordInteraction(userId, {
      text: trimmed,
      reply,
      lang,
      category: null,
      command: extractCommand(text)
    });
    return reply;
  }

  let sessionOpen = getSession(userId);
  const langOnb = resolveLanguageWithSession(trimmed, sessionOpen);
  if (shouldInterceptOpenText(sessionOpen)) {
    const ob = processOnboardingReply(
      userId,
      trimmed,
      sessionOpen,
      langOnb
    );
    if (ob && ob.reply) {
      log.kaizen("routing", { branch: "onboarding", handler: "onboarding.process" });
      recordInteraction(userId, {
        text: trimmed,
        reply: ob.reply,
        lang: langOnb,
        category: "onboarding",
        command: null
      });
      return ob.reply;
    }
  }

  sessionOpen = getSession(userId);
  const lang = resolveLanguageWithSession(trimmed, sessionOpen);
  const category = classifyMessage(text);
  log.kaizen("routing", {
    branch: "open",
    lang,
    category,
    handler: "openConversation"
  });

  const focused = tryConsumeFocusReply(message, lang);
  if (focused) {
    log.kaizen("chosen_handler", {
      handler: "planTracking.tryConsumeFocusReply",
      lang
    });
    recordInteraction(userId, {
      text: trimmed,
      reply: focused,
      lang,
      category: "focus_reply",
      command: null
    });
    return focused;
  }

  const { reply, category: outCat, suggestedAction } = handleOpenConversation(
    message,
    lang,
    sessionOpen
  );
  log.kaizen("chosen_handler", {
    handler: "openConversation.handleOpenConversation",
    lang,
    category: outCat
  });
  const payload = {
    text: trimmed,
    reply,
    lang,
    category: outCat,
    command: null
  };
  if (suggestedAction != null && suggestedAction !== "") {
    payload.suggestedAction = suggestedAction;
  }
  recordInteraction(userId, payload);
  return reply;
}

async function buildTelegramReplyWithBudget(message) {
  const userId = message.from?.id ?? message.chat.id;
  const session = getSession(userId);
  const langHint = resolveLanguageWithSession(
    String(message.text || "").trim(),
    session
  );
  const r = getResponses(langHint);

  let timer;
  try {
    const reply = await Promise.race([
      buildTelegramReply(message),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(Object.assign(new Error("reply_budget"), { code: "TIMEOUT" })),
          REPLY_BUDGET_MS
        );
      })
    ]);
    return reply;
  } catch (err) {
    if (err && err.code === "TIMEOUT") {
      log.recovery("reply budget exceeded", { userId: String(userId) });
      return r.recoveryTimeoutReply;
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

exports.handler = async (event) => {
  log.deploy("function_invoked", {
    method: event.httpMethod,
    path: event.path,
    isBase64Encoded: Boolean(event.isBase64Encoded),
    hasBody: Boolean(event.body),
    hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    hasSecret: Boolean(process.env.WEBHOOK_SECRET)
  });

  log.webhook("incoming", {
    method: event.httpMethod,
    hasBody: Boolean(event.body)
  });

  if (event.httpMethod === "GET") {
    return { statusCode: 200, body: "KaiZen webhook online." };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const auth = isAuthorized(event.headers || {});
  if (!auth.ok) {
    log.webhook("unauthorized", auth);
    return { statusCode: 401, body: "Unauthorized" };
  }

  let update;
  try {
    update = parseBody(event);
  } catch (err) {
    log.recovery("body parse failed", err.message);
    return { statusCode: 200, body: "Body parse failed (ignored)." };
  }

  const message = update.message;
  if (!message || !message.chat?.id) {
    log.webhook("no_actionable_message", { hasMessage: Boolean(message) });
    return { statusCode: 200, body: "No actionable message." };
  }

  if (!message.text) {
    log.webhook("no_text", { updateType: "message_without_text" });
    return { statusCode: 200, body: "No text (ignored)." };
  }

  const command = String(message.text).trim().split(/\s+/)[0].toLowerCase();
  log.webhook("message", {
    chat_id: message.chat.id,
    command,
    isCommandText: isCommandText(message.text)
  });

  const uid = message.from?.id ?? message.chat.id;
  const langForErrors = resolveLanguageWithSession(
    String(message.text || "").trim(),
    getSession(uid)
  );

  try {
    const reply = await buildTelegramReplyWithBudget(message);
    log.kaizen("reply", {
      length: reply?.length,
      preview: String(reply || "").slice(0, 100)
    });
    try {
      await sendMessage(
        message.chat.id,
        String(reply || "").trim() || "Send a short line when you can."
      );
    } catch (sendErr) {
      log.recovery("sendMessage failed", { message: sendErr.message });
      try {
        await sendMessage(
          message.chat.id,
          getResponses(langForErrors).recoverySendFailed
        );
      } catch (sendErr2) {
        log.recovery("retry send failed", { message: sendErr2.message });
      }
    }
    log.webhook("sendMessage ok", { chat_id: message.chat.id });
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    log.recovery("handler failed", {
      message: err.message,
      stack: err.stack && String(err.stack).slice(0, 400)
    });
    try {
      const fallback = getResponses(langForErrors).recoveryGenericReply;
      await sendMessage(message.chat.id, fallback);
    } catch (sendErr) {
      log.recovery("fallback send failed", sendErr.message);
    }
    return { statusCode: 200, body: "Internal error (logged)." };
  }
};
