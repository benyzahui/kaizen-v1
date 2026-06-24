/**
 * Telegram Bot API client (minimal sendMessage).
 * Architecture: keep network I/O here; add retries/backoff here when scaling.
 */

const { recovery: logRecovery } = require("./logging/log");

function getApiBase() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN.");
  }
  return `https://api.telegram.org/bot${token}`;
}

const SEND_TIMEOUT_MS = 12000;

async function sendMessage(chatId, text) {
  const url = `${getApiBase()}/sendMessage`;
  const controller = new AbortController();
  const kill = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal
    });
  } catch (err) {
    logRecovery("telegram fetch failed", {
      name: err.name,
      message: err.message
    });
    throw err;
  } finally {
    clearTimeout(kill);
  }

  const bodyText = await response.text();
  logRecovery("telegram.sendMessage", {
    status: response.status,
    preview: bodyText.slice(0, 200)
  });

  if (!response.ok) {
    throw new Error(`Telegram sendMessage ${response.status}: ${bodyText}`);
  }

  return JSON.parse(bodyText);
}

async function sendAnimation(chatId, animation) {
  const url = `${getApiBase()}/sendAnimation`;
  const controller = new AbortController();
  const kill = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  const payload = { chat_id: chatId };
  if (String(animation).startsWith("http")) {
    payload.animation = animation;
  } else {
    payload.animation = animation;
  }
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (err) {
    logRecovery("telegram animation fetch failed", {
      name: err.name,
      message: err.message
    });
    throw err;
  } finally {
    clearTimeout(kill);
  }

  const bodyText = await response.text();
  logRecovery("telegram.sendAnimation", {
    status: response.status,
    preview: bodyText.slice(0, 200)
  });

  if (!response.ok) {
    throw new Error(`Telegram sendAnimation ${response.status}: ${bodyText}`);
  }

  return JSON.parse(bodyText);
}

module.exports = { sendMessage, sendAnimation };
