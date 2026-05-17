/**
 * Phases 86–91 companion soul smoke.
 */
const { resolveRhythmMode, applyInternalRhythm } = require("../src/companion/internalRhythm");
const { resolveMirrorMode } = require("../src/companion/stateMirroring");
const { maybeCompanionWarmth } = require("../src/companion/companionWarmth");
const { maybePremiumClosing } = require("../src/companion/premiumClosing");
const { isDragonCringe, filterDragonPool } = require("../src/companion/dragonTone");
const { getResponses } = require("../src/i18n/getResponses");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function run() {
  const rhythm = resolveRhythmMode(
    { emotionalIntensity: 7, scatter: 2, energyLevel: 3, mentorMode: "recovery_mode" },
    { messages: [{}, {}], presenceMemory: { emotionalState: "overloaded" } },
    "kimerült vagyok",
    "emotional_reflection"
  );
  assert(["silent", "short", "slow", "breath"].includes(rhythm.mode), "exhausted rhythm");

  const shaped = applyInternalRhythm(
    "Line one.\nLine two.\nLine three.\nLine four.",
    rhythm,
    "hu",
    "t"
  );
  assert(
    shaped.split(/\n/).filter((l) => l.trim()).length <= 4,
    "rhythm caps lines"
  );

  assert(resolveMirrorMode({ scatter: 7 }, {}, "x", "focus_drift") === "stabilize", "chaos stabilize");

  let warm = null;
  for (let i = 0; i < 25 && !warm; i++) {
    warm = maybeCompanionWarmth(
      { emotionalIntensity: 3 },
      { onboardingCompleted: true, messages: [{}] },
      "hu",
      "natural_conversation",
      "Jó hogy ezt kimondtam."
    );
  }
  assert(warm && warm.length < 120, "warmth on said aloud");

  const r = getResponses("hu");
  const pool = filterDragonPool(r.dragonWhispers);
  assert(pool.every((p) => !isDragonCringe(p)), "dragon pool clean");

  const close = maybePremiumClosing(
    {
      state: { emotionalIntensity: 5 },
      session: { onboardingCompleted: true, messages: [{}, {}] },
      lang: "hu",
      lastUserText: "stressz"
    },
    "natural_conversation",
    "Ez sok nyomás.\nEgy lépés elég."
  );
  if (close) assert(/blokk|hegyet|tested/i.test(close), "premium closing HU");

  console.log("✓ companion-soul-smoke passed");
}

run();
