/**
 * Program mode + daily flow smoke test (HU).
 */
const { getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const EN_LEAK = [
  /\bDragon Program activated\b/i,
  /\bStart now:/i,
  /\bPhase:\s*morning\b/i,
  /\bNext step:/i,
  /\bThis is stabilization\b/i
];

function assertHu(text, label) {
  assert(text && text.length > 8, `${label}: empty`);
  for (const re of EN_LEAK) {
    assert(!re.test(text), `${label}: EN leak`);
  }
}

async function run() {
  const uid = `smoke_prog_${Date.now()}`;

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  });

  const prog = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/program"
  });
  assertHu(prog.reply, "/program");
  assert(/Dragon Program aktiválva/i.test(prog.reply), "activate");
  assert(/\/morning/i.test(prog.reply), "start morning");
  let s = getSession(uid);
  assert(s.programMode === "active", "active");
  assert(s.dailyPhase === "morning", "phase morning");

  await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/morning"
  });
  const morningDone = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "7 8 page polish víz légzés"
  });
  assert(morningDone.branch === "daily_checkin", "morning answers");
  assertHu(morningDone.reply, "morning save");
  assert(/\/midday/i.test(morningDone.reply), "suggest midday");
  s = getSession(uid);
  assert(s.dailyPhase === "midday", "phase midday");
  assert(s.completedPhases.includes("morning"), "morning completed");

  const where = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/whereami"
  });
  assertHu(where.reply, "/whereami");
  assert(/Jelenlegi állapot/i.test(where.reply), "whereami title");
  assert(/dél|midday/i.test(where.reply) || /Fázis:\s*dél/i.test(where.reply), "phase dél");
  assert(/\/midday/i.test(where.reply), "next midday");

  const overload = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "szétesek"
  });
  assert(overload.branch === "open", "overload open");
  assertHu(overload.reply, "overload");
  assert(/stabilizálás|nyitott kör|vissza|légzés/i.test(overload.reply), "stabilize or correction");
  assert(/\/midday|\/reset/i.test(overload.reply), "return step command");

  await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/midday"
  });
  const middayDone = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "nem igen igen közepes 10 perc séta"
  });
  assertHu(middayDone.reply, "midday done");
  assert(/\/evening/i.test(middayDone.reply), "suggest evening");
  s = getSession(uid);
  assert(s.dailyPhase === "evening", "phase evening");

  await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/evening"
  });
  const eveningDone = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "oldal kész; scroll; harag; 3 lassú légzés"
  });
  assertHu(eveningDone.reply, "evening done");
  assert(/lezárva|Holnap/i.test(eveningDone.reply), "cycle closed");
  s = getSession(uid);
  assert(s.dailyPhase === "completed", "phase completed");

  const paused = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/pause"
  });
  assertHu(paused.reply, "/pause");
  assert(getSession(uid).programPaused === true, "paused");

  const resumed = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/resume"
  });
  assertHu(resumed.reply, "/resume");
  assert(getSession(uid).programPaused === false, "resumed");

  const stopped = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text: "/stop"
  });
  assertHu(stopped.reply, "/stop");
  s = getSession(uid);
  assert(s.programMode === "inactive", "inactive");
  assert(!s.dailyPhase, "phase cleared");

  const replies = [prog.reply, morningDone.reply, where.reply, overload.reply];
  const heads = replies.map((r) => r.slice(0, 60));
  assert(new Set(heads).size === heads.length, "no reply loop");

  console.log("program-mode-smoke: OK");
}

run().catch((e) => {
  console.error("program-mode-smoke FAILED:", e.message);
  process.exit(1);
});
