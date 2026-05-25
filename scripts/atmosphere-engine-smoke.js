/**
 * Adaptive atmosphere + energy presence smoke.
 * Run: node scripts/atmosphere-engine-smoke.js
 */

const {
  resolveAtmosphereContext,
  resolveAtmosphereState,
  pickAdaptiveMantra,
  buildAtmosphericEnergyRead,
  eveningEnding
} = require("../src/atmosphere/atmosphereEngine");
const { resolveTimeAwareTone } = require("../src/atmosphere/timeAwareTone");
const { pickSymbolicLine, GURU_BLOCK } = require("../src/atmosphere/energyAtmosphereMap");
const { CRINGE_RE } = require("../src/atmosphere/emotionalPresencePool");
const { pickRomanianGreeting } = require("../src/atmosphere/nativeMantraPicker");
const { buildEveningBlueprint } = require("../src/rhythm/eveningBuilder");
const { buildMorningBlueprint } = require("../src/rhythm/morningBuilder");
const { energyOfTheDay } = require("../src/energy/energyEngine");
const { getTimeSlot } = require("../src/core/timeContext");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const GURU_SPIRIT =
  /\b(manifest your|universe wants|cosmic alignment|twin flame|5d|spirit guide|jósl|horoscope|predicție zilnică|astrolog)\b/i;

function assertPremium(text, label) {
  assert(text && text.length > 6, `${label}: empty`);
  assert(!GURU_SPIRIT.test(text), `${label}: guru/spirituality spam`);
  assert(!GURU_BLOCK.test(text), `${label}: guru block`);
  assert(!CRINGE_RE.test(text), `${label}: cringe pool`);
  assert(text.length < 1200, `${label}: wall of text`);
}

/** UTC instant → local hour with offset minutes (CET-style). */
function atLocalHour(hour, offsetMin = 60) {
  const utcH = ((hour - Math.floor(offsetMin / 60)) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 4, 25, utcH, 0, 0));
}

function sessionBase(overrides = {}) {
  return {
    onboardingCompleted: true,
    companionHourOffset: 60,
    preferredLanguage: "hu",
    lang: "hu",
    energyState: "stable",
    disciplineState: "focused",
    nervousSystemState: "calm",
    activeMode: "discipline",
    ...overrides
  };
}

