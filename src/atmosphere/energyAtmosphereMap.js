/**
 * Symbolic energy atmosphere lines by state + locale.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { symbolicEnergy } = require("./romanianNativePools");

const MAP = {
  hu: {
    calm: ["🌊 Ma stabil ritmus. Egy sáv elég."],
    warrior: ["⚔ Védd a fókuszt.\nA figyelem energia."],
    recovery: ["🌘 Nem kell ma mindent megjavítani.\nElég hogy nem adtad fel."],
    overloaded: ["🌊 Túl sok nyitott kör.\nKevesebb zaj. Több tisztánlátás."],
    emotional: ["🫀 A tested valószínűleg előbb fáradt el."],
    grounded: ["Talaj. Légzés. Egy irány."],
    reflective: ["🌘 Ma elengedés, nem új harc."]
  },
  en: {
    calm: ["🌊 Steady rhythm today. One lane is enough."],
    warrior: ["⚔ Protect focus.\nAttention is energy."],
    recovery: ["🌘 You do not need to fix everything tonight.\nNot giving up is enough."],
    overloaded: ["🌊 Too many open loops.\nLess noise. More clarity."],
    emotional: ["🫀 Your body may have tired before your mind admitted it."],
    grounded: ["Ground. Breath. One direction."],
    reflective: ["🌘 Tonight favors release, not new fights."]
  },
  ro: {
    calm: ["Ritm stabil azi. O bandă e suficientă."],
    warrior: ["⚔ Protejează focusul.\nAtenția e energie."],
    recovery: ["🌘 Nu trebuie să repari totul diseară.\nE destul să nu fi renunțat."],
    overloaded: symbolicEnergy.nervous,
    emotional: ["🫀 Corpul poate fi obosit înainte ca mintea să recunoască."],
    grounded: ["Pământ. Respirație. O direcție."],
    reflective: symbolicEnergy.evening
  }
};

const GURU_BLOCK =
  /\b(manifest|universe wants|cosmic|twin flame|5d|guru|spirit guide|jósl|horoscope|predicție zilnică)\b/i;

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} atmosphereState
 * @param {string} section atmosphere|nervous|recovery
 * @param {string|number} userId
 * @param {string} dateKey
 */
function pickSymbolicLine(lang, atmosphereState, section, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const byLang = MAP[locked] || MAP.en;
  let pool = byLang[atmosphereState] || byLang.calm;
  if (section === "nervous" && locked === "ro") {
    pool = symbolicEnergy.nervous;
  }
  const arr = Array.isArray(pool) ? pool : [pool];
  const clean = arr.filter((l) => l && !GURU_BLOCK.test(l));
  if (!clean.length) return "";
  return pickSeeded(clean, `${userId}|${dateKey}|${section}|${atmosphereState}`);
}

module.exports = { MAP, pickSymbolicLine, GURU_BLOCK };
