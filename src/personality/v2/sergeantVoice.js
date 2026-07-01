/**
 * Hadnagy hang — durva, vicces, motiváló. Nem símogat. Nem szégyenít.
 */

const { lines } = require("../kaizenVoice");

const VOICE_RULES = {
  style: "sergeant_major",
  traits: ["direct", "dry_humor", "tough_love", "short_orders"],
  never: ["therapy", "coddling", "shame", "insults_at_person"]
};

const EMOTIONAL = {
  tired: {
    hu: lines(
      "🐉 Hallom — kimerült vagy.",
      "Nem sírunk rá. Nem magyarázkodunk.",
      "",
      "Hadnagy parancs:",
      "💧 Víz.",
      "🧘 5 lassú lélegzet.",
      "🌿 5 perc séta.",
      "",
      "A kanapé nem hadvezér. Te vagy. Egy lépés elég."
    ),
    en: lines(
      "🐉 Copy — you're drained.",
      "No pity party. No lecture.",
      "",
      "Sergeant's orders:",
      "💧 Water.",
      "🧘 5 slow breaths.",
      "🌿 5-minute walk.",
      "",
      "The couch isn't your CO. You are. One step counts."
    ),
    ro: lines(
      "🐉 Am înțeles — ești epuizat.",
      "Fără dramă. Fără predici.",
      "",
      "Ordin:",
      "💧 Apă.",
      "🧘 5 respirații lente.",
      "🌿 5 minute de mers.",
      "",
      "Canapeaua nu e comandantul. Tu ești. Un pas e suficient."
    ),
    suggestedAction: "/breath",
    gifContext: "recovery_encouragement"
  },
  motivated: {
    hu: lines(
      "🐉 Na végre — energia megvan.",
      "Ne pazarold szét story-kra.",
      "",
      "🔥 Egy sáv. Egy blokk. Egy lezárás.",
      "🎯 A motiváció később jön. A mozgás most.",
      "",
      "Rajta. Vissza az útra."
    ),
    en: lines(
      "🐉 Good — energy's on deck.",
      "Don't waste it on scrolling.",
      "",
      "🔥 One lane. One block. One close.",
      "🎯 Motivation shows up later. Motion now.",
      "",
      "Move. Back to the path."
    ),
    ro: lines(
      "🐉 Bine — ai energie.",
      "Nu o arde pe scroll.",
      "",
      "🔥 O bandă. Un bloc. O închidere.",
      "🎯 Motivația vine după. Mișcarea acum.",
      "",
      "Execută. Înapoi pe drum."
    ),
    suggestedAction: "/challenge",
    gifContext: "discipline"
  },
  ashamed: {
    hu: lines(
      "🐉 Kihagytad? Oké.",
      "A hadnagy nem a múltat nézi.",
      "",
      "A visszatérés dönt — nem a kihagyás.",
      "",
      "Egy kis lépés. Most. Nem holnap.",
      "A tökéletesség mese. A fegyelem valóság."
    ),
    en: lines(
      "🐉 You skipped? Fine.",
      "The sergeant doesn't review the past.",
      "",
      "The return decides — not the skip.",
      "",
      "One small step. Now. Not tomorrow.",
      "Perfection's a fairy tale. Discipline is real."
    ),
    ro: lines(
      "🐉 Ai sărit? Bine.",
      "Sergentul nu judecă trecutul.",
      "",
      "Revenirea decide — nu omisiunea.",
      "",
      "Un pas mic. Acum. Nu mâine.",
      "Perfecțiunea e basm. Disciplina e reală."
    ),
    suggestedAction: "/program",
    gifContext: "recovery_encouragement"
  }
};

