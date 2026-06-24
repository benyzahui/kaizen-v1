/**
 * Dragon Blueprint Daily Path menu — calm hub, not a command dump.
 */

const { lines } = require("../personality/kaizenVoice");

const MENU = {
  en: {
    title: "🐉 Daily Path",
    subtitle: "Choose where you want to return today:",
    items: [
      "⚡ Energy Check",
      "🧘 Breathwork",
      "📖 Dragon Wisdom",
      "🎯 Challenge",
      "🪞 Reflection",
      "⚙️ Settings"
    ],
    hints: ["/midday", "/breath", "/today", "/challenge", "/reflection", "/language"]
  },
  hu: {
    title: "🐉 Napi Út",
    subtitle: "Válaszd ki, hova térsz vissza ma:",
    items: [
      "⚡ Energia ellenőrzés",
      "🧘 Légzés",
      "📖 Sárkány bölcsesség",
      "🎯 Kihívás",
      "🪞 Reflexió",
      "⚙️ Beállítások"
    ],
    hints: ["/midday", "/breath", "/today", "/challenge", "/reflection", "/language"]
  },
  ro: {
    title: "🐉 Calea Zilnică",
    subtitle: "Alege unde revii astăzi:",
    items: [
      "⚡ Verificare energie",
      "🧘 Respirație",
      "📖 Înțelepciunea Dragonului",
      "🎯 Provocare",
      "🪞 Reflecție",
      "⚙️ Setări"
    ],
    hints: ["/midday", "/breath", "/today", "/challenge", "/reflection", "/language"]
  }
};

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildDailyPathMenu(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const M = MENU[locked] || MENU.en;
  return lines(M.title, "", M.subtitle, "", ...M.items);
}

module.exports = { MENU, buildDailyPathMenu };
