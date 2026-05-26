/**
 * Retention rhythm smoke — touchpoints, check-ins, return, atmosphere.
 * Run: node scripts/retention-rhythm-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const {
  HYPE_RE,
  GUILT_RE,
  MARKETING_RE,
  isPremiumRetentionTone,
  isInactiveUser,
  maybeMicroTouchpoint,
  pickLightCheckIn,
  maybeLightCheckInLine,
  maybeIdentityWhisper,
  tryRetentionReturn,
  retentionPoolStats
} = require("../src/retention/retentionRhythmEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { tryCompanionCheckIn } = require("../src/companion/companionInitiation");

const GENERIC_RE =
  /\b(as an ai|language model|happy to help|how can i assist|subscribe now|don't miss out)\b/i;

const PHASES = ["morning", "midday", "evening"];
const LANGS = ["hu", "ro"];

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    activeMode: "discipline",
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "calm",
    companionHourOffset: 60,
    recentTouchIds: [],
    recentLightCheckInIds: [],
    recentIdentityWhisperIds: [],
    lastAt: Date.now(),
    ...overrides
  };
}

function assertPremium(text, label) {
  assert(text && text.length > 8, `${label}: empty`);
  assert(text.length < 950, `${label}: spam (${text.length})`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!GUILT_RE.test(text), `${label}: guilt`);
  assert(!MARKETING_RE.test(text), `${label}: marketing`);
  assert(!GENERIC_RE.test(text), `${label}: generic`);
}

function atHour(h, day = 0) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 8, 5 + day, utcH, 0, 0));
}

function forceTouches(uid, session, lang, phase, n = 8) {
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    const dk = `touch_${phase}_${i}`;
    const t = maybeMicroTouchpoint(lang, session, uid, dk, phase, 1, atHour(12, i));
    if (t) seen.add(t);
    session = getSession(uid);
  }
  return seen;
}

function run() {
  const stats = retentionPoolStats();
  assert(stats.touchpoints >= 24, `touchpoints pool (${stats.touchpoints})`);
  assert(stats.lightCheckIns >= 18, `light check-ins (${stats.lightCheckIns})`);
  assert(stats.identityLines >= 12, `identity lines (${stats.identityLines})`);
  assert(stats.returnNudges >= 6, `return nudges (${stats.returnNudges})`);

  const uid = `ret_smoke_${Date.now()}`;
  clearSession(uid);

  /* Active focused user */
  updateSession(uid, baseSession({ disciplineState: "locked_in", energyState: "high" }));
  let activeBodies = [];
  for (const phase of PHASES) {
    const body = buildDailyPhasePresence(
      phase,
      "hu",
      getSession(uid),
      uid,
      `active_${phase}`,
      atHour(phase === "morning" ? 7 : phase === "midday" ? 13 : 20)
    );
    assertPremium(body, `active/${phase}`);
    activeBodies.push(body);
  }
  assert(new Set(activeBodies).size >= 2, "active user: daily bodies vary");

  /* Inactive user — soft return */
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  updateSession(uid, baseSession({ lastAt: threeDaysAgo, lastReturnNudgeAt: 0 }));
  assert(isInactiveUser(getSession(uid)), "inactive detection");
  const ret = tryRetentionReturn(getSession(uid), "hu", uid, "szia");
  assert(ret && ret.body, "return nudge on greet");
  assertPremium(ret.body, "return nudge");
  assert(/ritm|lépés|step|ritm/i.test(ret.body), "return mentions rhythm/step not guilt");
  assert(!GUILT_RE.test(ret.body), "return no guilt");

  /* Overwhelmed user — grounding touches */
  updateSession(uid, baseSession({ energyState: "exhausted", nervousSystemState: "overloaded" }));
  const overwhelmedTouches = forceTouches(uid, getSession(uid), "hu", "midday", 6);
  for (const t of overwhelmedTouches) {
    assertPremium(t, "overwhelmed touch");
    assert(!/tiszta blokk|clean block/i.test(t), "no hard block when overwhelmed");
  }

  /* Focused stable — may get focus touch */
  updateSession(uid, baseSession({ energyState: "stable", disciplineState: "focused" }));
  const focusedTouches = forceTouches(uid, getSession(uid), "hu", "midday", 6);
  assert(focusedTouches.size >= 1, "focused user gets touches");

  /* Evening recovery */
  updateSession(uid, baseSession({ energyState: "low", activeMode: "recovery" }));
  let eveningTouch = null;
  for (let i = 0; i < 6; i++) {
    eveningTouch = maybeMicroTouchpoint(
      "hu",
      getSession(uid),
      uid,
      `eve_${i}`,
      "evening",
      1,
      atHour(21, i)
    );
    if (eveningTouch) break;
  }
  if (eveningTouch) {
    assertPremium(eveningTouch, "evening touch");
    assert(
      !/tiszta blokk|clean block|nyitott kör/i.test(eveningTouch),
      "evening avoids hard execution nudges"
    );
  }

  /* Light check-ins — variety */
  updateSession(uid, baseSession({ lastLightCheckInAt: 0 }));
  const checkIns = new Set();
  for (let i = 0; i < 10; i++) {
    const line = pickLightCheckIn("hu", getSession(uid), uid, "daily", "midday");
    if (line) checkIns.add(line);
  }
  assert(checkIns.size >= 3, `light check-in variety (${checkIns.size})`);
  for (const line of checkIns) assertPremium(line, "light check-in");

  /* Identity whispers */
  updateSession(uid, baseSession());
  const whispers = new Set();
  for (let i = 0; i < 8; i++) {
    const w = maybeIdentityWhisper("ro", getSession(uid), uid, `id_${i}`, "morning", 1);
    if (w) whispers.add(w);
  }
  assert(whispers.size >= 2, "identity whispers vary");
  for (const w of whispers) {
    assertPremium(w, "identity");
    assert(/🐉|Dragon|Blueprint|ritm|ritmus|irány|direction|direc/i.test(w), "program identity");
  }

  /* Romanian daily */
  updateSession(uid, baseSession({ preferredLanguage: "ro", lang: "ro" }));
  const roBody = buildDailyPhasePresence(
    "evening",
    "ro",
    getSession(uid),
    uid,
    "ro_evening",
    atHour(21)
  );
  assertPremium(roBody, "ro evening");

  /* Companion check-in uses retention pool */
  updateSession(uid, {
    ...baseSession(),
    lastAt: Date.now() - 9 * 60 * 60 * 1000,
    lastCompanionCheckin: 0
  });
  let gotCompanion = false;
  for (let i = 0; i < 30; i++) {
    const c = tryCompanionCheckIn(getSession(uid), "hu", uid, "hello");
    if (c) {
      assertPremium(c.body, "companion checkin");
      gotCompanion = true;
      break;
    }
  }

  /* Low repetition on light check-in pool */
  updateSession(uid, baseSession({ recentLightCheckInIds: [] }));
  const dailyQs = new Set();
  for (let i = 0; i < 12; i++) {
    const phase = PHASES[i % PHASES.length];
    const q = pickLightCheckIn("hu", getSession(uid), uid, "daily", phase);
    if (q) dailyQs.add(q);
  }
  assert(dailyQs.size >= 4, `daily check-in variety (${dailyQs.size})`);

  updateSession(uid, baseSession({ lastLightCheckInAt: 0 }));
  const oneDaily = maybeLightCheckInLine("hu", getSession(uid), uid, "dk_line", "midday", 1);
  if (oneDaily) assertPremium(oneDaily, "maybeLightCheckInLine");

  console.log("retention-rhythm-smoke: OK");
  console.log(`  pools: touch=${stats.touchpoints} checkin=${stats.lightCheckIns}`);
  console.log(`  companion check-in triggered: ${gotCompanion}`);
}

try {
  run();
} catch (e) {
  console.error("retention-rhythm-smoke: FAIL", e.message);
  process.exit(1);
}
