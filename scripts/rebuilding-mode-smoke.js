/**
 * Rebuilding mode smoke — injury, burnout, comeback, calm strength.
 * Run: node scripts/rebuilding-mode-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const {
  evaluateRebuildingTriggers,
  syncRebuildingMode,
  isRebuildingModeActive,
  INJURY_RE,
  EXHAUSTION_RE
} = require("../src/rebuilding/rebuildingMode");
const {
  isPremiumRebuildingLine,
  maybeRebuildingAtmosphere,
  maybePhysicalAwareness,
  maybeComebackLine,
  selectRebuildingMicroProtocol,
  formatRebuildingProtocol,
  pickRebuildingBundle,
  tryRebuildingComeback,
  applyRebuildingFinalize,
  rebuildingPoolStats,
  TOXIC_POSITIVITY_RE,
  AGGRESSIVE_MASC_RE
} = require("../src/rebuilding/rebuildingEngine");
const { REBUILDING_ATMOSPHERE } = require("../src/rebuilding/rebuildingAtmosphere");
const { PHYSICAL_RECOVERY_AWARENESS } = require("../src/rebuilding/physicalRecoveryAwareness");
const { COMEBACK_LINES } = require("../src/rebuilding/comebackLines");
const { MINI_RECOVERY_PROTOCOLS } = require("../src/rebuilding/miniRecoveryProtocols");
const { GUILT_RE, HYPE_RE } = require("../src/retention/retentionRhythmEngine");
const { VICTIM_RE, CULT_RE } = require("../src/community/originStoryAtmosphere");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { selectMicroProtocol, formatMicroProtocol } = require("../src/protocols/adaptiveProtocolSelector");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function auditLine(text, label) {
  assert(text && text.length >= 3, `${label}: empty`);
  assert(isPremiumRebuildingLine(text), `${label}: premium`);
  assert(!GUILT_RE.test(text), `${label}: guilt`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!VICTIM_RE.test(text), `${label}: victim`);
  assert(!CULT_RE.test(text), `${label}: cult`);
  assert(!TOXIC_POSITIVITY_RE.test(text), `${label}: toxic positivity`);
  assert(!AGGRESSIVE_MASC_RE.test(text), `${label}: aggressive`);
  assert(!/as an ai|language model/i.test(text), `${label}: AI claim`);
}

function auditPools() {
  const all = [
    ...REBUILDING_ATMOSPHERE,
    ...PHYSICAL_RECOVERY_AWARENESS,
    ...COMEBACK_LINES
  ];
  for (const e of all) auditLine(e.text, e.id);
  for (const p of MINI_RECOVERY_PROTOCOLS) {
    assert(p.title && p.actions?.length >= 2, `${p.id}: protocol shape`);
    assert(!/diagnos|prescri|orvos|medication/i.test(p.actions.join(" ")), `${p.id}: medical`);
  }
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    companionHourOffset: 60,
    dragonLevel: 2,
    activeMode: "discipline",
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "calm",
    rebuildingModeActive: false,
    rebuildingModeReasons: [],
    lowEnergyStreak: 0,
    recentRebuildingLineIds: [],
    recentMicroProtocolIds: [],
    messages: [],
    lastAt: Date.now(),
    ...overrides
  };
}

const SCENARIOS = [
  {
    name: "injury_recovery",
    session: {
      activePrimaryPath: "recovery",
      activeMode: "recovery",
      energyState: "low"
    },
    text: "térd sérülés után felépülök",
    phase: "morning",
    hour: 8
  },
  {
    name: "burnout",
    session: {
      energyState: "exhausted",
      nervousSystemState: "overloaded",
      lowEnergyStreak: 3,
      lowEnergyLastDateKey: "2026-12-01"
    },
    text: "burnout vagyok kimerült",
    phase: "evening",
    hour: 21
  },
  {
    name: "inactivity_return",
    session: { lastAt: Date.now() - 100 * 3600000, dailyStreak: 0 },
    text: "vissza",
    phase: "morning",
    hour: 7,
    greeting: true
  },
  {
    name: "low_energy_week",
    session: {
      energyState: "low",
      lowEnergyStreak: 2,
      lowEnergyLastDateKey: "2026-12-09"
    },
    text: "",
    phase: "midday",
    hour: 13
  },
  {
    name: "emotional_exhaustion",
    session: { nervousSystemState: "anxious", energyState: "exhausted" },
    text: "túlterhelt vagyok nem bírom",
    phase: "evening",
    hour: 20
  },
  {
    name: "slow_comeback",
    session: {
      disciplineState: "inconsistent",
      energyState: "low",
      activeMode: "stabilization"
    },
    text: "lassan jön vissza",
    phase: "midday",
    hour: 14
  }
];

function atHour(h) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, 15, utcH, 0, 0));
}

function runScenario(uid, sc) {
  clearSession(uid);
  updateSession(uid, baseSession(sc.session));
  let session = getSession(uid);
  const now = atHour(sc.hour);
  const dk = `2026-12-${sc.name}`;

  const reasons = evaluateRebuildingTriggers(session, sc.text, now);
  assert(reasons.length >= 1, `${sc.name}: no triggers (${reasons})`);

  const synced = syncRebuildingMode(session, sc.text, now, uid, dk);
  session = getSession(uid);
  assert(synced.active, `${sc.name}: rebuilding mode not active`);
  assert(isRebuildingModeActive(session), `${sc.name}: session flag`);

  const lines = new Set();
  for (let i = 0; i < 8; i++) {
    const s = getSession(uid);
    const ctx = synced;
    for (const fn of [
      () => maybeRebuildingAtmosphere("hu", s, uid, `${dk}|a${i}`, ctx, 0.98),
      () => maybePhysicalAwareness("hu", s, uid, `${dk}|p${i}`, 0.98),
      () => maybeComebackLine("hu", s, uid, `${dk}|c${i}`, 0.98)
    ]) {
      const l = fn();
      if (l) lines.add(l);
    }
  }

  const bundle = pickRebuildingBundle("hu", getSession(uid), uid, dk, sc.phase, now, sc.text);
  if (bundle) lines.add(bundle);

  const proto = selectRebuildingMicroProtocol(sc.phase, "hu", getSession(uid), uid, dk, now);
  if (proto) {
    const block = formatRebuildingProtocol(proto);
    auditLine(proto.title, `${sc.name}_proto`);
    assert(/Nervous|Body|Légzés|Reset|Return/i.test(proto.title), `${sc.name}: recovery proto`);
    lines.add(block.split("\n")[0]);
  }

  const micro = selectMicroProtocol(sc.phase, "hu", getSession(uid), uid, dk, now);
  if (isRebuildingModeActive(getSession(uid)) && micro) {
    assert(
      micro.category === "recovery" || /^rec_/.test(micro.id),
      `${sc.name}: expected recovery micro got ${micro.id}`
    );
  }

  assert(lines.size >= 2, `${sc.name}: variety ${lines.size}`);
  for (const line of lines) {
    if (line.length < 220) auditLine(line.split("\n")[0], sc.name);
  }

  if (sc.greeting) {
    const ret = tryRebuildingComeback(getSession(uid), "hu", uid, sc.text);
    assert(ret?.body, `${sc.name}: comeback handler`);
    auditLine(ret.body.split("\n")[0], `${sc.name}_return`);
    assert(!GUILT_RE.test(ret.body), `${sc.name}: comeback guilt`);
  }

  const body = buildDailyPhasePresence(sc.phase, "hu", getSession(uid), uid, dk, now);
  assert(body.length < 1000, `${sc.name}: spam ${body.length}`);

  const hasCalmStrength =
    /lassan|lépés|ritmus|vissza|épül|bíz|nem kell egyszerre/i.test(body) ||
    [...lines].some((l) => /lassan|lépés|ritmus|vissza|épül/i.test(l));
  assert(hasCalmStrength, `${sc.name}: missing calm strength tone`);
}

function run() {
  assert(INJURY_RE.test("térd sérülés"), "injury re");
  assert(EXHAUSTION_RE.test("burnout kimerült"), "exhaustion re");

  const stats = rebuildingPoolStats();
  assert(stats.atmosphere >= 18, `atmosphere ${stats.atmosphere}`);
  assert(stats.physicalAwareness >= 15, `physical ${stats.physicalAwareness}`);
  assert(stats.comeback >= 12, `comeback ${stats.comeback}`);
  assert(stats.miniProtocols >= 6, `protocols ${stats.miniProtocols}`);

  auditPools();

  const base = `rebuild_smoke_${Date.now()}`;
  for (let i = 0; i < SCENARIOS.length; i++) {
    runScenario(`${base}_${i}`, SCENARIOS[i]);
  }

  clearSession(`${base}_fin`);
  updateSession(`${base}_fin`, baseSession({ energyState: "exhausted", activeMode: "recovery" }));
  syncRebuildingMode(getSession(`${base}_fin`), "", atHour(21), `${base}_fin`, "2026-12-20");
  const out = applyRebuildingFinalize("Egy lépés ma.", "hu", getSession(`${base}_fin`), `${base}_fin`, {
    dateKey: "2026-12-20",
    phase: "evening",
    now: atHour(21),
    rebuildingChance: 0.99
  });
  if (out !== "Egy lépés ma.") {
    auditLine(out.split("\n").pop(), "finalize");
  }

  console.log("rebuilding-mode-smoke: OK");
  console.log(JSON.stringify(stats, null, 2));
}

run();
