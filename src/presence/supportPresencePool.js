/**
 * Rare presence reminders + small human support — minimal, non-possessive.
 */

/** @type {Array<{ id: string, language: string, text: string, kind: 'presence'|'support', scenes?: string[] }>} */
const SUPPORT_PRESENCE_POOL = [
  { id: "sp_hu_p1", language: "hu", text: "Itt vagyok.", kind: "presence" },
  { id: "sp_hu_p2", language: "hu", text: "Lassan stabilizálunk.", kind: "presence" },
  { id: "sp_hu_p3", language: "hu", text: "Holnap új kör.", kind: "presence", scenes: ["evening", "hard_day"] },
  { id: "sp_hu_p4", language: "hu", text: "Nem kell ma tökéletesnek lenned.", kind: "presence", scenes: ["hard_day", "evening"] },
  { id: "sp_hu_p5", language: "hu", text: "Kis lépések is számítanak.", kind: "presence" },
  { id: "sp_hu_p6", language: "hu", text: "Egy lépés elég most.", kind: "presence", scenes: ["overload", "hard_day"] },
  { id: "sp_hu_p7", language: "hu", text: "Lassan visszaállunk.", kind: "presence", scenes: ["comeback", "recovery"] },
  { id: "sp_hu_s1", language: "hu", text: "Jó hogy visszajöttél.", kind: "support", scenes: ["comeback"] },
  { id: "sp_hu_s2", language: "hu", text: "Nem estél ki végleg.", kind: "support", scenes: ["comeback", "missed_streak"] },
  { id: "sp_hu_s3", language: "hu", text: "Még épül a ritmus.", kind: "support", scenes: ["recovery", "comeback"] },
  { id: "sp_hu_s4", language: "hu", text: "Lassan visszaáll a rend.", kind: "support", scenes: ["recovery"] },
  { id: "sp_hu_s5", language: "hu", text: "Ma elég ennyi.", kind: "support", scenes: ["evening", "lonely_evening"] },
  { id: "sp_en_p1", language: "en", text: "I'm here.", kind: "presence" },
  { id: "sp_en_p2", language: "en", text: "We stabilize slowly.", kind: "presence" },
  { id: "sp_en_p3", language: "en", text: "Tomorrow is a new round.", kind: "presence", scenes: ["evening", "hard_day"] },
  { id: "sp_en_p4", language: "en", text: "You do not need to be perfect today.", kind: "presence", scenes: ["hard_day", "evening"] },
  { id: "sp_en_p5", language: "en", text: "Small steps still count.", kind: "presence" },
  { id: "sp_en_p6", language: "en", text: "One step is enough now.", kind: "presence", scenes: ["overload", "hard_day"] },
  { id: "sp_en_p7", language: "en", text: "We are settling back in.", kind: "presence", scenes: ["comeback", "recovery"] },
  { id: "sp_en_s1", language: "en", text: "Good that you came back.", kind: "support", scenes: ["comeback"] },
  { id: "sp_en_s2", language: "en", text: "You did not fall out for good.", kind: "support", scenes: ["comeback", "missed_streak"] },
  { id: "sp_en_s3", language: "en", text: "The rhythm is still building.", kind: "support", scenes: ["recovery", "comeback"] },
  { id: "sp_en_s4", language: "en", text: "Order is slowly returning.", kind: "support", scenes: ["recovery"] },
  { id: "sp_en_s5", language: "en", text: "Enough for today.", kind: "support", scenes: ["evening", "lonely_evening"] },
  { id: "sp_ro_p1", language: "ro", text: "Sunt aici.", kind: "presence" },
  { id: "sp_ro_p2", language: "ro", text: "Stabilizăm încet.", kind: "presence" },
  { id: "sp_ro_p3", language: "ro", text: "Mâine e un nou ciclu.", kind: "presence", scenes: ["evening", "hard_day"] },
  { id: "sp_ro_p4", language: "ro", text: "Nu trebuie să fii perfect azi.", kind: "presence", scenes: ["hard_day", "evening"] },
  { id: "sp_ro_p5", language: "ro", text: "Pașii mici contează.", kind: "presence" },
  { id: "sp_ro_p6", language: "ro", text: "Un pas e suficient acum.", kind: "presence", scenes: ["overload", "hard_day"] },
  { id: "sp_ro_p7", language: "ro", text: "Revenim încet.", kind: "presence", scenes: ["comeback", "recovery"] },
  { id: "sp_ro_s1", language: "ro", text: "Bine că ai revenit.", kind: "support", scenes: ["comeback"] },
  { id: "sp_ro_s2", language: "ro", text: "Nu ai ieșit definitiv.", kind: "support", scenes: ["comeback", "missed_streak"] },
  { id: "sp_ro_s3", language: "ro", text: "Ritmul încă se construiește.", kind: "support", scenes: ["recovery", "comeback"] },
  { id: "sp_ro_s4", language: "ro", text: "Ordinea revine încet.", kind: "support", scenes: ["recovery"] },
  { id: "sp_ro_s5", language: "ro", text: "Destul pentru azi.", kind: "support", scenes: ["evening", "lonely_evening"] }
];

module.exports = { SUPPORT_PRESENCE_POOL };
