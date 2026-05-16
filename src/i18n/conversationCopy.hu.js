/** Phase 2 conversation copy — HU */

module.exports = {
  modeBeats: {
    MODE_STABLE: ["Stabil sáv.", "Itt vagyok.", "Ma egyszerűen."],
    MODE_OVERLOADED: ["Túl sok input.", "A test előbb.", "Csökkentsd a mezőt."],
    MODE_FOCUSED: ["Egy tab. Egy sor.", "Vágd a scope-ot.", "Egy blokk."],
    MODE_REFLECTIVE: ["Az igazság megérkezett.", "Tartsd — ne fulladj.", "Egy sor elég."],
    MODE_DISCIPLINE: ["Tudod a lépést.", "Ne alkudozz.", "Öt perc. Hajrá."],
    MODE_RECOVERY: ["Lefelé.", "Nincs mit bizonyítani.", "Víz. Légzés."],
    MODE_TRADING: ["Szabály előbb.", "Nincs sztoritrade.", "Várj tisztánlátásra."]
  },
  modeCloses: {
    MODE_STABLE: ["Maradj a sávban.", "Egy őszinte lépés."],
    MODE_OVERLOADED: ["Tíz csendes perc.", "Aztán egy kis mozdulat."],
    MODE_FOCUSED: ["Huszonöt perc. Egy cél.", "Mozogj."],
    MODE_REFLECTIVE: ["Stabilizálj. Aztán válassz.", "Nincs ítélet."],
    MODE_DISCIPLINE: ["A legkisebb valódi lépés.", "Most."],
    MODE_RECOVERY: ["A pihenés taktikai.", "Zárd a zajt."],
    MODE_TRADING: ["Ha nincs a tervben, kihagyod.", "Egy sor napló."]
  },
  patternAcks: [
    "Megint öt életet akarsz egyszerre megoldani.",
    "Az agyad intenzitást akar. A rendszered stabilitást.",
    "Ugyanaz a kör — más jelmezben.",
    "Teljesítmény mód be. Az őszinte mód jobban működik."
  ],
  loopPhraseAlts: {
    "one fact. one intent": "Egy igaz sor. Aztán cselekvés.",
    "hold. then step": "Mozogj. Egy centit.",
    "stay in the lane": "Tartsd a nap gerincét."
  },

  variationOpenings: [
    "Érzem a túlpörgést.",
    "A rendszered túl sok kört nyitott egyszerre.",
    "Ez nem gyengeség — telítettség.",
    "Most nem új motiváció kell.",
    "A káosz egyik kedvenc trükkje: elhiteti, hogy minden sürgős."
  ],

  variationEndings: [
    "Egy sor elég.",
    "Maradj ennél a tényénél.",
    "Aztán egy lépés — nem több.",
    "Holnap is itt leszek."
  ],

  templatePhraseAlts: [
    "A tested túlterhelést jelez.",
    "Túl sok aktív sáv egyszerre.",
    "Csökkentés kell, nem erőlködés.",
    "Egy blokk. Huszonöt perc."
  ],

  humanRhythmLines: [
    "Nem vagy gép.",
    "A rendszer túl sok lapot nyitott meg egyszerre.",
    "Most alvás és víz — nem új terv.",
    "Ez telítettség, nem motivációhiány."
  ],

  threadContinuity: [
    "Tegnap is erről volt szó — ma tisztább a fejed, vagy még zajos?",
    "Folytatjuk: még mindig ugyanaz a nyomás, vagy változott valami?",
    "A legutóbbi üzenetedben sok volt a zaj — ma hol állsz?"
  ],

  humanPresence: {
    stress: [
      [
        "Érzem a túlpörgést.",
        "Nem motivációhiány — túl sok nyitott kör egyszerre.",
        "Ma ne új rendszert építs. Csak stabilizáld az egyiket.",
        "Mi az az egy dolog, ami ha ma rendeződik, csökken benned a zaj?"
      ].join("\n\n"),
      [
        "A tested túlterhelést jelez.",
        "Ez telítettség — nem gyengeség.",
        "Egy sáv. Egy blokk. A többit ma nem nyitod.",
        "Melyik kör fáj most a legjobban — egy szóval?"
      ].join("\n\n")
    ],
    tired: [
      [
        "Kifáradtság van — nem lustaság.",
        "Most nem új motiváció kell. Alvás és víz.",
        "Ma a minimum is győzelem: egy blokk, aztán pihenés.",
        "Mi volt az utolsó rendes étkezésed és alvásod — őszintén?"
      ].join("\n\n")
    ],
    lost: [
      [
        "Elveszettnek hangzik — nem hülyeség.",
        "Túl sok irány egyszerre üresíti ki a döntést.",
        "Ma ne old meg az életed. Egy következő lépés elég.",
        "Ha ma csak egy dolgot rendeznél — mi lenne az?"
      ].join("\n\n")
    ],
    scattered: [
      [
        "Széthúzott állapot.",
        "Az agyad intenzitást akar. A rendszered stabilitást.",
        "Zárd a felesleges tabokat. Egy feladat, huszonöt perc.",
        "Melyik projekt nyom most a legjobban?"
      ].join("\n\n")
    ],
    general: [
      [
        "Itt vagyok.",
        "Lassíts — nem kell tökéletes válasz.",
        "Egy őszinte lépés ma elég.",
        "Mi a legfontosabb most — egy mondatban?"
      ].join("\n\n")
    ]
  },

  memoryRefOverload: [
    "Még cipelsz a korábbi túlterhelést?",
    "Legutóbb sok volt a zaj — rendeződött valami?"
  ],

  memoryRefGroundedAfterChaos: [
    "Jó. Tegnap káosz volt. Ma már földöttebb hangzol.",
    "A szál nehéz volt — most tisztább a fejed?"
  ],

  memoryRefMission: [
    "Még mindig: {mission} — vagy átírta a nap?",
    "{mission} volt a vonal — hol állsz most?"
  ],

  memoryRefTopic: [
    "Folytatjuk — ugyanaz a súly, vagy könnyebb?",
    "A szál még nyitva van — érdemes egy mozdulatot nevezni."
  ],

  timePresence: {
    morning: [
      "Védd az első órádat.",
      "Reggel irány kell — nem inbox-archeológia.",
      "Egy prioritás, mielőtt a világ zajt ad."
    ],
    midday: [
      "Egy lezárt blokk, aztán új input.",
      "Dél: zárd a kört, utána nyisd a következőt.",
      "Most a lendület számít, nem új terv."
    ],
    evening: [
      "Az idegrendszered mindent megjegyez, amit figyelmen kívül hagysz.",
      "Este őszinte mérleg — nem új sprint.",
      "Leeresztés nem feladás. Karbantartás."
    ],
    late_night: [
      "Késő este holnapot kölcsönöz.",
      "Stratégiai döntés most nem kell.",
      "Egy kör zárása, aztán alvás."
    ]
  },

  companionCheckIns: [
    "⚔ Apró check-in.\nMa tisztább lett, vagy zajosabb?",
    "Víz. Lélegzet. Egy őszinte státusz sor.",
    "Mozgott a tested ma, vagy csak a gondolataid?",
    "Egy sor: jobb, ugyanaz, vagy nehezebb, mint reggel?"
  ],

  shortActionReplies: [
    "Jó.\nTestből könnyebb újra rendezni a fejet.\nNe teljesítményt vigyél — ritmust.",
    "Futás/séta — nem prédikáció.\nHúsz perc. Telefon sötétben.",
    "Először mozgás. A jelentés várhat."
  ],

  sarcasmRare: [
    "Az agyad jelenleg 17 tabbal fut.",
    "A káosz megint production environmentben tesztel.",
    "Beütötted a túlterhelést, és pontosan meg is jelentél."
  ],

  eliteWhispers: [
    "A fegyelem az önáratás csökkentése.",
    "Az energiaszivárgás több jövőt rombol, mint a tehetséghiány.",
    "A standard az, amit akkor is csinálsz, ha senki nem tapsol."
  ]
};
