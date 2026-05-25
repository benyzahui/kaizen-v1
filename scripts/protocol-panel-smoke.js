/**
 * Manual protocol panel + light presence smoke.
 * Run: node scripts/protocol-panel-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { routeCommandMessage } = require("../src/handlers/commands");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { handlePanelCommand } = require("../src/panel/protocolPanelEngine");
const { pickAdaptiveMantra } = require("../src/atmosphere/atmosphereEngine");
const { getTimeSlot } = require("../src/core/timeContext");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const GURU_RE =
  /\b(manifest your|universe wants|cosmic alignment|twin flame|spirit guide|jósl|horoscope)\b/i;

function assertShortPremium(text, label) {
  assert(text && text.length > 10, `${label}: empty`);
  assert(text.length < 700, `${label}: too long — light presence`);
  assert(!GURU_RE.test(text), `${label}: guru tone`);
}

async function cmd(uid, text, lang, fresh = false) {
  if (fresh) {
    updateSession(uid, { recentPanelFolders: [], lastPanelCommand: null });
  }
  return routeCommandMessage(
    { text, from: { id: uid }, chat: { id: uid } },
    getSession(uid)
  );
}

async function open(uid, text, lang) {
  updateSession(uid, { preferredLanguage: lang, lang, onboardingCompleted: true });
  const r = await processIncomingMessage({
    text,
    from: { id: uid, language_code: lang },
    chat: { id: uid }
  });
  return r;
}

async function run() {
  const hu = `smoke_panel_hu_${Date.now()}`;
  const ro = `smoke_panel_ro_${Date.now()}`;

  clearSession(hu);
  clearSession(ro);
  updateSession(hu, { onboardingCompleted: true, preferredLanguage: "hu", lang: "hu" });
  updateSession(ro, { onboardingCompleted: true, preferredLanguage: "ro", lang: "ro" });

  const panelHu = await cmd(hu, "/panel", "hu");
  assertShortPremium(panelHu, "panel HU");
  assert(/panel|mappa|Fegyelem|Stabilizálás|\/discipline/i.test(panelHu), "panel lists folders HU");
  assert(!/\b(the |your morning|Commands:)\b/i.test(panelHu), "panel HU no EN");

  const discHu = await cmd(hu, "/discipline", "hu", true);
  assertShortPremium(discHu, "discipline HU");
  assert(/Fegyelem|Cél|Kezdő|Ma/i.test(discHu), "discipline structure HU");
  assert(/25 perc|feladat/i.test(discHu), "discipline beginner HU");

  const stabHu = await cmd(hu, "/stabilization", "hu", true);
  assert(/Stabilizálás|Idegrendszer/i.test(stabHu), "stabilization HU");

  const trainHu = await cmd(hu, "/training", "hu", true);
  assert(/Edzés|mozgás/i.test(trainHu), "training HU");

  const letHu = await cmd(hu, "/lettinggo", "hu", true);
  assert(/Elengedés|elenged|nyitott|lista|Ma/i.test(letHu), "lettinggo HU");

  const energyHu = await cmd(hu, "/energy", "hu", true);
  assert(/Energia|mező|szimbolikus/i.test(energyHu), "energy folder HU");

  const panelRo = await cmd(ro, "/panel", "ro");
  assertShortPremium(panelRo, "panel RO");
  assert(/panou|Disciplină|Stabilizare|\/discipline/i.test(panelRo), "panel RO native");
  assert(!/\b(the |Purpose:|Beginner:)\b/i.test(panelRo), "panel RO no EN labels");

  const discRo = await cmd(ro, "/discipline", "ro");
  assert(/Disciplină|Scop|Începător|Azi/i.test(discRo), "discipline RO native labels");

  const eveRo = await cmd(ro, "/lettinggo", "ro");
  assert(/Eliberare|bucle/i.test(eveRo), "lettinggo RO");

  // Fast folder switching → surf guard
  const surf = `smoke_surf_${Date.now()}`;
  clearSession(surf);
  updateSession(surf, { onboardingCompleted: true, preferredLanguage: "hu", lang: "hu" });
  await cmd(surf, "/discipline", "hu");
  await cmd(surf, "/stabilization", "hu");
  await cmd(surf, "/training", "hu");
  const fourth = await cmd(surf, "/recovery", "hu");
  assert(/Túl sok sáv|egy protokoll/i.test(fourth), `surf guard: ${fourth}`);

  // Hungarian lock open chat
  const scatter = await open(hu, "Ma szétesek", "hu");
  assertShortPremium(scatter.reply, "scatter HU");
  assert(/stabilizálás|\/stabilization/i.test(scatter.reply), "scatter → stabilization");
  assert(scatter.lang === "hu", "HU lock");
  assert(!/\b(the |I understand how you feel)\b/i.test(scatter.reply), "scatter no EN therapist");

  // Romanian lock
  const roOpen = await open(ro, "Sunt epuizat", "ro");
  assert(roOpen.lang === "ro", "RO lock");
  assertShortPremium(roOpen.reply, "RO open");
  assert(/recuperare|\/recovery|epuizat/i.test(roOpen.reply), "RO recovery redirect");

  // Evening mantra (letting go tone)
  const eveSession = {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    energyState: "exhausted",
    activeMode: "recovery",
    companionHourOffset: 60
  };
  const eveNow = new Date(Date.UTC(2026, 4, 25, 17, 0, 0));
  const mantra = pickAdaptiveMantra("evening", "hu", eveSession, "m_eve", "2026-05-25", eveNow);
  assertShortPremium(mantra.text, "evening mantra");
  assert(
    /nem kell|elég|megjavítani|pihen|elenged/i.test(mantra.text),
    `evening letting-go HU: ${mantra.text}`
  );
  assert(getTimeSlot(eveSession, eveNow) === "evening", "evening slot");

  // Direct handler sanity
  const direct = handlePanelCommand("/breath", "en", {}, "x");
  assert(/Breath|Purpose|Today/i.test(direct), "EN breath folder");

  console.log("✓ protocol-panel-smoke passed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
