/**
 * Dragon Blueprint Knowledge Core — seed content (trilingual, same IDs across languages).
 */

/** @type {Array<object>} */
const MORNING_MANTRA_SEEDS = [
  {
    en: "Hydrate first. Then one breath.",
    hu: "Először víz. Aztán egy lélegzet.",
    ro: "Hidratare întâi. Apoi o respirație.",
    tags: ["hydration", "breathwork"],
    pillar: "hydration",
    energy_state: ["low", "stable", "exhausted"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "Move before motivation arrives.",
    hu: "Mozgás, mielőtt a motiváció jön.",
    ro: "Mișcare înainte de motivație.",
    tags: ["movement", "discipline"],
    pillar: "movement",
    energy_state: ["stable", "high"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "Protect the first hour.",
    hu: "Védd az első órát.",
    ro: "Protejează prima oră.",
    tags: ["discipline", "digital_control"],
    pillar: "digital_control",
    energy_state: ["stable", "high"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "Sunlight or fresh air — two minutes.",
    hu: "Napfény vagy friss levegő — két perc.",
    ro: "Lumină sau aer proaspăt — două minute.",
    tags: ["energy_awareness", "movement"],
    pillar: "energy_awareness",
    energy_state: ["low", "exhausted", "stable"],
    level: ["beginner"]
  },
  {
    en: "One direction. Not ten.",
    hu: "Egy irány. Nem tíz.",
    ro: "O direcție. Nu zece.",
    tags: ["discipline", "focus"],
    pillar: "discipline",
    energy_state: ["stable", "high"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "We return to the path today.",
    hu: "Ma visszatérünk az útra.",
    ro: "Azi revenim pe drum.",
    tags: ["hope", "discipline"],
    pillar: "discipline",
    energy_state: ["low", "stable", "exhausted", "high"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "Low energy is data — not failure.",
    hu: "Az alacsony energia adat — nem bukás.",
    ro: "Energia joasă e informație — nu eșec.",
    tags: ["energy_awareness", "recovery"],
    pillar: "energy_awareness",
    energy_state: ["low", "exhausted"],
    level: ["beginner"]
  },
  {
    en: "Warrior mode: one deep block.",
    hu: "Warrior mód: egy mély blokk.",
    ro: "Mod warrior: un bloc profund.",
    tags: ["discipline", "warrior_push"],
    pillar: "discipline",
    energy_state: ["high", "stable"],
    level: ["advanced"]
  },
  {
    en: "Breathe in. Slow exhale. Begin.",
    hu: "Belélegzés. Lassú kilélegzés. Kezdés.",
    ro: "Inspiră. Expiră lent. Începe.",
    tags: ["breathwork"],
    pillar: "breathwork",
    energy_state: ["low", "stable", "overstimulated", "exhausted"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "I am here beside you. One step.",
    hu: "Itt vagyok melletted. Egy lépés.",
    ro: "Sunt aici lângă tine. Un pas.",
    tags: ["hope", "presence"],
    pillar: "emotional_stability",
    energy_state: ["low", "stable", "exhausted"],
    level: ["beginner"]
  }
];

/** @type {Array<object>} */
const MIDDAY_MANTRA_SEEDS = [
  {
    en: "Stabilize before you push.",
    hu: "Stabilizálj, mielőtt tolod.",
    ro: "Stabilizează înainte să împingi.",
    tags: ["emotional_stability"],
    pillar: "emotional_stability",
    energy_state: ["stable", "high", "overstimulated"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "Water. Posture. One slow breath.",
    hu: "Víz. Testtartás. Egy lassú lélegzet.",
    ro: "Apă. Postură. O respirație lentă.",
    tags: ["hydration", "breathwork"],
    pillar: "hydration",
    energy_state: ["low", "stable", "exhausted"],
    level: ["beginner"]
  },
  {
    en: "Protect attention — one lane.",
    hu: "Védd a figyelmet — egy sáv.",
    ro: "Protejează atenția — o bandă.",
    tags: ["digital_control", "discipline"],
    pillar: "digital_control",
    energy_state: ["stable", "high"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "Midday is structure — not sprint.",
    hu: "A dél struktúra — nem sprint.",
    ro: "Amiaza e structură — nu sprint.",
    tags: ["discipline"],
    pillar: "discipline",
    energy_state: ["stable", "high"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "Overstimulated? Less input. More breath.",
    hu: "Túlingerelt? Kevesebb input. Több lélegzet.",
    ro: "Suprastimulat? Mai puțin input. Mai multă respirație.",
    tags: ["breathwork", "digital_control"],
    pillar: "breathwork",
    energy_state: ["overstimulated", "high"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "One stable block is enough.",
    hu: "Egy stabil blokk elég.",
    ro: "Un bloc stabil e suficient.",
    tags: ["discipline"],
    pillar: "discipline",
    energy_state: ["low", "exhausted", "stable"],
    level: ["beginner"]
  },
  {
    en: "Walk five minutes. Reset the body.",
    hu: "Öt perc séta. Test reset.",
    ro: "Cinci minute de mers. Reset corp.",
    tags: ["movement"],
    pillar: "movement",
    energy_state: ["low", "stable", "exhausted"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "Consistency beats intensity today.",
    hu: "Ma a következetesség nyer az intenzitás ellen.",
    ro: "Azi consecvența bate intensitatea.",
    tags: ["discipline"],
    pillar: "discipline",
    energy_state: ["stable", "low"],
    level: ["intermediate"]
  }
];

/** @type {Array<object>} */
const EVENING_MANTRA_SEEDS = [
  {
    en: "Release the day. Not everything needs solving.",
    hu: "Engedd el a napot. Nem mindent kell megoldani.",
    ro: "Lasă ziua. Nu totul cere soluție.",
    tags: ["evening_release"],
    pillar: "evening_release",
    energy_state: ["low", "stable", "exhausted", "overstimulated"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "Screens down. Breath slower.",
    hu: "Képernyő le. Lassabb légzés.",
    ro: "Ecrane jos. Respirație mai lentă.",
    tags: ["digital_control", "breathwork"],
    pillar: "evening_release",
    energy_state: ["overstimulated", "high", "stable"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "Recovery is part of the path.",
    hu: "A regeneráció is része az útnak.",
    ro: "Recuperarea e parte din drum.",
    tags: ["recovery"],
    pillar: "recovery",
    energy_state: ["exhausted", "low"],
    level: ["beginner"]
  },
  {
    en: "Tomorrow is a new round.",
    hu: "Holnap új kör.",
    ro: "Mâine e un nou ciclu.",
    tags: ["hope", "evening_release"],
    pillar: "evening_release",
    energy_state: ["low", "stable", "exhausted", "high", "overstimulated"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "Let go of what you did not finish.",
    hu: "Engedd el, amit nem fejeztél be.",
    ro: "Lasă ce n-ai terminat.",
    tags: ["evening_release", "emotional_stability"],
    pillar: "emotional_stability",
    energy_state: ["stable", "exhausted", "overstimulated"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "Rest now. Strength rebuilds quietly.",
    hu: "Pihenj most. Az erő csendben épül.",
    ro: "Odihnește acum. Puterea revine în liniște.",
    tags: ["recovery"],
    pillar: "recovery",
    energy_state: ["exhausted", "low"],
    level: ["beginner"]
  },
  {
    en: "Close one loop. Then stop.",
    hu: "Zárj egy kört. Aztán állj meg.",
    ro: "Închide un ciclu. Apoi oprește-te.",
    tags: ["discipline", "evening_release"],
    pillar: "evening_release",
    energy_state: ["stable", "high"],
    level: ["advanced"]
  },
  {
    en: "Fasting awareness: gentle close to food window.",
    hu: "Böjt tudatosság: lágy zárás az étkezési ablaknál.",
    ro: "Conștientizare post: închidere blândă a ferestrei.",
    tags: ["fasting_awareness"],
    pillar: "fasting_awareness",
    energy_state: ["stable", "high", "low"],
    level: ["intermediate", "advanced"]
  }
];

/** @type {Array<object>} */
const DRAGON_QUOTE_SEEDS = [
  {
    en: "The dragon builds in silence.",
    hu: "A sárkány csendben épül.",
    ro: "Dragonul se construiește în liniște.",
    tags: ["discipline", "mastery"],
    level: ["advanced"]
  },
  {
    en: "Rhythm holds what motivation cannot.",
    hu: "A ritmus tartja, amit a motiváció nem.",
    ro: "Ritmul ține ce motivația nu poate.",
    tags: ["discipline", "hope"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "Return to the path — not to perfection.",
    hu: "Vissza az útra — nem a tökéletességhez.",
    ro: "Înapoi pe drum — nu spre perfecțiune.",
    tags: ["recovery", "hope"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "Control the input. Protect the mind.",
    hu: "Kontrolláld az inputot. Védd az elmét.",
    ro: "Controlează inputul. Protejează mintea.",
    tags: ["digital_control"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "Strength is calm repetition.",
    hu: "Az erő nyugodt ismétlés.",
    ro: "Puterea e repetiție calmă.",
    tags: ["discipline"],
    level: ["beginner", "intermediate", "advanced"]
  }
];

/** @type {Array<object>} */
const LOW_ENERGY_PROTOCOL_SEEDS = [
  {
    en: "🌊 Low Energy Reset",
    hu: "🌊 Alacsony energia reset",
    ro: "🌊 Reset energie joasă",
    actions: {
      en: ["water", "slow breath ×5", "2 min walk", "no pressure"],
      hu: ["víz", "lassú légzés ×5", "2 perc séta", "nincs nyomás"],
      ro: ["apă", "respirație lentă ×5", "2 min mers", "fără presiune"]
    },
    tags: ["hydration", "breathwork", "movement"],
    energy_state: ["low", "exhausted"],
    level: ["beginner"],
    intensity: "low"
  },
  {
    en: "🫀 Gentle Body Return",
    hu: "🫀 Finom test-visszatérés",
    ro: "🫀 Revenire blândă la corp",
    actions: {
      en: ["shoulder roll", "neck release", "notice fatigue", "rest if needed"],
      hu: ["váll körzés", "nyak lazítás", "fáradtság észlelése", "pihenés ha kell"],
      ro: ["rotește umerii", "relaxare gât", "observă oboseala", "odihnă dacă e nevoie"]
    },
    tags: ["movement", "recovery"],
    energy_state: ["low", "exhausted"],
    level: ["beginner", "intermediate"],
    intensity: "low"
  }
];

/** @type {Array<object>} */
const HIGH_ENERGY_PROTOCOL_SEEDS = [
  {
    en: "⚔ Warrior Block",
    hu: "⚔ Warrior blokk",
    ro: "⚔ Bloc warrior",
    actions: {
      en: ["phone face down", "25 min deep work", "one lane", "hydrate after"],
      hu: ["telefon lefelé", "25 perc mély munka", "egy sáv", "víz utána"],
      ro: ["telefon cu fața în jos", "25 min muncă profundă", "o bandă", "apă după"]
    },
    tags: ["discipline", "warrior_push"],
    energy_state: ["high", "stable"],
    level: ["advanced", "intermediate"],
    intensity: "high"
  },
  {
    en: "🔥 Execute Window",
    hu: "🔥 Végrehajtási ablak",
    ro: "🔥 Fereastră de execuție",
    actions: {
      en: ["clear desk", "one priority", "40 min focus", "log win"],
      hu: ["tiszta asztal", "egy prioritás", "40 perc fókusz", "rögzítsd a kört"],
      ro: ["birou curat", "o prioritate", "40 min focus", "notează ciclul"]
    },
    tags: ["discipline"],
    energy_state: ["high", "stable"],
    level: ["intermediate", "advanced"],
    intensity: "high"
  }
];

/** @type {Array<object>} */
const REFLECTION_SEEDS = [
  {
    en: "What drained your energy today?",
    hu: "Mi vitte el ma az energiád?",
    ro: "Ce ți-a drenat energia azi?",
    tags: ["energy_awareness"],
    energy_state: ["low", "stable", "exhausted", "high", "overstimulated"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "What one thing did you protect well?",
    hu: "Mit védtél jól ma — egy dolgot?",
    ro: "Ce ai protejat bine azi — un lucru?",
    tags: ["discipline"],
    energy_state: ["stable", "high"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "What can you release tonight?",
    hu: "Mit engedhetsz el ma este?",
    ro: "Ce poți lăsa diseară?",
    tags: ["evening_release", "emotional_stability"],
    energy_state: ["low", "stable", "exhausted", "overstimulated"],
    level: ["beginner", "intermediate", "advanced"]
  },
  {
    en: "Did you honor your body's signals?",
    hu: "Figyeltél a tested jelzéseire?",
    ro: "Ai respectat semnalele corpului?",
    tags: ["recovery", "movement"],
    energy_state: ["low", "exhausted", "stable"],
    level: ["beginner"]
  }
];

/** @type {Array<object>} */
const MICRO_CHALLENGE_SEEDS = [
  {
    en: "🌊 Five slow exhales. Now.",
    hu: "🌊 Öt lassú kilélegzés. Most.",
    ro: "🌊 Cinci expirații lente. Acum.",
    tags: ["breathwork"],
    energy_state: ["low", "stable", "exhausted", "overstimulated"],
    level: ["beginner"]
  },
  {
    en: "🫀 Stand. Roll shoulders. 60 seconds.",
    hu: "🫀 Állj fel. Váll körzés. 60 másodperc.",
    ro: "🫀 Ridică-te. Rotește umerii. 60 secunde.",
    tags: ["movement"],
    energy_state: ["low", "stable", "exhausted"],
    level: ["beginner", "intermediate"]
  },
  {
    en: "⚔ One screen-free block: 15 minutes.",
    hu: "⚔ Egy képernyőmentes blokk: 15 perc.",
    ro: "⚔ Un bloc fără ecran: 15 minute.",
    tags: ["digital_control"],
    energy_state: ["stable", "high", "overstimulated"],
    level: ["intermediate", "advanced"]
  },
  {
    en: "🌘 Write one line to release. Then stop.",
    hu: "🌘 Írj egy sort az elengedéshez. Aztán állj.",
    ro: "🌘 Scrie o linie de eliberare. Apoi oprește-te.",
    tags: ["evening_release"],
    energy_state: ["stable", "exhausted", "overstimulated"],
    level: ["beginner", "intermediate", "advanced"]
  }
];

module.exports = {
  MORNING_MANTRA_SEEDS,
  MIDDAY_MANTRA_SEEDS,
  EVENING_MANTRA_SEEDS,
  DRAGON_QUOTE_SEEDS,
  LOW_ENERGY_PROTOCOL_SEEDS,
  HIGH_ENERGY_PROTOCOL_SEEDS,
  REFLECTION_SEEDS,
  MICRO_CHALLENGE_SEEDS
};
