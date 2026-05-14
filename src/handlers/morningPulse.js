const tone = require("../personality/tone");
const {
  startSession,
  updateSession,
  endSession
} = require("../flow/session");
const { insertDailyLog } = require("../supabase");

const FLOW = "pulse";

const QUESTIONS = {
  1: "How do you feel today, from 1 to 10?",
  2: "What is your main focus today?",
  3: "What is the one thing that would make today successful?",
  4: "Is today a trading day? (yes / no)"
};

function header(step) {
  return `${step}/4. ${QUESTIONS[step]}`;
}

function parseMood(text) {
  const m = String(text).trim().match(/\b(10|[1-9])\b/);
  return m ? Number(m[1]) : null;
}

function parseYesNo(text) {
  const t = String(text).trim().toLowerCase();
  if (/^(y|yes|yeah|yep|ya|sure)\b/.test(t)) return true;
  if (/^(n|no|nope|nah)\b/.test(t)) return false;
  return null;
}

async function startPulse(message) {
  await startSession(message.from.id, FLOW, {});
  return tone.lines(
    "Morning Pulse. Four short answers, no performance.",
    "",
    header(1)
  );
}

async function continuePulse(message, session) {
  const text = (message.text || "").trim();
  const data = { ...(session.data || {}) };
  const step = session.step;
  const telegramId = message.from.id;

  if (step === 1) {
    const mood = parseMood(text);
    if (mood == null) return "Give me a number from 1 to 10. No need to overthink it.";
    data.mood = mood;
    await updateSession(telegramId, { step: 2, data });
    return header(2);
  }

  if (step === 2) {
    if (!text) return header(2);
    data.focus = text.slice(0, 500);
    await updateSession(telegramId, { step: 3, data });
    return header(3);
  }

  if (step === 3) {
    if (!text) return header(3);
    data.success = text.slice(0, 500);
    await updateSession(telegramId, { step: 4, data });
    return header(4);
  }

  if (step === 4) {
    const tradingDay = parseYesNo(text);
    if (tradingDay == null) return "Answer yes or no.";
    data.trading_day = tradingDay;

    await insertDailyLog({
      telegram_id: String(telegramId),
      type: "pulse",
      mood: data.mood,
      focus: data.focus,
      success: data.success,
      trading_day: data.trading_day,
      created_at: new Date().toISOString()
    });
    await endSession(telegramId);

    return buildSummary(data);
  }

  // Defensive: unknown step — reset.
  await endSession(telegramId);
  return "Pulse reset. Send /pulse to begin again.";
}

function buildSummary(data) {
  const tradingNote = data.trading_day
    ? "Trading day. Discipline first, size second."
    : "Not a trading day. Protect that boundary.";

  return tone.lines(
    "Today's direction is clear.",
    "Protect your energy.",
    "Focus on what actually moves your life forward.",
    "No chaos. No rushing.",
    "",
    `Mood baseline: ${data.mood}/10`,
    `Focus: ${data.focus}`,
    `Success looks like: ${data.success}`,
    tradingNote
  );
}

module.exports = { FLOW, startPulse, continuePulse };
