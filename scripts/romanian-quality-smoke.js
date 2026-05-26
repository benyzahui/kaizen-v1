/**
 * Romanian native experience smoke — onboarding, daily, overload, warrior.
 * Run: node scripts/romanian-quality-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { getResponses } = require("../src/i18n/getResponses");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { pickNativeMantra } = require("../src/atmosphere/nativeMantraPicker");
const { pickRomanianGreeting } = require("../src/atmosphere/nativeMantraPicker");
const { finalizeOutboundReply, languageLockScore } = require("../src/i18n/hardLanguageLock");
const {
  validateRomanianOutput,
  hasHungarianCalque,
  hasEnglishLeak,
  isNativeRomanianTone,
  poolStats,
  pickRomanianLine
} = require("../src/i18n/ro/romanianExperienceEngine");
const { getPool, POOL_KEYS } = require("../src/i18n/ro/romanianExperiencePools");
const { getDailyProgramPresenceCopy } = require("../src/program/i18n/getDailyProgramPresenceCopy");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "ro",
    lang: "ro",
    companionHourOffset: 60,
    activeMode: "discipline",
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "calm",
    ...overrides
  };
}

function atHour(h) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 10, 5, utcH, 0, 0));
}

function assertRoPremium(text, label, minScore = 75) {
  const v = validateRomanianOutput(text, minScore);
  assert(v.ok, `${label}: ${v.reason || "invalid"} — ${String(text).slice(0, 100)}`);
  assert(!hasHungarianCalque(text), `${label}: HU calque`);
  const lines = String(text).split(/\n/).filter(Boolean);
  assert(lines.length <= 20, `${label}: verbosity ${lines.length} lines`);
}

function run() {
  const stats = poolStats();
  for (const key of POOL_KEYS) {
    assert(stats[key] >= 3, `pool ${key} >= 3 (${stats[key]})`);
    for (const entry of getPool(key)) {
      const text = typeof entry === "string" ? entry : entry.text;
      assert(isNativeRomanianTone(text), `pool ${key} tone: ${text.slice(0, 60)}`);
    }
  }

  const uid = `ro_smoke_${Date.now()}`;
  clearSession(uid);

  const r = getResponses("ro");
  const ob = r.protocolOnboarding;
  assertRoPremium(typeof ob.start === "string" ? ob.start : ob.start.join("\n"), "onboarding start", 70);
  assertRoPremium(ob.askPath, "onboarding path", 70);
  assertRoPremium(ob.complete.replace("{name}", "Alex").replace("{path}", "Disciplină").replace("{mode}", "discipline"), "onboarding complete");

  const greet = pickRomanianGreeting("ro");
  assert(greet && isNativeRomanianTone(greet), "greeting");

  const copy = getDailyProgramPresenceCopy("ro");
  assert(/Nu trebuie să repari tot în seara asta/i.test(copy.evening.lines.join(" ")), "evening native line");
  assert(/Mai puțin zgomot/i.test(copy.midday.fallbackMantra), "midday clarity line");

  const phases = ["morning", "midday", "evening"];
  const bodies = new Set();

  for (const phase of phases) {
    updateSession(uid, baseSession());
    const hour = phase === "morning" ? 7 : phase === "midday" ? 13 : 20;
    const body = buildDailyPhasePresence(phase, "ro", getSession(uid), uid, `ro_${phase}`, atHour(hour));
    assertRoPremium(body, `/ ${phase}`);
    bodies.add(body);
    const finalized = finalizeOutboundReply(body, "ro", getSession(uid), uid, {
      dateKey: `ro_${phase}`,
      quietPresence: true
    });
    assert(languageLockScore(finalized, "ro") >= 75, `${phase} lock score`);
    assert(!hasEnglishLeak(finalized) || languageLockScore(finalized, "ro") >= 85, `${phase} EN leak`);
  }
  assert(bodies.size >= 2, "daily phases vary");

  /* Overload */
  updateSession(uid, baseSession({ nervousSystemState: "overloaded", energyState: "exhausted" }));
  const ovMantra = pickNativeMantra("ro", "midday", "overloaded", "midday");
  if (ovMantra?.text) assertRoPremium(ovMantra.text, "overload mantra");
  const ovLine = pickRomanianLine("overload", "ov_test");
  assert(/cercuri|respirație|sistem|direcție/i.test(ovLine), "overload pool native");
  assertRoPremium(
    buildDailyPhasePresence("midday", "ro", getSession(uid), uid, "ro_ov", atHour(13)),
    "overload midday"
  );

  /* Recovery */
  updateSession(uid, baseSession({ activeMode: "recovery", energyState: "low" }));
  const rec = pickNativeMantra("ro", "evening", "recovery", "evening");
  if (rec?.text) assertRoPremium(rec.text, "recovery mantra");
  assertRoPremium(
    buildDailyPhasePresence("evening", "ro", getSession(uid), uid, "ro_rec", atHour(21)),
    "recovery evening"
  );

  /* Warrior */
  updateSession(uid, baseSession({ activeMode: "warrior", energyState: "high", disciplineState: "locked_in" }));
  const war = pickNativeMantra("ro", "morning", "warrior", "morning");
  assert(war?.text, "warrior mantra exists");
  assertRoPremium(war.text, "warrior morning");
  assert(/focus|bandă|execuție|muchie|forță|antrenează|obiectiv/i.test(war.text), "warrior tone");

  /* Trading */
  updateSession(uid, baseSession({ activeMode: "trading" }));
  const trade = pickRomanianLine("tradingPsychology", "trade");
  assertRoPremium(trade, "trading psychology");

  console.log("romanian-quality-smoke: OK");
  console.log(`  pools: ${JSON.stringify(stats)}`);
}

try {
  run();
} catch (e) {
  console.error("romanian-quality-smoke: FAIL", e.message);
  process.exit(1);
}