const ENERGY_HINTS = {
  low: {
    hu: "Lassú tempó. De nem nulla. Víz. Légzés. Egy lépés.",
    en: "Slow pace. Not zero. Water. Breath. One step.",
    ro: "Ritm lent. Nu zero. Apă. Respirație. Un pas."
  },
  stable: {
    hu: "Egy sáv. Egy feladat. Ne szóródj.",
    en: "One lane. One task. Don't scatter.",
    ro: "O bandă. O sarcină. Fără dispersie."
  },
  high: {
    hu: "Erős ablak. Ne beszélj róla — csináld.",
    en: "Strong window. Less talk — execute.",
    ro: "Fereastră puternică. Mai puțin vorbit — execută."
  },
  overstimulated: {
    hu: "Túl sok input. Csökkents. Lélegezz. Egy dolog.",
    en: "Too much input. Cut it. Breathe. One thing.",
    ro: "Prea mult input. Taie. Respiră. Un lucru."
  },
  exhausted: {
    hu: "Regeneráció először. De ne tűnj el — egy minimum.",
    en: "Recovery first. But don't vanish — one minimum.",
    ro: "Recuperare întâi. Dar nu dispărea — un minim."
  }
};

const DAILY_PRESENCE = {
  hu: {
    morning: [
      "☀️ Fel! Vissza az útra.",
      "🐉 Reggel. Egy lépés. Nem tíz.",
      "💧 Víz. Légzés. Aztán rajta."
    ],
    midday: [
      "🎯 Dél. Egy blokk. Nem három.",
      "⚡ Szétszóródtál? Egy sáv.",
      "🌿 Recenter. Hadnagy nem vár örökké."
    ],
    evening: [
      "🌙 Este. Zárd le a napot.",
      "🪞 Mi ment? Mi marad? Holnap új kör.",
      "🧘 Pihenj. De holnap felállsz."
    ]
  },
  en: {
    morning: [
      "☀️ Up. Back to the path.",
      "🐉 Morning. One step. Not ten.",
      "💧 Water. Breath. Then move."
    ],
    midday: [
      "🎯 Midday. One block. Not three.",
      "⚡ Scattered? One lane.",
      "🌿 Recenter. The sergeant won't wait forever."
    ],
    evening: [
      "🌙 Evening. Close the day.",
      "🪞 What worked? What stays? Tomorrow's new.",
      "🧘 Rest. But you stand up tomorrow."
    ]
  },
  ro: {
    morning: [
      "☀️ Sus. Înapoi pe drum.",
      "🐉 Dimineață. Un pas. Nu zece.",
      "💧 Apă. Respirație. Apoi mișcare."
    ],
    midday: [
      "🎯 Amiază. Un bloc. Nu trei.",
      "⚡ Împrăștiat? O bandă.",
      "🌿 Recenter. Sergentul nu așteaptă la infinit."
    ],
    evening: [
      "🌙 Seară. Închide ziua.",
      "🪞 Ce a mers? Ce rămâne? Mâine e nou.",
      "🧘 Odihnește. Dar mâine te ridici."
    ]
  }
};

const RETURNING = {
  hu: (name) =>
    lines(
      `🐉 Üdv vissza a sorban${name ? `, ${name}` : ""}.`,
      "Hadnagy mód: nem símogatunk — építünk.",
      ""
    ),
  en: (name) =>
    lines(
      `🐉 Back in formation${name ? `, ${name}` : ""}.`,
      "Sergeant mode: no coddling — we build.",
      ""
    ),
  ro: (name) =>
    lines(
      `🐉 Înapoi în formație${name ? `, ${name}` : ""}.`,
      "Mod sergent: fără mângâiere — construim.",
      ""
    )
};

const MANTRA_INTRO = {
  hu: "🪞 Mai parancs (mantra):",
  en: "🪞 Today's order (mantra):",
  ro: "🪞 Ordinul de azi (mantra):"
};

const RETURN_FOOTER = {
  hu: "→ /menu vagy írj. De ne üresen.",
  en: "→ /menu or write. Not empty.",
  ro: "→ /menu sau scrie. Nu gol."
};

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function sergeantEnergyHint(energyId, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pack = ENERGY_HINTS[energyId] || ENERGY_HINTS.stable;
  return pack[locked] || pack.en;
}

module.exports = {
  VOICE_RULES,
  EMOTIONAL,
  ENERGY_HINTS,
  DAILY_PRESENCE,
  RETURNING,
  MANTRA_INTRO,
  RETURN_FOOTER,
  sergeantEnergyHint
};
