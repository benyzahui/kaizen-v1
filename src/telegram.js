function getApiBase() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN.");
  }
  return `https://api.telegram.org/bot${token}`;
}

async function sendMessage(chatId, text) {
  const response = await fetch(`${getApiBase()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram sendMessage failed: ${errorText}`);
  }

  return response.json();
}

module.exports = { sendMessage };
