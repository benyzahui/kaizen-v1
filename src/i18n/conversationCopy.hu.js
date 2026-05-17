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

  humanLines: {
    stress: [
      "Ez már inkább túlterhelésnek hangzik, mint motivációhiánynak.",
      "A tested nem lustaságot jelez — túl sok nyomás egyszerre."
    ],
    tired: [
      "Kifáradtság van. Most nem új cél kell — pihenés.",
      "Érződik, hogy régóta nyomod megállás nélkül."
    ],
    scattered: [
      "Ha mindent egyszerre próbálsz tartani, a rendszer széthúzódik.",
      "Nem gyengeség — túl sok nyitott kör fut egyszerre."
    ],
    general: [
      "Itt vagyok. Lassíts — nem kell tökéletes válasz.",
      "Egy őszinte lépés ma elég."
    ]
  },

  microEmotional: {
    shame: [
      "A szégyen nem gyengeség — túl magas elvárás hangzik mögötte.",
      "Nem az a baj, hogy gyenge vagy. Hanem hogy túl sok nyitott kör fut egyszerre."
    ],
    frustration: [
      "A frusztráció rendben van — valami nem áll, és ezt érzed.",
      "Nem kell azonnal megoldani. Előbb egy kicsit leülni vele."
    ],
    exhaustion: [
      "Érződik, hogy régóta nyomod megállás nélkül.",
      "Ez már kimerülés — nem motivációhiány."
    ],
    overwhelm: [
      "Ez már inkább túlterhelésnek hangzik, mint motivációhiánynak.",
      "Túl sok nyitott kör — nem te vagy a probléma."
    ],
    scattered: [
      "Ha mindent egyszerre próbálsz tartani, a rendszer széthúzódik.",
      "Szétszórt fókusz — nem hülyeség, túl sok bemenet."
    ],
    stress: [
      "A tested jelez előbb, mint a fejed rendeződik.",
      "Nyomás van — nem kell azonnal rendszert építeni."
    ],
    fatigue: [
      "Mentális fáradtság — nem lustaság.",
      "Ma a minimum is győzelem: egy blokk, aztán pihenés."
    ]
  },

  conversationalFlow: {
    home_return: [
      "Na?\nMilyen nap volt?",
      "Haza.\nHosszú volt, vagy csak fárasztó?",
      "Na.\nMi maradt meg benned a napból?"
    ],
    day_end: [
      "Na.\nLezártad, vagy még fut a fejedben?",
      "Kész a nap.\nKönnyebb most, hogy megálltál?"
    ],
    arrival: ["Na?", "Megérkeztél.\nMi volt a nap legjobb része?"],
    opener: ["Na?", "Hallgatlak.", "Itt vagyok."],
    mundane: ["Na?", "Értem.", "Hallom."],
    day_reply: [
      "Értem.\nMi volt a legnehezebb része?",
      "Hallom.\nMi fárasztott jobban — ember vagy feladat?",
      "Na.\nVan még benned energia, vagy üres?"
    ]
  },

  lowEgoNaturalIntent: {
    overload: [
      "Ez sok nyomás egyszerre.",
      "Ez már inkább túlterhelésnek hangzik, mint motivációhiánynak."
    ],
    focus: [
      "Széthúzott állapot — nem identitás.",
      "Ha mindent egyszerre próbálsz tartani, a rendszer széthúzódik."
    ],
    clarity: [
      "Egy döntés elég most.",
      "Mitől lenne ma este egy fokkal könnyebb benned?"
    ]
  },

  lowEgoQuestions: {
    general: ["Mitől lenne ma este egy fokkal könnyebb benned?"],
    overwhelm: ["Mi az az egy dolog, ami ha ma rendeződik, csökken benned a zaj?"],
    exhaustion: ["Van ma este egy órád, ami tényleg a tiéd?"],
    stress: ["Mi nyom most a legjobban — egy szóval?"]
  },

  silenceBeats: [
    "Ez most nehéznek hangzik.",
    "Jó hogy ezt kimondtad.",
    "Itt vagyok.",
    "Hallom."
  ],

  groundedHumor: [
    "Az agyad most túl sok ablakkal fut egyszerre.",
    "Most nem új projekt hiányzik az életedből.",
    "A káosz megint élesben fut."
  ],

  emotionalContinuity: {
    groundedAfterOverload: [
      "Tegnap még teljesen széthúzott voltál. Most már valamivel tisztábbnak tűnsz.",
      "Múltkor túlterhelés volt — ma már földöttebb hangzol."
    ],
    stillHeavy: [
      "Még nehéznek érződik — ugyanaz a nyomás, vagy változott valami?",
      "A szál még nyitva van. Nem kell ma mindent megoldani."
    ],
    bodyFirst: [
      "Múltkor a tested jelezte előbb. Most is hasonló?",
      "Alvás és víz előbb — a fej utána következik."
    ],
    thread: [
      "Folytatjuk — ugyanaz a súly, vagy könnyebb lett?",
      "A legutóbbi üzenetedben sok volt a zaj — hol állsz most?"
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
    "Na, sikerült ma visszahozni a fókuszt?",
    "Most tested vagy a fejed fáradtabb?",
    "Egy sor: jobb, ugyanaz, vagy nehezebb, mint reggel?",
    "Víz megvan? Lélegzet lassabb?"
  ],

  dailyCompanionLoop: {
    morning: [
      "Reggel egy irány elég — nem tíz.",
      "Ma egy blokk, amit tényleg megvédesz."
    ],
    midday: [
      "Dél: még azon a sávon vagy, amit reggel választottál?",
      "Ha szétszórt vagy — egy kör zárása, aztán folytatás."
    ],
    evening: [
      "Este leeresztés — nem új sprint.",
      "Mi volt ma az egy őszinte mozdulat?"
    ],
    late_night: [
      "Késő este: holnap kölcsönöz, nem ma.",
      "Egy sor zárás, aztán alvás."
    ],
    default: ["Itt vagyok. Egy lépés elég."]
  },

  dynamicOpenings: {
    morning: [
      "Reggel van.\nNe az egész életedet próbáld ma megoldani.\nCsak állj bele tisztán az első blokkba.",
      "Reggel.\nEgy irány. Egy blokk."
    ],
    lateNight: [
      "Még pörög az agyad?\nVagy már inkább kifáradt?",
      "Késő este.\nLezárás vagy még egy kör a fejben?"
    ],
    evening: ["Este.\nLeeresztés, nem új sprint."],
    midday: ["Dél.\nMég azon a sávon vagy, amit reggel választottál?"],
    focused: [
      "Rendben.\nMa ne szélességet építsünk.\nMélységet.",
      "Tiszta sáv.\nEgy blokk mélyen."
    ],
    overloaded: [
      "Ma nem intenzitás kell.\nHanem idegrendszeri stabilitás.",
      "Sok nyomás — előbb egy sáv, nem tíz."
    ],
    tired: ["A tested ma hamarabb jelezhet mint a fejed."],
    groundedReturn: [
      "Most kevésbé széthúzottnak tűnsz.",
      "Tegnap még teljes káosznak élted meg ezt — ma már más a hang."
    ],
    returnAfterSilence: [
      "Vissza vagy.\nHol tartasz most — egy mondatban?",
      "Régóta nem írtál.\nMi változott?"
    ]
  },

  presenceCallbacks: {
    stillChaos: [
      "Tegnap még teljes káosznak élted meg ezt.",
      "Még mindig nehéz — ugyanaz a nyomás?"
    ],
    lessChaos: [
      "Tegnap még széthúzott voltál.\nMost már valamivel tisztábbnak tűnsz.",
      "Most kevésbé széthúzottnak tűnsz."
    ],
    lessScattered: ["Kevesebb szétszórtság hangzik most, mint legutóbb."],
    trading: ["Ma a túlkattintás veszélyesebb lehet mint a rossz setup."],
    training: ["A tested emlékszik a mozgásra — a fej lassabban követ."],
    exhaustion: ["A tested valószínűleg hamarabb fáradt el mint ahogy észrevetted."],
    mission: ["Még mindig: {mission} — vagy átírta a nap?"]
  },

  adaptiveEnergy: {
    trader: ["Ma a túlkattintás veszélyesebb lehet mint a rossz setup."],
    body: ["A tested ma hamarabb jelezhet mint a fejed."],
    overload: ["Ma nem intenzitás kell.\nHanem idegrendszeri stabilitás."],
    business: ["Ma az egyik döntés számít — nem tíz párhuzamos sprint."],
    athlete: ["A tested ma őszinte jelzéseket ad — hallgasd meg előbb."],
    discipline: ["Ma a mélység nyeri a szélességet."],
    general: ["Ma egy őszinte blokk többet ér mint egy új terv."],
    pulse: ["Egy irány. Egy blokk. A többi vár."]
  },

  microWow: {
    overload: [
      "Nem motivációhiány van.\nHanem túl sok nyitott kör.",
      "Ez túlterhelés — nem gyengeség."
    ],
    ideas: [
      "Most már nem új ötletek hiányoznak az életedből.\nHanem energia a meglévőkhöz."
    ],
    motivation: [
      "Nem motivációhiány.\nHanem túl sok nyitott kör egyszerre."
    ],
    body: ["A tested valószínűleg hamarabb fáradt el mint ahogy észrevetted."],
    trading: ["Ma a piac a második kockázat — az első az impulzus."],
    general: [
      "Nem motivációhiány van.\nHanem túl sok nyitott kör.",
      "Most már nem új ötletek hiányoznak — hanem energia a meglévőkhöz."
    ]
  },

  naturalTransitions: {
    general: ["Egyébként…", "Na várj."],
    stressToBody: ["Más:\na tested hogy van mostanában?"],
    stressClarify: [
      "Na várj.\nMost inkább stressz van vagy túlterhelés?",
      "Egyébként — a fejed zajos, vagy a tested üres?"
    ],
    deeper: ["Egyébként — mi van mögötte?"],
    workToFeeling: ["Más: emberileg hogy vagy ezzel a munkával?"],
    tradingToFeeling: ["Na várj — ez most piaci nyomás vagy belső zaj?"]
  },

  shortActionReplies: [
    "Jó.\nVissza jössz, és meglátjuk.",
    "Oké.\nFutás után.",
    "Rendben.\nNe teljesítmény — csak mozgás."
  ],

  sarcasmRare: [
    "Az agyad jelenleg 17 tabbal fut.",
    "A káosz megint élesben tesztel.",
    "Beütötted a túlterhelést, és pontosan meg is jelentél."
  ],

  eliteWhispers: [
    "A fegyelem az önáratás csökkentése.",
    "Az energiaszivárgás több jövőt rombol, mint a tehetséghiány.",
    "A standard az, amit akkor is csinálsz, ha senki nem tapsol."
  ],

  groundedVoiceAlts: [
    "Ez inkább túlterhelésnek hangzik, nem lustaságnak.",
    "Túl sok dolog fut egyszerre benned.",
    "Nem tűnsz gyengének. Inkább túl sokáig húztad megállás nélkül.",
    "Most nem új terv kell. Idegrendszeri visszarendezés.",
    "A tested előbb jelez, mint az egód."
  ],

  oneLineBeats: [
    "Ma ne bizonyíts. Csak stabilizálj.",
    "Most a legegyszerűbb lépés lesz a legerősebb.",
    "Egy őszinte blokk. Aztán állj."
  ],

  threadReturn: {
    generic: [
      "Na?\nTisztább a fejed vagy még zajos?",
      "Vissza vagy — mi változott?"
    ],
    run: [
      "Na?\nKönnyebb lett a fejed vagy még mindig zajos?",
      "Futás után — a test lejjebb vitte az elmét?"
    ],
    workout: [
      "Kész?\nA test visszahúzta egy fokkal az elmét?",
      "Vissza — erősebb vagy csak jó fáradtság?"
    ],
    walk: [
      "Vissza.\nVett a séta öt százalék nyugalmat?",
      "Visszajöttél — segített a levegő?"
    ],
    breath: [
      "Vissza.\nLazább a légzés?",
      "Vissza — kicsit több hely bent?"
    ],
    trade: [
      "Vissza.\nMég rajta a fegyelem?",
      "Session előtt — tiszta a szabály?"
    ]
  }
};
