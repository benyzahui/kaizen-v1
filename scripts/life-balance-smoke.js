/**
 * Life balance smoke — real life pressure, calm discipline, no hustle.
 * Run: node scripts/life-balance-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const {
  resolveLifeContext,
  isPremiumLifeBalanceLine,
  maybeLifeAwareness,
  maybeFlexibleDiscipline,
  maybeBalanceReminder,
  pickLifeBalanceBundle,
  applyLifeBalanceFinalize,
  stripHustleLines,
  lifeBalancePoolStats,
  HUSTLE_RE
} = require("../src/lifeBalance/lifeBalanceEngine");
const { LIFE_AWARENESS_LINES } = require("../src/lifeBalance/lifeAwarenessLines");
const { FLEXIBLE_DISCIPLINE_LINES } = require("../src/lifeBalance/flexibleDisciplineLines");
const { LIFE_BALANCE_REMINDERS } = require("../src/lifeBalance/lifeBalanceReminders");
const {
  resolvePressureLevel,
  getMaxProtocolActions,
  shouldReducePressure,
  simplifyProtocolForPressure
} = require("../src/lifeBalance/pressureReduction");
const { GUILT_RE, HYPE_RE } = require("../src/retention/retentionRhythmEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { selectMicroProtocol, formatMicroProtocol } = require("../src/protocols/adaptiveProtocolSelector");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function auditLine(text, label) {
  assert(text && text.length >= 3, `${label}: empty`);
  assert(isPremiumLifeBalanceLine(text), `${label}: premium`);
  assert(!GUILT_RE.test(text), `${label}: guilt`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!HUSTLE_RE.test(text), `${label}: hustle`);
  assert(!/grindset|sigma|alpha male|no excuses/i.test(text), `${label}: toxic performance`);
}

function auditPools() {
  const all = [...LIFE_AWARENESS_LINES, ...FLEXIBLE_DISCIPLINE_LINES, ...LIFE_BALANCE_REMINDERS];
  assert(all.length >= 40, `pools ${all.length}`);
  for (const e of all) auditLine(e.text, e.id);
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
    recentLifeBalanceLineIds: [],
    recentMicroProtocolIds: [],
    messages: [],
    lastAt: Date.now(),
    ...overrides
  };
}

const SCENARIOS = [
  {
    name: "stressed_worker",
    session: { nervousSystemState: "overloaded" },
    text: "munka meeting határidő stress",
    phase: "midday",
    hour: 14
  },
  {
    name: "exhausted_student",
    session: { energyState: "exhausted" },
    text: "vizsga tanulás kimerült",
    phase: "evening",
    hour: 20
  },
  {
    name: "busy_entrepreneur",
    session: { energyState: "high", disciplineState: "focused" },
    text: "nincs idő busy packed schedule projekt",
    phase: "morning",
    hour: 8,
    recentCommands: ["a", "b", "c", "d", "e"]
  },
  {
    name: "recovery_day",
    session: { activeMode: "recovery", energyState: "low", rebuildingModeActive: true },
    text: "",
    phase: "midday",
    hour: 13
  },
  {
    name: "overloaded_evening",
    session: { energyState: "exhausted", nervousSystemState: "anxious" },
    text: "túlterhelt félek",
    phase: "evening",
    hour: 21
  }
];

function atHour(h) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, 18, utcH, 0, 0));
}

function runScenario(uid, sc) {
  clearSession(uid);
  updateSession(uid, baseSession(sc.session));
  const now = atHour(sc.hour);
  const dk = `2026-12-${sc.name}`;
  let session = getSession(uid);

  const ctx = resolveLifeContext(session, sc.text, now);
  assert(ctx.scenes.length >= 1, `${sc.name}: scenes`);
  assert(
    ctx.pressure !== "low" || ctx.reducePressure || sc.name === "busy_entrepreneur",
    `${sc.name}: expected pressure context`
  );

  const maxActions = getMaxProtocolActions(session, sc.text, now);
  if (sc.name === "overloaded_evening" || sc.name === "stressed_worker") {
    assert(maxActions <= 3, `${sc.name}: max actions ${maxActions}`);
  }

  const lines = new Set();
  for (let i = 0; i < 8; i++) {
    const s = getSession(uid);
    for (const fn of [
      () => maybeLifeAwareness("hu", s, uid, `${dk}|a${i}`, ctx, 0.98),
      () => maybeFlexibleDiscipline("hu", s, uid, `${dk}|f${i}`, ctx, 0.98),
      () => maybeBalanceReminder("hu", s, uid, `${dk}|b${i}`, ctx, 0.98)
    ]) {
      const l = fn();
      if (l) lines.add(l);
    }
  }

  const bundle = pickLifeBalanceBundle("hu", getSession(uid), uid, dk, sc.phase, now, sc.text);
  if (bundle) lines.add(bundle);

  assert(lines.size >= 2, `${sc.name}: variety ${lines.size}`);
  for (const line of lines) auditLine(line, sc.name);

  const proto = {
    id: "test_proto",
    title: "Test",
    actions: ["a", "b", "c", "d"]
  };
  const simplified = simplifyProtocolForPressure(proto, getSession(uid), sc.text, now);
  if (shouldReducePressure(getSession(uid), sc.text, now)) {
    assert(simplified.actions.length <= 3, `${sc.name}: protocol not reduced`);
  }

  const micro = selectMicroProtocol(sc.phase, "hu", getSession(uid), uid, dk, now);
  if (micro && shouldReducePressure(getSession(uid), sc.text, now)) {
    const formatted = formatMicroProtocol(micro, getSession(uid), sc.text);
    const bullets = formatted.split("\n").filter((l) => l.startsWith("-"));
    assert(bullets.length <= 3, `${sc.name}: too many protocol steps ${bullets.length}`);
  }

  const body = buildDailyPhasePresence(sc.phase, "hu", getSession(uid), uid, dk, now);
  assert(body.length < 1050, `${sc.name}: spam ${body.length}`);
  assert(!HUSTLE_RE.test(body), `${sc.name}: hustle in daily`);

  const hasRealism =
    /stabilit|ritmus|blokk|warrior|push|gép|zaj|nem kell|elég/i.test(body) ||
    [...lines].some((l) => /stabilit|ritmus|blokk|warrior/i.test(l));
  assert(hasRealism, `${sc.name}: missing real-life tone`);
}

function run() {
  const stats = lifeBalancePoolStats();
  assert(stats.awareness >= 15, `awareness ${stats.awareness}`);
  assert(stats.flexibleDiscipline >= 12, `flexible ${stats.flexibleDiscipline}`);
  assert(stats.reminders >= 12, `reminders ${stats.reminders}`);

  auditPools();

  const stripped = stripHustleLines("Ok.\nHustle harder today.\nMa stabil.");
  assert(!/hustle/i.test(stripped), "strip hustle");
  assert(/stabil/i.test(stripped), "keep calm line");

  const base = `life_bal_${Date.now()}`;
  for (let i = 0; i < SCENARIOS.length; i++) {
    runScenario(`${base}_${i}`, SCENARIOS[i]);
  }

  clearSession(`${base}_fin`);
  updateSession(`${base}_fin`, baseSession({ nervousSystemState: "overloaded", energyState: "exhausted" }));
  const out = applyLifeBalanceFinalize("Hustle grind.\nEgy blokk elég.", "hu", getSession(`${base}_fin`), `${base}_fin`, {
    dateKey: "2026-12-20",
    phase: "evening",
    now: atHour(21),
    lifeBalanceChance: 0.99
  });
  assert(!/hustle|grind/i.test(out), "finalize strips hustle");
  if (out.includes("\n")) {
    const last = out.split("\n").filter(Boolean).pop();
    if (last !== "Egy blokk elég." && !/hustle/i.test(last)) auditLine(last, "finalize_add");
  }

  console.log("life-balance-smoke: OK");
  console.log(JSON.stringify(stats, null, 2));
}

run();
