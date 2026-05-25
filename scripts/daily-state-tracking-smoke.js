/**
 * Daily state tracking + status engine smoke test.
 */
const { getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { buildDailyStatusSnapshot } = require("../src/tracking/statusEngine");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const EN_LEAK = [/\bState:\b/i, /\bStep:\b/i, /\bEnergy:\s*low\b/i, /\bNext step:/i];

function assertHu(text, label) {
  assert(text && text.length > 10, `${label}: empty`);
  for (const re of EN_LEAK) {
    assert(!re.test(text), `${label}: EN leak ${re}`);
  }
  assert(/🐉|Reggeli|Délközi|Esti|Mai állapot|Energia:/i.test(text), `${label}: HU markers`);
}

async function run() {
  const uid = `smoke_daily_${Date.now()}`;

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userName: "Smoke"
  });

  const morning = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/morning"
  });
  assertHu(morning.reply, "/morning");
  assert(/Dragon Blueprint|napi ritmus/i.test(morning.reply), "program presence");
  assert(/Reggeli aktiválás|Mantra:/i.test(morning.reply), "morning activation");
  assert(/energia 1–10|Rövid válasz/i.test(morning.reply), "morning check-in footer");
  assert(/Ma:|Mini Reset|Focus Lock|víz|⚔|🌊|Mozgás/i.test(morning.reply), "daily action");

  const answers = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "7 8 page polish víz légzés"
  });
  assert(answers.branch === "daily_checkin", "natural answer → daily_checkin");
  assertHu(answers.reply, "morning answers");
  assert(/lezárva|Streak:/i.test(answers.reply), "completion + streak");

  const s1 = getSession(uid);
  assert(s1.dailyState?.energyLevel === 7, "energy 7");
  assert(s1.dailyState?.sleepQuality === 8, "sleep 8");
  assert(s1.dailyState?.hydrationDone === true, "hydration");
  assert(s1.dailyState?.todayMission, "mission saved");
  assert(!s1.dailyCheckInPending, "pending cleared");

  const status1 = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/status"
  });
  assertHu(status1.reply, "/status");
  assert(/Mai állapot/i.test(status1.reply), "status title");
  assert(/page polish|polish/i.test(status1.reply), "mission on status");
  assert(/Következő lépés:/i.test(status1.reply), "next step");

  updateSession(uid, {
    dailyState: {
      date: s1.dailyState.date,
      userId: uid,
      language: "hu",
      energyLevel: 3,
      sleepQuality: 4,
      hydrationDone: false,
      movementDone: false,
      breathworkDone: false,
      screenDiscipline: "high",
      todayMission: "recovery"
    },
    dailyCheckInPending: null
  });
  const lowSnap = buildDailyStatusSnapshot(getSession(uid), "hu", uid);
  assertHu(lowSnap, "low snapshot");
  assert(/alacsony|Stabilizálás|Recovery/i.test(lowSnap), "low energy adaptation");
  assert(/digitális|képernyő/i.test(lowSnap), "high screen → detox hint");

  updateSession(uid, {
    dailyState: {
      date: s1.dailyState.date,
      userId: uid,
      language: "hu",
      energyLevel: 8,
      sleepQuality: 7,
      hydrationDone: true,
      movementDone: true,
      breathworkDone: true,
      screenDiscipline: "low",
      todayMission: "deep work"
    }
  });
  const highSnap = buildDailyStatusSnapshot(getSession(uid), "hu", uid);
  assert(/magas|Fegyelem|Warrior/i.test(highSnap), "high energy adaptation");

  await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/midday"
  });
  const middayAns = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "nem igen igen közepes 10 perc séta"
  });
  assert(middayAns.branch === "daily_checkin", "midday check-in");
  assertHu(middayAns.reply, "midday answers");

  await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/evening"
  });
  const eveningAns = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "oldal kész; scroll; harag; 3 lassú légzés"
  });
  assert(eveningAns.branch === "daily_checkin", "evening check-in branch");
  assertHu(eveningAns.reply, "evening save");
  const s2 = getSession(uid);
  assert(s2.dailyState?.eveningReflection, "evening reflection");
  assert(s2.dailyState?.recoveryAction, "recovery action");

  console.log("daily-state-tracking-smoke: OK");
}

run().catch((e) => {
  console.error("daily-state-tracking-smoke FAILED:", e.message);
  process.exit(1);
});
