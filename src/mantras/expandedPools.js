/**
 * Expanded mantra pools — 100+ structured entries (id, category, language, intensity, atmosphere, text).
 */

const { CATEGORIES, CATEGORY_META } = require("./categoryMap");

/** @type {Record<string, Record<'en'|'hu'|'ro', string[]>>} */
const POOL_TEXT = {
  activation: {
    en: [
      "Protect the first hour.",
      "One direction is enough.",
      "Move before motivation.",
      "Hydrate. Breathe. Begin.",
      "Clarity before intensity."
    ],
    hu: [
      "Védd az első órát.",
      "Egy irány elég.",
      "Mozgás motiváció előtt.",
      "Víz. Légzés. Kezdés.",
      "Tisztánlátás az intenzitás előtt."
    ],
    ro: [
      "Protejează prima oră.",
      "O direcție e suficientă.",
      "Mișcarea înaintea motivației.",
      "Apă. Respirație. Start.",
      "Claritate înainte de intensitate."
    ]
  },
  discipline: {
    en: [
      "One lane until done.",
      "Structure beats mood.",
      "Finish one block clean.",
      "No side quests today.",
      "Discipline is quiet execution."
    ],
    hu: [
      "Egy sáv, amíg kész.",
      "A struktúra nyer a hangulat ellen.",
      "Egy blokk tisztán.",
      "Ma nincs mellékküldetés.",
      "A fegyelem csendes végrehajtás."
    ],
    ro: [
      "O bandă până e gata.",
      "Structura bate starea.",
      "Un bloc curat.",
      "Fără side quest-uri azi.",
      "Disciplina e execuție liniștită."
    ]
  },
  stabilization: {
    en: [
      "Ground before push.",
      "Water. Slow exhale. One step.",
      "Lower noise first.",
      "Anchor the nervous system.",
      "Stability before intensity."
    ],
    hu: [
      "Földölj nyomás előtt.",
      "Víz. Lassú kilélegzés. Egy lépés.",
      "Előbb csökkentsd a zajt.",
      "Horgonyozd az idegrendszert.",
      "Stabilitás az intenzitás előtt."
    ],
    ro: [
      "Ancorează înainte de push.",
      "Apă. Expirație lentă. Un pas.",
      "Mai întâi mai puțin zgomot.",
      "Ancorează sistemul nervos.",
      "Stabilitate înainte de intensitate."
    ]
  },
  overload: {
    en: [
      "Too many open loops.",
      "Close one channel.",
      "Simpler is faster now.",
      "Less input. More clarity.",
      "One anchor, then stop."
    ],
    hu: [
      "Túl sok nyitott kör.",
      "Zárj egy csatornát.",
      "Most az egyszerűbb gyorsabb.",
      "Kevesebb input. Több tisztánlátás.",
      "Egy horgony, aztán stop."
    ],
    ro: [
      "Prea multe bucle deschise.",
      "Închide un canal.",
      "Acum simplu e mai rapid.",
      "Mai puțin input. Mai multă claritate.",
      "O ancoră, apoi stop."
    ]
  },
  recovery: {
    en: [
      "Rest is part of the work.",
      "Recovery is not quitting.",
      "Lower the load tonight.",
      "Body first, then plans.",
      "Not giving up is enough."
    ],
    hu: [
      "A pihenés is a munka része.",
      "A felépülés nem feladás.",
      "Ma este csökkentsd a terhet.",
      "Test előbb, terv utána.",
      "Elég hogy nem adtad fel."
    ],
    ro: [
      "Odihna e parte din muncă.",
      "Recuperarea nu e renunțare.",
      "Diseară coboară sarcina.",
      "Corpul întâi, planul după.",
      "E destul să nu fi renunțat."
    ]
  },
  focus: {
    en: [
      "Attention is energy.",
      "Protect focus like fuel.",
      "One task visible.",
      "Close the leak.",
      "Return to one lane."
    ],
    hu: [
      "A figyelem energia.",
      "Védd a fókuszt, mint az üzemanyagot.",
      "Egy feladat látható.",
      "Zárd a szivárgást.",
      "Vissza egy sávra."
    ],
    ro: [
      "Atenția e energie.",
      "Protejează focusul ca pe combustibil.",
      "Un task vizibil.",
      "Închide scurgerea.",
      "Înapoi pe o bandă."
    ]
  },
  warrior: {
    en: [
      "Protect focus. Execute clean.",
      "One lane. Full presence.",
      "Edge without noise.",
      "Train the standard.",
      "Silent execution window."
    ],
    hu: [
      "Védd a fókuszt. Tiszta végrehajtás.",
      "Egy sáv. Teljes jelenlét.",
      "Él mélyen, zaj nélkül.",
      "Edzd a standardot.",
      "Csendes végrehajtási ablak."
    ],
    ro: [
      "Protejează focusul. Execuție curată.",
      "O bandă. Prezență totală.",
      "Muchie fără zgomot.",
      "Antrenează standardul.",
      "Fereastră de execuție în liniște."
    ]
  },
  emotional_reset: {
    en: [
      "Slow down first.",
      "You do not carry this alone.",
      "Name it once, then breathe.",
      "Body may be tired before the mind.",
      "One honest step is enough."
    ],
    hu: [
      "Előbb lassíts.",
      "Nem egyedül cipeled.",
      "Nevezd meg egyszer, aztán lélegezz.",
      "A tested előbb fáradt lehet.",
      "Egy őszinte lépés elég."
    ],
    ro: [
      "Încetinește mai întâi.",
      "Nu duci asta singur.",
      "Numește o dată, apoi respiră.",
      "Corpul poate fi obosit înaintea minții.",
      "Un pas sincer e suficient."
    ]
  },
  fasting: {
    en: [
      "Hydrate before restriction.",
      "Reset without punishment.",
      "Clean window, not chaos.",
      "Nervous system first.",
      "Water is the first reset."
    ],
    hu: [
      "Hidratálás korlátozás előtt.",
      "Reset büntetés nélkül.",
      "Tiszta ablak, nem káosz.",
      "Idegrendszer előbb.",
      "A víz az első reset."
    ],
    ro: [
      "Hidratare înainte de restricție.",
      "Reset fără pedeapsă.",
      "Fereastră curată, nu haos.",
      "Sistemul nervos întâi.",
      "Apa e primul reset."
    ]
  },
  movement: {
    en: [
      "Move once. Log it. Done.",
      "Body carries focus.",
      "Walk unlocks the mind.",
      "Movement without drama.",
      "Five minutes still counts."
    ],
    hu: [
      "Mozogj egyszer. Jegyezd. Kész.",
      "A test hordozza a fókuszt.",
      "A séta feloldja a fejet.",
      "Mozgás dráma nélkül.",
      "Öt perc is számít."
    ],
    ro: [
      "Mișcă-te o dată. Notează. Gata.",
      "Corpul poartă focusul.",
      "Mersul deblochează mintea.",
      "Mișcare fără dramă.",
      "Cinci minute contează."
    ]
  },
  silence: {
    en: [
      "Less noise tonight.",
      "Quiet is structure.",
      "Silence before new plans.",
      "Let the day close.",
      "Stillness is discipline."
    ],
    hu: [
      "Kevesebb zaj ma este.",
      "A csend is struktúra.",
      "Csend új tervek előtt.",
      "Engedd le a napot.",
      "A nyugalom is fegyelem."
    ],
    ro: [
      "Mai puțin zgomot diseară.",
      "Liniștea e structură.",
      "Tăcere înainte de planuri noi.",
      "Lasă ziua să se închidă.",
      "Starea de calm e disciplină."
    ]
  },
  trading: {
    en: [
      "Rules before screen.",
      "Risk cap first.",
      "No revenge trades.",
      "Plan written, then entries.",
      "Psychology before clicks."
    ],
    hu: [
      "Szabály a képernyő előtt.",
      "Kockázati limit először.",
      "Nincs bosszú trade.",
      "Terv papíron, aztán belépés.",
      "Pszichológia kattintás előtt."
    ],
    ro: [
      "Reguli înainte de ecran.",
      "Plafon de risc întâi.",
      "Fără trade de răzbunare.",
      "Plan scris, apoi intrări.",
      "Psihologie înainte de click."
    ]
  },
  letting_go: {
    en: [
      "You do not fix everything tonight.",
      "Close one loop. Leave the rest.",
      "Release before sleep.",
      "Tomorrow rebuilds.",
      "Letting go is progress."
    ],
    hu: [
      "Nem kell ma mindent megjavítani.",
      "Zárj egy kört. A többit hagyd.",
      "Elengedés alvás előtt.",
      "Holnap újra építünk.",
      "Az elengedés is haladás."
    ],
    ro: [
      "Nu repari totul diseară.",
      "Închide o buclă. Restul așteaptă.",
      "Eliberare înainte de somn.",
      "Mâine reconstruim.",
      "Eliberarea e progres."
    ]
  }
};

