/**
 * Hard language lock + daily rhythm readiness report.
 * Run: node scripts/language-lock-rhythm-report.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { routeCommandMessage } = require("../src/handlers/commands");
const { simulateDailyRhythmDay } = require("../src/scheduler/dailyRhythmScheduler");
const { getEntries } = require("../src/mantra/mantraPools/registry");
const { languageLockScore } = require("../src/i18n/hardLanguageLock");
const { repetitionScore } = require("../src/memory/recentReplyMemory");
const { pickMantraForSlot } = require("../src/mantra/mantraEngine");

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const uid = "lock_rhythm_report";
  clearSession(uid);

  /* 1 — New user → language HU */
  let r = await processIncomingMessage({
    text: "/start",
    from: { id: uid, language_code: "en" },
    chat: { id: uid }
  });
  assert(r.branch === "command", "start command");

  r = await processIncomingMessage({ text: "2", from: { id: uid }, chat: { id: uid } });
  assert(r.branch === "onboarding", "lang pick");
  updateSession(uid, { userName: "Teszt", onboardingStep: 2 });

  r = await processIncomingMessage({ text: "1", from: { id: uid }, chat: { id: uid } });
  assert(r.branch === "onboarding", "path complete");
  const s = getSession(uid);
  assert(s.preferredLanguage === "hu", "HU saved");
  assert(s.onboardingCompleted, "onboarding done");

  /* 2 — All HU, no EN */
  const checks = [];
  const scatter = await processIncomingMessage({
    text: "Ma szét vagyok esve.",
    from: { id: uid, language_code: "en" },
    chat: { id: uid }
  });
  checks.push({
    label: "scatter open",
    score: languageLockScore(scatter.reply, "hu"),
    branch: scatter.branch
  });
  assert(languageLockScore(scatter.reply, "hu") >= 85, "scatter HU pure");
  assert(/stabiliz|víz|légz|reset/i.test(scatter.reply), "stabilization redirect");

  r = await processIncomingMessage({ text: "/energy", from: { id: uid }, chat: { id: uid } });
  checks.push({ label: "/energy", score: languageLockScore(r.reply, "hu") });
  assert(languageLockScore(r.reply, "hu") >= 85, "/energy HU");

  r = await processIncomingMessage({ text: "/morning", from: { id: uid }, chat: { id: uid } });
  checks.push({ label: "/morning", score: languageLockScore(r.reply, "hu") });
  assert(languageLockScore(r.reply, "hu") >= 85, "/morning HU");

  r = await processIncomingMessage({ text: "kösz", from: { id: uid }, chat: { id: uid } });
  checks.push({ label: "natural", score: languageLockScore(r.reply, "hu") });
  assert(languageLockScore(r.reply, "hu") >= 80, "natural HU");

  /* 3 — Mantra no repeat 10 picks */
  const mantraIds = new Set();
  let sess = getSession(uid);
  for (let d = 1; d <= 10; d++) {
    const m = pickMantraForSlot("morning", "hu", sess, uid, `2026-07-${String(d).padStart(2, "0")}`, {
      lang: "hu",
      energyState: "stable",
      activeMode: "discipline",
      disciplineState: "focused",
      nervousSystemState: "calm"
    });
    mantraIds.add(m.id);
    sess = getSession(uid);
  }
  assert(mantraIds.size >= 7, `mantra variety (${mantraIds.size}/10)`);

  /* 4 — 3-day schedule simulation */
  const {
    sendMorningActivation,
    sendMiddayStabilization,
    sendEveningReset
  } = require("../src/scheduler/dailyRhythmScheduler");
  const days = [];
  for (let d = 1; d <= 3; d++) {
    const dk = `2026-08-0${d}`;
    days.push({
      day: d,
      morning: sendMorningActivation(uid, { dateKey: dk }),
      midday: sendMiddayStabilization(uid, { dateKey: dk }),
      evening: sendEveningReset(uid, { dateKey: dk })
    });
  }

  for (const day of days) {
    assert(day.morning.preview && /Reggeli|aktiválás/i.test(day.morning.preview), `d${day.day} morning HU`);
    assert(day.midday.preview && /Délközi|stabiliz/i.test(day.midday.preview), `d${day.day} midday HU`);
    assert(day.evening.preview && /Esti|elengedés/i.test(day.evening.preview), `d${day.day} evening HU`);
  }

  const repScore = repetitionScore(getSession(uid));
  const morningEntries = getEntries("morning", "hu").length;

  const report = {
    languageLockScore: Math.round(
      checks.reduce((a, c) => a + c.score, 0) / checks.length
    ),
    repetitionScore: repScore,
    dailyRhythmReadiness: morningEntries >= 30 ? "READY" : "PARTIAL",
    automationReadiness: "READY (scheduler functions; enable cron in Netlify)",
    remainingIssues: [
      "Live Telegram cron not enabled — use netlify/functions/* with config.schedule",
      "Per-user timezone override not implemented — default Europe/Bucharest",
      "Supabase push requires notification_opt_in users in DB"
    ],
    mantraPoolMorningHU: morningEntries,
    checks,
    sampleScatterReply: scatter.reply?.slice(0, 200)
  };

  console.log("\n=== KAIZEN LANGUAGE LOCK + DAILY RHYTHM REPORT ===\n");
  console.log(JSON.stringify(report, null, 2));
  console.log("\n✓ language-lock-rhythm-report passed\n");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
