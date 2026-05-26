/**
 * Content variety smoke — 14-day simulation, anti-repeat, premium tone.
 * Run: node scripts/content-variety-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { getCatalogStats } = require("../src/content/contentCatalog");
const { LEGACY_MICRO_PROTOCOLS } = require("../src/protocols/microProtocols");
const { LEGACY_AWARENESS_PROMPTS } = require("../src/challenges/awarenessPrompts");
const {
  selectMantra,
  selectMicroProtocol,
  selectAwareness,
  selectCategoryPrompt,
  maybeHumanMoment,
  isPremiumContent,
  HYPE_RE
} = require("../src/content/dailyContentEngine");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { isEveningSafeContent } = require("../src/content/eveningSafety");
const { languageLockScore } = require("../src/i18n/hardLanguageLock");

const PHASES = ["morning", "midday", "evening"];

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(day, overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    companionHourOffset: 60,
    activeMode: "discipline",
    energyState: day % 5 === 0 ? "exhausted" : day % 3 === 0 ? "high" : "stable",
    disciplineState: day % 4 === 0 ? "drifting" : "focused",
    nervousSystemState: day % 6 === 0 ? "overloaded" : "calm",
    activePrimaryPath: day % 7 === 0 ? "trading" : "discipline",
    recentMantraIds: [],
    recentMicroProtocolIds: [],
    recentAwarenessIds: [],
    recentHumanMomentIds: [],
    recentEmotionalTones: [],
    ...overrides
  };
}

function atDayPhase(day, phase) {
  const h = phase === "morning" ? 7 : phase === "midday" ? 13 : 21;
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, 1 + day, utcH, 0, 0));
}

function run() {
  const stats = getCatalogStats(LEGACY_MICRO_PROTOCOLS, LEGACY_AWARENESS_PROMPTS);
  assert(stats.mantras >= 150, `mantras ${stats.mantras}`);
  assert(stats.microProtocols >= 80, `micro ${stats.microProtocols}`);
  assert(stats.awarenessPrompts >= 60, `awareness ${stats.awarenessPrompts}`);
  assert(stats.stabilizationPrompts >= 40, `stab ${stats.stabilizationPrompts}`);
  assert(stats.disciplinePrompts >= 40, `disc ${stats.disciplinePrompts}`);
  assert(stats.recoveryPrompts >= 30, `rec ${stats.recoveryPrompts}`);
  assert(stats.tradingPrompts >= 30, `trade ${stats.tradingPrompts}`);

  const uid = `content_var_${Date.now()}`;
  clearSession(uid);

  const mantraTexts = new Set();
  const microTitles = new Set();
  const awarenessTexts = new Set();
  const dailyOpeners = new Set();
  const eveningBodies = [];
  const tones = new Set();

  for (let day = 0; day < 14; day++) {
    const dk = `2026-12-${String(day + 1).padStart(2, "0")}`;
    updateSession(uid, baseSession(day));
    let session = getSession(uid);

    for (const phase of PHASES) {
      const now = atDayPhase(day, phase);
      const ctx = {
        energyState: session.energyState,
        disciplineState: session.disciplineState,
        nervousSystemState: session.nervousSystemState,
        activeMode: session.activeMode,
        primaryPath: session.activePrimaryPath,
        atmosphere: phase === "evening" ? "recovery" : "calm"
      };

      const mantra = selectMantra("hu", ctx, session, uid, dk, phase);
      assert(mantra?.text && isPremiumContent(mantra.text), `mantra d${day} ${phase}`);
      assert(!HYPE_RE.test(mantra.text), `hype mantra d${day}`);
      mantraTexts.add(mantra.text);

      const micro = selectMicroProtocol("hu", ctx, session, uid, dk, phase);
      if (micro?.title) {
        assert(isPremiumContent(micro.title), `micro d${day} ${phase}`);
        microTitles.add(micro.title);
      }

      session = getSession(uid);
      const aw = selectAwareness("hu", ctx, session, uid, dk, phase);
      if (aw?.text) {
        assert(isPremiumContent(aw.text), `awareness d${day}`);
        awarenessTexts.add(aw.text);
      }

      const stab = selectCategoryPrompt("stabilization", "hu", ctx, session, uid, dk, phase);
      if (stab?.text) {
        tones.add(stab.emotionalTone || "grounded");
        assert(isPremiumContent(stab.text), `category prompt d${day}`);
      }
      if (mantra.emotionalTone) tones.add(mantra.emotionalTone);

      const body = buildDailyPhasePresence(phase, "hu", getSession(uid), uid, dk, now);
      assert(body.length < 950, `spam d${day} ${phase} (${body.length})`);
      assert(isPremiumContent(body.split("\n")[0]), `daily premium d${day} ${phase}`);
      dailyOpeners.add(body.split("\n").slice(0, 3).join("|"));

      if (phase === "evening") {
        eveningBodies.push(body);
        assert(
          /pihen|elég|elenged|seara|🌘|nem kell|nem trebuie|recovery/i.test(body),
          `evening safe d${day}`
        );
        assert(!/crush|grind|10x|beast|hustle/i.test(body), `evening not productive d${day}`);
      }

      const hm = maybeHumanMoment("hu", getSession(uid), uid, dk, phase, 1);
      if (hm) assert(isPremiumContent(hm), `human moment d${day}`);
    }
  }

  const mantraRate = mantraTexts.size / (14 * 3);
  const microRate = microTitles.size / (14 * 3);
  const awarenessRate = awarenessTexts.size / (14 * 3);

  assert(mantraRate >= 0.35, `mantra variety ${mantraTexts.size} (${mantraRate.toFixed(2)})`);
  assert(microRate >= 0.25, `micro variety ${microTitles.size} (${microRate.toFixed(2)})`);
  assert(awarenessRate >= 0.2, `awareness variety ${awarenessTexts.size}`);
  assert(dailyOpeners.size >= 10, `daily opener variety ${dailyOpeners.size}`);
  assert(tones.size >= 1, `emotional tone variety ${tones.size}`);

  /* Romanian pass */
  updateSession(uid, baseSession(0, { preferredLanguage: "ro", lang: "ro" }));
  const roBody = buildDailyPhasePresence(
    "evening",
    "ro",
    getSession(uid),
    uid,
    "ro_eve",
    atDayPhase(0, "evening")
  );
  assert(languageLockScore(roBody, "ro") >= 75, "RO language lock");

  console.log("content-variety-smoke: OK");
  console.log(`  14d unique mantras: ${mantraTexts.size}, micro titles: ${microTitles.size}`);
  console.log(`  awareness: ${awarenessTexts.size}, daily openers: ${dailyOpeners.size}`);
  console.log(`  catalog: ${JSON.stringify(stats)}`);
}

try {
  run();
} catch (e) {
  console.error("content-variety-smoke: FAIL", e.message);
  process.exit(1);
}
