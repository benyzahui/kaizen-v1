/**
 * Expanded mantras + micro protocol smoke — 5 days, energy states, anti-repeat.
 * Run: node scripts/micro-protocol-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { totalExpandedCount } = require("../src/mantras/expandedPools");
const { pickExpandedMantra } = require("../src/mantras/expandedMantraEngine");
const { pickAdaptiveMantra } = require("../src/atmosphere/atmosphereEngine");
const {
  selectMicroProtocol,
  formatMicroProtocol,
  maybeMicroTouch,
  HYPE_RE
} = require("../src/protocols/adaptiveProtocolSelector");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { MICRO_PROTOCOLS } = require("../src/protocols/microProtocols");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const ENERGY_STATES = ["exhausted", "low", "stable", "high"];
const PHASES = ["morning", "midday", "evening"];
const LANGS = ["en", "hu", "ro"];

function atLocalHour(hour, dayIndex = 0, offsetMin = 60) {
  const utcH = ((hour - Math.floor(offsetMin / 60)) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 6, 1 + dayIndex, utcH, 0, 0));
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    activeMode: "discipline",
    energyState: "stable",
    nervousSystemState: "calm",
    companionHourOffset: 60,
    recentMantraIds: [],
    recentMicroProtocolIds: [],
    recentTouchIds: [],
    ...overrides
  };
}

function assertPremium(text, label) {
  assert(text && text.length > 8, `${label}: empty`);
  assert(text.length < 900, `${label}: spam length ${text.length}`);
  assert(!HYPE_RE.test(text), `${label}: cringe`);
}

function run() {
  assert(totalExpandedCount() >= 100, `expanded pool >= 100 (${totalExpandedCount()})`);
  assert(MICRO_PROTOCOLS.length >= 15, "micro protocols defined");

  for (const lang of LANGS) {
    const protos = MICRO_PROTOCOLS.filter((p) => p.language === lang);
    assert(protos.length >= 5, `${lang} micro protocols`);
    for (const p of protos) {
      assert(p.actions.length >= 1 && p.actions.length <= 4, `${p.id} action count`);
    }
  }

  const uid = `smoke_micro_${Date.now()}`;
  clearSession(uid);

  const mantraIds = new Set();
  const microIds = new Set();
  const openers = new Set();

  for (let d = 0; d < 5; d++) {
    const dk = `2026-07-0${d + 1}`;

    for (const energy of ENERGY_STATES) {
      updateSession(uid, baseSession({ energyState: energy }));
      const session = getSession(uid);

      for (const phase of PHASES) {
        const hour = phase === "morning" ? 6 : phase === "midday" ? 12 : 21;
        const now = atLocalHour(hour, d);

        const mantra = pickExpandedMantra(phase, "hu", session, uid, `${dk}_${energy}`, {
          energyState: energy,
          nervousSystemState: session.nervousSystemState,
          activeMode: session.activeMode,
          atmosphere: energy === "high" ? "warrior" : energy === "exhausted" ? "recovery" : "calm"
        });
        assert(mantra.id?.startsWith("exp_"), `expanded id ${mantra.id}`);
        mantraIds.add(mantra.id);

        const micro = selectMicroProtocol(phase, "hu", session, uid, `${dk}_${phase}_${energy}`, now);
        assert(micro, `micro ${phase} ${energy} day${d}`);
        microIds.add(micro.id);
        const formatted = formatMicroProtocol(micro);
        assertPremium(formatted, `micro fmt ${micro.id}`);
        assert(/-|víz|légzés|perc|sáv|fény|ecran/i.test(formatted), `practical ${micro.id}`);
      }
    }

    updateSession(uid, baseSession({ energyState: "high", activeMode: "warrior" }));
    const warMicro = selectMicroProtocol(
      "morning",
      "hu",
      getSession(uid),
      uid,
      `war_${d}`,
      atLocalHour(6, d)
    );
    assert(
      warMicro.category === "warrior" ||
        warMicro.intensity === "high" ||
        (warMicro.modes && warMicro.modes.includes("warrior")),
      `warrior micro d${d}: ${warMicro?.id}`
    );

    const presence = buildDailyPhasePresence(
      "morning",
      "hu",
      getSession(uid),
      uid,
      dk,
      atLocalHour(6, d)
    );
    assertPremium(presence, `presence d${d}`);
    assert(/Dragon Blueprint|Mantra:/i.test(presence), "program + mantra");
    assert(/Mini Reset|Focus Lock|Mozgás|🌊|⚔|🔥/i.test(presence), "micro protocol in presence");
    openers.add(presence.split("\n")[0]);
  }

  assert(mantraIds.size >= 12, `mantra variety (${mantraIds.size})`);
  assert(microIds.size >= 5, `micro variety (${microIds.size})`);

  /* HU lock */
  const huBlock = buildDailyPhasePresence(
    "evening",
    "hu",
    baseSession({ energyState: "low" }),
    uid,
    "2026-07-99",
    atLocalHour(21)
  );
  assert(!/\b(the |your morning|Purpose:)\b/i.test(huBlock), "HU evening no EN");
  assert(/Esti|elenged|Mantra:/i.test(huBlock), "HU evening native");

  /* RO natural */
  const roBlock = buildDailyPhasePresence(
    "midday",
    "ro",
    baseSession({ lang: "ro", preferredLanguage: "ro" }),
    "ro_uid",
    "2026-07-10",
    atLocalHour(12)
  );
  assert(/prânz|Revenire|Mantra:|apă/i.test(roBlock), "RO midday");
  assert(!/\b(Beginner:|the |your morning)\b/i.test(roBlock), "RO no EN");

  const touch = maybeMicroTouch("hu", baseSession(), uid, "touch_test", 1);
  assert(touch && /vizet|lélegzés|kör|lépés|húzni/i.test(touch), "HU micro touch");

  console.log("✓ micro-protocol-smoke passed");
  console.log(`  Expanded mantras: ${totalExpandedCount()}`);
  console.log(`  Unique mantra IDs (5d): ${mantraIds.size}, micro: ${microIds.size}`);
}

try {
  run();
} catch (e) {
  console.error(e);
  process.exit(1);
}
