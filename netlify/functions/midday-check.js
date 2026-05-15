/**
 * Midday Check — scheduled push stub.
 *
 * Intended trigger: Netlify scheduled function, daily at 13:00 local per opted-in user.
 * See docs/scheduling.md for setup.
 *
 * CURRENT STATE: Manual trigger only. Architecture ready; no live sends.
 */

// export const config = { schedule: "0 13 * * *" }; // ← uncomment to activate cron

const { createClient } = require("@supabase/supabase-js");
const { getResponses } = require("../../src/i18n/getResponses");
const { lines } = require("../../src/personality/kaizenVoice");

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function sendTelegram(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });
  if (!res.ok) {
    console.error(`Telegram send failed for ${chatId}:`, await res.text());
  }
}

function buildMiddayMessage(profile) {
  const lang = profile.preferred_language || "en";
  const r = getResponses(lang);
  const missionLine = profile.current_mission?.trim()
    ? `${r.tMiddayMissionCheck || "Mission"}: ${profile.current_mission.trim()}`
    : r.tMiddayNoMission || "No mission set. Set one: /mission";

  return lines(
    r.tMiddayGateTitle || "🔁 Midday Check",
    "",
    r.tMiddayDriftCheck || "Where did the morning actually go?",
    "",
    missionLine,
    "",
    r.tMiddayAvoidancePrompt || "If you have been avoiding — name it. Then do 5 minutes of it.",
    "",
    r.tMiddayNextPrompt || "Continue: /focus or open chat."
  );
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
    .select("telegram_id, preferred_language, current_mission, membership_tier")
    .eq("notification_opt_in", true)
    .eq("active_mode", true)
    .in("membership_tier", ["elite", "dragon"]); // midday push: elite+ only

  if (error) {
    console.error("Supabase error:", error.message);
    return { statusCode: 500, body: error.message };
  }

  const results = [];
  for (const profile of users || []) {
    const text = buildMiddayMessage(profile);
    if (isTest) {
      results.push({ id: profile.telegram_id, preview: text.slice(0, 80) });
    } else {
      await sendTelegram(profile.telegram_id, text);
      results.push({ id: profile.telegram_id, sent: true });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ processed: results.length, isTest, results })
  };
};
