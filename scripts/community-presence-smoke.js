/**
 * Community + origin story smoke — earned tone, no cult/victim/hype.
 * Run: node scripts/community-presence-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const {
  isPremiumCommunityLine,
  resolveCommunityContext,
  maybeCommunityBelonging,
  maybeRebuildingLine,
  maybeRecoveryStrength,
  pickCommunityPresenceBundle,
  applyCommunityPresenceFinalize,
  communityPoolStats,
  VICTIM_RE,
  CULT_RE,
  MELODRAMA_RE,
  FAKE_INSPIRATION_RE,
  MOTIVATION_SPAM_RE
} = require("../src/community/originStoryAtmosphere");
const { BELONGING_LINES } = require("../src/community/belongingLines");
const { REBUILDING_LINES } = require("../src/community/rebuildingLines");
const { RECOVERY_STRENGTH_LINES } = require("../src/community/recoveryStrengthLines");
const { HYPE_RE, GUILT_RE } = require("../src/retention/retentionRhythmEngine");
const { POSSESSIVE_RE, DEPENDENCY_RE, FAKE_DEEP_RE, CRINGE_RE } = require("../src/presence/hopePresenceEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { finalizeOutboundReply } = require("../src/i18n/hardLanguageLock");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function auditLine(text, label) {
  assert(text && text.length >= 3, `${label}: empty`);
  assert(text.length <= 220, `${label}: too long`);
  assert(isPremiumCommunityLine(text), `${label}: premium gate`);
  assert(!GUILT_RE.test(text), `${label}: guilt`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!VICTIM_RE.test(text), `${label}: victim`);
  assert(!CULT_RE.test(text), `${label}: cult`);
  assert(!MELODRAMA_RE.test(text), `${label}: melodrama`);
  assert(!FAKE_INSPIRATION_RE.test(text), `${label}: fake inspiration`);
  assert(!MOTIVATION_SPAM_RE.test(text), `${label}: motivation spam`);
  assert(!POSSESSIVE_RE.test(text), `${label}: possessive`);
  assert(!DEPENDENCY_RE.test(text), `${label}: dependency`);
  assert(!FAKE_DEEP_RE.test(text), `${label}: fake deep`);
  assert(!CRINGE_RE.test(text), `${label}: cringe`);
  assert(!/as an ai|language model/i.test(text), `${label}: AI claim`);
  assert(!/discord|grindset|sigma/i.test(text), `${label}: hype discord`);
}

function auditPools() {
  const all = [...BELONGING_LINES, ...REBUILDING_LINES, ...RECOVERY_STRENGTH_LINES];
  assert(all.length >= 45, `pool size ${all.length}`);
  for (const e of all) auditLine(e.text, e.id);
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
    recentCommunityPresenceIds: [],
    messages: [{ text: "ok", ts: Date.now() - 60000 }],
    lastAt: Date.now(),
    ...overrides
  };
}

const SCENARIOS = [
  {
    name: "beginner",
    session: { dragonLevel: 1, messages: [{ text: "hi", ts: Date.now() }] },
    phase: "morning",
    hour: 8,
    expect: /közösség|indul|épül|MindsetAlchemy|út/i
  },
  {
    name: "injury_recovery",
    session: {
      activeMode: "recovery",
      activePrimaryPath: "recovery",
      nervousSystemState: "grounded",
      energyState: "low"
    },
    phase: "evening",
    hour: 20,
    expect: /test|bíz|épít|regener|ritmus|lépés/i
  },
  {
    name: "discipline_collapse",
    session: { disciplineState: "inconsistent" },
    phase: "midday",
    hour: 13,
    expect: /ritmus|fegyelem|káosz|lépés|irány/i
  },
  {
    name: "comeback",
    session: { lastAt: Date.now() - 96 * 3600000, dailyStreak: 0 },
    phase: "morning",
    hour: 7,
    expect: /indul|épül|ritmus|közösség|lépés/i
  },
  {
    name: "lonely_evening",
    session: {
      energyState: "exhausted",
      nervousSystemState: "anxious",
      messages: [
        { text: "stress", ts: Date.now() - 50000 },
        { text: "félek", ts: Date.now() - 20000 }
      ]
    },
    phase: "evening",
    hour: 22,
    expect: /egyszerre|pihen|ritmus|🌘|🫀/i
  },
  {
    name: "stabilization",
    session: {
      activePrimaryPath: "stabilization",
      activeMode: "stabilization",
      nervousSystemState: "grounded"
    },
    phase: "midday",
    hour: 14,
    expect: /stabil|ismétl|ritmus|lépés|test/i
  }
];

function atHour(h) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, 12, utcH, 0, 0));
}

function runScenario(uid, sc) {
  clearSession(uid);
  updateSession(uid, baseSession(sc.session));
  const session = getSession(uid);
  const now = atHour(sc.hour);
  const dk = `2026-12-${sc.name}`;
  const ctx = resolveCommunityContext(session, now, sc.phase);
  assert(ctx.scenes.length >= 1, `${sc.name}: no scenes`);

  const lines = new Set();
  for (let i = 0; i < 10; i++) {
    const s = getSession(uid);
    for (const fn of [
      () => maybeCommunityBelonging("hu", s, uid, `${dk}|b${i}`, ctx, 0.98),
      () => maybeRebuildingLine("hu", s, uid, `${dk}|r${i}`, ctx, 0.98),
      () => maybeRecoveryStrength("hu", s, uid, `${dk}|s${i}`, ctx, 0.98)
    ]) {
      const l = fn();
      if (l) lines.add(l);
    }
  }

  const bundle = pickCommunityPresenceBundle("hu", getSession(uid), uid, dk, sc.phase, now);
  if (bundle) lines.add(bundle);

  assert(lines.size >= 2, `${sc.name}: variety ${lines.size}`);
  const combined = [...lines].join("\n");
  assert(sc.expect.test(combined) || sc.expect.test(combined), `${sc.name}: theme mismatch`);

  for (const line of lines) {
    auditLine(line, sc.name);
    assert(!/áldozat|poor me|devastat|limitless|grindset/i.test(line), `${sc.name}: bad tone`);
  }

  const body = buildDailyPhasePresence(sc.phase, "hu", getSession(uid), uid, dk, now);
  assert(body.length < 980, `${sc.name}: spam ${body.length}`);

  const finalized = finalizeOutboundReply(body, "hu", getSession(uid), uid, {
    dateKey: dk,
    phase: sc.phase,
    now,
    communityChance: 0.55,
    hopeChance: 0.2
  });
  assert(finalized.length < 1150, `${sc.name}: finalize spam`);
  assert(!MOTIVATION_SPAM_RE.test(finalized), `${sc.name}: spam in finalize`);
}

function run() {
  const stats = communityPoolStats();
  assert(stats.belonging >= 15, `belonging ${stats.belonging}`);
  assert(stats.rebuilding >= 20, `rebuilding ${stats.rebuilding}`);
  assert(stats.recoveryStrength >= 18, `recovery ${stats.recoveryStrength}`);

  auditPools();

  const base = `community_smoke_${Date.now()}`;
  for (let i = 0; i < SCENARIOS.length; i++) {
    runScenario(`${base}_${i}`, SCENARIOS[i]);
  }

  clearSession(`${base}_fin`);
  updateSession(`${base}_fin`, baseSession({ activeMode: "recovery" }));
  const plain = "Ma egy lépés.\nRitmus.";
  const out = applyCommunityPresenceFinalize(plain, "hu", getSession(`${base}_fin`), `${base}_fin`, {
    dateKey: "2026-12-20",
    phase: "evening",
    now: atHour(21),
    communityChance: 0.99
  });
  if (out !== plain) {
    const added = out.replace(plain, "").trim();
    auditLine(added.split("\n").pop(), "finalize");
    assert(out.split(/\n/).filter(Boolean).length <= plain.split(/\n/).length + 4, "one block max");
  }

  console.log("community-presence-smoke: OK");
  console.log(JSON.stringify(stats, null, 2));
}

run();