const INTENSITY_BY_CATEGORY = {
  warrior: "high",
  activation: "medium",
  overload: "low",
  recovery: "low",
  emotional_reset: "low",
  letting_go: "low",
  silence: "low"
};

const ATMOSPHERE_BY_CATEGORY = {
  warrior: "warrior",
  activation: "calm",
  overload: "overloaded",
  recovery: "recovery",
  emotional_reset: "emotional",
  letting_go: "reflective",
  silence: "reflective",
  stabilization: "grounded",
  discipline: "calm",
  focus: "calm",
  trading: "calm",
  movement: "grounded",
  fasting: "grounded"
};

/**
 * @param {string} category
 */
function phasesForCategory(category) {
  return CATEGORY_META[category]?.phases || ["morning", "midday", "evening"];
}

function buildExpandedPools() {
  /** @type {object[]} */
  const entries = [];

  for (const category of CATEGORIES) {
    for (const language of ["en", "hu", "ro"]) {
      const texts = POOL_TEXT[category]?.[language] || [];
      texts.forEach((text, i) => {
        entries.push({
          id: `exp_${category}_${language}_${String(i + 1).padStart(2, "0")}`,
          category,
          language,
          intensity: INTENSITY_BY_CATEGORY[category] || "medium",
          atmosphere: ATMOSPHERE_BY_CATEGORY[category] || "calm",
          text: text.trim(),
          phases: phasesForCategory(category),
          tags: [category, ...(CATEGORY_META[category]?.tags || [])]
        });
      });
    }
  }

  return entries;
}

const EXPANDED_MANTRAS = buildExpandedPools();

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function getExpandedForLang(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return EXPANDED_MANTRAS.filter((e) => e.language === locked);
}

function totalExpandedCount() {
  return EXPANDED_MANTRAS.length;
}

module.exports = {
  EXPANDED_MANTRAS,
  POOL_TEXT,
  buildExpandedPools,
  getExpandedForLang,
  totalExpandedCount
};
