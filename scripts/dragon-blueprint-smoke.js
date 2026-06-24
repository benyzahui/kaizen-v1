/**
 * Dragon Blueprint Knowledge Core smoke — 7 scenarios + registry + language lock.
 * Run: node scripts/dragon-blueprint-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { getKnowledgeCoreStats, getKnowledgeById } = require("../src/knowledgeCore/knowledgeRegistry");
const {
  pickKnowledgeMantra,
  pickKnowledgeProtocol,
  pickKnowledgeReflection,
  pickKnowledgeChallenge,
  isPremiumKnowledgeText
} = require("../src/knowledgeCore/knowledgeSelector");
const {
  buildTodayCommand,
  buildReflectionCommand,
  buildChallengeCommand
} = require("../src/knowledgeCore/dragonBlueprintCommands");
const { getDragonBlueprintCompanionLine } = require("../src/knowledgeCore/dragonBlueprintCompanion");
const { pickAdaptiveMantra } = require("../src/atmosphere/atmosphereEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { finalizeOutboundReply, languageLockScore } = require("../src/i18n/hardLanguageLock");
const { HUSTLE_RE } = require("../src/lifeBalance/lifeBalanceEngine");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    companionHourOffset: 60,
    recentKnowledgeIds: [],
    recentMantraIds: [],
    recentMicroProtocolIds: [],
    messages: [],
    lastAt: Date.now(),
    ...overrides
  };
}

function atHour(h, day = 10) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, day, utcH, 0, 0));
}

const SCENARIOS = [
  {
    name: "beginner_low_morning",
    lang: "hu",
    session: { protocolLevel: "beginner", energyState: "low", dragonLevel: 1 },
    phase: "morning",
    hour: 7,
    expect: /víz|lélegzet|lépés|útra|Itt vagyok|irány|energia adat/i
  },
  {
    name: "intermediate_stable_midday",
    lang: "en",
    session: { protocolLevel: "intermediate", energyState: "stable", dragonLevel: 4 },
    phase: "midday",
    hour: 13,
    expect: /stabil|structure|attention|block|water/i
  },
  {
    name: "advanced_high_morning",
    lang: "en",
    session: {
      protocolLevel: "advanced",
      energyState: "high",
      disciplineState: "locked_in",
      dragonLevel: 6
    },
    phase: "morning",
    hour: 8,
    expect: /warrior|deep|protect|direction|path/i
  },
  {
    name: "overstimulated_evening",
    lang: "hu",
    session: { energyState: "overstimulated", nervousSystemState: "anxious" },
    phase: "evening",
    hour: 21,
    expect: /képernyő|légzés|engedd|holnap|pihen/i
  },
  {
    name: "exhausted_evening",
    lang: "hu",
    session: { energyState: "exhausted", activeMode: "recovery" },
    phase: "evening",
    hour: 21,
    expect: /pihen|regener|holnap|engedd|erő/i
  },
  {
    name: "hu_language_lock",
    lang: "hu",
    session: { preferredLanguage: "hu", lang: "hu" },
    phase: "morning",
    hour: 7,
    lock: "hu"
  },
  {
    name: "ro_language_lock",
    lang: "ro",
    session: { preferredLanguage: "ro", lang: "ro" },
    phase: "midday",
    hour: 13,
    lock: "ro"
  }
];

function runScenario(uid, sc) {
  clearSession(uid);
  updateSession(uid, baseSession({ ...sc.session, preferredLanguage: sc.lang, lang: sc.lang }));
  const now = atHour(sc.hour);
  const dk = `2026-12-${sc.name}`;

  const mantra = pickKnowledgeMantra(sc.phase, sc.lang, getSession(uid), uid, dk);
  assert(mantra?.text, `${sc.name}: mantra`);
  assert(isPremiumKnowledgeText(mantra.text), `${sc.name}: premium mantra`);
  assert(!HUSTLE_RE.test(mantra.text), `${sc.name}: hustle`);

  if (sc.expect) {
    assert(sc.expect.test(mantra.text), `${sc.name}: tone mismatch (${mantra.text})`);
  }

  const adaptive = pickAdaptiveMantra(sc.phase, sc.lang, getSession(uid), uid, dk, now);
  assert(adaptive?.text, `${sc.name}: adaptive mantra`);

  const proto = pickKnowledgeProtocol(sc.phase, sc.lang, getSession(uid), uid, dk, sc.session);
  if (sc.session.energyState === "low" || sc.session.energyState === "exhausted") {
    assert(proto?.actions?.length >= 2, `${sc.name}: low protocol`);
  }

  const body = buildDailyPhasePresence(sc.phase, sc.lang, getSession(uid), uid, dk, now);
  const finalized = finalizeOutboundReply(body, sc.lang, getSession(uid), uid, {
    dateKey: dk,
    phase: sc.phase,
    now
  });

  if (sc.lock) {
    assert(languageLockScore(finalized, sc.lock) >= 75, `${sc.name}: language lock`);
    assert(!/\b(the|you should|how can i help)\b/i.test(finalized) || sc.lock === "en", `${sc.name}: foreign leak`);
  }

  assert(finalized.length < 1100, `${sc.name}: spam`);
  assert(!/therapy|manifest|sigma|guru/i.test(finalized), `${sc.name}: cringe`);
}

function runSevenDayVariety(uid) {
  const mantras = new Set();
  for (let day = 0; day < 7; day++) {
    updateSession(uid, baseSession({ energyState: day % 2 ? "low" : "stable" }));
    for (const phase of ["morning", "midday", "evening"]) {
      const dk = `2026-12-${String(day + 1).padStart(2, "0")}`;
      const m = pickKnowledgeMantra(phase, "hu", getSession(uid), uid, `${dk}|${phase}`);
      if (m?.text) mantras.add(m.text);
    }
  }
  assert(mantras.size >= 6, `7d variety ${mantras.size}`);
}

function printSamples() {
  const samples = {
    en: getKnowledgeById("morning_001"),
    hu: getKnowledgeById("morning_002"),
    ro: getKnowledgeById("evening_001")
  };
  console.log("\n── Sample Knowledge Core entries ──");
  console.log(`  morning_001 EN: ${samples.en?.en}`);
  console.log(`  morning_002 HU: ${samples.hu?.hu}`);
  console.log(`  evening_001 RO: ${samples.ro?.ro}`);
  console.log(`  Companion HU: ${getDragonBlueprintCompanionLine("hu", "morning", "0", "today")}`);
}

function run() {
  const stats = getKnowledgeCoreStats();
  assert(stats.total >= 550, `registry total ${stats.total}`);
  assert(stats.byCategory.morning_mantra >= 100, `morning ${stats.byCategory.morning_mantra}`);
  assert(stats.byCategory.midday_mantra >= 100, `midday ${stats.byCategory.midday_mantra}`);
  assert(stats.byCategory.evening_mantra >= 100, `evening ${stats.byCategory.evening_mantra}`);
  assert(stats.byCategory.dragon_quote >= 100, `quotes ${stats.byCategory.dragon_quote}`);
  assert(stats.byCategory.low_energy_protocol >= 50, `low proto ${stats.byCategory.low_energy_protocol}`);
  assert(stats.byCategory.high_energy_protocol >= 50, `high proto ${stats.byCategory.high_energy_protocol}`);
  assert(stats.byCategory.reflection >= 50, `reflection ${stats.byCategory.reflection}`);
  assert(stats.byCategory.micro_challenge >= 50, `challenge ${stats.byCategory.micro_challenge}`);

  const base = `db_smoke_${Date.now()}`;
  for (let i = 0; i < SCENARIOS.length; i++) {
    runScenario(`${base}_${i}`, SCENARIOS[i]);
  }

  runSevenDayVariety(`${base}_7d`);

  clearSession(`${base}_cmd`);
  updateSession(`${base}_cmd`, baseSession());
  const today = buildTodayCommand(`${base}_cmd`, getSession(`${base}_cmd`), "hu");
  const reflection = buildReflectionCommand(`${base}_cmd`, getSession(`${base}_cmd`), "hu");
  const challenge = buildChallengeCommand(`${base}_cmd`, getSession(`${base}_cmd`), "hu");
  assert(/Dragon Blueprint|Ma|Mantra/i.test(today), "today cmd");
  assert(reflection.length > 10, "reflection cmd");
  assert(challenge.length > 5, "challenge cmd");

  printSamples();

  console.log("\ndragon-blueprint-smoke: OK");
  console.log(JSON.stringify(stats, null, 2));
}

run();
