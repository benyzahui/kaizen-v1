/**
 * V2 first startup — warm welcome + language selection before lock.
 */

const { lines } = require("../kaizenVoice");

const WELCOME = {
  en: lines(
    "🐉 Welcome to KaiZen.",
    "Your Dragon Blueprint Energy Companion.",
    "",
    "I am here to help you build discipline, protect your energy, and return to the path every day.",
    "",
    "Choose your language:",
    "",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  ),
  hu: lines(
    "🐉 Üdvözöllek KaiZenben.",
    "A Dragon Blueprint energia társad vagyok.",
    "",
    "Azért vagyok itt, hogy segítsek védeni az energiád, építeni a fegyelmed, és visszatérni az útra minden nap.",
    "",
    "Válassz nyelvet:",
    "",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  ),
  ro: lines(
    "🐉 Bun venit în KaiZen.",
    "Sunt companionul tău Dragon Blueprint pentru energie.",
    "",
    "Sunt aici să te ajut să îți protejezi energia, să construiești disciplină și să revii pe cale în fiecare zi.",
    "",
    "Alege limba:",
    "",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  )
};

const LANGUAGE_LOCK_CONFIRM = {
  en: (langLabel) =>
    lines(
      `Language locked: ${langLabel}.`,
      "You can change it later in Settings."
    ),
  hu: (langLabel) =>
    lines(`Nyelv rögzítve: ${langLabel}.`, "Később a Beállításokban módosíthatod."),
  ro: (langLabel) =>
    lines(
      `Limba a fost setată: ${langLabel}.`,
      "O poți schimba mai târziu din Setări."
    )
};

const LANG_LABELS = { en: "English", hu: "Magyar", ro: "Română" };

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
 * @param {{ noLangSelected?: boolean }} [opts]
 */
function buildWelcomeScreen(hint = "en", opts = {}) {
  if (opts.noLangSelected) return WELCOME.en;
  const locked = hint === "hu" || hint === "ro" ? hint : "en";
  return WELCOME[locked] || WELCOME.en;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildLanguageLockConfirm(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const label = LANG_LABELS[locked] || LANG_LABELS.en;
  const fn = LANGUAGE_LOCK_CONFIRM[locked] || LANGUAGE_LOCK_CONFIRM.en;
  return fn(label);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildSettingsLanguageMenu(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return SETTINGS_LANGUAGE_MENU[locked] || SETTINGS_LANGUAGE_MENU.en;
}

module.exports = {
  WELCOME,
  LANG_LABELS,
  buildWelcomeScreen,
  buildLanguageLockConfirm,
  buildSettingsLanguageMenu
};
