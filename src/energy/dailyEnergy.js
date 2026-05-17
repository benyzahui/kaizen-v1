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
  seed = "",
  ctx = null
) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const vib = getUniversalDayVibration(date).vibration;
  const maps = getEnergyMaps(l);
  const core = pickVib(l, vib);
  const watch = maps.watch[vib] || maps.watch[7];
  const action = maps.action[vib] || maps.action[7];
  const h = sectionLabels(l);
  const daySeed = seed || date.toISOString().slice(0, 10);

  const state = ctx?.state;
  const mentalLine =
    lens === "emotion"
      ? lines(core.emotion, watch.split(".")[0])
      : lens === "body" && state?.energyLevel <= 4
        ? pickSeeded(
            {
              en: ["Calm the nervous system before any new input.", "Body first. Mind follows slower."],
              hu: ["Előbb idegrendszer. Utána input.", "Test először. Fej lassabban követ."],
              ro: ["Calmează sistemul nervos înainte de input.", "Corpul întâi. Mintea urmează."]
            }[l] || [],
            `${daySeed}:calm`
          )
        : core.emotion;
  const bodyLine =
    lens === "body"
      ? pickSeeded(
          {
            en: ["Water, food, slow walk — in that order if you can.", "No heroics. Restore the tank."],
            hu: ["Víz, étel, lassú séta — ebben a sorrendben, ha lehet.", "Nincs hőség. Töltés."],
            ro: ["Apă, mâncare, mers lent — în ordinea asta.", "Fără eroism. Reîncarcă."]
          }[l] || [],
          `${daySeed}:body`
        )
      : pickBody(l, vib);
  const workLine =
    lens === "trading"
      ? pickSeeded(
          {
            en: ["Rules before charts. Size second.", "Discipline is the edge today — not adrenaline."],
            hu: ["Szabály a chart előtt. Méret második.", "Ma a fegyelem az edge — nem az adrenalin."],
            ro: ["Reguli înainte de chart. Mărimea pe locul doi.", "Disciplina e edge-ul azi."]
          }[l] || [],
          `${daySeed}:trade`
        )
      : lens === "work"
        ? pickSeeded(
            {
              en: ["One block with a visible finish.", "Execution energy — close one loop."],
              hu: ["Egy blokk látható véggel.", "Végrehajtás — egy kör lezárása."],
              ro: ["Un bloc cu final vizibil.", "Execuție — închide o buclă."]
            }[l] || [],
            `${daySeed}:work`
          )
        : pickTrading(l, vib);
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

/**
 * Compact humanized energy — symbolic rhythm, no almanac wall.
 * @param {Date} date
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} [ctx]
 */
function buildHumanizedEnergyCompact(date, lang, ctx = null) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const { getResponses } = require("../i18n/getResponses");
  const { buildAdaptiveEnergyRead } = require("../companion/adaptiveEnergy");

  const adaptive = buildAdaptiveEnergyRead(date, l, ctx);
  if (adaptive && adaptive.length <= 280) {
    return capLength(adaptive, 280);
  }

  const r = getResponses(l);
  const pool = r.humanizedEnergyReads || r.adaptiveEnergy?.pulse || [];
  if (!pool.length) {
    return capLength(sectionLabels(l).title, 120);
  }

  const line = pickSeeded(pool, `henergy_${date.toISOString().slice(0, 10)}_${ctx?.userId || ""}`);
  return capLength(line, 220);
}

module.exports = { buildDailyEnergyMessage, buildHumanizedEnergyCompact };
