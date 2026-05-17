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
      "Ha túl sok mindent próbálsz tartani egyszerre, az ember előbb-utóbb széthúzódik."
    ],
    tired: [
      "A tested sokszor hamarabb elfárad, mint ahogy észreveszed.",
      "Most inkább pihenés hiányzik belőled, nem motiváció."
    ],
    scattered: [
      "Ha mindent egyszerre próbálsz tartani, a rendszer széthúzódik.",
      "Nem gyengeség — túl sok nyitott kör fut egyszerre."
    ],
    lost: [
      "Nem kell most mindent érteni.",
      "Elég ha kimondod, hogy összevissza érzed."
    ],
    lonely: [
      "Magányosnak hangzik — és ez emberi.",
      "Nem vagy túl sok. Csak most kevés a kapcsolódás."
    ],
    uncertainty: [
      "A bizonytalanság önmagában is fárasztó tud lenni.",
      "Nem kell most rögtön megoldanod mindent."
    ],
    general: [
      "Itt vagyok. Lassíts — nem kell tökéletes válasz.",
      "Hallom."
    ]
  },

  lifeLines: {
    lonely: [
      "Magányosnak hangzik — és ez teljesen érthető.",
      "Nem kell most erősebbnek tűnnöd."
    ],
    uncertainty: [
      "A bizonytalanság most hangosabb lehet, mint a tények.",
      "Nem kell most mindenre válasz."
    ],
    excitement: [
      "Jó energia — csak ne próbáld az egész hetet ma megélni.",
      "Ez most tényleg mozgásban van benned."
    ],
    small_win: [
      "Ez számít — nem kicsi dolog.",
      "Jó. Ez már mozdulat, nem csak szöveg."
    ],
    lost: [
      "Nem kell most rendbe tenni az egészet.",
      "Elég ha egy mondatban kimondod, mi a legzavarosabb."
    ]
  },

  listeningQuestions: {
    confusion: [
      "Mi változott meg benned szerinted?",
      "Mióta érzed ezt így?",
      "Mi a legelső dolog, ami más lett?"
    ],
    lost: [
      "Hol érzed a legjobban az elveszett részt?",
      "Mi volt még rendben, mielőtt ez elindult?"
    ],
    uncertainty: [
      "Mi a legnagyobb bizonytalanság most — egy szóval?",
      "Mitől lenne ma este egy fokkal könnyebb?"
    ],
    general: ["Mi a legelső dolog, ami most a legközelebb van hozzád?"]
  },

  listeningAck: [
    "Értem.",
    "Hallom.",
    "Ez most nehéznek hangzik."
  ],

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

  emotionalRealism: {
    shame: [
      "Ez most kicsit soknak hangzik egyszerre.",
      "Nem kell most rendbe tenni — elég ha kimondod."
    ],
    frustration: [
      "Valami régóta nem áll — és ez most feljött.",
      "Ez nem túlreakció. Valami tényleg nem működik."
    ],
    exhaustion: [
      "Érződik, hogy régóta próbálod egyben tartani.",
      "Néha az ember nem is fáradt.\nCsak túl sokáig feszült."
    ],
    overwhelm: [
      "Ez most kicsit soknak hangzik egyszerre.",
      "Nem te vagy gyenge — túl sok dolog fut párhuzamosan."
    ],
    scattered: [
      "Úgy érződik, mintha minden egyszerre kérne figyelmet.",
      "A fókusz szétesett — nem az identitásod."
    ],
    stress: [
      "A tested már rég jelez — a fejed most éri utol.",
      "Nyomás van. Nem kell ma mindent megoldani."
    ],
    fatigue: [
      "Néha az ember nem is fáradt.\nCsak túl sokáig feszült.",
      "Ez már nem lustaság — ez kifogyás."
    ],
    lonely: [
      "Magányosnak hangzik — és ez emberi.",
      "Nem vagy túl sok. Csak most kevés a kapcsolódás."
    ],
    failure: [
      "Ez fáj — nem kell azonnal tanulságot gyúrni belőle.",
      "A kudarc most hangosabb, mint a valóság."
    ],
    ambitious: [
      "Sok energia van benned — csak nincs még egy tiszta sáv.",
      "Ambíció rendben van. A rendszered még nem követte."
    ]
  },

  microReactions: [
    "Hm.",
    "Na várj.",
    "Az mondjuk sok.",
    "Értem már.",
    "Na ez fontos.",
    "Hallom.",
    "Na."
  ],

  humanImperfections: [
    "Hm.",
    "Na várj.",
    "Az mondjuk sok.",
    "Értem már."
  ],

  naturalCheckbacks: {
    overload: [
      "Egyébként…\na tegnapi túlterhelés enyhült valamennyit?",
      "Még mindig sok minden fut egyszerre benned, vagy ma könnyebb?"
    ],
    focus: [
      "Múltkor mondtad, hogy szétesett a fókusz.\nMost jobb?",
      "A szétszórtság még ott van, vagy ma tisztább a fejed?"
    ],
    exhaustion: [
      "A kimerültség még ott van, vagy ma egy fokkal könnyebb?",
      "Múltkor a tested jelezte előbb — most is hasonló?"
    ],
    general: [
      "Egyébként…\nhol tartasz most ezzel kapcsolatban?",
      "Amit legutóbb említettél — még nyitva van benned?"
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
    minimal_ack: ["Értem.", "Rendben.", "Hallom."],
    return_back: [
      "Vissza.\nHol tartasz most?",
      "Na.\nMi változott addig?",
      "Itt vagyok."
    ],
    day_reply: [
      "Értem.\nMi volt a legnehezebb része?",
      "Hallom.\nMi fárasztott jobban — ember vagy feladat?",
      "Na.\nVan még benned energia, vagy üres?"
    ],
    small_win: [
      "Na.\nEz tényleg számít.",
      "Jó.\nEz már mozdulat.",
      "Hallom — ez nem kicsi."
    ],
    loneliness: [
      "Magányosnak hangzik.",
      "Itt vagyok.",
      "Nem kell most erősebbnek tűnnöd."
    ],
    uncertainty: [
      "A bizonytalanság is fárasztó tud lenni.",
      "Nem kell most mindenre válasz.",
      "Hallgatlak."
    ],
    future_anxiety: [
      "A jövő most hangosabb lehet, mint a ma.",
      "Mi nyom most a legjobban — egy mondatban?",
      "Nem kell most a teljes terv."
    ],
    excitement: [
      "Jó energia.",
      "Na — ez most tényleg mozog benned.",
      "Ne próbáld az egész hetet ma megélni."
    ],
    after_work: [
      "Munka után a tested gyakran előbb szól.",
      "Na.\nÜres vagy, vagy csak fáradt?",
      "Hallom."
    ],
    random_thought: [
      "Na.",
      "Értem.",
      "Hallgatlak — mi van mögötte?"
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

  naturalCheckIns: [
    "Na, hogy vagy most ehhez képest?",
    "Még mindig ugyanaz a zaj fut benned?",
    "Tested vagy fejed fáradtabb most?",
    "Na — jobb, ugyanaz, vagy nehezebb?"
  ],

  companionCheckIns: [
    "Na, hogy vagy most ehhez képest?",
    "Még mindig ugyanaz a zaj fut benned?",
    "Tested vagy fejed fáradtabb most?"
  ],

  rhythmLock: {
    morning: [
      "Reggel.\nEgy irány elég ma — nem tíz.",
      "Mi az egy dolog, amit ma megvédesz?",
      "Tisztaság először.\nAztán egy blokk."
    ],
    morningWithMission: [
      "Reggel.\nA vonalad ma: {mission}",
      "Egy irány: {mission}.\nAztán mozgás."
    ],
    midday: [
      "Dél.\nMég azon a sávon vagy?",
      "Egy kör zárása — aztán tovább.",
      "Fókusz-korrekció: egy blokk, nem tíz."
    ],
    evening: [
      "Este.\nLeeresztés — nem új sprint.",
      "Engedd le a fejet.\nHolnap is itt leszek.",
      "Mi volt ma az egy stabil mozdulat?"
    ]
  },

  microRituals: {
    morning: [
      "Reggel.\nEgy irány elég ma.",
      "Ma egy blokk, amit megvédesz.",
      "Tisztaság — aztán egy lépés."
    ],
    midday: [
      "Dél.\nMég azon a sávon vagy?",
      "Egy kör zárása, aztán folytatás.",
      "Szétszórt vagy túlterhelt? Egy fókusz elég."
    ],
    evening: [
      "Este.\nLeeresztés, nem új sprint.",
      "Mi volt ma az egy stabil blokk?",
      "Pihenés — holnap is itt leszek."
    ],
    late_night: [
      "Késő este: egy sor zárás, aztán alvás.",
      "Semmi stratégiai döntés most nem kell."
    ]
  },

  attachmentMoments: {
    calmer: [
      "Tegnap még sokkal zajosabbnak tűntél.",
      "Most nyugodtabb energiád van."
    ],
    stillHeavy: [
      "Még nehéz — de itt vagy, és ez számít.",
      "A nyomás még ott van — nem kell ma megoldani."
    ],
    action: [
      "Jó látni hogy nem csak gondolkodsz rajta, hanem lépsz is.",
      "Ez már mozdulat — nem csak szöveg."
    ],
    return: ["Jó hogy ma visszajöttél.", "Vissza vagy — ez is ritmus."]
  },

  lightAccountability: [
    "Sikerült ma legalább egy stabil blokk?",
    "Ma testedet vagy fejedet terhelted jobban?",
    "Egy sor: volt ma mozdulat, vagy csak gondolkodás?"
  ],

  premiumQuiet: [
    "Ez most nehéznek hangzik.",
    "Jó hogy ezt nem tartottad bent.",
    "Hallom.",
    "Itt vagyok — nem kell most tökéletes válasz."
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
    ],
    observational: [
      "Na. Milyen nap volt eddig?",
      "Most inkább túlterhelés vagy fáradtság?",
      "A tested mit szól ehhez a tempóhoz mostanában?"
    ],
    reflective: [
      "Mi maradt meg benned a napból eddig?",
      "Hol érzed most a legnagyobb súlyt?"
    ],
    practical: [
      "Egy blokk elég most — melyik legyen?",
      "Mi az egy dolog, ami ma tényleg számít?"
    ],
    calm: ["Itt vagyok.", "Hallgatlak.", "Lassíts — egy lépés elég."],
    lightHumor: [
      "Az agyad megint túl sok tabbal fut?",
      "Na — ma is sok minden egyszerre?"
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

  companionWarmth: {
    saidAloud: [
      "Jó hogy ezt kimondtad.",
      "Ez emberileg teljesen érthető.",
      "Hallom — nem ítéllek."
    ],
    emotional: [
      "Nem kell most rögtön megoldanod mindent.",
      "Ez most nehéz — rendben van, hogy így érzed."
    ],
    tired: ["A tested ma előbb szól, mint az elvárásod."],
    shame: ["A szégyen gyakran túl magas elvárás — nem gyengeség."],
    general: ["Itt vagyok.", "Rendben vagy így is."]
  },

  relationshipContinuity: {
    sameTimeScattered: [
      "Múltkor is ilyenkor kezdett széthúzódni a fókuszod.",
      "Ismerős — ilyen időszakban szokott felborulni a rend."
    ],
    calmerThanBefore: [
      "Tegnap még sokkal feszültebb voltál.",
      "Most nyugodtabbnak tűnsz mint pár napja."
    ],
    stillTense: [
      "Még mindig sok benned — ugyanaz a nyomás?",
      "Tegnap is hasonló volt a hang."
    ]
  },

  relationalStay: [
    "Az érződik.",
    "Régóta húzod?",
    "Hallom.",
    "Na. Sok volt?"
  ],

  relationalCuriosity: {
    general: [
      "Mi nyom most a legjobban?",
      "Mitől lenne ma egy fokkal könnyebb benned?"
    ],
    tired: ["Most tested vagy fejed zajosabb?", "Régóta húzod így?"],
    focus: ["Mi szór szét most a legjobban?", "Egy dolog — mi a legzavarosabb?"]
  },

  naturalComfort: [
    "Nem kell most mindent egyszerre megoldanod.",
    "Ez emberileg teljesen érthető.",
    "Néha az ember csak kifárad."
  ],

  emotionalTextures: {
    presence: ["Itt vagyok.", "Hallgatlak.", "Na."],
    quiet: ["Értem.", "Hm.", "…"],
    reflective: ["Mi maradt meg ebből benned?", "Hallom."],
    direct: ["Egy blokk elég.", "Egy döntés most."],
    warm: ["Jó hogy ezt kimondtad.", "Ez emberi."],
    sharp: ["Egy sáv.", "Most nem szélesség."],
    playful: ["Na.", "Az agyad megint sok ablakkal fut?"],
    grounding: ["Lassíts egy fokot.", "Egy lélegzet elég most."]
  },

  presenceBeats: ["Itt vagyok.", "Hallgatlak.", "Na.", "Értem."],

  quietConfidence: [
    "Most nem több gondolat hiányzik.",
    "Előbb pihenj.\nAztán nézd újra.",
    "Ez már túl sok terhelés egyszerre."
  ],

  emotionalGrounding: [
    "Most nem új terv kell.",
    "Ez inkább túlterhelésnek hangzik.",
    "Menj vissza egy kicsit a testedbe.",
    "Előbb a tested, aztán a gondolat.",
    "Ez nem lustaság — túl sok egyszerre.",
    "Ma nem kell mindent rendbe tenni."
  ],

  returnStateClosings: [
    "Ez elég most.",
    "Menj lassabban.",
    "Egy lépés elég ma.",
    "Pihenj egy kicsit.",
    "Holnap is itt leszek."
  ],

  calmListening: [
    "Hallgatlak.",
    "Na.",
    "Értem.",
    "Itt vagyok.",
    "Ez most sok lehet."
  ],

  depthGrounding: [
    "Nem kell mindent kibontani most.",
    "Elég ennyit kimondani.",
    "Lélegezz egyet.",
    "Nem kell rendbe tenni most."
  ],

  microHumanityAlive: ["Hm.", "Na.", "Na várj.", "Az mondjuk sok.", "Értem.", "Jó."],

  naturalEmotionalSupport: [
    "Ez most soknak hangzik.",
    "Nem kell ma mindent megoldani.",
    "Érződik hogy régóta húzod.",
    "Nem kell ma mindenre reagálni."
  ],

  groundedWarmth: [
    "Ez most nehéznek hangzik.",
    "Jó hogy ezt nem nyomtad el.",
    "Hallom — nem kell most tökéletesen megfogalmazni.",
    "Ez emberi. Nem kell rendbe tenni most."
  ],

  microPresencePremium: [
    "Na.",
    "Értem.",
    "Az sok.",
    "Jó.",
    "Az kemény lehetett.",
    "Ez már tisztább."
  ],

  soulMicroBeats: ["Hm.", "Na.", "Értem.", "Az kemény lehetett.", "Jó.", "Az sok."],

  eliteAtmosphereCalm: [
    "Egy sáv elég ma.",
    "Energia védelem: kevesebb bemenet.",
    "Tisztaság most fontosabb mint sebesség.",
    "Nem kell ma mindenre reagálni."
  ],

  premiumAtmosphere: [
    "Ma ne az egész jövődet próbáld megoldani.",
    "Elég egy tiszta blokk.",
    "A túlterhelés néha csak túl sok nyitott kör."
  ],

  structuredCalm: [
    "Lassíts egy fokot — nem kell most mindenre reagálni.",
    "Egy lélegzet. Aztán egy döntés.",
    "Most nem intenzitás kell — egy kicsit lejjebb."
  ],

  microImmersion: [
    "Az kemény lehetett.",
    "Ez már tisztább.",
    "Na."
  ],

  atmosphereTransitions: [
    "Egy másodperc.",
    "Na.",
    "Más irány:"
  ],

  companionClosings: {
    general: [
      "Ma ne az egész hegyet cipeld.\nCsak a következő stabil lépést.",
      "Elég egy tiszta blokk mára.",
      "Menj vissza a testedbe egy kicsit."
    ],
    stabilize: [
      "Egy sáv.\nA többi ma nem nyitod.",
      "Elég egy stabil lépés mára."
    ],
    soften: [
      "Ma nem bizonyítani kell.\nPihenni is része a rendszernek.",
      "Elég egy tiszta blokk — aztán alvás."
    ],
    concise: ["Egy blokk. Aztán jelents.", "Most cselekvés — nem beszéd."],
    slow: ["Hagyd landolni.\nHolnap folytatjuk.", "Egy őszinte sor elég mára."],
    deepen: ["Egy irány mélyen — nem tíz felületen.", "Tartsd a vonalat. Egy lépés."]
  },

  soulRhythmBeats: {
    breath: ["…", "Itt vagyok.", "Hallgatlak."]
  },

  conversationBridges: {
    topicShift: ["Na.", "Más:", "Egyébként…"],
    emotionalFollow: [
      "Még ott vagy ebben?",
      "Ugyanaz a nyomás, vagy könnyebb?",
      "Na — jobb, ugyanaz, vagy nehezebb?"
    ]
  },

  conversationHumor: [
    "Az agyad megint sok ablakkal fut?",
    "Na, klasszikus tab-káosz.",
    "Értem. Digitális tűzijáték."
  ],

  naturalTransitions: {
    general: ["Egyébként…"],
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
    "Ha túl sok mindent próbálsz tartani egyszerre, az ember előbb-utóbb széthúzódik.",
    "A tested sokszor hamarabb elfárad, mint ahogy észreveszed.",
    "Ez inkább túlterhelésnek hangzik, nem lustaságnak.",
    "Most inkább pihenés hiányzik, nem motiváció."
  ],

  densityLines: [
    "Most inkább pihenés hiányzik belőled, nem motiváció.",
    "Ez már inkább idegrendszeri fáradás.",
    "Nem kell most mindent megoldani."
  ],

  oneLineBeats: [
    "Most inkább pihenés hiányzik belőled, nem motiváció.",
    "Ez már inkább idegrendszeri fáradás.",
    "Hallom."
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
