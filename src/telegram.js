function getApiBase() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN.");
  }
  return `https://api.telegram.org/bot${token}`;
}

async function sendMessage(chatId, text) {
  const url = `${getApiBase()}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  const bodyText = await response.text();
  console.log(
    "[kaizen] telegram.sendMessage",
    response.status,
    bodyText.slice(0, 200)
  );

  if (!response.ok) {
    throw new Error(
      `Telegram sendMessage ${response.status}: ${bodyText}`
    );
  }

  return JSON.parse(bodyText);
}

module.exports = { sendMessage };
