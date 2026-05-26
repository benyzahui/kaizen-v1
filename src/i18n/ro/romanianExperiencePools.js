/**
 * Native Romanian experience pools — calm, grounded, concise (not HU-translated).
 */

/** @type {string[]} */
const greetings = [
  "Bună. Sunt aici — un pas pe rând.",
  "Salut. Ritmul de azi contează mai mult decât viteza.",
  "Bună dimineața. Claritate înainte de zgomot.",
  "Salut. Nu trebuie să rezolvi totul acum.",
  "Bună. Mai puțin zgomot. Mai multă claritate.",
  "Salut. Un fir. Nu zece."
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const morningActivation = [
  {
    id: "ro_morn_1",
    text: "⚔ Dimineață curată.\nO direcție — nu zece.",
    tags: ["activation", "discipline"]
  },
  {
    id: "ro_morn_2",
    text: "⚔ Protejează focusul.\nAtenția e energie.",
    tags: ["activation", "focus"]
  },
  {
    id: "ro_morn_3",
    text: "🫀 Apă. Respirație.\nApoi un singur task.",
    tags: ["activation", "body"]
  },
  {
    id: "ro_morn_4",
    text: "Nu trebuie start perfect.\nDoar prezent.",
    tags: ["activation"]
  },
  {
    id: "ro_morn_5",
    text: "⚔ Un bloc curat.\nFără telefon în el.",
    tags: ["discipline", "focus"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const middayCorrection = [
  {
    id: "ro_mid_1",
    text: "☀ Încă în ritmul tău,\nsau zgomotul conduce deja?",
    tags: ["midday", "awareness"]
  },
  {
    id: "ro_mid_2",
    text: "Prea multe cercuri deschise.\nÎnchide unul.",
    tags: ["midday", "discipline"]
  },
  {
    id: "ro_mid_3",
    text: "Mai puțin zgomot.\nMai multă claritate.",
    tags: ["midday", "stabilization"]
  },
  {
    id: "ro_mid_4",
    text: "☀ Corecție simplă:\napă, postură, un focus.",
    tags: ["midday", "correction"]
  },
  {
    id: "ro_mid_5",
    text: "Nu lăsa energia să se scurgă.\nUn canal deschis.",
    tags: ["midday", "focus"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const eveningRecovery = [
  {
    id: "ro_eve_1",
    text: "🌘 Nu trebuie să repari tot în seara asta.\nE destul să nu renunți.",
    tags: ["recovery", "evening"]
  },
  {
    id: "ro_eve_2",
    text: "🌘 Nu mai trebuie să duci ziua.\nRecuperarea e parte din program.",
    tags: ["recovery", "evening"]
  },
  {
    id: "ro_eve_3",
    text: "Mâine reconstruim.\nAcum odihnește-te.",
    tags: ["recovery", "evening"]
  },
  {
    id: "ro_eve_4",
    text: "🌘 Presiunea poate coborî.\nCorpul primește voce diseară.",
    tags: ["recovery", "calm"]
  },
  {
    id: "ro_eve_5",
    text: "Ziua se închide.\nValoarea ta rămâne.",
    tags: ["recovery", "hope"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const stabilization = [
  {
    id: "ro_stab_1",
    text: "🫀 Nu e lene.\nSistemul e prea deschis.",
    tags: ["stabilization"]
  },
  {
    id: "ro_stab_2",
    text: "Apă. Respirație. Un pas.\nAtât pentru acum.",
    tags: ["stabilization", "recovery"]
  },
  {
    id: "ro_stab_3",
    text: "Mai puțin zgomot.\nMai multă claritate.",
    tags: ["stabilization"]
  },
  {
    id: "ro_stab_4",
    text: "🌊 Ancoră în corp\nînainte de presiune.",
    tags: ["stabilization", "body"]
  },
  {
    id: "ro_stab_5",
    text: "Un pas stabil.\nNu un plan nou.",
    tags: ["stabilization"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const overload = [
  {
    id: "ro_ov_1",
    text: "🌊 Prea multe cercuri deschise.\nÎnchide unul — restul așteaptă.",
    tags: ["overload", "stabilization"]
  },
  {
    id: "ro_ov_2",
    text: "🫀 Respirație întâi.\nApoi decizia.",
    tags: ["overload", "body"]
  },
  {
    id: "ro_ov_3",
    text: "Acum nu construi un sistem nou.\nUn pas.",
    tags: ["overload", "one_thing"]
  },
  {
    id: "ro_ov_4",
    text: "🌊 Sistemul nervos e încărcat.\nMai puțin input.",
    tags: ["overload", "nervous"]
  },
  {
    id: "ro_ov_5",
    text: "O direcție.\nNu cinci.",
    tags: ["overload", "chaos"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const discipline = [
  {
    id: "ro_disc_1",
    text: "⚔ Un angajament.\nFără negociere.",
    tags: ["discipline", "focus"]
  },
  {
    id: "ro_disc_2",
    text: "⚔ Închide cel mai mic cerc deschis.",
    tags: ["discipline"]
  },
  {
    id: "ro_disc_3",
    text: "Disciplina e o acțiune vizibilă.\nNu o stare.",
    tags: ["discipline"]
  },
  {
    id: "ro_disc_4",
    text: "⚔ Un bloc — prezență totală.",
    tags: ["discipline", "focus"]
  },
  {
    id: "ro_disc_5",
    text: "Execuție curată.\nFără dramă.",
    tags: ["discipline"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const warriorMode = [
  {
    id: "ro_war_1",
    text: "🔥 Protejează focusul.\nAtenția e energie.",
    tags: ["warrior", "focus"]
  },
  {
    id: "ro_war_2",
    text: "🔥 O bandă.\nO execuție curată.",
    tags: ["warrior", "discipline"]
  },
  {
    id: "ro_war_3",
    text: "Muchie fără zgomot.\nUn obiectiv, gata.",
    tags: ["warrior"]
  },
  {
    id: "ro_war_4",
    text: "🔥 Antrenează muchia — nu povestea.",
    tags: ["warrior", "training"]
  },
  {
    id: "ro_war_5",
    text: "Forță fără dramă.\nUn rep sau un minut greu.",
    tags: ["warrior"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const tradingPsychology = [
  {
    id: "ro_trade_1",
    text: "📉 Reguli înainte de ecran.\nImpulsul după.",
    tags: ["trading", "discipline"]
  },
  {
    id: "ro_trade_2",
    text: "📉 Setup sau impuls?\nOnest, acum.",
    tags: ["trading", "awareness"]
  },
  {
    id: "ro_trade_3",
    text: "🫀 Cum e corpul înainte de trade?",
    tags: ["trading", "body"]
  },
  {
    id: "ro_trade_4",
    text: "📉 Fără trade de răzbunare.\nÎnchide sesiunea.",
    tags: ["trading", "recovery"]
  },
  {
    id: "ro_trade_5",
    text: "Calm sau demonstrezi ceva?\nAlege înainte.",
    tags: ["trading", "focus"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const emotionalReset = [
  {
    id: "ro_emo_1",
    text: "🫀 Nu ești singur cu asta.\nÎncetinește mai întâi.",
    tags: ["emotional", "recovery"]
  },
  {
    id: "ro_emo_2",
    text: "Corpul poate fi obosit înaintea minții.\nOnorează asta.",
    tags: ["emotional", "body"]
  },
  {
    id: "ro_emo_3",
    text: "🌊 Nu trebuie să repari tot acum.\nUn pas e suficient.",
    tags: ["emotional", "stabilization"]
  },
  {
    id: "ro_emo_4",
    text: "Lasă zgomotul să coboare.\nApoi decizi.",
    tags: ["emotional", "calm"]
  },
  {
    id: "ro_emo_5",
    text: "🫀 Respirație.\nApoi un singur fir.",
    tags: ["emotional", "reset"]
  }
];

/** @type {Array<{ id: string, text: string, tags?: string[] }>} */
const programContinuity = [
  {
    id: "ro_prog_1",
    text: "🐉 Sistemul se construiește din repetiție.",
    tags: ["program"]
  },
  {
    id: "ro_prog_2",
    text: "🌱 Din bucle mici vine stabilitatea.",
    tags: ["program"]
  },
  {
    id: "ro_prog_3",
    text: "🐉 Proces lung — ciclul de azi e suficient.",
    tags: ["program"]
  }
];

const symbolicEnergy = {
  nervous: [
    "🌊 Sistemul nervos reacționează la haos.\nMai puțin zgomot. Mai multă claritate."
  ],
  evening: [
    "🌘 Energia de seară cere coborâre, nu analiză.",
    "🌘 Ritmul: eliberare înainte de listă."
  ],
  default: [
    "Ritmul de azi: structură peste burst.",
    "Tema zilei: un singur canal deschis."
  ]
};

const POOL_KEYS = [
  "greetings",
  "morningActivation",
  "middayCorrection",
  "eveningRecovery",
  "stabilization",
  "overload",
  "discipline",
  "warriorMode",
  "tradingPsychology",
  "emotionalReset",
  "programContinuity"
];

/**
 * @param {string} kind
 */
function getPool(kind) {
  const map = {
    greetings,
    morningActivation,
    middayCorrection,
    eveningRecovery,
    stabilization,
    overload,
    discipline,
    warriorMode,
    tradingPsychology,
    emotionalReset,
    programContinuity,
    evening: eveningRecovery,
    warrior: warriorMode,
    emotional: emotionalReset,
    trading: tradingPsychology
  };
  return map[kind] || [];
}

module.exports = {
  POOL_KEYS,
  greetings,
  morningActivation,
  middayCorrection,
  eveningRecovery,
  stabilization,
  overload,
  discipline,
  warriorMode,
  tradingPsychology,
  emotionalReset,
  programContinuity,
  symbolicEnergy,
  getPool
};
