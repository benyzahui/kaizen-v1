/**
 * Native Romanian pools — grounded, premium (not mechanical translation).
 */

const greetings = [
  "Bună. Sunt aici — un pas pe rând.",
  "Salut. Ritmul de azi contează mai mult decât viteza.",
  "Bună dimineața. Claritate înainte de zgomot.",
  "Salut. Nu trebuie să rezolvi totul acum."
];

const eveningRecovery = [
  {
    id: "ro_eve_hope_1",
    text: "Nu trebuie să repari totul diseară.\nE destul să nu ai renunțat.",
    tags: ["recovery", "hope", "let_go"]
  },
  {
    id: "ro_eve_close_1",
    text: "Mâine reconstruim.\nAcum odihnește-te.",
    tags: ["recovery", "evening"]
  },
  {
    id: "ro_eve_calm_1",
    text: "Presiunea poate coborî.\nCorpul primește voce diseară.",
    tags: ["recovery", "calm"]
  },
  {
    id: "ro_eve_safe_1",
    text: "Ziua se închide.\nValoarea ta rămâne.",
    tags: ["recovery", "hope"]
  }
];

const warriorMode = [
  {
    id: "ro_war_1",
    text: "Protejează focusul.\nAtenția e energie.",
    tags: ["warrior", "focus", "discipline"]
  },
  {
    id: "ro_war_2",
    text: "O bandă.\nO execuție curată.",
    tags: ["warrior", "discipline"]
  },
  {
    id: "ro_war_3",
    text: "Muchie fără zgomot.\nUn obiectiv, gata.",
    tags: ["warrior", "focus"]
  }
];

const stabilization = [
  {
    id: "ro_stab_1",
    text: "Nu e lene.\nSistemul e prea deschis.",
    tags: ["stabilization", "let_go"]
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
  }
];

const emotionalReset = [
  {
    id: "ro_emo_1",
    text: "Nu ești singur cu asta.\nÎncetinește mai întâi.",
    tags: ["emotional", "recovery"]
  },
  {
    id: "ro_emo_2",
    text: "Corpul poate fi obosit înaintea minții.\nOnorează asta.",
    tags: ["emotional", "recovery"]
  }
];

const symbolicEnergy = {
  nervous: [
    "🌊 Astăzi sistemul nervos poate reacționa mai puternic la haos.\nMai puțin zgomot.\nMai multă claritate."
  ],
  evening: [
    "🌘 Energia de seară cere coborâre, nu analiză.",
    "🌘 Ritmul simbolic: eliberare înainte de listă."
  ],
  default: [
    "Ritmul simbolic de azi: structură peste burst.",
    "Tema zilei: un singur canal deschis."
  ]
};

/**
 * @param {'greetings'|'evening'|'warrior'|'stabilization'|'emotional'} kind
 */
function getRomanianPool(kind) {
  const map = {
    greetings,
    evening: eveningRecovery,
    warrior: warriorMode,
    stabilization,
    emotional: emotionalReset
  };
  return map[kind] || [];
}

module.exports = {
  greetings,
  eveningRecovery,
  warriorMode,
  stabilization,
  emotionalReset,
  symbolicEnergy,
  getRomanianPool
};
