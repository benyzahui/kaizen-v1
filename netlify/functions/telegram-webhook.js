const { routeMessage } = require("../../src/handlers/commands");
const { sendMessage } = require("../../src/telegram");

function isAuthorized(headers) {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected) return true;

  const provided =
    headers["x-telegram-bot-api-secret-token"] ||
    headers["X-Telegram-Bot-Api-Secret-Token"];

  return provided === expected;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    if (!isAuthorized(event.headers || {})) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    const update = JSON.parse(event.body || "{}");
    const message = update.message;

    if (!message || !message.text || !message.chat?.id) {
      return { statusCode: 200, body: "No actionable message." };
    }

    const responseText = await routeMessage(message);
    await sendMessage(message.chat.id, responseText);

    return { statusCode: 200, body: "OK" };
  } catch (error) {
    console.error("Webhook error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
