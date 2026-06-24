/**
 * Netlify scheduled function runner — shared hydration + send.
 */

const { createClient } = require("@supabase/supabase-js");
const { sendDailyAutomation } = require("../../src/dailyAutomation/dailyAutomationEngine");
const {
  hydrateSchedulerSession,
  profileToSchedulerSession
} = require("../../src/dailyAutomation/sessionHydration");
const { updateSession } = require("../../src/session/sessionStore");

/**
 * @param {'morning'|'midday'|'evening'} slot
 * @param {object} event
 * @param {(chatId: string|number, text: string) => Promise<void>} sendTelegram
 */
async function runScheduledDailySlot(slot, event, sendTelegram) {
  const isTest = event?.queryStringParameters?.trigger === "test";
  const isScheduled = event?.triggerType === "scheduled";
  if (!isTest && !isScheduled) {
    return { statusCode: 403, body: "Not authorized" };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 500, body: "Supabase not configured" };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: users, error } = await supabase
    .from("kaizen_users")
    .select("*")
    .eq("notification_opt_in", true)
    .eq("onboarding_completed", true);

  if (error) {
    return { statusCode: 500, body: error.message };
  }

  const results = [];
  for (const profile of users || []) {
    const id = profile.telegram_id;
    await hydrateSchedulerSession(id, profile);
    const sessionOverride = profileToSchedulerSession(profile);
    updateSession(id, sessionOverride);

    const result = sendDailyAutomation(slot, id, {
      force: isTest,
      session: sessionOverride,
      sessionOverride,
      sendFn: isTest ? null : (uid, text) => sendTelegram(uid, text)
    });
    results.push({
      id,
      sent: result.sent,
      preview: result.preview?.slice(0, 140),
      error: result.error || null
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ slot, processed: results.length, isTest, results })
  };
}

module.exports = { runScheduledDailySlot };
