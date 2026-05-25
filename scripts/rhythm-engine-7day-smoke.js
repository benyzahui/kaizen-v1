/**
 * Daily Rhythm Engine — 7-day simulation smoke test.
 * Run: node scripts/rhythm-engine-7day-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { buildMorningBlueprint } = require("../src/rhythm/morningBuilder");
const { buildMiddayBlueprint } = require("../src/rhythm/middayBuilder");
const { buildEveningBlueprint } = require("../src/rhythm/eveningBuilder");
const {
  resolveRhythmContext,
  pickRhythmLine
} = require("../src/rhythm/rhythmPicker");
const { MAX_LINES, selectDailyRhythmSlot } = require("../src/rhythm/rhythmEngine");
const { routeCommandMessage } = require("../src/handlers/commands");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "en",
    lang: "en",
    userName: "Test",
    activeMode: "discipline",
    energyState: "stable",
    nervousSystemState: "calm",
    recentCoachSnippets: [],
    rhythmRecentOpeners: [],
    messages: [],
    ...overrides
  };
}

async function run() {
  const uid = "rhythm_7day_smoke";

  /* ── Structure: morning 6 sections ── */
  const m = buildMorningBlueprint(baseSession(), "en", uid, "2026-05-01");
  const mLines = m.split(/\n/).filter(Boolean);
  assert(mLines.length >= 5 && mLines.length <= MAX_LINES.morning, `morning lines ${mLines.length}`);
  assert(/hydrat|fuel|energy|stimul|caffeine|water|calibrat|baseline|üzemanyag/i.test(m), "morning has energy calibration");
  assert(/focus|direction|lane|target|commitment|irány|fókusz/i.test(m), "morning has focus");
  assert(/movement|body|scroll|move|posture|mozg|test/i.test(m), "morning has body");
  assert(/discipline|clarity|structure|accountability|fegyelem/i.test(m), "morning has discipline");

  const mid = buildMiddayBlueprint(baseSession(), "en", uid, "2026-05-01");
  const midLines = mid.split(/\n/).filter(Boolean);
  assert(midLines.length >= 4 && midLines.length <= MAX_LINES.midday, `midday lines ${midLines.length}`);
  assert(/attention|noise|lane|drift/i.test(mid), "midday attention");
  assert(/jaw|breath|nervous|relax/i.test(mid), "midday nervous");

  const eve = buildEveningBlueprint(baseSession(), "en", uid, "2026-05-01");
  const eveLines = eve.split(/\n/).filter(Boolean);
  assert(eveLines.length >= 4 && eveLines.length <= MAX_LINES.evening, `evening lines ${eveLines.length}`);
  assert(/tonight|solve|release|pressure/i.test(eve), "evening release");
  assert(/screen|noise|scroll|stimul|input|feed|digital|dim|képernyő|ecran/i.test(eve), "evening screen cue");

  /* ── Adaptive: exhausted vs warrior ── */
  const exhaustedOpener = pickRhythmLine(
    "morning",
    "opener",
    resolveRhythmContext(baseSession({ energyState: "exhausted" }), "en"),
    baseSession({ energyState: "exhausted" }),
    "exhausted_user",
    "2026-05-02"
  );
  assert(
    /soft|gentle|recovery|low|fuel|pihen|ușor|blând|light|entry|minimum|lágy|finom/i.test(
      exhaustedOpener
    ),
    `exhausted softer opener: ${exhaustedOpener}`
  );

  const warriorOpener = pickRhythmLine(
    "morning",
    "opener",
    resolveRhythmContext(
      baseSession({ activeMode: "warrior", energyState: "high" }),
      "en"
    ),
    baseSession({ activeMode: "warrior" }),
    "warrior_user",
    "2026-05-03"
  );
  assert(
    /edge|train|sharp|warrior|harcos|disciplin|rep/i.test(warriorOpener),
    `warrior sharper opener: ${warriorOpener}`
  );

  const overloadedMid = buildMiddayBlueprint(
    baseSession({ nervousSystemState: "overloaded" }),
    "en",
    uid,
    "2026-05-04"
  );
  assert(/breath|calm|overload|scope|léleg|csökkent/i.test(overloadedMid), "overloaded midday calming");

  /* ── 7-day opener variation ── */
  const openers = new Set();
  let session = baseSession();
  for (let d = 1; d <= 7; d++) {
    const dk = `2026-05-0${d}`;
    const dayMorning = buildMorningBlueprint(session, "en", uid, dk);
    const first = dayMorning.split(/\n/)[0].trim();
    openers.add(first);
    session = {
      ...session,
      recentCoachSnippets: [
        ...(session.recentCoachSnippets || []),
        first.toLowerCase().slice(0, 96)
      ]
    };
  }
  assert(openers.size >= 5, `7-day openers varied (${openers.size} unique)`);

  /* ── Command integration ── */
  clearSession(uid);
  updateSession(uid, {
    ...baseSession(),
    onboardingCompleted: true,
    preferredLanguage: "en",
    lang: "en"
  });
  const morningCmd = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text: "/morning" },
    getSession(uid)
  );
  assert(morningCmd && morningCmd.split(/\n/).length >= 5, "/morning uses blueprint");

  clearSession(uid);
  updateSession(uid, baseSession({ lang: "hu", preferredLanguage: "hu" }));
  const huMid = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text: "/midday" },
    getSession(uid)
  );
  assert(huMid && /sáv|figyelem|léleg|zaj/i.test(huMid), "HU midday rhythm");

  const slot = selectDailyRhythmSlot({});
  assert(["morning", "midday", "evening", "late_night"].includes(slot), `slot selector: ${slot}`);

  console.log("✓ rhythm-engine-7day-smoke passed");
  console.log(`  Sample morning:\n${mLines.slice(0, 3).join("\n")}…`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
