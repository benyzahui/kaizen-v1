/**
 * Lightweight conversational state.
 * One active flow per user — keyed by telegram_id.
 *
 * Stored in Supabase (`sessions` table) because Netlify Functions
 * are stateless; in-memory would be lost between invocations.
 */
const { getSupabase } = require("../supabase");

const TABLE = "sessions";

async function getSession(telegramId) {
  const db = getSupabase();
  const { data, error } = await db
    .from(TABLE)
    .select("telegram_id, flow, step, data, updated_at")
    .eq("telegram_id", String(telegramId))
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function startSession(telegramId, flow, initialData = {}) {
  const db = getSupabase();
  const now = new Date().toISOString();
  const { error } = await db.from(TABLE).upsert(
    {
      telegram_id: String(telegramId),
      flow,
      step: 1,
      data: initialData,
      updated_at: now
    },
    { onConflict: "telegram_id" }
  );
  if (error) throw error;
}

async function updateSession(telegramId, { step, data }) {
  const db = getSupabase();
  const patch = { updated_at: new Date().toISOString() };
  if (step !== undefined) patch.step = step;
  if (data !== undefined) patch.data = data;
  const { error } = await db
    .from(TABLE)
    .update(patch)
    .eq("telegram_id", String(telegramId));
  if (error) throw error;
}

async function endSession(telegramId) {
  const db = getSupabase();
  const { error } = await db
    .from(TABLE)
    .delete()
    .eq("telegram_id", String(telegramId));
  if (error) throw error;
}

module.exports = { getSession, startSession, updateSession, endSession };
