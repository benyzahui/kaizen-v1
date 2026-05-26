/**
 * Hope + presence smoke — hard day, comeback, lonely evening, no manipulation.
 * Run: node scripts/hope-presence-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const {
  isPremiumHopePresence,
  resolveHopeContext,
  maybePresenceOrSupport,
  maybeQuietHope,
  maybeHardDayResponse,
  maybeBelongingWhisper,
  pickHopePresenceBundle,
  applyHopePresenceFinalize,
  hopePresencePoolStats,
  POSSESSIVE_RE,
  DEPENDENCY_RE,
  FAKE_DEEP_RE,
  CRINGE_RE
} = require("../src/presence/hopePresenceEngine");
const { SUPPORT_PRESENCE_POOL } = require("../src/presence/supportPresencePool");
const { HOPE_LINES } = require("../src/presence/hopeLines");
const { HARD_DAY_RESPONSES } = require("../src/presence/hardDayResponses");
const { BELONGING_MESSAGES } = require("../src/presence/belongingMessages");
const { GUILT_RE, HYPE_RE } = require("../src/retention/retentionRhythmEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { finalizeOutboundReply } = require("../src/i18n/hardLanguageLock");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function auditLine(text, label) {
  assert(text && text.length >= 3, `${label}: empty`);
  assert(text.length <= 220, `${label}: too long (${text.length})`);
  assert(isPremiumHopePresence(text), `${label}: failed premium gate`);
  assert(!GUILT_RE.test(text), `${label}: guilt`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!POSSESSIVE_RE.test(text), `${label}: possessive`);
  assert(!DEPENDENCY_RE.test(text), `${label}: dependency`);
  assert(!FAKE_DEEP_RE.test(text), `${label}: fake deep`);
  assert(!CRINGE_RE.test(text), `${label}: cringe`);
  assert(!/best friend|legjobb barát/i.test(text), `${label}: attachment`);
}

function auditAllPools() {
  const all = [
    ...SUPPORT_PRESENCE_POOL,
    ...HOPE_LINES,
    ...HARD_DAY_RESPONSES,
    ...BELONGING_MESSAGES
  ];
  assert(all.length >= 50, `pool size ${all.length}`);
  for (const e of all) {
    auditLine(e.text, e.id);
  }
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
    recentHopePresenceIds: [],
    messages: [],
    lastAt: Date.now(),
    ...overrides
  };
}

const SCENARIOS = [
  {
    name: "hard_day",
    session: {
      energyState: "exhausted",
      disciplineState: "drifting",
      nervousSystemState: "overloaded"
    },
    phase: "evening",
    hour: 21
  },
  {
    name: "missed_streak",
    session: {
      dailyStreak: 0,
      lastAt: Date.now() - 72 * 3600000,
      messages: [{ text: "hi", ts: Date.now() - 80 * 3600000 }]
    },
    phase: "morning",
    hour: 8
  },
  {
    name: "lonely_evening",
    session: {
      energyState: "low",
      nervousSystemState: "anxious",
      messages: [
        { text: "stress", ts: Date.now() - 60000 },
        { text: "félek", ts: Date.now() - 30000 }
      ]
    },
    phase: "evening",
    hour: 22
  },
  {
    name: "overload",
    session: { nervousSystemState: "overloaded", energyState: "high" },
    phase: "midday",
    hour: 14
  },
  {
    name: "comeback",
    session: {
      lastAt: Date.now() - 96 * 3600000,
      dailyStreak: 0
    },
    phase: "morning",
    hour: 7
  },
  {
    name: "recovery",
    session: {
      activeMode: "recovery",
      energyState: "low",
      nervousSystemState: "grounded"
    },
    phase: "evening",
    hour: 20
  }
];

function atHour(h, day = 5) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, 1 + day, utcH, 0, 0));
}

function runScenario(uid, sc) {
  clearSession(uid);
  updateSession(uid, baseSession(sc.session));
  const session = getSession(uid);
  const now = atHour(sc.hour);
  const dk = "2026-12-10";
  const ctx = resolveHopeContext(session, now, sc.phase);

  assert(ctx.scenes.length >= 1, `${sc.name}: no scenes`);

  const lines = [];
  for (let i = 0; i < 8; i++) {
    const s = getSession(uid);
    const hard = maybeHardDayResponse("hu", s, uid, `${dk}|${i}`, ctx, 0.95);
    const sup = maybePresenceOrSupport("hu", s, uid, `${dk}|s${i}`, ctx, 0.95);
    const hope = maybeQuietHope("hu", s, uid, `${dk}|h${i}`, ctx, 0.95);
    const bel = maybeBelongingWhisper("hu", s, uid, `${dk}|b${i}`, sc.phase, 0.95);
    for (const l of [hard, sup, hope, bel]) {
      if (l) lines.push(l);
    }
  }

  const bundle = pickHopePresenceBundle("hu", getSession(uid), uid, dk, sc.phase, now);
  if (bundle) lines.push(bundle);

  const body = buildDailyPhasePresence(sc.phase, "hu", getSession(uid), uid, dk, now);
  assert(body.length < 950, `${sc.name}: daily spam (${body.length})`);
  assert(isPremiumHopePresence(body.split("\n")[0] || "x"), `${sc.name}: daily opener`);

  const finalized = finalizeOutboundReply(body, "hu", getSession(uid), uid, {
    dateKey: dk,
    phase: sc.phase,
    now,
    hopePresence: true,
    hopeChance: 0.5
  });
  assert(finalized.length < 1100, `${sc.name}: finalize spam`);

  const unique = new Set(lines.map((l) => l.trim()));
  assert(unique.size >= 2, `${sc.name}: variety (${unique.size})`);

  for (const line of unique) {
    auditLine(line, `${sc.name}`);
    assert(!/motivációs|speech|ted talk/i.test(line), `${sc.name}: speechy`);
  }

  if (sc.name === "hard_day" || sc.name === "lonely_evening") {
    const hasCalm =
      [...unique].some((l) => /pihen|elég|kör|stabil|🌘|🫀/.test(l)) ||
      /pihen|elég|🌘/.test(body);
    assert(hasCalm, `${sc.name}: missing calm/release tone`);
  }

  if (sc.name === "comeback" || sc.name === "missed_streak") {
    const hasWelcome = [...unique].some((l) => /vissza|ritmus|kör|épül/i);
    assert(hasWelcome || /vissza|ritmus/i.test(body), `${sc.name}: missing soft comeback`);
  }
}

function run() {
  const stats = hopePresencePoolStats();
  assert(stats.supportPresence >= 30, `support ${stats.supportPresence}`);
  assert(stats.hopeLines >= 20, `hope ${stats.hopeLines}`);
  assert(stats.hardDay >= 15, `hardDay ${stats.hardDay}`);
  assert(stats.belonging >= 15, `belonging ${stats.belonging}`);

  auditAllPools();

  const uidBase = `hope_smoke_${Date.now()}`;
  for (let i = 0; i < SCENARIOS.length; i++) {
    runScenario(`${uidBase}_${i}`, SCENARIOS[i]);
  }

  clearSession(`${uidBase}_fin`);
  updateSession(`${uidBase}_fin`, baseSession({ energyState: "exhausted" }));
  const plain = "Ma mantra.\nEgy lépés.";
  const out = applyHopePresenceFinalize(plain, "hu", getSession(`${uidBase}_fin`), `${uidBase}_fin`, {
    dateKey: "2026-12-11",
    phase: "evening",
    now: atHour(21),
    hopeChance: 0.99
  });
  if (out !== plain) {
    const added = out.replace(plain, "").trim();
    auditLine(added.split("\n").pop(), "finalize_add");
    assert(out.split(/\n/).filter(Boolean).length <= plain.split(/\n/).length + 4, "max one block");
  }

  console.log("hope-presence-smoke: OK");
  console.log(JSON.stringify(stats, null, 2));
}

run();
