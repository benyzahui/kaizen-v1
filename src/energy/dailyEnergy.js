/**
 * Daily Energy Intelligence — structured compose (numerology, season, moon, tone, action).
 * V1.9: premium readability layout (headers, spacing, restrained emoji).
 */

const { lines } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { getUniversalDayVibration } = require("./numerology");
const { getAstrologicalSeason } = require("./astrologySeason");
const { getMoonPhaseContext } = require("./moonPhase");
const { getEnergyMaps } = require("../i18n/energyLocales");
const {
  getFrame,
  pickVib,
  pickTrading,
  pickBody,
  signLine,
  getLensTail
} = require("../i18n/dailyEnergyStrings");

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} lens
 */
function premiumSectionLabels(lang, lens) {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const lensNote =
    l === "hu"
      ? ` (${lens === "general" ? "általános" : lens})`
      : l === "ro"
        ? ` (${lens === "general" ? "general" : lens})`
        : lens !== "general"
          ? ` (${lens})`
          : "";
  if (l === "hu") {
    return {
      title: `🌙 A nap energiája${lensNote}`,
      atmosphere: "🌤 Légkör",
      mental: "🧠 Mentális mező",
      discipline: "⚔️ Fegyelem jel",
      body: "🌿 Test jel",
      social: "🤝 Kapcsolat / társ",
      trading: "📈 Üzlet / trading",
      action: "→ Irány",
      symbolic: "🔢 Szimbolikus réteg"
    };
  }
  if (l === "ro") {
    return {
      title: `🌙 Energia zilei${lensNote}`,
      atmosphere: "🌤 Atmosferă",
      mental: "🧠 Câmp mental",
      discipline: "⚔️ Semnal disciplină",
      body: "🌿 Semnal corp",
      social: "🤝 Relații / social",
      trading: "📈 Business / trading",
      action: "→ Direcție",
      symbolic: "🔢 Strat simbolic"
    };
  }
  return {
    title: `🌙 Today's energy${lensNote}`,
    atmosphere: "🌤 Atmosphere",
    mental: "🧠 Mental field",
    discipline: "⚔️ Discipline signal",
    body: "🌿 Body signal",
    social: "🤝 Relationship / social",
    trading: "📈 Business / trading",
    action: "→ Direction",
    symbolic: "🔢 Symbolic layer"
  };
}

/**
 * @param {Date} [date]
 * @param {'en'|'hu'|'ro'} [lang]
 * @param {'general'|'trading'|'body'|'emotion'|'work'} [lens]
 * @returns {string}
 */
function buildDailyEnergyMessage(date = new Date(), lang = "en", lens = "general") {
  const l = lang === "hu" ? "hu" : lang === "ro" ? "ro" : "en";
  const vib = getUniversalDayVibration(date).vibration;
  const season = getAstrologicalSeason(date);
  const moon = getMoonPhaseContext(date);
  const f = getFrame(l, lens);
  const maps = getEnergyMaps(l);
  const core = pickVib(l, vib);
  const watch = maps.watch[vib] || maps.watch[7];
  const action = maps.action[vib] || maps.action[7];
  const moonText =
    moon.mode === "api" && moon.displayKey === "api_pending"
      ? f.moon.apiPending
      : f.moon.staticHonest;
  const sign = signLine(season.sign, l) || "—";
  const tail = getLensTail(l, lens);
  const tradingLine = pickTrading(l, vib);
  const bodyLine = pickBody(l, vib);
  const r = getResponses(l);
  const foot = r.tEnergyLensFooter || "";

  const emotionForMind =
    lens === "emotion" && tail ? lines(core.emotion, tail) : core.emotion;
  const directionBlock =
    lens === "work" && tail ? lines(action, tail) : action;
  const tradingBlock =
    lens === "trading" && tail ? lines(tradingLine, tail) : tradingLine;
  const bodyBlock = lens === "body" && tail ? lines(bodyLine, tail) : bodyLine;

  const h = premiumSectionLabels(l, lens);
  const headNote = f.lensLead[lens] ? lines(f.lensLead[lens]) : null;
  const disciplineLine =
    l === "hu"
      ? "Egy szabály, egy ismétlés. Nincs új terv, amíg ez nincs kint."
      : l === "ro"
        ? "O regulă, o repetare. Fără plan nou până livrezi asta."
        : "One rule, one repetition. No new plan until this ships.";

  const atmosphereLine =
    l === "hu"
      ? `${core.emotion} — ${moonText}`
      : l === "ro"
        ? `${core.emotion} — ${moonText}`
        : `${core.emotion} — ${moonText}`;

  const socialLine =
    l === "hu"
      ? "Egy beszélgetés ma: őszinte, rövid, nem teljesítmény."
      : l === "ro"
        ? "O conversație azi: onestă, scurtă, fără spectacol."
        : "One conversation today: honest, short, not performance.";

  const parts = [
    h.title,
    headNote,
    "",
    h.atmosphere,
    atmosphereLine,
    "",
    h.mental,
    lines(emotionForMind, watch),
    "",
    h.discipline,
    disciplineLine,
    "",
    h.body,
    bodyBlock,
    "",
    h.social,
    socialLine,
    "",
    h.trading,
    tradingBlock,
    "",
    h.action,
    directionBlock,
    "",
    h.symbolic,
    lines(`${core.num} · ${sign}`, f.moon.staticHonest.split(".")[0] + "."),
    foot
  ];

  return lines(...parts.filter((x) => x !== null && x !== ""));
}

module.exports = { buildDailyEnergyMessage };
