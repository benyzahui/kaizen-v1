/**
 * Daily Energy Intelligence — structured compose (numerology, season, moon, tone, action).
 * No fortune-telling; ENERGY_MODE controls moon honesty (see moonPhase.js).
 */

const { lines } = require("../personality/tone");
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
  const sign = signLine(season.sign, l);
  const tail = getLensTail(l, lens);

  const tradingLine = pickTrading(l, vib);
  const bodyLine = pickBody(l, vib);

  const emotionalBlock =
    lens === "emotion" && tail
      ? lines(core.emotion, tail)
      : core.emotion;

  const directionBlock =
    lens === "work" && tail ? lines(action, tail) : action;

  const tradingBlock =
    lens === "trading" && tail
      ? lines(tradingLine, tail)
      : tradingLine;

  const bodyBlock =
    lens === "body" && tail ? lines(bodyLine, tail) : bodyLine;

  const head = f.lensLead[lens]
    ? lines(f.title, "", f.lensLead[lens])
    : f.title;

  const blocks = [
    head,
    "",
    f.labels.numerology,
    core.num,
    core.body,
    "",
    f.labels.astrology,
    sign || "—",
    "",
    f.labels.moon,
    moonText,
    "",
    f.labels.emotionalTone,
    emotionalBlock,
    "",
    f.labels.watchToday,
    watch,
    "",
    f.labels.bestDirection,
    directionBlock,
    "",
    f.labels.trading,
    tradingBlock,
    "",
    f.labels.body,
    bodyBlock
  ];

  return lines(...blocks.filter((x) => x !== null));
}

module.exports = { buildDailyEnergyMessage };
