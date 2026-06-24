/**
 * Evening reset — 21:00 Europe/Bucharest (scheduler-ready).
 * Uncomment config.schedule to enable Netlify cron (UTC).
 */

// export const config = { schedule: "0 19 * * *" }; // 21:00 Bucharest ≈ 19:00 UTC (DST varies)

const { runScheduledDailySlot } = require("../../src/scheduler/schedulerRunner");

async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!res.ok) console.error(`Telegram send failed for ${chatId}:`, await res.text());
}

exports.handler = async (event) => {
  const result = await runScheduledDailySlot("evening", event, sendTelegram);
  return result;
};
