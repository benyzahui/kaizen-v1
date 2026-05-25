/**
 * Consistency + streak engine smoke test (HU).
 */
const { getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { buildWeeklySummary } = require("../src/consistency/weeklySummary");
const { emptyStreaks } = require("../src/consistency/streakModel");
const { recordCheckInCompletion, CRINGE_RE } = require("../src/consistency/streakEngine");
const { yesterdayKey, todayKey } = require("../src/consistency/streakModel");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const EN_LEAK = [
  /\bStreak:\s*\d+\s*days\b/i,
  /\bWeekly summary\b/i,
  /\bLET'S GO\b/i,
  /\bYOU ARE A MACHINE\b/i
];
const SHAME = [/szégyen/i, /failed you/i, /loser/i];

function assertHu(text, label) {
  assert(text && text.length > 10, `${label}: empty`);
  for (const re of EN_LEAK) assert(!re.test(text), `${label}: EN/hype leak`);
  for (const re of SHAME) assert(!re.test(text), `${label}: shame`);
  assert(!CRINGE_RE.test(text), `${label}: cringe`);
}

async function run() {
  const uid = `smoke_streak_${Date.now()}`;
  const today = todayKey();
  const y = yesterdayKey();

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    streaks: (() => {
      const s = emptyStreaks();
      s.morning = { current: 4, best: 5, lastDate: y };
      s.movement = { current: 3, best: 3, lastDate: y };
      return s;
    })()
  });

  await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/morning"
  });
  const done = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "8 7 warrior day víz mozgás légzés"
  });
  assert(done.branch === "daily_checkin", "check-in branch");
  assertHu(done.reply, "morning complete");
  assert(/Reggeli kör lezárva/i.test(done.reply), "close line");
  assert(/Streak:\s*5 nap/i.test(done.reply), "5 day streak");
  assert(!/🔥{2,}/.test(done.reply), "no fire hype");

  const s1 = getSession(uid);
  assert(s1.streaks.morning.current === 5, "morning streak 5");

  const weekly = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/weekly"
  });
  assertHu(weekly.reply, "/weekly");
  assert(/Heti összegzés/i.test(weekly.reply), "weekly title");
  assert(/Következő fókusz/i.test(weekly.reply), "next focus");

  updateSession(uid, {
    streaks: (() => {
      const s = emptyStreaks();
      const old = "2020-01-01";
      s.morning = { current: 3, best: 3, lastDate: old };
      return s;
    })(),
    dailyState: {
      date: today,
      userId: uid,
      language: "hu",
      energyLevel: 3,
      sleepQuality: 4,
      screenDiscipline: "high",
      focusDrift: true
    }
  });
  const recovery = recordCheckInCompletion(
    uid,
    "morning",
    "hu",
    getSession(uid).dailyState,
    getSession(uid)
  );
  assertHu(recovery, "recovery");
  assert(/újrakezdeni|ritmusba|irány fontosabb/i.test(recovery), "recovery msg");

  const lowWeekly = buildWeeklySummary(getSession(uid), "hu", uid);
  assertHu(lowWeekly, "low weekly");
  assert(/gyenge|stabilizálás|zaj/i.test(lowWeekly), "low energy weekly");

  updateSession(uid, {
    streaks: (() => {
      const s = emptyStreaks();
      for (let i = 0; i < 8; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        if (i > 0) s.morning = { current: 8 - i, best: 8, lastDate: key };
      }
      s.morning = { current: 8, best: 8, lastDate: y };
      s.movement = { current: 6, best: 6, lastDate: y };
      return s;
    })(),
    dailyState: {
      date: today,
      userId: uid,
      language: "hu",
      energyLevel: 8,
      sleepQuality: 7,
      movementDone: true,
      focusDrift: false
    },
    nervousSystemState: "calm"
  });
  const warrior = buildWeeklySummary(getSession(uid), "hu", uid);
  assertHu(warrior, "warrior weekly");
  assert(/Warrior|Stabilizer|erős|stabil/i.test(warrior), "warrior level");

  const stab = recordCheckInCompletion(
    uid,
    "midday",
    "hu",
    { energyLevel: 3, screenDiscipline: "high", focusDrift: true },
    { nervousSystemState: "overloaded", dailyState: { screenDiscipline: "high" } }
  );
  assertHu(stab, "stabilization tone");
  assert(/stabilizálás|Nyomás le/i.test(stab), "overload tone");

  const replies = [done.reply, weekly.reply, recovery];
  assert(new Set(replies.map((r) => r.slice(0, 70))).size === replies.length, "no loops");

  console.log("streak-engine-smoke: OK");
}

run().catch((e) => {
  console.error("streak-engine-smoke FAILED:", e.message);
  process.exit(1);
});
