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
      numerology: "🔢 Numerológia",
      astrology: "♉ Asztrológiai minőség",
      moon: "🌘 Hold",
      mind: "🧠 Mentális fókusz",
      lettingGo: "🌊 Elengedés",
      discipline: "⚔️ Fegyelem",
      direction: "🔥 Legjobb irány",
      trading: "📈 Trading",
      body: "🌿 Test"
    };
  }
  if (l === "ro") {
    return {
      title: `🌙 Energia zilei${lensNote}`,
      numerology: "🔢 Numerologie",
      astrology: "♉ Calitate astrologică",
      moon: "🌘 Lună",
      mind: "🧠 Focus mental",
      lettingGo: "🌊 Eliberare",
      discipline: "⚔️ Disciplină",
      direction: "🔥 Cea mai bună direcție",
      trading: "📈 Trading",
      body: "🌿 Corp"
    };
  }
  return {
    title: `🌙 Today's energy${lensNote}`,
    numerology: "🔢 Numerology",
    astrology: "♉ Astrological quality",
    moon: "🌘 Moon",
    mind: "🧠 Mental focus",
    lettingGo: "🌊 Letting go",
    discipline: "⚔️ Discipline",
    direction: "🔥 Best direction",
    trading: "📈 Trading",
    body: "🌿 Body"
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
  const lettingLine =
    l === "hu"
      ? "Egy dolgot engedj el ma — nem az egész múltat, csak egy terhet."
      : l === "ro"
        ? "Eliberează un lucru azi — nu tot trecutul, doar o greutate."
        : "Release one weight today — not the whole past, one honest burden.";
  const disciplineLine =
    l === "hu"
      ? "Egy szabály, egy ismétlés. Nincs új terv, amíg ez nincs kint."
      : l === "ro"
        ? "O regulă, o repetare. Fără plan nou până livrezi asta."
        : "One rule, one repetition. No new plan until this ships.";

  const parts = [
    h.title,
    headNote,
    "",
    h.numerology,
    core.num,
    core.body,
    "",
    h.astrology,
    sign,
    "",
    h.moon,
    moonText,
    "",
    h.mind,
    lines(emotionForMind, watch),
    "",
    h.lettingGo,
    lettingLine,
    "",
    h.discipline,
    disciplineLine,
    "",
    h.direction,
    directionBlock,
    "",
    h.trading,
    tradingBlock,
    "",
    h.body,
    bodyBlock,
    foot
  ];

  return lines(...parts.filter((x) => x !== null && x !== ""));
}

module.exports = { buildDailyEnergyMessage };