function run() {
  const eveNow = atLocalHour(20);
  const mornNow = atLocalHour(8);
  const aftNow = atLocalHour(14);
  const nightNow = atLocalHour(23);

  // 1) Low energy evening (HU)
  const lowEve = sessionBase({
    energyState: "exhausted",
    activeMode: "recovery",
    preferredLanguage: "hu",
    lang: "hu"
  });
  const lowCtx = resolveAtmosphereContext(lowEve, "hu", eveNow);
  assert(
    lowCtx.atmosphere === "recovery" || lowCtx.atmosphere === "emotional",
    "low evening atmosphere"
  );
  assert(lowCtx.tone.pacing === "reflect" || lowCtx.tone.pacing === "slow", "evening pacing");
  const lowMantra = pickAdaptiveMantra("evening", "hu", lowEve, "u_low", "2026-05-25", eveNow);
  assertPremium(lowMantra.text, "low energy evening mantra");
  assert(
    /nem kell|elég|megjavítani|pihen|nyomás|adott fel/i.test(lowMantra.text),
    `HU hopeful evening: ${lowMantra.text}`
  );

  // 2) Overloaded afternoon
  const overload = sessionBase({
    nervousSystemState: "overloaded",
    energyState: "low",
    preferredLanguage: "hu",
    lang: "hu"
  });
  const aftCtx = resolveAtmosphereContext(overload, "hu", aftNow);
  assert(aftCtx.atmosphere === "overloaded", "overloaded afternoon");
  const symOverload = pickSymbolicLine("hu", "overloaded", "nervous", "u_ol", "2026-05-25");
  assertPremium(symOverload, "overloaded symbolic");
  assert(/zaj|tisztánlátás|nyitott|claritate|zgomot/i.test(symOverload), "overload clarity line");

  // 3) Warrior morning
  const warrior = sessionBase({
    energyState: "high",
    activeMode: "warrior",
    disciplineState: "locked_in",
    preferredLanguage: "hu",
    lang: "hu"
  });
  assert(resolveAtmosphereState(warrior, mornNow) === "warrior", "warrior morning state");
  const warMantra = pickAdaptiveMantra("morning", "hu", warrior, "u_war", "2026-05-26", mornNow);
  assertPremium(warMantra.text, "warrior morning mantra");
  assert(/fókuszt|figyelem|sáv|védd/i.test(warMantra.text), `warrior HU: ${warMantra.text}`);

  const warMorning = buildMorningBlueprint(warrior, "hu", "u_war", "2026-05-26");
  assertPremium(warMorning, "warrior morning blueprint");

  // 4) Lonely night — reflective / emotional, late tone
  const lonely = sessionBase({
    energyState: "low",
    nervousSystemState: "anxious",
    activeMode: "recovery",
    preferredLanguage: "hu",
    lang: "hu"
  });
  const nightCtx = resolveAtmosphereContext(lonely, "hu", nightNow);
  assert(
    nightCtx.atmosphere === "overloaded" || nightCtx.atmosphere === "recovery",
    "lonely night atmosphere"
  );
  assert(nightCtx.tone.timeSlot === "late_night", "late night slot");
  assert(nightCtx.tone.pacing === "slow", "slow late night");
  const nightRead = buildAtmosphericEnergyRead(lonely, "hu", "2026-05-27", "u_lon", nightNow);
  assertPremium(nightRead, "lonely night read");

  // 5) Romanian onboarding greeting
  const roGreet = pickRomanianGreeting("ro");
  assertPremium(roGreet, "RO greeting");
  assert(/bună|salut|ritm|pas/i.test(roGreet), `RO native greeting: ${roGreet}`);
  assert(!/\bhello\b|\bgood morning\b/i.test(roGreet), "RO greeting no EN leak");

  // 6) Romanian evening
  const roEve = sessionBase({
    preferredLanguage: "ro",
    lang: "ro",
    energyState: "exhausted",
    activeMode: "recovery"
  });
  const roMantra = pickAdaptiveMantra("evening", "ro", roEve, "u_ro", "2026-05-28", eveNow);
  assertPremium(roMantra.text, "RO evening mantra");
  assert(/diseară|renunțat|odihn|repari|mâine/i.test(roMantra.text), `RO evening: ${roMantra.text}`);

  const roClose = eveningEnding("ro", "recovery");
  assert(/Mâine reconstruim|odihnește-te/i.test(roClose), "RO evening ending");

  const roBlueprint = buildEveningBlueprint(roEve, "ro", "u_ro", "2026-05-28");
  assertPremium(roBlueprint, "RO evening blueprint");
  assert(/odihnește|Mâine|renunțat|diseară/i.test(roBlueprint), "RO blueprint evening feel");

  // 7) Symbolic energy outputs (RO nervous — no astrology spam)
  const roEnergy = energyOfTheDay(
    {
      preferredLanguage: "ro",
      lang: "ro",
      nervousSystemState: "overloaded",
      energyState: "low",
      activeMode: "stabilization"
    },
    "ro",
    "2026-05-29",
    "u_ro_e"
  );
  assertPremium(roEnergy, "RO symbolic energy");
  assert(/sistemul nervos|zgomot|claritate|azi|atenție/i.test(roEnergy), "RO energy localized");
  assert(!/\b(the |your morning|horoscope)\b/i.test(roEnergy), "RO energy no EN/astro");

  const huEnergy = energyOfTheDay(
    { preferredLanguage: "hu", lang: "hu", nervousSystemState: "overloaded" },
    "hu",
    "2026-05-30",
    "u_hu_e"
  );
  assertPremium(huEnergy, "HU symbolic energy");
  assert(!/\b(the |universe wants)\b/i.test(huEnergy), "HU no EN guru leak");

  // Time bands
  const s = sessionBase({ companionHourOffset: 60 });
  assert(getTimeSlot(s, mornNow) === "morning", "morning slot");
  assert(getTimeSlot(s, eveNow) === "evening", "evening slot");
  assert(getTimeSlot(s, nightNow) === "late_night", "late night slot");
  const lateTone = resolveTimeAwareTone(s, nightNow);
  assert(lateTone.maxLines <= 4, "late night shorter responses");

  console.log("✓ atmosphere-engine-smoke passed");
}

try {
  run();
} catch (e) {
  console.error(e);
  process.exit(1);
}
