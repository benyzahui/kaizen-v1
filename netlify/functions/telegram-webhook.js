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

const { sendMessage, sendAnimation } = require("../../src/telegram");
const { extractCommand, isCommandText } = require("../../src/handlers/commands");
const { resolveLanguageWithSession } = require("../../src/i18n/languageDetect");
const { getResponses } = require("../../src/i18n/getResponses");
const { processWithHydration } = require("../../src/core/kaizenPipeline");
const { getSession } = require("../../src/session/sessionStore");
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

async function buildTelegramReplyWithBudget(message) {
  const trimmed = String(message.text || "").trim();
  log.kaizen("incoming_text", {
    text: trimmed.slice(0, 240),
    length: trimmed.length
  });
  if (isCommandText(message.text)) {
    log.command("routing", { branch: "command", command: extractCommand(message.text) });
  }
  return processWithHydration(message, REPLY_BUDGET_MS);
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
      const after = getSession(uid);
      const gifUrl = after?.pendingGifUrl;
      if (gifUrl) {
        try {
          await sendAnimation(message.chat.id, gifUrl);
          const { clearPendingGif } = require("../../src/personality/v2/gifIntegration");
          clearPendingGif(uid);
        } catch (gifErr) {
          log.recovery("sendAnimation failed", { message: gifErr.message });
        }
      }
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
