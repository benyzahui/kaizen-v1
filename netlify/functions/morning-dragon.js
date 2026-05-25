/**
 * Morning activation — 06:00 Europe/Bucharest (scheduler-ready).
 * Uncomment config.schedule to enable Netlify cron (UTC).
 */

// export const config = { schedule: "0 4 * * *" }; // 06:00 Bucharest ≈ 04:00 UTC (DST varies)

const { createClient } = require("@supabase/supabase-js");
const { sendMorningActivation } = require("../../src/scheduler/dailyRhythmScheduler");

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function sendTelegram(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!res.ok) console.error(`Telegram send failed for ${chatId}:`, await res.text());
}

exports.handler = async (event) => {
  const isTest = event?.queryStringParameters?.trigger === "test";
  const isScheduled = event?.triggerType === "scheduled";
  if (!isTest && !isScheduled) {
    return { statusCode: 403, body: "Not authorized" };
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 500, body: "Supabase not configured" };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: users, error } = await supabase
    .from("kaizen_users")
    .select("telegram_id, preferred_language, notification_opt_in")
    .eq("notification_opt_in", true);

  if (error) {
    return { statusCode: 500, body: error.message };
  }

  const results = [];
  for (const profile of users || []) {
    const id = profile.telegram_id;
    const result = sendMorningActivation(id, {
      sendFn: isTest ? null : (uid, text) => sendTelegram(uid, text),
      sessionOverride: {
        preferredLanguage: profile.preferred_language,
        onboardingCompleted: true,
        notificationOptIn: true
      }
    });
    results.push({ id, preview: result.preview?.slice(0, 120), sent: result.sent });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ slot: "morning", processed: results.length, isTest, results })
  };
};
