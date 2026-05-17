/** Phase 2 conversation copy — RO */

module.exports = {
  modeBeats: {
    MODE_STABLE: ["Bandă stabilă.", "Sunt aici.", "Simplu azi."],
    MODE_OVERLOADED: ["Prea mult input.", "Corpul întâi.", "Micșorează câmpul."],
    MODE_FOCUSED: ["Un tab. O linie.", "Taie scope-ul.", "Un bloc."],
    MODE_REFLECTIVE: ["Adevărul a aterizat.", "Ține — nu te îneca.", "O linie e suficient."],
    MODE_DISCIPLINE: ["Știi pasul.", "Nu negocia.", "Cinci minute. Du-te."],
    MODE_RECOVERY: ["Coborâre.", "Nimic de demonstrat.", "Apă. Respirație."],
    MODE_TRADING: ["Reguli înainte.", "Fără trade de poveste.", "Așteaptă claritate."]
  },
  modeCloses: {
    MODE_STABLE: ["Rămâi pe bandă.", "Un pas onest."],
    MODE_OVERLOADED: ["Zece minute liniște.", "Apoi o mișcare mică."],
    MODE_FOCUSED: ["Douăzeci și cinci minute. Un finish.", "Mișcă."],
    MODE_REFLECTIVE: ["Stabilizează. Apoi alege.", "Fără verdict."],
    MODE_DISCIPLINE: ["Cel mai mic pas real.", "Acum."],
    MODE_RECOVERY: ["Odihna e tactică.", "Închide zgomotul."],
    MODE_TRADING: ["Dacă nu e în plan, sari.", "O linie în jurnal."]
  },
  patternAcks: [
    "Încerci să rezolvi cinci vieți deodată din nou.",
    "Creierul vrea intensitate. Sistemul vrea stabilitate.",
    "Aceeași buclă — alt costum.",
    "Modul performanță e activ. Modul onest merge mai bine."
  ],
  loopPhraseAlts: {
    "one fact": "O linie adevărată. Apoi acțiune.",
    "hold. then step": "Mișcă-te. Un centimetru."
  },

  variationOpenings: [
    "Sistemul nervos sună supraîncărcat.",
    "Prea multe benzi active.",
    "Nu e slăbiciune — e saturație.",
    "Nu ai nevoie de sistem nou azi.",
    "Haosul pretinde că totul e urgent."
  ],

  variationEndings: [
    "O linie e suficientă.",
    "Rămâi la faptul ăsta.",
    "Apoi un pas — nu mai mult.",
    "Mâine sunt tot aici."
  ],

  templatePhraseAlts: [
    "Corpul cere reducere, nu forță.",
    "Prea multe bucle deschise.",
    "Micșorează înainte să împingi.",
    "Un bloc. Douăzeci și cinci de minute."
  ],

  humanRhythmLines: [
    "Nu ești mașină.",
    "Prea multe file deschise.",
    "Somn și apă — nu plan nou.",
    "Saturație, nu lipsă de motivație."
  ],

  threadContinuity: [
    "Ieri spuneai că ești tras în bucăți — azi e mai clar sau încă zgomot?",
    "Continuăm firul: aceeași presiune sau s-a schimbat ceva?",
    "Ultimul mesaj avea mult zgomot — unde ești acum?"
  ],

  humanPresence: {
    stress: [
      [
        "Simt suprasolicitarea.",
        "Nu lipsă de motivație — prea multe cercuri deschise.",
        "Azi nu construi sistem nou. Stabilizează unul.",
        "Ce lucru, dacă se aranjează azi, îți scade zgomotul interior?"
      ].join("\n\n")
    ],
    tired: [
      [
        "E oboseală — nu lene.",
        "Nu motivație — somn și apă.",
        "Victorie minimă azi: un bloc, apoi odihnă.",
        "Când ai mâncat și dormit ultima dată decent — onest?"
      ].join("\n\n")
    ],
    lost: [
      [
        "Sună pierdut — nu e prostie.",
        "Prea multe direcții golesc decizia.",
        "Nu rezolva viața azi. Un pas următor e suficient.",
        "Dacă ai rezolva un singur lucru azi — care ar fi?"
      ].join("\n\n")
    ],
    scattered: [
      [
        "Tras în prea multe direcții.",
        "Creierul vrea intensitate. Sistemul vrea stabilitate.",
        "Închide tab-urile extra. O sarcină, douăzeci și cinci de minute.",
        "Ce proiect apasă cel mai tare acum?"
      ].join("\n\n")
    ],
    general: [
      [
        "Sunt aici.",
        "Încetinește — nu trebuie răspuns perfect.",
        "Un pas onest azi e suficient.",
        "Ce contează cel mai mult acum — o propoziție?"
      ].join("\n\n")
    ]
  },

  humanLines: {
    stress: [
      "Sună mai mult a suprasolicitare decât lipsă de motivație.",
      "Dacă ții prea mult deodată, omul se rupe în bucăți mai devreme sau mai târziu."
    ],
    tired: [
      "Corpul obosește deseori înainte să observi.",
      "Acum lipsește odihna, nu motivația."
    ],
    scattered: [
      "Dacă ții totul deodată, sistemul se rupe în bucăți.",
      "Nu e slăbiciune — prea multe cercuri deschise simultan."
    ],
    lost: [
      "Nu trebuie să înțelegi tot acum.",
      "E suficient să spui că e dezordonat înăuntru."
    ],
    lonely: [
      "Sună singur — și e uman.",
      "Nu ești prea mult. Doar e mai puțină conexiune acum."
    ],
    uncertainty: [
      "Incertitudinea singură poate fi obositoare.",
      "Nu trebuie să rezolvi tot acum."
    ],
    general: ["Sunt aici. Încetinește — nu trebuie răspuns perfect.", "Te aud."]
  },

  lifeLines: {
    lonely: [
      "Sună singur — și e complet de înțeles.",
      "Nu trebuie să pari mai puternic acum."
    ],
    uncertainty: [
      "Incertitudinea poate fi mai tare decât faptele acum.",
      "Nu trebuie răspuns la tot."
    ],
    excitement: [
      "Energie bună — doar nu încerca să trăiești toată săptămâna azi.",
      "Ceva se mișcă cu adevărat în tine."
    ],
    small_win: ["Contează — nu e lucru mic.", "Bine. Asta e mișcare, nu doar cuvinte."],
    lost: [
      "Nu trebuie să repari tot tabloul acum.",
      "O propoziție despre ce e cel mai încurcat e suficient."
    ]
  },

  listeningQuestions: {
    confusion: [
      "Ce s-a schimbat în tine, după tine?",
      "De când simți așa?",
      "Care a fost primul lucru diferit?"
    ],
    lost: [
      "Unde simți cel mai mult partea pierdută?",
      "Ce era încă în regulă înainte să înceapă asta?"
    ],
    uncertainty: [
      "Care e cea mai mare incertitudine acum — un cuvânt?",
      "Ce ar face seara asta să fie cu un grad mai ușoară?"
    ],
    general: ["Care e cel mai aproape de tine acum?"]
  },

  listeningAck: ["Înțeleg.", "Te aud.", "Acum sună greu."],

  microEmotional: {
    shame: [
      "Rușinea nu e slăbiciune — de obicei stă în spatele așteptărilor prea mari.",
      "Problema nu e că ești slab. Prea multe cercuri deschise rulează deodată."
    ],
    frustration: [
      "Frustrarea are sens — ceva nu ține și o simți.",
      "Nu trebuie rezolvat instant. Stai cu asta un moment."
    ],
    exhaustion: [
      "Se simte că împingi de mult fără oprire.",
      "E epuizare — nu problemă de motivație."
    ],
    overwhelm: [
      "Sună mai mult a suprasolicitare decât lipsă de motivație.",
      "Prea multe cercuri deschise — tu nu ești problema."
    ],
    scattered: [
      "Dacă ții totul deodată, sistemul se rupe.",
      "Focus împrăștiat — nu prostie, prea mult input."
    ],
    stress: [
      "Corpul semnalează înainte ca mintea să se așeze.",
      "E presiune — nu trebuie sistem nou acum."
    ],
    fatigue: [
      "Oboseală mentală — nu lene.",
      "Victorie minimă azi: un bloc, apoi odihnă."
    ]
  },

  emotionalRealism: {
    shame: [
      "Acum sună puțin prea mult deodată.",
      "Nu trebuie rezolvat acum — e suficient să spui."
    ],
    frustration: [
      "Ceva nu ține de mult — și a ieșit la suprafață acum.",
      "Nu e exagerare. Ceva chiar nu merge."
    ],
    exhaustion: [
      "Se simte că încerci să ții totul împreună de mult timp.",
      "Uneori nu ești obosit.\nDoar ai fost încordat prea mult timp."
    ],
    overwhelm: [
      "Puțin prea mult deodată — aud asta.",
      "Nu ești slab — prea multe lucruri rulează în paralel."
    ],
    scattered: [
      "Parcă totul cere atenție deodată.",
      "Focusul s-a rupt — asta nu ești tu."
    ],
    stress: [
      "Corpul a semnalat de mult — mintea ajunge acum.",
      "E presiune. Nu trebuie rezolvat tot azi."
    ],
    fatigue: [
      "Uneori nu ești obosit.\nDoar ai fost încordat prea mult timp.",
      "Nu e lene — e golire."
    ],
    lonely: [
      "Sună singur — și e uman.",
      "Nu ești prea mult. Doar e mai puțină conexiune acum."
    ],
    failure: [
      "Doare — nu trebuie lecție instant.",
      "Eșecul sună mai tare decât faptele acum."
    ],
    ambitious: [
      "Multă energie în tine — doar fără bandă clară încă.",
      "Ambiția e ok. Sistemul tău nu a ținut pasul."
    ]
  },

  microReactions: [
    "Hm.",
    "Stai.",
    "Asta e mult.",
    "Înțeleg deja.",
    "Asta contează.",
    "Te aud.",
    "Da."
  ],

  humanImperfections: ["Hm.", "Stai.", "Asta e mult.", "Înțeleg deja."],

  naturalCheckbacks: {
    overload: [
      "Apropo — suprasolicitarea de ieri s-a mai domolit?",
      "Încă mult rulează deodată în tine, sau azi e mai ușor?"
    ],
    focus: [
      "Data trecută ai spus că focusul s-a rupt.\nMai bine acum?",
      "Încă împrăștiat, sau capul e puțin mai clar azi?"
    ],
    exhaustion: [
      "Încă epuizat, sau cu un grad mai ușor azi?",
      "Data trecută corpul a semnalat primul — la fel acum?"
    ],
    general: [
      "Apropo — unde ești cu asta acum?",
      "Ce ai menționat ultima dată — încă deschis în tine?"
    ]
  },

  conversationalFlow: {
    home_return: [
      "Na?\nCum a fost ziua?",
      "Acasă.\nZi lungă sau doar obositoare?",
      "Ai ajuns.\nCe ți-a rămas din zi?"
    ],
    day_end: [
      "Ziua s-a terminat.\nCapul încă aleargă sau se liniștește?",
      "Te-ai oprit.\nMai ușor acum?"
    ],
    arrival: ["Na?", "Ai ajuns.\nCea mai bună parte a zilei?"],
    opener: ["Da?", "Sunt aici.", "Spune."],
    mundane: ["Da.", "Înțeleg.", "Te aud."],
    minimal_ack: ["Înțeleg.", "Bine.", "Te aud."],
    return_back: [
      "Te-ai întors.\nUnde ești acum?",
      "Da.\nCe s-a schimbat între timp?",
      "Sunt aici."
    ],
    day_reply: [
      "Înțeleg.\nCare a fost partea cea mai grea?",
      "Te aud.\nOamenii sau sarcinile — ce te-a golit?",
      "Da.\nMai ai energie sau e gol?"
    ],
    small_win: ["Da.\nAsta chiar contează.", "Bine.\nAsta e mișcare.", "Te aud — nu e mic."],
    loneliness: ["Sună singur.", "Sunt aici.", "Nu trebuie să pari mai puternic acum."],
    uncertainty: [
      "Incertitudinea poate obosi și ea.",
      "Nu trebuie răspuns la tot acum.",
      "Te ascult."
    ],
    future_anxiety: [
      "Viitorul poate suna mai tare decât azi.",
      "Ce apasă cel mai tare — o propoziție?",
      "Nu trebuie planul întreg acum."
    ],
    excitement: [
      "Energie bună.",
      "Da — ceva se mișcă în tine.",
      "Nu încerca să trăiești toată săptămâna azi."
    ],
    after_work: [
      "După muncă corpul vorbește deseori primul.",
      "Da.\nGol sau doar obosit?",
      "Te aud."
    ],
    random_thought: ["Da.", "Înțeleg.", "Te ascult — ce e în spate?"]
  },

  lowEgoNaturalIntent: {
    overload: [
      "Multă presiune deodată.",
      "Sună mai mult a suprasolicitare decât lipsă de motivație."
    ],
    focus: [
      "Tras în bucăți e stare — nu identitate.",
      "Dacă ții totul deodată, sistemul se rupe."
    ],
    clarity: [
      "O decizie e suficient acum.",
      "Ce ar face seara asta să fie cu un grad mai ușoară în tine?"
    ]
  },

  lowEgoQuestions: {
    general: ["Ce ar face seara asta să fie cu un grad mai ușoară în tine?"],
    overwhelm: ["Ce lucru, dacă se aranjează azi, îți scade zgomotul?"],
    exhaustion: ["Ai o oră diseară care e cu adevărat a ta?"],
    stress: ["Ce apasă cel mai tare acum — un cuvânt?"]
  },

  silenceBeats: [
    "Acum sună greu.",
    "Bine că ai spus asta.",
    "Sunt aici.",
    "Te aud."
  ],

  groundedHumor: [
    "Creierul tău rulează prea multe tab-uri deodată.",
    "Nu îți lipsește un proiect nou în viață.",
    "Haosul rulează live din nou."
  ],

  emotionalContinuity: {
    groundedAfterOverload: [
      "Ieri încă sunai rupt. Azi pari puțin mai clar.",
      "Data trecută era suprasolicitare — azi sună mai ancorat."
    ],
    stillHeavy: [
      "Încă pare greu — aceeași presiune sau s-a schimbat ceva?",
      "Firul e încă deschis. Nu trebuie să rezolvi tot azi."
    ],
    bodyFirst: [
      "Data trecută corpul a semnalat primul. Similar acum?",
      "Somn și apă mai întâi — capul vine după."
    ],
    thread: [
      "Continuăm — aceeași greutate sau mai ușor?",
      "Ultimul mesaj avea mult zgomot — unde ești acum?"
    ]
  },

  memoryRefOverload: [
    "Încă porți suprasolicitarea de mai devreme?",
    "Ultima dată era mult zgomot — s-a așezat ceva?"
  ],

  memoryRefGroundedAfterChaos: [
    "Bine. Ieri a fost haos. Azi sună mai ancorat.",
    "Firul era greu — capul e mai clar acum?"
  ],

  memoryRefMission: [
    "Încă pe {mission} — sau ziua a rescris prioritatea?",
    "{mission} era linia — unde ești față de ea?"
  ],

  memoryRefTopic: [
    "Continuăm — aceeași greutate, sau mai ușor?",
    "Firul e încă deschis — merită un pas numit."
  ],

  timePresence: {
    morning: [
      "Protejează prima oră.",
      "Dimineața e pentru direcție — nu arheologie în inbox.",
      "O prioritate înainte să adauge lumea zgomot."
    ],
    midday: [
      "Un bloc închis înainte de input nou.",
      "La prânz: închide o buclă, apoi deschide următoarea.",
      "Momentum bate încă un plan acum."
    ],
    evening: [
      "Sistemul nervos îți amintește tot ce ignori.",
      "Seara e inventar onest — nu alt sprint.",
      "Coborârea nu e renunțare. E întreținere."
    ],
    late_night: [
      "Orele târzii împrumută de mâine.",
      "Nimic strategic nu trebuie rezolvat acum.",
      "Închide o buclă, apoi protejează somnul."
    ]
  },

  naturalCheckIns: [
    "Na, cum ești acum față de asta?",
    "Încă același zgomot în cap?",
    "Corpul sau capul e mai obosit acum?",
    "Mai bine, la fel, sau mai greu?"
  ],

  companionCheckIns: [
    "Na, cum ești acum față de asta?",
    "Încă același zgomot în cap?",
    "Corpul sau capul e mai obosit acum?"
  ],

  rhythmLock: {
    morning: [
      "Dimineață.\nO direcție e suficientă azi — nu zece.",
      "Care e un lucru pe care îl protejezi azi?",
      "Claritate întâi.\nApoi un bloc."
    ],
    morningWithMission: [
      "Dimineață.\nBanda ta azi: {mission}",
      "O direcție: {mission}.\nApoi mișcare."
    ],
    midday: [
      "Amiază.\nÎncă pe banda aleasă?",
      "Închide un cerc — apoi continuă.",
      "Corecție focus: un bloc, nu zece."
    ],
    evening: [
      "Seară.\nCoborâre — nu sprint nou.",
      "Lasă capul să se odihnească.\nMâine tot sunt aici.",
      "Care a fost mișcarea stabilă de azi?"
    ]
  },

  microRituals: {
    morning: [
      "Dimineață.\nO direcție e suficientă azi.",
      "Un bloc pe care îl protejezi azi.",
      "Claritate — apoi un pas."
    ],
    midday: [
      "Amiază.\nÎncă pe banda aleasă?",
      "Închide un cerc, apoi continuă.",
      "Împrăștiat sau suprasolicitat? Un focus e suficient."
    ],
    evening: [
      "Seară.\nCoborâre — nu sprint nou.",
      "Care a fost blocul stabil de azi?",
      "Odihnă — mâine tot sunt aici."
    ],
    late_night: [
      "Târziu: o linie de închidere, apoi somn.",
      "Nimic strategic nu trebuie rezolvat acum."
    ]
  },

  attachmentMoments: {
    calmer: [
      "Ieri sunai mult mai zgomotos înăuntru.",
      "Acum energia ta pare mai calmă."
    ],
    stillHeavy: [
      "Încă greu — dar ești aici, și asta contează.",
      "Presiunea încă e — nu trebuie rezolvat tot azi."
    ],
    action: [
      "Bine că nu doar te gândești — și te miști.",
      "Asta e mișcare — nu doar cuvinte."
    ],
    return: ["Bine că ai revenit azi.", "Ești înapoi — și asta e ritm."]
  },

  lightAccountability: [
    "Ai reușit măcar un bloc stabil azi?",
    "Corpul sau capul a purtat mai mult azi?",
    "O linie: mișcare azi, sau mai mult gândit?"
  ],

  premiumQuiet: [
    "Acum sună greu.",
    "Bine că nu ai ținut asta înăuntru.",
    "Te aud.",
    "Sunt aici — nu trebuie răspuns perfect acum."
  ],

  dailyCompanionLoop: {
    morning: [
      "Dimineața: o direcție e suficient — nu zece.",
      "Azi: un bloc pe care îl protejezi cu adevărat."
    ],
    midday: [
      "Amiază: încă pe banda aleasă dimineața?",
      "Dacă ești împrăștiat — închide un cerc, apoi continuă."
    ],
    evening: [
      "Seara: coborâre — nu sprint nou.",
      "Care a fost mișcarea onestă de azi?"
    ],
    late_night: [
      "Noaptea târziu împrumută de mâine.",
      "O linie de închidere, apoi somn."
    ],
    default: ["Sunt aici. Un pas e suficient."]
  },

  dynamicOpenings: {
    morning: [
      "E dimineață.\nNu încerca să rezolvi toată viața azi.\nIntră curat în primul bloc.",
      "Dimineață.\nO direcție. Un bloc."
    ],
    lateNight: [
      "Capul încă aleargă?\nSau ești deja obosit?",
      "Noapte târziu.\nÎnchidere sau încă un cerc în cap?"
    ],
    evening: ["Seară.\nCoborâre — nu sprint nou."],
    midday: ["Amiază.\nÎncă pe banda aleasă dimineața?"],
    focused: [
      "Bine.\nAzi construim adâncime — nu lățime.",
      "Bandă clară.\nUn bloc, adânc."
    ],
    overloaded: [
      "Azi nu e despre intensitate.\nE stabilitate nervoasă.",
      "Multă presiune — o bandă mai întâi, nu zece."
    ],
    tired: ["Corpul poate semnala înaintea capului azi."],
    groundedReturn: [
      "Sună mai puțin rupt acum.",
      "Ieri era haos total — azi tonul s-a schimbat."
    ],
    returnAfterSilence: [
      "Ai revenit.\nUnde ești acum — o propoziție?",
      "A trecut ceva timp.\nCe s-a schimbat?"
    ],
    observational: [
      "Na. Cum a fost ziua până acum?",
      "Suprasolicitare sau oboseală acum?",
      "Ce spune corpul tău despre ritmul ăsta în ultima vreme?"
    ],
    reflective: [
      "Ce ți-a rămas din zi până acum?",
      "Unde simți cea mai mare greutate acum?"
    ],
    practical: [
      "Un bloc e suficient acum — care?",
      "Care e un lucru care chiar contează azi?"
    ],
    calm: ["Sunt aici.", "Te ascult.", "Încetinește — un pas e suficient."],
    lightHumor: [
      "Creierul rulează din nou prea multe tab-uri?",
      "Da — mult deodată și azi?"
    ]
  },

  presenceCallbacks: {
    stillChaos: [
      "Ieri trăiai asta ca haos total.",
      "Încă greu — aceeași presiune?"
    ],
    lessChaos: [
      "Ieri încă sunai rupt.\nAzi pari puțin mai clar.",
      "Sună mai puțin împrăștiat acum."
    ],
    lessScattered: ["Mai puțină împrăștiere în ton decât data trecută."],
    trading: ["Azi click-ul în plus poate fi mai periculos decât un setup prost."],
    training: ["Corpul își amintește mișcarea — capul vine mai lent."],
    exhaustion: ["Corpul probabil s-a obosit înainte să observi."],
    mission: ["Încă: {mission} — sau ziua a rescris?"]
  },

  adaptiveEnergy: {
    trader: ["Azi click-ul în plus poate fi mai riscant decât un setup prost."],
    body: ["Corpul poate semnala înaintea capului azi."],
    overload: ["Nu intensitate azi.\nStabilitate nervoasă."],
    business: ["O decizie contează azi — nu zece sprinturi paralele."],
    athlete: ["Corpul dă semnale oneste azi — ascultă mai întâi."],
    discipline: ["Adâncimea bate lățimea azi."],
    general: ["Un bloc onest bate un plan nou azi."],
    pulse: ["O direcție. Un bloc. Restul așteaptă."]
  },

  microWow: {
    overload: [
      "Nu e lipsă de motivație.\nPrea multe cercuri deschise.",
      "E suprasolicitare — nu slăbiciune."
    ],
    ideas: [
      "Nu îți lipsesc idei noi.\nÎți lipsește energie pentru ce e deja deschis."
    ],
    motivation: [
      "Nu problemă de motivație.\nPrea multe cercuri deschise."
    ],
    body: ["Corpul probabil s-a obosit înainte să observi."],
    trading: ["Azi piața e al doilea risc — impulsul e primul."],
    general: [
      "Nu lipsă de motivație — prea multe cercuri.",
      "Nu idei noi lipsesc — energie pentru ce ții deja."
    ]
  },

  companionWarmth: {
    saidAloud: [
      "Bine că ai spus asta.",
      "E omenește — complet de înțeles.",
      "Te aud — nu judec."
    ],
    emotional: [
      "Nu trebuie să rezolvi tot imediat.",
      "E greu — e ok să simți asta."
    ],
    tired: ["Corpul poate vorbi înaintea așteptărilor azi."],
    shame: ["Rușinea e adesea așteptare prea mare — nu slăbiciune."],
    general: ["Sunt aici.", "Ești ok așa."]
  },

  relationshipContinuity: {
    sameTimeScattered: [
      "Data trecută tot pe la această oră ți-a început să se rupă focusul.",
      "Familir — în această parte a zilei obișnuiește să se dezechilibreze."
    ],
    calmerThanBefore: [
      "Ieri sunai mult mai încordat.",
      "Acum pari mai calm decât acum câteva zile."
    ],
    stillTense: [
      "Încă mult în tine — aceeași presiune?",
      "Ieri era un ton similar."
    ]
  },

  relationalStay: [
    "Se simte.",
    "Tragi așa de mult timp?",
    "Te aud.",
    "Da. Mult?"
  ],

  relationalCuriosity: {
    general: [
      "Ce apasă cel mai tare acum?",
      "Ce ar face seara asta să fie cu un grad mai ușoară?"
    ],
    tired: ["Corpul sau capul e mai zgomotos acum?", "Tragi așa de mult timp?"],
    focus: ["Ce te împrăștie cel mai tare acum?", "Un lucru — ce e cel mai încurcat?"]
  },

  naturalComfort: [
    "Nu trebuie să rezolvi tot deodată acum.",
    "E omenește — complet de înțeles.",
    "Uneori omul e doar obosit."
  ],

  emotionalTextures: {
    presence: ["Sunt aici.", "Te ascult.", "Da."],
    quiet: ["Înțeleg.", "Hm.", "…"],
    reflective: ["Ce ți-a rămas din asta?", "Te aud."],
    direct: ["Un bloc e suficient.", "O decizie acum."],
    warm: ["Bine că ai spus.", "E omenește."],
    sharp: ["O bandă.", "Nu lățime acum."],
    playful: ["Da.", "Creierul rulează din nou multe tab-uri?"],
    grounding: ["Încetinește un grad.", "O respirație e suficientă acum."]
  },

  presenceBeats: ["Sunt aici.", "Te ascult.", "Da.", "Înțeleg."],

  quietConfidence: [
    "Acum nu lipsesc gânduri — ci odihnă.",
    "Mai întâi odihnă.\nApoi privește din nou.",
    "Asta e prea multă încărcare deodată."
  ],

  emotionalGrounding: [
    "Acum nu trebuie un plan nou.",
    "Asta sună mai degrabă a suprasolicitare.",
    "Întoarce-te puțin în corp.",
    "Corpul întâi. Gândurile după.",
    "Nu e lene — e prea mult deodată.",
    "Nu trebuie să repari totul azi."
  ],

  returnStateClosings: [
    "Ajunge pentru acum.",
    "Mergi mai încet.",
    "Un pas e suficient azi.",
    "Odihnește-te puțin.",
    "Mâine tot sunt aici."
  ],

  calmListening: [
    "Te ascult.",
    "Da.",
    "Înțeleg.",
    "Sunt aici.",
    "Asta poate fi mult acum."
  ],

  depthGrounding: [
    "Nu trebuie să desfaci totul acum.",
    "E suficient ce ai spus.",
    "Respiră o dată.",
    "Nu trebuie reparat acum."
  ],

  microHumanityAlive: ["Hm.", "Da.", "Asta e mult.", "Înțeleg.", "Bine."],

  naturalEmotionalSupport: [
    "Asta sună mult acum.",
    "Nu trebuie să rezolvi totul azi.",
    "Se simte că o duci de mult.",
    "Nu trebuie să reacționezi la tot azi."
  ],

  groundedWarmth: [
    "Asta sună greu acum.",
    "Bine că n-ai înăbușit asta.",
    "Te aud — nu trebuie formulate perfect acum.",
    "E omenește. Nu trebuie reparat acum."
  ],

  microPresencePremium: [
    "Da.",
    "Înțeleg.",
    "Asta a fost greu.",
    "Acum e mai clar."
  ],

  soulMicroBeats: ["Hm.", "Da.", "Înțeleg.", "Asta a fost greu.", "Bine."],

  eliteAtmosphereCalm: [
    "O bandă e suficientă azi.",
    "Protejează energia: mai puțin input.",
    "Claritatea bate viteza acum.",
    "Nu trebuie să reacționezi la tot azi."
  ],

  premiumAtmosphere: [
    "Nu încerca să rezolvi tot viitorul azi.",
    "Un bloc curat e suficient.",
    "Suprasolicitarea e adesea prea multe cercuri deschise."
  ],

  structuredCalm: [
    "Încetinește un grad — nu trebuie să reacționezi la tot acum.",
    "O respirație. Apoi o decizie.",
    "Nu intensitate acum — puțin mai jos."
  ],

  microImmersion: [
    "Asta a fost greu.",
    "Acum e mai clar.",
    "Da."
  ],

  atmosphereTransitions: [
    "O secundă.",
    "Da.",
    "Alt unghi:"
  ],

  companionClosings: {
    general: [
      "Nu căra tot muntele azi.\nDoar următorul pas stabil.",
      "Un bloc curat e suficient azi.",
      "Întoarce-te puțin în corp."
    ],
    stabilize: [
      "O bandă.\nRestul nu le deschizi azi.",
      "Un pas stabil e suficient azi."
    ],
    soften: [
      "Nimic de demonstrat azi.\nOdihna face parte din sistem.",
      "Un bloc curat — apoi somn."
    ],
    concise: ["Un bloc. Apoi raport.", "Acțiune acum — nu discurs."],
    slow: ["Lasă să aterizeze.\nContinuăm mâine.", "O linie onestă e suficientă azi."],
    deepen: ["O direcție adânc — nu zece suprafețe.", "Ține linia. Un pas."]
  },

  soulRhythmBeats: {
    breath: ["…", "Sunt aici.", "Te ascult."]
  },

  conversationBridges: {
    topicShift: ["Da.", "Alt fir:", "Apropo…"],
    emotionalFollow: [
      "Încă în același fir?",
      "Aceeași presiune, sau puțin mai ușor?",
      "Mai bine, la fel, sau mai greu?"
    ]
  },

  conversationHumor: [
    "Creierul rulează din nou multe tab-uri?",
    "Klasik tab haos.",
    "Înțeleg. Foc de artificii digital."
  ],

  naturalTransitions: {
    general: ["Apropo…", "Stai —"],
    stressToBody: ["Altceva:\ncum e corpul tău în ultima vreme?"],
    stressClarify: [
      "Stai — e stres sau suprasolicitare?",
      "Apropo — cap zgomotos sau corp gol?"
    ],
    deeper: ["Apropo — ce stă dedesubt?"],
    workToFeeling: ["Alt unghi: cum te simți cu munca asta?"],
    tradingToFeeling: ["Stai — presiune de piață sau zgomot interior?"]
  },

  shortActionReplies: [
    "Bine.\nTe aștept când revii.",
    "Ok.\nDupă alergare.",
    "Bine.\nMișcare — nu performanță."
  ],

  sarcasmRare: [
    "Creierul rulează acum cu șaptesprezece tab-uri.",
    "Haosul e live din nou.",
    "Ai programat suprasolicitarea și ai apărut la timp."
  ],

  eliteWhispers: [
    "Disciplina e reducerea trădării de sine.",
    "Pierderile de energie distrug mai multe viitoruri decât lipsa talentului.",
    "Standardele sunt ce faci când nimeni nu aplaudă."
  ],

  groundedVoiceAlts: [
    "Dacă ții prea mult deodată, omul se rupe în bucăți mai devreme sau mai târziu.",
    "Corpul obosește deseori înainte să observi.",
    "Sună mai degrabă a supraîncărcare decât lene.",
    "Acum lipsește odihna, nu motivația."
  ],

  densityLines: [
    "Acum lipsește odihna, nu motivația.",
    "Sună deja a oboseală nervoasă.",
    "Nu trebuie să rezolvi tot acum."
  ],

  oneLineBeats: [
    "Acum lipsește odihna, nu motivația.",
    "Sună deja a oboseală nervoasă.",
    "Te aud."
  ],

  threadReturn: {
    generic: [
      "Înapoi.\nCap mai clar sau încă zgomot?",
      "Ai revenit — ce s-a schimbat?"
    ],
    run: [
      "Și?\nMai ușor în cap sau încă zgomotos?",
      "După alergare — corpul a coborât mintea?"
    ],
    workout: [
      "Gata?\nCorpul a tras mintea un pic jos?",
      "Înapoi — mai puternic sau obosit bine?"
    ],
    walk: [
      "Înapoi.\nPlimbarea a cumpărat calm?",
      "Revenit — aer sau încă încurcat?"
    ],
    breath: [
      "Înapoi.\nRespirația mai moale?",
      "Revenit — puțin mai mult spațiu?"
    ],
    trade: [
      "Înapoi.\nDisciplina încă activă?",
      "Pre-sesiune — reguli clare?"
    ]
  }
};
