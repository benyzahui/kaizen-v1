/**
 * Active Netlify entry: Telegram POST → reply.
 * Commands vs open conversation is explicit here.
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

require("../../src/handlers/balanceProtocol");
require("../../src/personality/kaizenVoice");
require("../../src/i18n/getResponses");

function log(...args) {
  console.log("[kaizen]", ...args);
}

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

  log("incoming_text", { text: trimmed.slice(0, 240), length: trimmed.length });

  if (!trimmed) {
    log("routing", { branch: "fallback", reason: "empty_text" });
    return "Send a message when you are ready.";
  }

  if (isCommandText(text)) {
    log("routing", { branch: "command", isCommandText: true });
    const lang = resolveLang(message, text, session);
    log("session_lang", { lang, command: extractCommand(text) });
    const reply = await routeCommandMessage(message, session);
    log("chosen_handler", { handler: "commands.routeCommandMessage" });
    recordInteraction(userId, {
      text: trimmed,
      reply,
      lang,
      category: null,
      command: extractCommand(text)
    });
    return reply;
  }

  const lang = resolveLanguageWithSession(text, session);
  const category = classifyMessage(text);
  log("routing", {
    branch: "open",
    lang,
    category,
    handler: "openConversation"
  });

  const focused = tryConsumeFocusReply(message, lang);
  if (focused) {
    log("chosen_handler", { handler: "planTracking.tryConsumeFocusReply", lang });
    recordInteraction(userId, {
      text: trimmed,
      reply: focused,
      lang,
      category: "focus_reply",
      command: null
    });
    return focused;
  }

  const { reply, category: outCat } = handleOpenConversation(
    message,
    lang,
    session
  );
  log("chosen_handler", {
    handler: "openConversation.handleOpenConversation",
    lang,
    category: outCat
  });
  recordInteraction(userId, {
    text: trimmed,
    reply,
    lang,
    category: outCat,
    command: null
  });
  return reply;
}

exports.handler = async (event) => {
  log("incoming", {
    method: event.httpMethod,
    path: event.path,
    isBase64Encoded: Boolean(event.isBase64Encoded),
    hasBody: Boolean(event.body),
    hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    hasSecret: Boolean(process.env.WEBHOOK_SECRET)
  });

  if (event.httpMethod === "GET") {
    return { statusCode: 200, body: "KaiZen webhook online." };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const auth = isAuthorized(event.headers || {});
  if (!auth.ok) {
    log("unauthorized", auth.reason);
    return { statusCode: 401, body: "Unauthorized" };
  }

  let update;
  try {
    update = parseBody(event);
  } catch (err) {
    log("body parse failed", err.message);
    return { statusCode: 200, body: "Body parse failed (ignored)." };
  }

  const message = update.message;
  if (!message || !message.chat?.id) {
    log("no actionable message", { hasMessage: Boolean(message) });
    return { statusCode: 200, body: "No actionable message." };
  }

  if (!message.text) {
    log("no_text", { updateType: "message_without_text" });
    return { statusCode: 200, body: "No text (ignored)." };
  }

  const command = String(message.text).trim().split(/\s+/)[0].toLowerCase();
  log("message", {
    chat_id: message.chat.id,
    command,
    isCommandText: isCommandText(message.text)
  });

  try {
    const reply = await buildTelegramReply(message);
    log("reply", {
      length: reply?.length,
      preview: String(reply || "").slice(0, 100)
    });
    await sendMessage(message.chat.id, reply);
    log("sendMessage ok");
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    log("handler failed", err.message);
    return { statusCode: 200, body: "Internal error (logged)." };
  }
};
