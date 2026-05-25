/**
 * Daily rhythm + program presence — 3-day phase simulation (06:00 / 12:00 / 21:00).
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
const { buildDailyPhasePresence, HYPE_RE, MAX_PHASE_CHARS } = require("../src/program/dailyProgramPresence");
const { buildScheduledRhythmMessage } = require("../src/scheduler/dailyRhythmScheduler");

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
    companionHourOffset: 60,
    recentCoachSnippets: [],
    rhythmRecentOpeners: [],
    messages: [],
    ...overrides
  };
}

/** Local hour → UTC Date (CET offset minutes). */
function atLocalHour(hour, dayIndex = 0, offsetMin = 60) {
  const utcH = ((hour - Math.floor(offsetMin / 60)) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 5, 1 + dayIndex, utcH, 0, 0));
}

function assertProgramPresence(text, label, lang) {
  assert(text && text.length > 40, `${label}: empty`);
  assert(text.length <= MAX_PHASE_CHARS + 40, `${label}: overtalk (${text.length})`);
  assert(!HYPE_RE.test(text), `${label}: motivational cringe`);
  assert(/Dragon Blueprint|🐉/i.test(text), `${label}: program identity`);
  assert(/Mantra:/i.test(text), `${label}: mantra block`);

  if (lang === "hu") {
    assert(
      /Ma:|Mini Reset|Focus|víz|⚔|🌊|program|rítmus|Ritmust|Ma is/i.test(text),
      `${label}: HU action or program`
    );
    assert(!/\b(the |your morning|Purpose:)\b/i.test(text), `${label}: HU no EN leak`);
  }
  if (lang === "ro") {
    assert(/Azi:|program|ritm|Mantra:/i.test(text), `${label}: RO natural`);
    assert(!/\b(the |your morning|Beginner:)\b/i.test(text), `${label}: RO no EN leak`);
  }
  if (lang === "en") {
    assert(/Today:|program|rhythm/i.test(text), `${label}: EN action`);
  }
}

async function run() {
  const uid = "rhythm_7day_smoke";

  /* ── Blueprint builders (unchanged structure) ── */
  const m = buildMorningBlueprint(baseSession(), "en", uid, "2026-05-01");
  const mLines = m.split(/\n/).filter(Boolean);
  assert(mLines.length >= 5 && mLines.length <= MAX_LINES.morning, `morning lines ${mLines.length}`);
  assert(/hydrat|fuel|energy|water|calibrat/i.test(m), "morning has energy calibration");
  assert(
    /focus|direction|lane|clarity|structure|discipline|intent|execution|commitment|accountability/i.test(
      m
    ),
    `morning has focus: ${m.slice(0, 80)}`
  );

  const mid = buildMiddayBlueprint(baseSession(), "en", uid, "2026-05-01");
  assert(mid.split(/\n/).filter(Boolean).length >= 4, "midday structure");

  const eve = buildEveningBlueprint(baseSession(), "en", uid, "2026-05-01");
  assert(/release|screen|tonight/i.test(eve), "evening release");

  /* ── 3 days × 06:00 / 12:00 / 21:00 program presence ── */
  const huUid = `rhythm_prog_hu_${Date.now()}`;
  clearSession(huUid);
  updateSession(huUid, baseSession({ lang: "hu", preferredLanguage: "hu" }));

  for (let d = 0; d < 3; d++) {
    const dk = `2026-06-0${d + 1}`;
    const morning = buildDailyPhasePresence(
      "morning",
      "hu",
      getSession(huUid),
      huUid,
      dk,
      atLocalHour(6, d)
    );
    assertProgramPresence(morning, `day${d + 1} 06:00 morning HU`, "hu");
    assert(/Reggeli aktiválás|víz|Küldetés|Mi az egy/i.test(morning), "morning activation HU");

    const midday = buildDailyPhasePresence(
      "midday",
      "hu",
      getSession(huUid),
      huUid,
      dk,
      atLocalHour(12, d)
    );
    assertProgramPresence(midday, `day${d + 1} 12:00 midday HU`, "hu");
    assert(/Délközi|visszahúzás|Most:/i.test(midday), "midday correction HU");

    const evening = buildDailyPhasePresence(
      "evening",
      "hu",
      getSession(huUid),
      huUid,
      dk,
      atLocalHour(21, d)
    );
    assertProgramPresence(evening, `day${d + 1} 21:00 evening HU`, "hu");
    assert(/Esti elengedés|Mit engedsz|pihenés|regeneráció/i.test(evening), "evening release HU");
  }

  /* ── Romanian natural ── */
  const roUid = `rhythm_prog_ro_${Date.now()}`;
  clearSession(roUid);
  updateSession(roUid, baseSession({ lang: "ro", preferredLanguage: "ro" }));
  const roMorn = buildDailyPhasePresence(
    "morning",
    "ro",
    getSession(roUid),
    roUid,
    "2026-06-01",
    atLocalHour(6)
  );
  assertProgramPresence(roMorn, "RO morning", "ro");
  assert(/Activare dimineață|apă|expirații|Misiune/i.test(roMorn), "RO morning native");

  /* ── Command /morning uses program presence ── */
  clearSession(uid);
  updateSession(uid, {
    ...baseSession(),
    preferredLanguage: "hu",
    lang: "hu"
  });
  const morningCmd = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text: "/morning" },
    getSession(uid)
  );
  assertProgramPresence(morningCmd, "/morning HU command", "hu");
  assert(/Rövid válasz/i.test(morningCmd), "check-in footer");

  /* ── Scheduler same builder ── */
  const sched = buildScheduledRhythmMessage(
    "midday",
    getSession(uid),
    uid,
    "2026-06-02",
    atLocalHour(12)
  );
  assertProgramPresence(sched, "scheduled midday HU", "hu");

  /* ── Adaptive openers (7-day) ── */
  const openers = new Set();
  let session = baseSession();
  for (let d = 1; d <= 7; d++) {
    const dk = `2026-05-0${d}`;
    const dayMorning = buildMorningBlueprint(session, "en", uid, dk);
    openers.add(dayMorning.split(/\n/)[0].trim());
    session = {
      ...session,
      recentCoachSnippets: [
        ...(session.recentCoachSnippets || []),
        dayMorning.slice(0, 96).toLowerCase()
      ]
    };
  }
  assert(openers.size >= 4, `7-day blueprint openers varied (${openers.size})`);

  const exhaustedOpener = pickRhythmLine(
    "morning",
    "opener",
    resolveRhythmContext(baseSession({ energyState: "exhausted" }), "en"),
    baseSession({ energyState: "exhausted" }),
    "exhausted_user",
    "2026-05-02"
  );
  assert(/soft|gentle|recovery|low|light|minimum/i.test(exhaustedOpener), "exhausted softer opener");

  const slot = selectDailyRhythmSlot({});
  assert(["morning", "midday", "evening", "late_night"].includes(slot), `slot selector: ${slot}`);

  const sampleMorning = buildDailyPhasePresence(
    "morning",
    "hu",
    getSession(huUid),
    huUid,
    "2026-06-01",
    atLocalHour(6)
  );

  console.log("✓ rhythm-engine-7day-smoke passed");
  console.log(`  Sample program morning (HU):\n${sampleMorning.split("\n").slice(0, 6).join("\n")}…`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
