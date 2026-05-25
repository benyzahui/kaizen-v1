/**
 * Supabase persistence for kaizen_sessions (24h rolling window).
 * Named db/sessionStore.js per project layout — not src/session/sessionStore.js.
 */

const { getSupabaseAdmin } = require("./supabaseClient");

const TABLE = "kaizen_sessions";

const EPHEMERAL_KEYS = [
  "messages",
  "lastReplyByCategory",
  "lastSuggestedAction",
  "lastAssistantPrints",
  "comfortOpenerUses",
  "smallStepAskUses",
  "recentCoachSnippets",
  "recentCommands",
  "lastEmotion",
  "dailyTask",
  "programMode",
  "currentProgramStep",
  "lastMantraDate",
  "lastMirrorDate",
  "focusLocked",
  "companionActive",
  "companionPaused",
  "companionAwaiting",
  "companionFlowBody",
  "companionFlowMind",
  "companionLastMissionSnippet",
  "companionLastProtocol",
  "awaitingWhyHere",
  "brainHumorCooldown",
  "brainHumorIndex",
  "dailyState",
  "dailyCheckInPending",
  "dailyPhase",
  "programPaused",
  "completedPhases",
  "programDayKey"
];

/**
 * @param {object} session
 */
function buildEphemeralBlob(session) {
  const o = {};
  for (const k of EPHEMERAL_KEYS) {
    if (session[k] !== undefined) o[k] = session[k];
  }
  return o;
}

/**
 * @param {object} session
 * @param {string|null} [topicHint]
 */
function summarizeMessages(session, topicHint) {
  const m = session.messages || [];
  if (!m.length) return topicHint || "";
  return m
    .map((x) => String(x.text || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" | ")
    .slice(0, 500);
}

function intensityFromSession(session) {
  const c = session.lastCategory || "";
  if (
    ["chaos_loop", "immediate_recovery", "pattern_blocked", "session_loop"].includes(
      c
    )
  )
    return "high";
  if (
    ["trading_impulse", "emotional_reflection", "focus_drift", "work_focus"].includes(
      c
    )
  )
    return "mid";
  return "low";
}

/**
 * @param {string|number} telegramId
 * @param {object} session
 */
async function upsertSessionFromSession(telegramId, session) {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const lastMsg = (session.messages || []).slice(-1)[0];
  const topic =
    (lastMsg && String(lastMsg.text || "").slice(0, 160)) || session.lastTopic || null;

  const row = {
    telegram_id: Number(telegramId),
    current_mode: session.conversationState ?? null,
    last_language: session.lang ?? null,
    last_category: session.lastCategory ?? null,
    last_command: session.lastCommand ?? null,
    last_topic: topic,
    last_emotional_intensity: intensityFromSession(session),
    last_messages_summary: summarizeMessages(session, topic),
    ephemeral: buildEphemeralBlob(session),
    updated_at: now.toISOString(),
    expires_at: expires.toISOString()
  };

  const { error } = await sb.from(TABLE).upsert(row, { onConflict: "telegram_id" });
  if (error) console.warn("[kaizen] upsertSessionFromSession", error.message);
}

/**
 * @param {string|number} telegramId
 */
async function fetchSessionRow(telegramId) {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("telegram_id", Number(telegramId))
    .maybeSingle();
  if (error) {
    console.warn("[kaizen] fetchSessionRow", error.message);
    return null;
  }
  return data;
}

/**
 * @param {string|number} telegramId
 */
async function deleteSessionRow(telegramId) {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { error } = await sb.from(TABLE).delete().eq("telegram_id", Number(telegramId));
  if (error) console.warn("[kaizen] deleteSessionRow", error.message);
}

/**
 * @param {object} row
 * @returns {object} partial session patch
 */
function sessionRowToPatch(row) {
  if (!row) return {};
  const ep = row.ephemeral && typeof row.ephemeral === "object" ? row.ephemeral : {};
  const patch = {
    conversationState: row.current_mode ?? null,
    lang: row.last_language ?? null,
    lastCategory: row.last_category ?? null,
    lastCommand: row.last_command ?? null,
    lastTopic: row.last_topic ?? null
  };
  for (const k of EPHEMERAL_KEYS) {
    if (ep[k] !== undefined) patch[k] = ep[k];
  }
  return patch;
}

module.exports = {
  TABLE,
  fetchSessionRow,
  upsertSessionFromSession,
  deleteSessionRow,
  sessionRowToPatch,
  buildEphemeralBlob
};
