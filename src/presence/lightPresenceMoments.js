/**
 * Light presence + silence confidence — rare, minimal, not human-pretending.
 */

/** @type {Array<{ id: string, language: string, text: string, kind: 'presence'|'silence', timeOfDay?: string[] }>} */
const LIGHT_PRESENCE_MOMENTS = [
  { id: "lp_hu_p1", language: "hu", text: "Itt vagyok.", kind: "presence" },
  { id: "lp_hu_p2", language: "hu", text: "Lassan.", kind: "silence" },
  { id: "lp_hu_p3", language: "hu", text: "Egy lépés.", kind: "silence" },
  { id: "lp_hu_p4", language: "hu", text: "Holnap új kör.", kind: "presence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_hu_p5", language: "hu", text: "Pihenj most.", kind: "presence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_hu_s1", language: "hu", text: "⚔ Most fókusz.", kind: "silence", timeOfDay: ["morning", "midday"] },
  { id: "lp_hu_s2", language: "hu", text: "🌘 Elég volt mára.", kind: "silence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_hu_s3", language: "hu", text: "🫀 Lassíts.", kind: "silence" },
  { id: "lp_hu_s4", language: "hu", text: "🌱 Egy kör.", kind: "silence" },
  { id: "lp_en_p1", language: "en", text: "I'm here.", kind: "presence" },
  { id: "lp_en_p2", language: "en", text: "Slowly.", kind: "silence" },
  { id: "lp_en_p3", language: "en", text: "One step.", kind: "silence" },
  { id: "lp_en_p4", language: "en", text: "Tomorrow is a new round.", kind: "presence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_en_p5", language: "en", text: "Rest now.", kind: "presence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_en_s1", language: "en", text: "⚔ Focus now.", kind: "silence", timeOfDay: ["morning", "midday"] },
  { id: "lp_en_s2", language: "en", text: "🌘 Enough for today.", kind: "silence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_en_s3", language: "en", text: "🫀 Slow down.", kind: "silence" },
  { id: "lp_en_s4", language: "en", text: "🌱 One loop.", kind: "silence" },
  { id: "lp_ro_p1", language: "ro", text: "Sunt aici.", kind: "presence" },
  { id: "lp_ro_p2", language: "ro", text: "Încet.", kind: "silence" },
  { id: "lp_ro_p3", language: "ro", text: "Un pas.", kind: "silence" },
  { id: "lp_ro_p4", language: "ro", text: "Mâine e un nou ciclu.", kind: "presence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_ro_p5", language: "ro", text: "Odihnește acum.", kind: "presence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_ro_s1", language: "ro", text: "⚔ Focalizare acum.", kind: "silence", timeOfDay: ["morning", "midday"] },
  { id: "lp_ro_s2", language: "ro", text: "🌘 Destul pentru azi.", kind: "silence", timeOfDay: ["evening", "late_night"] },
  { id: "lp_ro_s3", language: "ro", text: "🫀 Încetinește.", kind: "silence" },
  { id: "lp_ro_s4", language: "ro", text: "🌱 Un ciclu.", kind: "silence" }
];

module.exports = { LIGHT_PRESENCE_MOMENTS };
