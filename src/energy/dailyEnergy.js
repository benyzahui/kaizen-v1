/**
 * Phase 2 — compact daily energy read.
 * Short, readable, screenshot-worthy. Symbolic data used lightly — no fortune telling.
 */

const { lines, pickSeeded } = require("../personality/tone");
const { getUniversalDayVibration } = require("./numerology");
const { getEnergyMaps } = require("../i18n/energyLocales");
const { pickVib, pickTrading, pickBody } = require("../i18n/dailyEnergyStrings");

function sectionLabels(lang) {
  if (lang === "hu") {
    return {
      title: "🌙 Mai energia",
      tone: "⚡ Fő hangulat",
      mental: "🧠 Mentális tér",
      body: "🫀 Test",
      work: "💼 Munka / trading",
      discipline: "🔥 Fegyelem",
      step: "🌱 Egy stabil lépés"
    };
  }
  if (lang === "ro") {
    return {
      title: "🌙 Energia zilei",
      tone: "⚡ Ton principal",
      mental: "🧠 Spațiu mental",
      body: "🫀 Corp",
      work: "💼 Muncă / trading",
      discipline: "🔥 Disciplina de azi",
      step: "🌱 Un pas stabil"
    };
  }
  return {
    title: "🌙 Today's energy",
    tone: "⚡ Main tone",
    mental: "🧠 Mental field",
    body: "🫀 Body",
    work: "💼 Work / trading",
    discipline: "🔥 Today's discipline",
    step: "🌱 One stable step"
  };
}

function disciplineLine(lang, vib, seed = "") {
  const maps = {
    en: [
      "One rule ships before a new plan.",
      "Repeat one thing you already know works.",
      "No heroics — one honest repetition."
    ],
    hu: [
      "Egy szabály, aztán ismétlés — új terv nélkül.",
      "Ismételd amit már tudsz hogy működik.",
      "Nincs hőség — egy őszinte ismétlés."
    ],
    ro: [
      "O regulă, apoi repetare — fără plan nou.",
      "Repetă ce știi deja că merge.",
      "Fără eroism — o repetare onestă."
    ]
  };
  const pool = maps[lang] || maps.en;
  return pickSeeded(pool, `${seed}:disc:${vib}`);
}

function stableStep(lang, action) {
  if (lang === "hu") return action || "Egy blokk. Huszonöt perc. Kész.";
  if (lang === "ro") return action || "Un bloc. Douăzeci și cinci de minute. Gata.";
  return action || "One block. Twenty-five minutes. Done.";
}

/**
 * @param {Date} [date]
 * @param {'en'|'hu'|'ro'} [lang]
 * @param {'general'|'trading'|'body'|'emotion'|'work'} [lens]
 */
function buildDailyEnergyMessage(
  date = new Date(),
  lang = "en",
  lens = "general",
  seed = ""
) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const vib = getUniversalDayVibration(date).vibration;
  const maps = getEnergyMaps(l);
  const core = pickVib(l, vib);
  const watch = maps.watch[vib] || maps.watch[7];
  const action = maps.action[vib] || maps.action[7];
  const h = sectionLabels(l);

  const toneLine = core.emotion;
  const mentalLine =
    lens === "emotion"
      ? lines(core.emotion, watch)
      : `${watch}`.split(".")[0].trim();
  const bodyLine = pickBody(l, vib);
  const workLine = pickTrading(l, vib);
  const daySeed = seed || date.toISOString().slice(0, 10);

  return lines(
    h.title,
    "",
    h.tone,
    toneLine,
    "",
    h.mental,
    mentalLine,
    "",
    h.body,
    bodyLine,
    "",
    h.work,
    workLine,
    "",
    h.discipline,
    disciplineLine(l, vib, daySeed),
    "",
    h.step,
    pickSeeded(
      [action, ...Object.values(maps.action || {})].filter(Boolean),
      `${daySeed}:step:${lens}`
    ) || stableStep(l, action)
  );
}

module.exports = { buildDailyEnergyMessage };
