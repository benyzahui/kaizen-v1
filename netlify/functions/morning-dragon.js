/**
 * Morning Dragon — scheduled push stub.
 *
 * Intended trigger: Netlify scheduled function, daily at 06:00 local for each opted-in user.
 * See docs/scheduling.md for full setup guide.
 *
 * CURRENT STATE: Manual trigger only. No live cron. No actual Telegram sends.
 * When ready to activate: wire NETLIFY_CRON below and uncomment the dispatch loop.
 *
 * Architecture note (LLM-ready):
 *   Replace buildMorningMessage() with: coachBrain.generateMorningBrief(profile)
 *   The rest of the loop (filter + send) stays identical.
 */

// export const config = { schedule: "0 6 * * *" }; // ← uncomment to activate cron

const { createClient } = require("@supabase/supabase-js");
const { getResponses } = require("../../src/i18n/getResponses");
const { pickMantra } = require("../../src/handlers/dragonTraining");
const { lines } = require("../../src/personality/kaizenVoice");

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

/** Send a Telegram message (plain text). */
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

/** Build the morning message for one user profile row. */
function buildMorningMessage(profile) {
  const lang = profile.preferred_language || "en";
  const r = getResponses(lang);
  const session = {
    lastMantraDate: profile.last_morning_checkin,
    currentMission: profile.current_mission,
    dailyStreak: profile.daily_streak || 0
  };
  const mantra = pickMantra(r, session, String(profile.telegram_id));
  const streak = Number(profile.daily_streak) || 0;
  const streakLine =
    streak > 0
      ? `${streak} days in a row.`
      : "First morning. Good start.";
  const missionLine = profile.current_mission?.trim()
    ? `Mission: ${profile.current_mission.trim()}`
    : "No mission set. Write one: /mission your one-liner";

  return lines(
    r.tMorningGateTitle || "⚔️ Morning Gate",
    "",
    mantra,
    "",
    streakLine,
    "",
    missionLine,
    "",
    r.tMorningNextPrompt || "When ready: /energy → /mission → /midday"
  );
}

/** Netlify handler — currently a no-op / manual test entry point. */
exports.handler = async (event) => {
  // Guard: only fire from scheduled context or manual ?trigger=test
  const isTest = event?.queryStringParameters?.trigger === "test";
  const isScheduled = event?.triggerType === "scheduled";
  if (!isTest && !isScheduled) {
    return { statusCode: 403, body: "Not authorized" };
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 500, body: "Supabase not configured" };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Load all users who opted in AND have active_mode true
  const { data: users, error } = await supabase
    .from("kaizen_users")
    .select("telegram_id, preferred_language, current_mission, daily_streak, last_morning_checkin, membership_tier")
    .eq("notification_opt_in", true)
    .eq("active_mode", true);

  if (error) {
    console.error("Supabase error:", error.message);
    return { statusCode: 500, body: error.message };
  }

  const results = [];
  for (const profile of users || []) {
    const text = buildMorningMessage(profile);
    if (isTest) {
      // In test mode: log, do not send
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
