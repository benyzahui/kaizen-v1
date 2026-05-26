/**
 * Micro human moments — tiny realistic lines (low frequency).
 */

/** @type {Array<{ id: string, language: string, text: string, emotionalTone: string, timeOfDay: string[] }>} */
const MICRO_HUMAN_MOMENTS = [
  { id: "hm_hu_1", language: "hu", text: "Hm. Ma sok fut egyszerre.", emotionalTone: "awareness", timeOfDay: ["midday", "evening"] },
  { id: "hm_hu_2", language: "hu", text: "Lassan kezd visszaállni a ritmus.", emotionalTone: "calm", timeOfDay: ["morning", "midday"] },
  { id: "hm_hu_3", language: "hu", text: "Ez most inkább fáradtság.", emotionalTone: "grounded", timeOfDay: ["midday", "evening"] },
  { id: "hm_hu_4", language: "hu", text: "🌘 Elég volt mára.", emotionalTone: "release", timeOfDay: ["evening", "late_night"] },
  { id: "hm_hu_5", language: "hu", text: "Na. Egy irány elég.", emotionalTone: "calm", timeOfDay: ["morning", "midday"] },
  { id: "hm_hu_6", language: "hu", text: "Oké. Vissza a testhez.", emotionalTone: "grounded", timeOfDay: ["midday", "evening"] },
  { id: "hm_en_1", language: "en", text: "Hm. A lot running at once today.", emotionalTone: "awareness", timeOfDay: ["midday", "evening"] },
  { id: "hm_en_2", language: "en", text: "Rhythm is slowly coming back.", emotionalTone: "calm", timeOfDay: ["morning", "midday"] },
  { id: "hm_en_3", language: "en", text: "This feels more like fatigue.", emotionalTone: "grounded", timeOfDay: ["midday", "evening"] },
  { id: "hm_en_4", language: "en", text: "🌘 Enough for today.", emotionalTone: "release", timeOfDay: ["evening", "late_night"] },
  { id: "hm_en_5", language: "en", text: "Right. One direction is enough.", emotionalTone: "calm", timeOfDay: ["morning", "midday"] },
  { id: "hm_en_6", language: "en", text: "Okay. Back to the body.", emotionalTone: "grounded", timeOfDay: ["midday", "evening"] },
  { id: "hm_ro_1", language: "ro", text: "Hm. Prea multe în paralel azi.", emotionalTone: "awareness", timeOfDay: ["midday", "evening"] },
  { id: "hm_ro_2", language: "ro", text: "Ritmul revine încet.", emotionalTone: "calm", timeOfDay: ["morning", "midday"] },
  { id: "hm_ro_3", language: "ro", text: "Acum e mai mult oboseală.", emotionalTone: "grounded", timeOfDay: ["midday", "evening"] },
  { id: "hm_ro_4", language: "ro", text: "🌘 Destul pentru azi.", emotionalTone: "release", timeOfDay: ["evening", "late_night"] },
  { id: "hm_ro_5", language: "ro", text: "Bine. O direcție e suficientă.", emotionalTone: "calm", timeOfDay: ["morning", "midday"] },
  { id: "hm_ro_6", language: "ro", text: "Ok. Înapoi la corp.", emotionalTone: "grounded", timeOfDay: ["midday", "evening"] }
];

module.exports = { MICRO_HUMAN_MOMENTS };
