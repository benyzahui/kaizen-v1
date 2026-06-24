/**
 * Dragon Blueprint Daily Path menu.
 */

const { lines } = require("../personality/kaizenVoice");
const { dragonTierName, evaluateDragonProgression } = require("./dragonProgression");
const { getNextProgramCommand } = require("../program/dailyProgramEngine");

const MENU = {
  en: {
    title: "🐉 Daily Path",
    items: [
      "🐉 Daily Path — /program",
      "⚡ Energy Check — /midday",
      "🧘 Breathwork — /breath",
      "📖 Dragon Wisdom — /today",
      "🎯 Challenge — /challenge",
      "🪞 Reflection — /reflection",
      "⚙️ Settings — /language"
    ],
    tier: "Dragon tier:",
    next: "Next step:"
  },
  hu: {
    title: "🐉 Napi Út",
    items: [
      "🐉 Napi Út — /program",
      "⚡ Energia — /midday",
      "🧘 Légzés — /breath",
      "📖 Dragon Bölcsesség — /today",
      "🎯 Kihívás — /challenge",
      "🪞 Reflexió — /reflection",
      "⚙️ Beállítások — /language"
    ],
    tier: "Sárkány szint:",
    next: "Következő lépés:"
  },
  ro: {
    title: "🐉 Calea Zilnică",
    items: [
      "🐉 Calea Zilnică — /program",
      "⚡ Energie — /midday",
      "🧘 Respirație — /breath",
      "📖 Înțelepciune Dragon — /today",
      "🎯 Provocare — /challenge",
      "🪞 Reflecție — /reflection",
      "⚙️ Setări — /language"
    ],
    tier: "Nivel Dragon:",
    next: "Următorul pas:"
  }
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function buildDailyPathMenu(lang, session) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const M = MENU[locked] || MENU.en;
  const tier = dragonTierName(session, locked);
  const { promote, nextTier } = evaluateDragonProgression(session);
  const next = getNextProgramCommand(session);

  const promo =
    promote && nextTier
      ? locked === "hu"
        ? `⭐ Közeledés: ${nextTier.names.hu}`
        : locked === "ro"
          ? `⭐ Progres: ${nextTier.names.ro}`
          : `⭐ Approaching: ${nextTier.names.en}`
      : "";

  return lines(
    M.title,
    "",
    `${M.tier} ${tier}`,
    promo,
    "",
    ...M.items,
    "",
    `${M.next} ${next}`
  );
}

module.exports = { MENU, buildDailyPathMenu };
