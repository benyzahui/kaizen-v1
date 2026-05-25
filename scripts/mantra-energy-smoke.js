/**
 * Mantra + Energy engine smoke — 10 days, modes, languages.
 * Run: node scripts/mantra-energy-smoke.js
 */

const { poolSize, pickMantraForSlot } = require("../src/mantra/mantraEngine");
const { energyOfTheDay, sanitizeEnergyCopy } = require("../src/energy/energyEngine");
const { getLockedLang } = require("../src/i18n/lockedLanguage");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { buildMorningBlueprint } = require("../src/rhythm/morningBuilder");
const { handleEnergy } = require("../src/handlers/energyHandler");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const MODES = ["stabilization", "discipline", "warrior", "recovery", "trading", "energy"];
const LANGS = ["en", "hu", "ro"];

async function run() {
  for (const lang of LANGS) {
    assert(poolSize("morning", lang) >= 30, `${lang} morning pool >= 30`);
    assert(poolSize("midday", lang) >= 30, `${lang} midday pool >= 30`);
    assert(poolSize("evening", lang) >= 30, `${lang} evening pool >= 30`);
  }

  const mantras = new Set();
  let session = {
    onboardingCompleted: true,
    preferredLanguage: "en",
    lang: "en",
    activeMode: "discipline",
    energyState: "stable",
    recentCoachSnippets: [],
    recentMantras: []
  };

  for (let d = 1; d <= 10; d++) {
    const dk = `2026-06-${String(d).padStart(2, "0")}`;
    const m = pickMantraForSlot("morning", "en", session, "u10", dk, {
      lang: "en",
      energyState: session.energyState,
      activeMode: session.activeMode,
      disciplineState: "focused",
      nervousSystemState: "calm"
    });
    mantras.add(m);
    session.recentCoachSnippets = [...(session.recentCoachSnippets || []), m.slice(0, 48)];
  }
  assert(mantras.size >= 7, `10-day mantra variety (${mantras.size})`);

  const exhausted = pickMantraForSlot(
    "evening",
    "en",
    {},
    "ex",
    "2026-06-11",
    { lang: "en", energyState: "exhausted", activeMode: "recovery", disciplineState: "focused", nervousSystemState: "calm" }
  );
  assert(/rest|recovery|guilt|sleep|enough|lower/i.test(exhausted), "exhausted evening mantra");

  const warrior = pickMantraForSlot(
    "midday",
    "en",
    {},
    "war",
    "2026-06-12",
    { lang: "en", energyState: "high", activeMode: "warrior", disciplineState: "locked_in", nervousSystemState: "calm" }
  );
  assert(
    /lane|task|disciplin|execut|focus|edge|standard|midday|continue|push|regulate|sáv|bandă/i.test(
      warrior
    ),
    `warrior midday mantra: ${warrior}`
  );

  const energyEn = energyOfTheDay(
    { activeMode: "discipline", energyState: "stable", disciplineState: "focused" },
    "en",
    "2026-06-01",
    "e1"
  );
  assert(energyEn.split(/\n/).length >= 4, "energy read has 5 sections");
  assert(!/horoscope|zodiac|manifest|universe wants/i.test(energyEn), "no mystical spam");
  assert(!/predict|guarantee|will happen/i.test(energyEn), "no prediction tone");

  const energyHu = energyOfTheDay(
    { preferredLanguage: "hu", lang: "hu", activeMode: "stabilization" },
    "hu",
    "2026-06-02",
    "e2"
  );
  assert(/nap|figyel|ideg|fegyelem|felépül|szimbolikus|pihenés/i.test(energyHu), "HU energy localized");
  assert(!/\b(the |your morning)\b/i.test(energyHu), "HU energy no EN leak");

  const energyRo = energyOfTheDay(
    { preferredLanguage: "ro", lang: "ro", activeMode: "trading" },
    "ro",
    "2026-06-03",
    "e3"
  );
  assert(/azi|atenție|disciplin|recuperare/i.test(energyRo), "RO energy localized");

  const uid = "lang_lock_hu";
  clearSession(uid);
  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    activeMode: "discipline"
  });
  assert(getLockedLang(getSession(uid), null, "hello how are you") === "hu", "HU lock on EN text");

  let r = await processIncomingMessage({
    text: "random",
    from: { id: uid, language_code: "en" },
    chat: { id: uid }
  });
  assert(r.lang === "hu", "pipeline open chat stays HU");
  assert(!/\b(the |your |protect the first)\b/i.test(r.reply), "open reply HU locked");

  r = await handleEnergy({
    text: "/energy",
    from: { id: uid },
    chat: { id: uid }
  });
  assert(/ma|energi|figyelem|mező/i.test(r), "/energy HU");

  const huMorning = buildMorningBlueprint(getSession(uid), "hu", uid, "2026-06-05");
  assert(/védd|első|irány|mozg|mantra|egy/i.test(huMorning), "morning blueprint HU");

  for (const mode of MODES) {
    const e = energyOfTheDay(
      { activeMode: mode, energyState: mode === "warrior" ? "high" : "stable" },
      "en",
      `2026-06-${mode}`,
      mode
    );
    assert(e.length > 40 && sanitizeEnergyCopy(e) === e, `energy ok for ${mode}`);
  }

  console.log("✓ mantra-energy-smoke passed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
