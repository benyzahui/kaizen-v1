/**
 * Daily energy — premium compact read (max ~300 words).
 */

const { lines, pickSeeded } = require("../personality/tone");
const { getUniversalDayVibration } = require("./numerology");
const { getEnergyMaps } = require("../i18n/energyLocales");
const { pickVib, pickTrading, pickBody } = require("../i18n/dailyEnergyStrings");

const MAX_CHARS = 1200;

function sectionLabels(lang) {
  if (lang === "hu") {
    return {
      title: "🌘 Mai energia",
      mental: "🧠 Mentális tér",
      body: "💪 Test",
      focus: "🔥 Fókusz",
      watch: "📉 Mire figyelj",
      work: "⚔ Trading / munka",
      direction: "🌱 Mai irány"
    };
  }
  if (lang === "ro") {
    return {
      title: "🌘 Energia zilei",
      mental: "🧠 Spațiu mental",
      body: "💪 Corp",
      focus: "🔥 Focus",
      watch: "📉 La ce să fii atent",
      work: "⚔ Trading / muncă",
      direction: "🌱 Direcția zilei"
    };
  }
  return {
    title: "🌘 Today's energy",
    mental: "🧠 Mental field",
    body: "💪 Body",
    focus: "🔥 Focus",
    watch: "📉 Watch for",
    work: "⚔ Trading / work",
    direction: "🌱 Today's direction"
  };
}

function focusLine(lang, vib, seed) {
  const pool = {
    en: [
      "One rule before a new plan.",
      "Repeat what already works once.",
      "No heroics — one honest block."
    ],
    hu: [
      "Egy szabály, aztán ismétlés.",
      "Amit már tudsz hogy működik — újra.",
      "Nincs hőség — egy blokk."
    ],
    ro: [
      "O regulă înainte de plan nou.",
      "Repetă ce știi că merge.",
      "Fără eroism — un bloc."
    ]
  };
  const arr = pool[lang] || pool.en;
  return pickSeeded(arr, `${seed}:foc:${vib}`);
}

function capLength(text, max = MAX_CHARS) {
  const t = String(text || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/**
 * @param {Date} [date]
 * @param {'en'|'hu'|'ro'} [lang]
 * @param {'general'|'trading'|'body'|'emotion'|'work'} [lens]
 * @param {string} [seed]
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
  const daySeed = seed || date.toISOString().slice(0, 10);

  const mentalLine =
    lens === "emotion"
      ? lines(core.emotion, watch.split(".")[0])
      : core.emotion;
  const bodyLine = pickBody(l, vib);
  const workLine = pickTrading(l, vib);
  const watchLine = `${watch}`.split(".")[0].trim();

  const out = lines(
    h.title,
    "",
    h.mental,
    mentalLine,
    "",
    h.body,
    bodyLine,
    "",
    h.focus,
    focusLine(l, vib, daySeed),
    "",
    h.watch,
    watchLine,
    "",
    h.work,
    workLine,
    "",
    h.direction,
    pickSeeded(
      [action, ...Object.values(maps.action || {})].filter(Boolean),
      `${daySeed}:dir:${lens}`
    )
  );

  return capLength(out);
}

module.exports = { buildDailyEnergyMessage };
