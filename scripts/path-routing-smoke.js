/**
 * Path routing + daily flow smoke — all paths, phases, energy, overload, HU/RO.
 * Run: node scripts/path-routing-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { PATH_IDS } = require("../src/path/primaryPaths");
const {
  resolvePrimaryPathId,
  enrichRhythmContext,
  pickPathCue,
  setPrimaryPath,
  buildPathCommandReply
} = require("../src/path/dailyPathEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { pickAdaptiveMantra } = require("../src/atmosphere/atmosphereEngine");
const { selectMiniChallenge } = require("../src/challenges/challengeSelector");
const { HYPE_RE } = require("../src/program/dailyProgramPresence");

const PHASES = ["morning", "midday", "evening"];
const LANGS = ["hu", "ro"];

const GENERIC_RE =
  /\b(as an ai|language model|happy to help|how can i assist|let me know if you need)\b/i;

const PATH_MARKERS = {
  discipline: [/fókuszt|focus|végrehajt|execu/i, /⚔|disciplin/i],
  energy: [/energia|energy|légzés|respira|lassíts|szétesel|stimul|mozgás/i, /🌙|🫀/],
  stabilization: [/stabiliz|bazele|anchor|ancor/i, /🌊|🫀|🌘/],
  warrior: [/momentum|warrior|harcos|zgomot|noise/i, /🔥|⚔/],
  recovery: [/regener|recovery|recuper|push kell|no push|lassú|tempó|pihen|elenged/i, /🌊|🌘/],
  trading: [/trade|setup|impulse|revenge|📉/i]
};

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(pathId, overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    activePrimaryPath: pathId,
    userPrimaryPath: pathId,
    activeMode: pathId === "trading" ? "trading" : pathId,
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "calm",
    companionHourOffset: 60,
    recentMantraIds: [],
    recentChallengeIds: [],
    recentAwarenessIds: [],
    lastMiniChallengeAt: 0,
    lastAwarenessPromptAt: 0,
    ...overrides
  };
}

function assertPremium(text, label) {
  assert(text && text.length > 12, `${label}: empty`);
  assert(text.length < 900, `${label}: too long ${text.length}`);
  assert(!HYPE_RE.test(text), `${label}: hype`);
  assert(!GENERIC_RE.test(text), `${label}: generic assistant`);
}

function assertPathIdentity(text, pathId, label) {
  const markers = PATH_MARKERS[pathId];
  const hit = markers.some((re) => re.test(text));
  assert(hit, `${label}: missing path identity for ${pathId}`);
}

function atLocalHour(hour, dayIndex = 0) {
  return new Date(Date.UTC(2026, 6, 10 + dayIndex, hour - 1, 0, 0));
}

function run() {
  const uid = `path_smoke_${Date.now()}`;
  clearSession(uid);

  for (const pathId of PATH_IDS) {
    updateSession(uid, baseSession(pathId));
    const session = getSession(uid);
    assert(resolvePrimaryPathId(session) === pathId, `resolve path ${pathId}`);

    const ctx = enrichRhythmContext(session, "hu");
    assert(ctx.primaryPath === pathId, `ctx primaryPath ${pathId}`);
    assert(ctx.pathMantraTags?.length >= 1, `mantra tags ${pathId}`);

    if (pathId === "warrior") {
      updateSession(uid, { energyState: "exhausted" });
      const wCtx = enrichRhythmContext(getSession(uid), "hu");
      assert(wCtx.activeMode === "recovery", "warrior + low energy → recovery mode");
      updateSession(uid, baseSession(pathId));
    }

    if (pathId !== "trading") {
      updateSession(uid, { nervousSystemState: "overloaded" });
      const oCtx = enrichRhythmContext(getSession(uid), "hu");
      assert(
        oCtx.activeMode === "stabilization",
        `overload softens activeMode for ${pathId}`
      );
      updateSession(uid, baseSession(pathId));
    }
  }

  for (const lang of LANGS) {
    for (const pathId of PATH_IDS) {
      updateSession(uid, baseSession(pathId, { preferredLanguage: lang, lang }));
      const session = getSession(uid);
      const cues = new Set();

      for (const phase of PHASES) {
        const dk = `2026-path-${pathId}-${lang}-${phase}`;
        const cue = pickPathCue(pathId, phase, lang, uid, dk);
        assert(cue && cue.length > 4, `${lang}/${pathId}/${phase} cue`);
        cues.add(cue);

        const hour = phase === "morning" ? 8 : phase === "midday" ? 13 : 20;
        const now = atLocalHour(hour);
        const body = buildDailyPhasePresence(phase, lang, session, uid, dk, now);
        assertPremium(body, `${lang}/${pathId}/${phase} daily`);
        assertPathIdentity(`${cue}\n${body}`, pathId, `${lang}/${pathId}/${phase}`);

        const mantra = pickAdaptiveMantra(phase, lang, session, uid, dk, now);
        assert(mantra?.text, `${lang}/${pathId}/${phase} mantra`);
      }

      assert(cues.size >= 2, `${lang}/${pathId}: path cues vary across phases`);
    }
  }

  updateSession(uid, baseSession("discipline", { energyState: "low" }));
  const lowCh = selectMiniChallenge(
    "morning",
    "hu",
    getSession(uid),
    uid,
    "low_energy",
    atLocalHour(8)
  );
  if (lowCh) assert(lowCh.intensity === "low", "low energy challenge intensity");

  updateSession(uid, baseSession("trading", { nervousSystemState: "overloaded" }));
  const tradeCtx = enrichRhythmContext(getSession(uid), "ro");
  assert(tradeCtx.primaryPath === "trading", "trading path preserved under overload");

  const menu = buildPathCommandReply({ ...getSession(uid), userId: uid }, "hu", "/path");
  assert(/út|cale|path/i.test(menu), "/path menu HU");
  assert(!menu.includes("happy to help"), "/path not generic");

  const switched = buildPathCommandReply(
    { ...getSession(uid), userId: uid },
    "hu",
    "/path warrior"
  );
  assert(switched.includes("Harcos") || switched.includes("warrior"), "/path switch");
  assert(resolvePrimaryPathId(getSession(uid)) === "warrior", "session path after switch");

  const loops = new Set();
  for (let i = 0; i < 12; i++) {
    updateSession(uid, baseSession("energy"));
    const t = buildPathCommandReply({ ...getSession(uid), userId: uid }, "ro", "/path");
    loops.add(t.split("\n")[2] || t);
  }
  assert(loops.size <= 4, "path menu not infinite loop spam");

  console.log("path-routing-smoke: OK");
  console.log(`  paths: ${PATH_IDS.length}`);
  console.log(`  langs: ${LANGS.join(", ")}`);
  console.log(`  phases: ${PHASES.join(", ")}`);
}

try {
  run();
} catch (e) {
  console.error("path-routing-smoke: FAIL", e.message);
  process.exit(1);
}
