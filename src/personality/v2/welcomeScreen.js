/**
 * V2 first startup — language selection before lock.
 */

const { lines } = require("../kaizenVoice");

const WELCOME = {
  en: lines(
    "Welcome to KaiZen",
    "Dragon Blueprint Energy Companion",
    "",
    "🐉 Return to the Path.",
    "",
    "Select Language:",
    "🇬🇧 1 — English",
    "🇭🇺 2 — Magyar",
    "🇷🇴 3 — Română"
  ),
  hu: lines(
    "Üdvözöl a KaiZen",
    "Dragon Blueprint Energy Companion",
    "",
    "🐉 Vissza az útra.",
    "",
    "Válassz nyelvet:",
    "🇬🇧 1 — English",
    "🇭🇺 2 — Magyar",
    "🇷🇴 3 — Română"
  ),
  ro: lines(
    "Bine ai venit la KaiZen",
    "Dragon Blueprint Energy Companion",
    "",
    "🐉 Înapoi pe drum.",
    "",
    "Alege limba:",
    "🇬🇧 1 — English",
    "🇭🇺 2 — Magyar",
    "🇷🇴 3 — Română"
  )
};

const SETTINGS_LANGUAGE_MENU = {
  en: lines(
    "⚙️ Settings — Language",
    "Only you can change language here.",
    "",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  ),
  hu: lines(
    "⚙️ Beállítások — Nyelv",
    "Csak te változtathatod meg a nyelvet.",
    "",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  ),
  ro: lines(
    "⚙️ Setări — Limbă",
    "Doar tu poți schimba limba aici.",
    "",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  )
};

/**
 * @param {'en'|'hu'|'ro'} [hint]
 */
function buildWelcomeScreen(hint = "en") {
  const locked = hint === "hu" || hint === "ro" ? hint : "en";
  return WELCOME[locked] || WELCOME.en;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildSettingsLanguageMenu(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return SETTINGS_LANGUAGE_MENU[locked] || SETTINGS_LANGUAGE_MENU.en;
}

module.exports = { WELCOME, buildWelcomeScreen, buildSettingsLanguageMenu };
