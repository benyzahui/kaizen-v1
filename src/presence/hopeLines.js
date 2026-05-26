/**
 * Quiet hope — calm, grounded, no motivation speeches.
 */

/** @type {Array<{ id: string, language: string, text: string, scenes?: string[] }>} */
const HOPE_LINES = [
  { id: "hope_hu_1", language: "hu", text: "Az irány fontosabb mint a tökéletesség." },
  { id: "hope_hu_2", language: "hu", text: "A ritmus visszajön — nem egy nap alatt." },
  { id: "hope_hu_3", language: "hu", text: "Ma elég a stabilizálás." },
  { id: "hope_hu_4", language: "hu", text: "Holnap tisztább lesz a kép." },
  { id: "hope_hu_5", language: "hu", text: "Egy kör elég — nem kell mindent most." },
  { id: "hope_hu_6", language: "hu", text: "Lassan épül vissza a rend." },
  { id: "hope_hu_7", language: "hu", text: "A fáradtság nem végállapot.", scenes: ["hard_day", "recovery"] },
  { id: "hope_hu_8", language: "hu", text: "A rendszer segít visszatalálni a ritmushoz.", scenes: ["recovery", "comeback"] },
  { id: "hope_en_1", language: "en", text: "Direction matters more than perfection." },
  { id: "hope_en_2", language: "en", text: "The rhythm returns — not in one day." },
  { id: "hope_en_3", language: "en", text: "Today, stabilization is enough." },
  { id: "hope_en_4", language: "en", text: "Tomorrow the picture clears." },
  { id: "hope_en_5", language: "en", text: "One round is enough — not everything now." },
  { id: "hope_en_6", language: "en", text: "Order is rebuilding slowly." },
  { id: "hope_en_7", language: "en", text: "Fatigue is not a final state.", scenes: ["hard_day", "recovery"] },
  { id: "hope_en_8", language: "en", text: "The system helps you find the rhythm again.", scenes: ["recovery", "comeback"] },
  { id: "hope_ro_1", language: "ro", text: "Direcția contează mai mult decât perfecțiunea." },
  { id: "hope_ro_2", language: "ro", text: "Ritmul revine — nu într-o zi." },
  { id: "hope_ro_3", language: "ro", text: "Azi e suficientă stabilizarea." },
  { id: "hope_ro_4", language: "ro", text: "Mâine imaginea e mai clară." },
  { id: "hope_ro_5", language: "ro", text: "Un ciclu e suficient — nu totul acum." },
  { id: "hope_ro_6", language: "ro", text: "Ordinea se reconstruiește încet." },
  { id: "hope_ro_7", language: "ro", text: "Oboseala nu e stare finală.", scenes: ["hard_day", "recovery"] },
  { id: "hope_ro_8", language: "ro", text: "Sistemul te ajută să regăsești ritmul.", scenes: ["recovery", "comeback"] }
];

module.exports = { HOPE_LINES };
