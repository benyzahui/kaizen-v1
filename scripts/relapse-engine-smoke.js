/**
 * Relapse + adaptive correction smoke test (HU).
 */
const { getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const {
  computeRelapseRisk,
  tryAdaptiveCorrectionReply
} = require("../src/correction/relapseEngine");
const { buildWeeklySummary } = require("../src/consistency/weeklySummary");
const { emptyStreaks } = require("../src/consistency/streakModel");
const { SHAME_RE } = require("../src/correction/correctionResponses");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const THERAPIST = [
  /how do you feel/i,
  /i'?m here for you/i,
  /tell me more about your childhood/i,
  /nézzük meg miért érzed/i
];

function assertTone(text, label) {
  assert(text && text.length > 8, `${label}: empty`);
  assert(!SHAME_RE.test(text), `${label}: shame`);
  for (const re of THERAPIST) assert(!re.test(text), `${label}: therapist`);
  assert(!/🔥{2,}/.test(text), `${label}: hype`);
  assert(text.length < 900, `${label}: not spam wall`);
}

async function run() {
  const uid = `smoke_relapse_${Date.now()}`;

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    streaks: (() => {
      const s = emptyStreaks();
      s.morning = { current: 0, best: 5, lastDate: "2020-01-01" };
      s.movement = { current: 0, best: 2, lastDate: "2020-01-02" };
      s.hydration = { current: 0, best: 1, lastDate: null };
      return s;
    })(),
    dailyState: {
      energyLevel: 3,
      sleepQuality: 4,
      focusDrift: true,
      screenDiscipline: "high"
    },
    disciplineState: "drifting",
    nervousSystemState: "overloaded"
  });

  const missedRisk = computeRelapseRisk(getSession(uid), "");
  assert(missedRisk === "high", "missed streaks → high risk");

  const missed = tryAdaptiveCorrectionReply(
    "nem megy ma semmi",
    "hu",
    getSession(uid),
    uid
  );
  assert(missed, "missed correction");
  assertTone(missed.body, "missed");
  assert(/nyitott kör|reset|ritmus|vissza|újrakezdeni/i.test(missed.body), "high risk correction HU");

  updateSession(uid, {
    streaks: emptyStreaks(),
    dailyState: { energyLevel: 2, sleepQuality: 3 },
    nervousSystemState: "calm"
  });
  const exhausted = tryAdaptiveCorrectionReply("kimerült vagyok", "hu", getSession(uid), uid);
  assertTone(exhausted.body, "exhausted");
  assert(/tested|Mini reset|víz|légzés/i.test(exhausted.body), "low energy protection");

  updateSession(uid, {
    dailyState: { screenDiscipline: "high" },
    nervousSystemState: "overloaded"
  });
  const overwhelmed = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "túl sok minden pánik stressz egyszerre"
  });
  assertTone(overwhelmed.reply, "overwhelmed");
  assert(/nyitott kör|reset/i.test(overwhelmed.reply), "overload block");

  updateSession(uid, {
    nervousSystemState: "calm",
    dailyState: { screenDiscipline: "low", focusDrift: false, energyLevel: 6 },
    messages: [
      { text: "why", category: "emotional_reflection" },
      { text: "and also", category: "reflective_open" },
      { text: "more", category: "work_focus" }
    ],
    streaks: (() => {
      const s = emptyStreaks();
      s.morning = { current: 2, best: 2, lastDate: new Date().toISOString().slice(0, 10) };
      return s;
    })()
  });
  const chaotic = tryAdaptiveCorrectionReply(
    "miért? és mi van ha? de ha nem? és akkor? és még?\n".repeat(8),
    "hu",
    getSession(uid),
    uid
  );
  assertTone(chaotic.body, "chaotic");
  assert(/elemzés|Mozdulj/i.test(chaotic.body), "chaotic interrupt");

  updateSession(uid, {
    messages: [],
    streaks: (() => {
      const s = emptyStreaks();
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      s.morning = { current: 5, best: 5, lastDate: y };
      s.movement = { current: 4, best: 4, lastDate: y };
      s.hydration = { current: 3, best: 3, lastDate: y };
      return s;
    })(),
    dailyState: { energyLevel: 8, sleepQuality: 7, focusDrift: false },
    disciplineState: "focused",
    nervousSystemState: "calm",
    relapseRisk: "low"
  });
  const warrior = tryAdaptiveCorrectionReply(
    "ma a fókusz a mission execution",
    "hu",
    getSession(uid),
    uid
  );
  assert(warrior, "warrior discipline");
  assertTone(warrior.body, "warrior");
  assert(/Védd|küldetés|tiszta|figyelmet|végrehajtás/i.test(warrior.body), "discipline tone");

  updateSession(uid, {
    dailyState: {
      date: new Date().toISOString().slice(0, 10),
      userId: uid,
      language: "hu",
      energyLevel: 3,
      screenDiscipline: "high",
      focusDrift: true
    },
    streaks: (() => {
      const s = emptyStreaks();
      s.morning = { current: 1, best: 6, lastDate: "2020-01-01" };
      return s;
    })(),
    nervousSystemState: "overloaded"
  });
  const weekly = buildWeeklySummary(getSession(uid), "hu", uid);
  assert(/Recovery ajánlott|kevesebb stimuláció/i.test(weekly), "weekly recovery");

  assert(chaotic.body !== warrior.body, "distinct chaotic vs warrior");

  console.log("relapse-engine-smoke: OK");
}

run().catch((e) => {
  console.error("relapse-engine-smoke FAILED:", e.message);
  process.exit(1);
});
