/**
 * Evening Mirror — scheduled push stub.
 *
 * Intended trigger: Netlify scheduled function, daily at 21:00 local per opted-in user.
 * See docs/scheduling.md for setup.
 *
 * CURRENT STATE: Manual trigger only. Architecture ready; no live sends.
 */

// export const config = { schedule: "0 21 * * *" }; // ← uncomment to activate cron

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

function buildEveningMessage(profile) {
  const lang = profile.preferred_language || "en";
  const r = getResponses(lang);
  const streak = Number(profile.daily_streak) || 0;
  const missionLine = profile.current_mission?.trim()
    ? `${r.tEveningMissionReview || "Mission"}: ${profile.current_mission.trim()}`
    : r.tEveningNoMission || "No mission today.";

  const streakNote =
    streak > 0
      ? (r.tStreakCount ? r.tStreakCount(streak) : `${streak} day streak.`)
      : "";

  return lines(
    r.tEveningGateTitle || "🌙 Evening Mirror",
    "",
    missionLine,
    "",
    r.tEveningReleasePrompt || "Release what you could not finish.",
    "",
    r.tEveningLessonPrompt || "What do you want tomorrow's version of you to remember?",
    "",
    streakNote,
    "",
    r.tEveningNextPrompt || "Close the day."
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
    .select("telegram_id, preferred_language, current_mission, daily_streak, membership_tier")
    .eq("notification_opt_in", true)
    .eq("active_mode", true);

  if (error) {
    console.error("Supabase error:", error.message);
    return { statusCode: 500, body: error.message };
  }

  const results = [];
  for (const profile of users || []) {
    const text = buildEveningMessage(profile);
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
