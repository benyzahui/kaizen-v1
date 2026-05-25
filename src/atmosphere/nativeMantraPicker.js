/**
 * Locale-native mantra picks — energy + atmosphere + time (not mechanical translation).
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const {
  eveningRecovery,
  warriorMode,
  stabilization,
  emotionalReset
} = require("./romanianNativePools");

const HU_NATIVE = {
  evening_recovery: [
    {
      id: "hu_native_eve_hope",
      text: "🌘 Nem kell ma mindent megjavítani.\nElég hogy nem adtad fel.",
      tags: ["recovery", "hope"]
    },
    {
      id: "hu_native_eve_calm",
      text: "🌘 A nyomás lejöhet.\nA tested ma este kap szót.",
      tags: ["recovery", "calm"]
    }
  ],
  morning_warrior: [
    {
      id: "hu_native_war_morn",
      text: "⚔ Védd a fókuszt.\nA figyelem energia.",
      tags: ["warrior", "focus"]
    },
    {
      id: "hu_native_war_lane",
      text: "⚔ Egy sáv.\nEgy tiszta végrehajtás.",
      tags: ["warrior", "discipline"]
    }
  ],
  stabilization: [
    {
      id: "hu_native_stab",
      text: "🌊 Nem lustaság.\nA rendszer túl nyitott.",
      tags: ["stabilization"]
    }
  ],
  emotional: [
    {
      id: "hu_native_emo",
      text: "🫀 Nem egyedül cipeled.\nElőbb lassíts.",
      tags: ["emotional", "recovery"]
    }
  ]
};

const EN_NATIVE = {
  evening_recovery: [
    {
      id: "en_native_eve",
      text: "🌘 You do not need to fix everything tonight.\nNot giving up is enough.",
      tags: ["recovery"]
    }
  ],
  morning_warrior: [
    {
      id: "en_native_war",
      text: "⚔ Protect focus.\nAttention is energy.",
      tags: ["warrior"]
    }
  ]
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {string} atmosphere
 * @param {string} timeSlot
 * @returns {{ text: string, id: string }|null}
 */
function pickNativeMantra(lang, phase, atmosphere, timeSlot) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const isEvening = phase === "evening" || timeSlot === "evening" || timeSlot === "late_night";
  const isMorning = phase === "morning" || timeSlot === "morning";

  if (locked === "hu") {
    if (
      isEvening &&
      (atmosphere === "recovery" || atmosphere === "emotional")
    ) {
      return pickSeeded(HU_NATIVE.evening_recovery, `hu|eve|${atmosphere}`);
    }
    if (isMorning && atmosphere === "warrior") {
      return pickSeeded(HU_NATIVE.morning_warrior, "hu|war|morning");
    }
    if (atmosphere === "overloaded") {
      return pickSeeded(HU_NATIVE.stabilization, "hu|stab");
    }
    if (atmosphere === "emotional") {
      return pickSeeded(HU_NATIVE.emotional, "hu|emo");
    }
    return null;
  }

  if (locked === "ro") {
    if (isEvening && (atmosphere === "recovery" || atmosphere === "reflective")) {
      const e = pickSeeded(eveningRecovery, `ro|eve|${atmosphere}`);
      return e?.text ? { text: e.text, id: e.id } : null;
    }
    if (isMorning && atmosphere === "warrior") {
      const w = pickSeeded(warriorMode, "ro|war|morning");
      return w?.text ? { text: w.text, id: w.id } : null;
    }
    if (atmosphere === "overloaded") {
      const s = pickSeeded(stabilization, "ro|stab");
      return s?.text ? { text: s.text, id: s.id } : null;
    }
    if (atmosphere === "emotional") {
      const em = pickSeeded(emotionalReset, "ro|emo");
      return em?.text ? { text: em.text, id: em.id } : null;
    }
    return null;
  }

  if (locked === "en") {
    if (isEvening && atmosphere === "recovery") {
      return pickSeeded(EN_NATIVE.evening_recovery, "en|eve");
    }
    if (isMorning && atmosphere === "warrior") {
      return pickSeeded(EN_NATIVE.morning_warrior, "en|war");
    }
  }

  return null;
}

/**
 * @param {'ro'} lang
 */
function pickRomanianGreeting(lang = "ro") {
  if (lang !== "ro") return null;
  const { greetings } = require("./romanianNativePools");
  return pickSeeded(greetings, `ro|greet|${Date.now() >> 10}`);
}

module.exports = { pickNativeMantra, pickRomanianGreeting, HU_NATIVE };
