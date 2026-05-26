/**
 * Contextual micro presence — one line, alive through timing.
 */

/** @type {Array<{ id: string, language: string, signal: string, text: string }>} */
const CONTEXTUAL_PRESENCE = [
  { id: "cp_night_hu", language: "hu", signal: "night_spiral", text: "🌘 Még mindig pörög az agyad?" },
  { id: "cp_night_hu2", language: "hu", signal: "night", text: "🌘 Lassíts — holnap építünk." },
  { id: "cp_focus_hu", language: "hu", signal: "disciplined_flow", text: "⚔ Ma stabilabb a fókuszod." },
  { id: "cp_focus_hu2", language: "hu", signal: "disciplined_flow", text: "⚔ Egy sáv — tiszta jelenlét." },
  { id: "cp_body_hu", language: "hu", signal: "overload", text: "🫀 A tested hogy bírja most?" },
  { id: "cp_body_hu2", language: "hu", signal: "overload", text: "🫀 Légzés előbb — aztán döntés." },
  { id: "cp_calm_hu", language: "hu", signal: "overload", text: "🌊 Kevesebb zaj ma." },
  { id: "cp_calm_hu2", language: "hu", signal: "chaotic", text: "🌊 Egy irány. Nem öt." },
  { id: "cp_inact_hu", language: "hu", signal: "inactivity", text: "🌱 Egy kis lépés elég a visszatéréshez." },
  { id: "cp_streak_hu", language: "hu", signal: "streak", text: "🐉 A ritmus tart — ne a tökéletesség." },

  { id: "cp_night_en", language: "en", signal: "night_spiral", text: "🌘 Is your mind still spinning?" },
  { id: "cp_night_en2", language: "en", signal: "night", text: "🌘 Slow down — we build tomorrow." },
  { id: "cp_focus_en", language: "en", signal: "disciplined_flow", text: "⚔ Your focus is steadier today." },
  { id: "cp_focus_en2", language: "en", signal: "disciplined_flow", text: "⚔ One lane — clear presence." },
  { id: "cp_body_en", language: "en", signal: "overload", text: "🫀 How is your body holding up right now?" },
  { id: "cp_body_en2", language: "en", signal: "overload", text: "🫀 Breath first — then decide." },
  { id: "cp_calm_en", language: "en", signal: "overload", text: "🌊 Less noise today." },
  { id: "cp_calm_en2", language: "en", signal: "chaotic", text: "🌊 One direction. Not five." },
  { id: "cp_inact_en", language: "en", signal: "inactivity", text: "🌱 One small step is enough to return." },
  { id: "cp_streak_en", language: "en", signal: "streak", text: "🐉 Rhythm holds — not perfection." },

  { id: "cp_night_ro", language: "ro", signal: "night_spiral", text: "🌘 Încă îți aleargă mintea?" },
  { id: "cp_night_ro2", language: "ro", signal: "night", text: "🌘 Încetinește — mâine construim." },
  { id: "cp_focus_ro", language: "ro", signal: "disciplined_flow", text: "⚔ Focusul e mai stabil azi." },
  { id: "cp_focus_ro2", language: "ro", signal: "disciplined_flow", text: "⚔ O bandă — prezență clară." },
  { id: "cp_body_ro", language: "ro", signal: "overload", text: "🫀 Cum ține corpul acum?" },
  { id: "cp_body_ro2", language: "ro", signal: "overload", text: "🫀 Respirație întâi — apoi decizia." },
  { id: "cp_calm_ro", language: "ro", signal: "overload", text: "🌊 Mai puțin zgomot azi." },
  { id: "cp_calm_ro2", language: "ro", signal: "chaotic", text: "🌊 O direcție. Nu cinci." },
  { id: "cp_inact_ro", language: "ro", signal: "inactivity", text: "🌱 Un pas mic e suficient să revii." },
  { id: "cp_streak_ro", language: "ro", signal: "streak", text: "🐉 Ritmul ține — nu perfecțiunea." }
];

module.exports = { CONTEXTUAL_PRESENCE };
