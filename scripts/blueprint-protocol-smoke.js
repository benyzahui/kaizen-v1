/**
 * Dragon Blueprint protocol mapping smoke test.
 */
const { getSession, updateSession } = require("../src/session/sessionStore");
const { routeCommandMessage } = require("../src/handlers/commands");
const { buildBlueprintCommandResponse } = require("../src/blueprint/adaptiveProtocolEngine");
const { finalizeOutboundReply } = require("../src/i18n/hardLanguageLock");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const EN_LEAK = [
  /\bState:\b/i,
  /\bStep:\b/i,
  /\bNext:\b/i,
  /\bYou got this\b/i,
  /\bStay strong\b/i,
  /\bHow do you feel\b/i,
  /\bI'm here for you\b/i
];

const GENERIC_COACH = [
  /believe in yourself/i,
  /you've got this/i,
  /stay motivated/i,
  /mindset coach/i
];

const EXTREME = [
  /\b72\s*h/i,
  /\b48\s*hour/i,
  /dry fast/i,
  /medical/i,
  /prescribe/i
];

function huBaseSession(uid, patch = {}) {
  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userName: "Smoke",
    userPrimaryPath: "stabilization",
    protocolLevel: "beginner",
    ...patch
  });
  return getSession(uid);
}

async function cmd(uid, text, session) {
  const raw = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text },
    session
  );
  return finalizeOutboundReply(raw, "hu", getSession(uid), uid, {
    openingId: `smoke_${text}`
  });
}

function assertHuBlueprint(reply, label) {
  assert(reply && reply.length > 20, `${label}: reply exists`);
  for (const re of EN_LEAK) {
    assert(!re.test(reply), `${label}: EN leakage ${re}`);
  }
  for (const re of GENERIC_COACH) {
    assert(!re.test(reply), `${label}: generic coaching`);
  }
  for (const re of EXTREME) {
    assert(!re.test(reply), `${label}: extreme health advice`);
  }
  assert(/Lépés:|Következő:/i.test(reply), `${label}: blueprint structure`);
  assert(
    /Állapot:|Energia|Stabilizálás|Böjt|Mozgás|Trade/i.test(reply),
    `${label}: protocol header`
  );
}

async function run() {
  const uid = `smoke_bp_${Date.now()}`;
  let s = huBaseSession(uid);
  const replies = [];

  for (const c of ["/energy", "/fasting", "/training", "/reset", "/trade"]) {
    const r = await cmd(uid, c, s);
    replies.push(r);
    assertHuBlueprint(r, c);
  }

  s = huBaseSession(uid, {
    energyState: "low",
    disciplineState: "focused",
    nervousSystemState: "calm"
  });
  const lowTrain = await cmd(uid, "/training", s);
  assertHuBlueprint(lowTrain, "low energy /training");
  const lowSteps = (lowTrain.split("Lépés:")[1] || "").toLowerCase();
  assert(
    !/intervall|interval|cold|hideg/i.test(lowSteps),
    "low energy: gentle steps only"
  );
  assert(/Következő: \/energy/i.test(lowTrain), "low training → /energy");

  s = huBaseSession(uid, {
    energyState: "high",
    disciplineState: "locked_in",
    nervousSystemState: "calm",
    protocolLevel: "intermediate"
  });
  const highEnergy = await buildBlueprintCommandResponse("/energy", s, "hu", "/energy");
  assert(/tisza|fókusz|kapacitás/i.test(highEnergy), "high energy copy");

  s = huBaseSession(uid, {
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "overloaded"
  });
  const overloaded = await cmd(uid, "/energy", s);
  assertHuBlueprint(overloaded, "overloaded /energy");
  assert(/Következő: \/reset/i.test(overloaded), "overloaded → /reset");

  const tradeBad = await cmd(uid, "/trade", s);
  assert(/nincs trade|Nincs trade/i.test(tradeBad), "overloaded: no trade");
  assert(/Következő: \/reset/i.test(tradeBad), "trade → reset");

  s = huBaseSession(uid, {
    energyState: "stable",
    disciplineState: "drifting",
    nervousSystemState: "calm"
  });
  const focus = await cmd(uid, "/focus", s);
  assertHuBlueprint(focus, "drifting /focus");
  assert(/zárat|zárol|fókusz sodródik/i.test(focus), "drifting focus copy");

  const unique = new Set(replies.map((r) => r.slice(0, 80)));
  assert(unique.size === replies.length, "no identical reply loop on commands");

  console.log("blueprint-protocol-smoke: OK");
  console.log("  HU commands: /energy /fasting /training /reset /trade");
  console.log("  states: low, high, overloaded, drifting");
}

run().catch((e) => {
  console.error("blueprint-protocol-smoke FAILED:", e.message);
  process.exit(1);
});
