/**
 * Mini challenge + awareness smoke — timing, adaptation, anti-spam.
 * Run: node scripts/challenge-awareness-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { MINI_CHALLENGES, CATEGORIES } = require("../src/challenges/miniChallenges");
const { AWARENESS_PROMPTS } = require("../src/challenges/awarenessPrompts");
const {
  selectMiniChallenge,
  selectAwarenessPrompt,
  recordChallengeUse,
  recordAwarenessUse,
  maybeLightActivation,
  resolveAwarenessContext,
  isOnCooldown,
  HYPE_RE,
  CHALLENGE_COOLDOWN_MS,
  MAX_CHALLENGES_PER_DAY
} = require("../src/challenges/challengeSelector");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");

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
    nervousSystemState: "calm",
    disciplineState: "focused",
    companionHourOffset: 60,
    recentChallengeIds: [],
    recentAwarenessIds: [],
    ...overrides
  };
}

function atHour(h, day = 0) {
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 7, 1 + day, utcH, 0, 0));
}

function assertPremium(text, label) {
  assert(text && text.length > 5, `${label}: empty`);
  assert(text.length < 950, `${label}: spam (${text.length})`);
  assert(!HYPE_RE.test(text), `${label}: cringe`);
}

function run() {
  assert(CATEGORIES.length >= 8, "challenge categories");
  assert(MINI_CHALLENGES.length >= 20, "mini challenges pool");
  assert(AWARENESS_PROMPTS.length >= 15, "awareness prompts");

  for (const c of MINI_CHALLENGES) {
    assert(c.id && c.category && c.language && c.text, `challenge ${c.id}`);
    assert(!HYPE_RE.test(c.text), `hype in ${c.id}`);
  }

  const uid = `smoke_ch_${Date.now()}`;
  clearSession(uid);

  /* Exhausted → no hard challenge */
  updateSession(uid, baseSession({ energyState: "exhausted" }));
  const exhaustedCh = selectMiniChallenge(
    "morning",
    "hu",
    getSession(uid),
    uid,
    "ex_test",
    atHour(6)
  );
  if (exhaustedCh) {
    assert(exhaustedCh.intensity === "low", `exhausted low only: ${exhaustedCh.id}`);
    assert(
      !/25 perc telefon|egy sáv — 25/i.test(exhaustedCh.text),
      "no hard challenge when exhausted"
    );
  }

  /* Stable → discipline allowed */
  updateSession(uid, baseSession({ energyState: "stable", recentChallengeIds: [] }));
  let gotDiscipline = false;
  for (let i = 0; i < 12; i++) {
    const ch = selectMiniChallenge("midday", "hu", getSession(uid), uid, `stable_${i}`, atHour(12));
    if (ch && (ch.category === "discipline" || ch.category === "focus")) {
      gotDiscipline = true;
      break;
    }
  }
  assert(gotDiscipline, "stable allows stronger discipline/focus challenge");

  /* Trading awareness */
  updateSession(uid, baseSession({ activeMode: "trading", energyState: "stable" }));
  const tradeAw = selectAwarenessPrompt(
    "midday",
    "hu",
    getSession(uid),
    uid,
    "trade_ctx",
    "trading",
    atHour(12)
  );
  assert(tradeAw, "trading awareness");
  assert(/Nyugodt|setup|impulse|tested feszült/i.test(tradeAw.text), `trading prompt: ${tradeAw.text}`);

  /* HU examples present */
  const huPhone = MINI_CHALLENGES.find((c) => c.id === "ch_disc_phone_hu");
  assert(huPhone?.text.includes("25 perc telefon"), "HU phone challenge");
  const huSilence = MINI_CHALLENGES.find((c) => c.id === "ch_ns_silence_hu");
  assert(huSilence?.text.includes("csend"), "HU silence challenge");

  /* Cooldown / daily cap */
  updateSession(uid, baseSession());
  const ch1 = selectMiniChallenge("morning", "hu", getSession(uid), uid, "cap1", atHour(6));
  assert(ch1, "first challenge");
  recordChallengeUse(ch1, uid);
  updateSession(uid, {
    lastMiniChallengeAt: Date.now(),
    miniChallengesToday: { date: new Date().toISOString().slice(0, 10), count: MAX_CHALLENGES_PER_DAY }
  });
  assert(isOnCooldown(getSession(uid), "challenge"), "cooldown after daily cap");

  /* 5-day presence — low spam, variety */
  const challengeIds = new Set();
  const awarenessSnippets = new Set();
  let presenceCount = 0;

  for (let d = 0; d < 5; d++) {
    updateSession(uid, baseSession({
      recentChallengeIds: [],
      recentAwarenessIds: [],
      lastMiniChallengeAt: null,
      lastAwarenessPromptAt: null,
      miniChallengesToday: null,
      energyState: d % 2 === 0 ? "stable" : "low"
    }));

    for (const phase of ["morning", "midday", "evening"]) {
      const hour = phase === "morning" ? 6 : phase === "midday" ? 12 : 21;
      const dk = `2026-08-0${d + 1}`;
      const block = buildDailyPhasePresence(
        phase,
        "hu",
        getSession(uid),
        uid,
        dk,
        atHour(hour, d)
      );
      presenceCount += 1;
      assertPremium(block, `presence d${d} ${phase}`);

      if (/25 perc|csend|liter vizet|képernyő nélkül|Mini Reset|Mantra:/i.test(block)) {
        challengeIds.add(block.slice(-80));
      }
      if (/tested vagy|fókuszod|pihentél|kontrollálni|Nyugodt|setup/i.test(block)) {
        awarenessSnippets.add(block.match(/[^\n]+\?/)?.[0] || block.slice(0, 40));
      }
    }
  }

  assert(presenceCount === 15, "5 days × 3 phases");

  /* Forced activation samples across seeds */
  let activations = 0;
  for (let i = 0; i < 40; i++) {
    updateSession(uid, baseSession({
      lastMiniChallengeAt: null,
      lastAwarenessPromptAt: null,
      miniChallengesToday: null,
      recentChallengeIds: [],
      recentAwarenessIds: []
    }));
    const act = maybeLightActivation({
      slot: "midday",
      lang: "hu",
      session: getSession(uid),
      userId: uid,
      dateKey: `seed_${i}`,
      contextKey: "default",
      challengeChance: 0.35,
      awarenessChance: 0.35,
      now: atHour(12)
    });
    if (act) activations += 1;
  }
  assert(activations >= 8 && activations <= 35, `activation rate not spam (${activations}/40)`);

  /* RO natural */
  const roAw = selectAwarenessPrompt(
    "evening",
    "ro",
    baseSession({ lang: "ro", preferredLanguage: "ro" }),
    "ro_u",
    "ro_eve",
    "default",
    atHour(21)
  );
  assert(roAw && /odihnit|odihnit|Chiar|Corpul/i.test(roAw.text), "RO awareness");
  assert(!/\b(the |your body tired)\b/i.test(roAw.text), "RO no EN");

  /* Context resolver */
  assert(resolveAwarenessContext(baseSession({ activeMode: "trading" })) === "trading");
  assert(
    resolveAwarenessContext(baseSession({ nervousSystemState: "overloaded" })) === "overloaded"
  );

  console.log("✓ challenge-awareness-smoke passed");
  console.log(`  Challenges: ${MINI_CHALLENGES.length}, prompts: ${AWARENESS_PROMPTS.length}`);
  console.log(`  Cooldown: ${CHALLENGE_COOLDOWN_MS / 3600000}h, max/day: ${MAX_CHALLENGES_PER_DAY}`);
}

try {
  run();
} catch (e) {
  console.error(e);
  process.exit(1);
}
