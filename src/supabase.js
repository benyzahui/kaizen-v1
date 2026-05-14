const { createClient } = require("@supabase/supabase-js");

let supabase;

function getSupabase() {
  if (supabase) return supabase;
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return supabase;
}

/**
 * Insert new user or update last_seen_at (and profile fields) for existing.
 */
async function touchTelegramUser(from) {
  const db = getSupabase();
  const telegram_id = String(from.id);
  const username = from.username ?? null;
  const first_name = from.first_name ?? null;
  const now = new Date().toISOString();

  const { data: existing, error: selectError } = await db
    .from("users")
    .select("telegram_id")
    .eq("telegram_id", telegram_id)
    .maybeSingle();

  if (selectError) throw selectError;

  if (!existing) {
    const { error } = await db.from("users").insert({
      telegram_id,
      username,
      first_name,
      created_at: now,
      last_seen_at: now
    });
    if (error) throw error;
    return;
  }

  const { error } = await db
    .from("users")
    .update({
      last_seen_at: now,
      username,
      first_name
    })
    .eq("telegram_id", telegram_id);

  if (error) throw error;
}

/**
 * Insert a single completed daily log row (pulse, mirror, etc.).
 */
async function insertDailyLog(row) {
  const db = getSupabase();
  const { error } = await db.from("daily_logs").insert(row);
  if (error) throw error;
}

module.exports = { getSupabase, touchTelegramUser, insertDailyLog };
