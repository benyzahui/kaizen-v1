/**
 * Rhythm intelligence smoke — timing, verbosity, overload, premium tone.
 * Run: node scripts/rhythm-intelligence-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { getTimeSlot, localHour } = require("../src/core/timeContext");
const { resolveTimeAwareTone } = require("../src/atmosphere/timeAwareTone");
const {
  resolveRhythmProfile,
  applyVerbosityCap,
  pickContextualPresence,
  pickOneThingLine,
  pickContinuityLine,
  maybeContextualPresence,
  applyRhythmIntelligenceFinalize,
  rhythmPoolStats,
  isPremiumRhythmLine,
  GENERIC_RE
} = require("../src/rhythm/rhythmIntelligenceEngine");
const { resolveBehaviorSignals } = require("../src/rhythm/behaviorSignals");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { HYPE_RE, GUILT_RE } = require("../src/retention/retentionRhythmEngine");
const { finalizeOutboundReply } = require("../src/i18n/hardLanguageLock");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    companionHourOffset: 60,
    activeMode: "discipline",
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "calm",
    recentCommands: [],
    recentContextPresenceIds: [],
    recentContinuityIds: [],
    lastAt: Date.now(),
    streaks: {
      morning: { current: 0, best: 0, lastDate: null },
      focus: { current: 0, best: 0, lastDate: null }
    },
    ...overrides
  };
}

function atHour(h, day = 0) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 9, 1 + day, utcH, 0, 0));
}

function assertPremium(text, label) {
  assert(text && text.length > 4, `${label}: empty`);
  assert(text.length < 900, `${label}: spam (${text.length})`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!GUILT_RE.test(text), `${label}: guilt`);
  assert(!GENERIC_RE.test(text), `${label}: generic`);
  assert(isPremiumRhythmLine(text), `${label}: tone`);
}

function lineCount(text) {
  return String(text || "").split(/\n/).filter((l) => l.trim()).length;
}

function run() {
  const stats = rhythmPoolStats();
  assert(stats.contextualPresence >= 24, "contextual presence pool");
  assert(stats.oneThing >= 10, "one-thing pool");
  assert(stats.continuity >= 8, "continuity pool");

  const uid = `rhythm_smoke_${Date.now()}`;
  clearSession(uid);

  /* Time bands */
  updateSession(uid, baseSession());
  const slots = [
    { h: 7, expect: "morning", mode: "activate" },
    { h: 12, expect: "midday", mode: "execute" },
    { h: 18, expect: "evening", mode: "stabilize" },
    { h: 22, expect: "late_night", mode: "recover" }
  ];
  for (const { h, expect, mode } of slots) {
    const now = atHour(h);
    const s = getSession(uid);
    assert(getTimeSlot(s, now) === expect, `hour ${h} → ${expect}`);
    const tone = resolveTimeAwareTone(s, now);
    assert(tone.rhythmMode === mode, `hour ${h} rhythmMode ${mode}`);
  }

  /* Active focused user — low verbosity cap */
  updateSession(uid, baseSession({ disciplineState: "locked_in", energyState: "high" }));
  const activeProfile = resolveRhythmProfile(getSession(uid), "", atHour(11));
  assert(activeProfile.rhythmMode === "execute", "midday execute");
  const longBody = Array(12).fill("Sor.").join("\n");
  const capped = applyVerbosityCap(longBody, activeProfile);
  assert(lineCount(capped) <= activeProfile.maxLines + 1, "verbosity cap active user");

  /* Overloaded — one thing + minimal */
  updateSession(uid, baseSession({ nervousSystemState: "overloaded", energyState: "exhausted" }));
  const ovProfile = resolveRhythmProfile(getSession(uid), "szétesek", atHour(14));
  assert(ovProfile.protocolIntensity === "low", "overload lowers intensity");
  const oneThing = pickOneThingLine(ovProfile, "hu", uid, "ov");
  assertPremium(oneThing, "one thing HU");
  assert(/egy|nem új|one|nu construi/i.test(oneThing), "one thing reduces complexity");

  const finalized = applyRhythmIntelligenceFinalize(
    longBody,
    "hu",
    getSession(uid),
    uid,
    { dateKey: "ov", inboundText: "szétesek" }
  );
  assert(lineCount(finalized) <= 6, `overload finalize lines (${lineCount(finalized)})`);
  assert(
    /egy|nem új|lépés|építs|tíz|one thing|nu construi/i.test(finalized),
    `overload finalize has one-thing: ${JSON.stringify(finalized.slice(0, 80))}`
  );

  /* Frantic commands */
  updateSession(uid, baseSession({
    recentCommands: ["/morning", "/midday", "/panel", "/energy", "/status"],
    lastAt: Date.now()
  }));
  const franticSig = resolveBehaviorSignals(getSession(uid), "", atHour(13));
  assert(franticSig.frantic, "frantic command switching");
  const franticProfile = resolveRhythmProfile(getSession(uid), "", atHour(13));
  assert(franticProfile.maxLines <= 4, "frantic shortens messages");

  /* Evening recovery */
  updateSession(uid, baseSession({ energyState: "low", activeMode: "recovery" }));
  const eveBody = buildDailyPhasePresence(
    "evening",
    "hu",
    getSession(uid),
    uid,
    "eve_rec",
    atHour(21)
  );
  assertPremium(eveBody, "evening recovery daily");
  assert(lineCount(eveBody) <= 18, "evening not spam");

  /* Night spiral */
  const nightNow = atHour(23);
  updateSession(uid, baseSession({
    nervousSystemState: "anxious",
    messages: [
      { text: "stress", ts: nightNow.getTime() - 1000 },
      { text: "panik", ts: nightNow.getTime() - 2000 },
      { text: "szétesek", ts: nightNow.getTime() - 3000 },
      { text: "nem alszom", ts: nightNow.getTime() - 4000 }
    ]
  }));
  const nightSig = resolveBehaviorSignals(getSession(uid), "nem alszom még", nightNow);
  assert(nightSig.lateNightSpiral, "late night spiral");
  const nightProfile = resolveRhythmProfile(getSession(uid), "nem alszom", nightNow);
  const nightLine = pickContextualPresence(nightProfile, "hu", uid, "night", getSession(uid));
  if (nightLine) assertPremium(nightLine, "night presence");

  /* Streak / disciplined */
  updateSession(uid, baseSession({
    disciplineState: "focused",
    streaks: {
      morning: { current: 5, best: 5, lastDate: new Date().toISOString().slice(0, 10) },
      focus: { current: 3, best: 3, lastDate: new Date().toISOString().slice(0, 10) }
    }
  }));
  const streakSig = resolveBehaviorSignals(getSession(uid), "", atHour(8));
  assert(streakSig.strongConsistency, "strong consistency");
  const focusProfile = resolveRhythmProfile(getSession(uid), "", atHour(8));
  const focusLine = pickContextualPresence(focusProfile, "hu", uid, "streak", getSession(uid));
  assert(
    focusProfile.signals.disciplinedFlow || focusProfile.signals.strongConsistency,
    "disciplined/streak signals"
  );
  if (focusLine) assertPremium(focusLine, "streak/discipline presence HU");

  /* Romanian quality */
  updateSession(uid, baseSession({ preferredLanguage: "ro", lang: "ro", nervousSystemState: "overloaded" }));
  const roOne = pickOneThingLine(resolveRhythmProfile(getSession(uid), "", atHour(15)), "ro", uid, "ro");
  assertPremium(roOne, "one thing RO");
  const roCont = pickContinuityLine("ro", uid, "ro_c", getSession(uid));
  assertPremium(roCont, "continuity RO");
  assert(/sistem|bucl|proces/i.test(roCont), "continuity RO identity");

  /* Hungarian consistency via finalizeOutbound */
  updateSession(uid, baseSession({ nervousSystemState: "overloaded" }));
  const huOut = finalizeOutboundReply(
    "Első sor.\nMásodik.\nHarmadik.\nNegyedik.\nÖtödik.\nHatodik.\nHetedik.",
    "hu",
    getSession(uid),
    uid,
    { dateKey: "fin", inboundText: "túl sok" }
  );
  assert(!/\b(the|your journey|feel free)\b/i.test(huOut), "HU lock no EN leak");
  assert(lineCount(huOut) <= 8, "finalize verbosity");

  /* Anti-repeat presence */
  updateSession(uid, baseSession({ nervousSystemState: "overloaded" }));
  const seen = new Set();
  for (let i = 0; i < 8; i++) {
    const p = maybeContextualPresence("hu", getSession(uid), uid, `rep_${i}`, "", 1, atHour(14, i));
    if (p) seen.add(p);
  }
  assert(seen.size >= 2, `presence variety (${seen.size})`);

  console.log("rhythm-intelligence-smoke: OK");
  console.log(`  pools: presence=${stats.contextualPresence} oneThing=${stats.oneThing}`);
  console.log(`  time bands: 06-10 / 10-16 / 16-21 / 21-06`);
}

try {
  run();
} catch (e) {
  console.error("rhythm-intelligence-smoke: FAIL", e.message);
  process.exit(1);
}
