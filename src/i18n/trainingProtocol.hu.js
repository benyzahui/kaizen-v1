/**
 * Dragon Training OS — protocol copy (HU).
 */

module.exports = {
  tMorningHeader: "Reggeli mantra:",
  tMorningFooter: "Aztán: /energy → egy küldetés-lépés → /evening",

  tProgramTitle: "Dragon Training — napi szerkezet",
  tProgramBody: [
    "Dragon Training — napi szerkezet",
    "",
    "1. Reggeli mantra — /morning",
    "2. Energia ellenőrzés — /energy",
    "3. Egy küldetés-lépés — /mission",
    "4. Test fegyelem — /body vagy /breath",
    "5. Esti tükör — /evening",
    "",
    "Ma nem arról szól, hogy mindent megcsinálsz.",
    "Hanem arról, hogy benn maradsz a folyamatban.",
    "",
    "Rajta: /morning"
  ].join("\n"),

  tTodayBody: [
    "Ma (training keret):",
    "",
    "• Mantra: /morning",
    "• Energia: /energy",
    "• Küldetés sor: /mission",
    "• Egy testi horgony: /breath vagy /walk",
    "• Zárás: /evening",
    "",
    "Egy sáv. Egy nap. Nem alkuszol a szétfolyással."
  ].join("\n"),

  tMissionEmpty: [
    "Küldetés (training):",
    "Még nincs egy soros küldetés tárolva.",
    "",
    "Írj egyet:",
    "/mission a te egy soros küldetésed",
    "",
    "Vagy előbb rögzíts 30 napos célt: /setup"
  ].join("\n"),

  tMissionStored: (line) =>
    [
      "Küldetés rögzítve:",
      line,
      "",
      "Szabály: egy látható lépés ebbe az irányba, mielőtt új szálat nyitsz.",
      "Zárás: /done"
    ].join("\n"),

  tMissionUpdateHint: "Frissítés: /mission az új egy soros küldetés",

  tDoneBody: [
    "Kész (training):",
    "Nevezd meg, mit zártál le — akár kicsit is.",
    "Elismerés produkció nélkül.",
    "",
    "Ha ma az ellenállás nyert: /procrastination",
    "Ha holnap előtt el kell engedni valamit: /lettinggo",
    "",
    "Következő: /evening vagy /mirror"
  ].join("\n"),

  tEveningMirror: [
    "Esti tükör:",
    "",
    "1) Mit fejeztél be — egy sorban?",
    "2) Hol jött elő ellenállás — egy szóban?",
    "3) Mit tanultál — egy mondatban?",
    "4) Mit kell elengedni holnap előtt — egy lélegzet, egy név?",
    "",
    "Nincs ítélet. Csak őszinte zárás.",
    "Holnap: /morning"
  ].join("\n"),

  tProcrastinationProtocol: [
    "Halogatás protokoll:",
    "",
    "A halogatás nem lustaság.",
    "Ellenállás, félelem, vagy irány nélküli energia.",
    "",
    "1. Nevezd meg a kerülendő feladatot.",
    "2. Tedd kisebbé.",
    "3. Kezdj el 5 percet.",
    "4. Jelents vissza: /done"
  ].join("\n"),

  tLettingGoProtocol: [
    "Elengedés protokoll:",
    "",
    "1. Lélegezz — kilégzés hosszabb, három kör.",
    "2. Nevezd meg, mit engedsz el — egy mondat.",
    "3. Érezni a testben — öt másodperc, történet nélkül.",
    "4. Ne túlgondold — egy szimbolikus tett (lap bezár, telefon másik szobába).",
    "5. Vissza a jelenbe — láb, légzés, egy fizikai lépés.",
    "",
    "Aztán: /mission vagy /focus"
  ].join("\n"),

  tFocusLaneNudge: [
    "Sávot váltasz.",
    "Ez nem tisztánlátás. Menekülés.",
    "",
    "Térj vissza a választott küldetéshez.",
    "Használd: /focus vagy /clear."
  ].join("\n"),

  tResistanceProtocol: [
    "Ellenállás (training olvasat):",
    "Az ellenállás információ — nem jellembíró ítélet.",
    "",
    "Nevezd meg a kerülendő lépést egy sorban.",
    "Aprítsd öt percre.",
    "Kezdj csúnyán. Zárj láthatóan.",
    "",
    "Ha a test zajos: /breath",
    "Ha a történet hangos: /mirror"
  ].join("\n"),

  tBusinessMenu: [
    "Business aréna — melyik sáv ma?",
    "",
    "1. Adminisztráció",
    "2. Értékesítés",
    "3. Analitika",
    "4. Trading (üzleti fegyelem, nem felhajtás)",
    "",
    "Parancs: /business admin | /business sales | /business analytics | /business trading",
    "Vagy: /admin /sales /analytics — végrehajtás: /trade /check /risk"
  ].join("\n"),

  tBusinessAdmin: [
    "Admin sáv:",
    "Rendezés, dokumentálás, jövőbeli énednek át nem hagyott adósság.",
    "Egy lezárt ciklus: fájl, címke, archívum.",
    "",
    "Kész: /done"
  ].join("\n"),

  tBusinessSales: [
    "Sales sáv:",
    "Outreach, ajánlat tisztaság, követés — ha az érték valódi.",
    "Egy beszéd vagy egy üzenet — kiküldve.",
    "",
    "Kész: /done"
  ].join("\n"),

  tBusinessAnalytics: [
    "Analitika sáv:",
    "Adat és viselkedés — minták, nem hangulat.",
    "Egy grafikon, egy hipotézis, egy döntés.",
    "",
    "Következő: /focus — egy mérték ma."
  ].join("\n"),

  tBusinessTrading: [
    "Trading (üzleti fegyelem) sáv:",
    "Kockázat először. Nincs hős trade. Folyamat a narratíva helyett.",
    "",
    "Lánc: /check → /risk → /trade (csak ha mindkettő ok)",
    "Ha fáradt: /notrade"
  ].join("\n"),

  tMoonPortal: [
    "Hold (training):",
    "Nem találunk ki pontos holdfázist élő adat nélkül.",
    "Őszinte napi keret + cselekvés: /energy",
    "",
    "Rövid horgony: lassítsd a bemeneteket; a test vezessen döntés előtt."
  ].join("\n"),

  tNumerologyPortal: [
    "Numerológia (training):",
    "A nap rezgése kontextus — nem sors.",
    "Teljes szerkezetes olvasat: /energy",
    "",
    "Egy tett: zárj le egy nyitott kört új előtt."
  ].join("\n"),

  tAstroPortal: [
    "Asztrológia (training):",
    "Évszak minőség — nincs chart-színház, nincs jóslás.",
    "Földelt napi keret: /energy",
    "",
    "Egy tett: munkaterhelés az évszak kéréséhez igazítva."
  ].join("\n"),

  tMantraSameAsMorning:
    "A mantra a /morning része — rövid, kimondható, ismételhető. Futtasd: /morning.",

  tMorningMantras: {
    trading: [
      "Ma nem alkuszom az impulzussal.\nElőbb a kockázat.\nNincs trade, amihez történet kell igazolásnak.",
      "Ma a piac nem tartozik nekem tisztánlátással.\nA setupomra várok — vagy kiszállok.",
      "Ma a tőkét oxigénként védem.\nA türelem is végrehajtás."
    ],
    business: [
      "Ma nem alkuszom a káosszal.\nEgy utat választok.\nEgy tiszta tettet befejezek.",
      "Ma a mélység veri a láthatóságot.\nEgy szállított darab tíz piszkozat helyett.",
      "Ma szerkezettel vezetek — két órára törvény a naptár."
    ],
    physical: [
      "Ma a test vezet.\nAlvás, üzemanyag, mozgás — ebben a sorrendben.\nNincs hősies üres tankkal.",
      "Ma az erő unalmas ismétlés.\nEgy őszinte szett.",
      "Ma a regeneráció része az edzésnek.\nMegállok, mielőt hazudnék magamnak."
    ],
    emotional: [
      "Ma elnevezem az érzést anélkül, hogy parancsolna.\nA nyugalom nem zsibbadtság — irányított.",
      "Ma nem spirálozom szórakozásból.\nEgy igazság, egy határ, egy lélegzet.",
      "Ma az együttérzés határt is jelent — magamnak először."
    ],
    spiritual: [
      "Ma az energia irányt kap.\nÉrzékelés cselekvés nélkül csúszka — egy földelt lépést veszek.",
      "Ma ciklust olvasok determinizmus nélkül.\nEgyszerűsítem a bemenetet; figyelek a testre.",
      "Ma a szellem a kis dolgok fegyelme.\nA szent: következetes."
    ],
    selfdev: [
      "Ma a növekedés egy ismétlés.\nVitánincs a szabály után.",
      "Ma drámát cserélek ismétlésre.\nTíz perc, egy képesség, egy bizonyíték.",
      "Ma a cselekvés formál identitást — nem fordítva."
    ],
    mixed: [
      "Ma nem alkuszom a káosszal.\nEgy utat választok.\nEgy tiszta tettet befejezek.",
      "Ma egy sáv egyszerre.\nA mélység a fegyver.",
      "Ma a fegyelem szeretet fogakkal — megtartom a szavam magammal."
    ],
    default: [
      "Ma nem alkuszom a káosszal.\nEgy utat választok.\nEgy tiszta tettet befejezek.",
      "Ma a folyamathoz térek vissza — nem a hangulathoz.",
      "Ma egy tiszta lépés veri a tökéletes tervet."
    ]
  },

  tHelpTrainingMap: [
    "KaiZen Training térkép",
    "",
    "Napi:",
    "/program /morning /pulse /focus /mirror /evening /today",
    "",
    "Átalakulás:",
    "/discipline /resistance /procrastination /shadow /lettinggo /identity /lockin",
    "",
    "Test:",
    "/body /breath /walk /train /sleep /recovery",
    "",
    "Energia:",
    "/energy /moon /numerology /astro /ground /recenter",
    "",
    "Business:",
    "/business /admin /sales /analytics",
    "",
    "Trading:",
    "/trade /check /risk /cooldown /notrade",
    "",
    "Profil:",
    "/setup /profile /mission /clear /status /language"
  ].join("\n"),

  tProgramActivated: [
    "⚔️ Dragon Training — aktív.",
    "",
    "Napi sáv él: mantra → energia → küldetés → test → tükör.",
    "",
    "1. lépés: /morning",
    "",
    "Teljes térkép (mentsd el): /map"
  ].join("\n"),

  tProgramStep2Energy: "Következő lépés: /energy",
  tProgramStep3Mission: "Következő lépés: /mission",
  tProgramStep4Body: "Következő lépés: /body vagy /breath",
  tProgramStep5Evening: "Következő lépés: /evening vagy /mirror",
  tProgramCycleClosed: "A ciklus ma lezárult.\n\nEste: /mirror — holnap: /program",

  tProgramWanderOpenChat: [
    "A nyitott chat oké.",
    "De a program sávja még aktív.",
    "",
    "Folytatás: a /program szerinti következő parancs",
    "Fókusz: /focus",
    "Session törölve (profil marad): /clear"
  ].join("\n"),

  tCommandsCategorized: [
    "KaiZen — parancstérkép",
    "",
    "START",
    "/start /setup /program /mission /today /focus /done /clear",
    "",
    "NAPI",
    "/morning /mantra /pulse /evening /mirror /review",
    "",
    "ÁTALAKULÁS",
    "/discipline /resistance /procrastination /shadow /lettinggo /identity /lockin",
    "",
    "TEST",
    "/body /breath /walk /train /sleep /recovery",
    "",
    "ENERGIA",
    "/energy /moon /numerology /astro /ground /recenter",
    "",
    "BUSINESS",
    "/business /admin /sales /analytics",
    "",
    "TRADING",
    "/trade /check /risk /cooldown /notrade",
    "",
    "PROFIL",
    "/profile /status /language /help /guide /commands /map",
    "",
    "AKTÍV (társ mód)",
    "/mode /off /pause /resume /whereami"
  ].join("\n"),

  tMapFooter: "Mentsd el ezt az üzenetet. Ez a training térképed.",

  helpV19Simple: [
    "A KaiZen két módon használható:",
    "",
    "1) Természetes beszéd — tükrözés és tisztánlátás.",
    "2) Parancsok — szerkezet és training.",
    "",
    "Aktív vezetés (egy lépés egyszerre):",
    "/mode — majd /off /pause /resume /whereami",
    "",
    "Napi keret indítása:",
    "/program",
    "",
    "Napi ritmus:",
    "/morning /energy /mission /body /mirror",
    "",
    "Teljes lista:",
    "/commands vagy /map"
  ].join("\n"),

  tStatusProgram: "Program",
  tStatusProgramStep: "Következő lépés",
  tStatusProgramIdle: "üres (nincs aktív lépés)",
  tStatusNextProgram: "Javasolt (program)",

  tStatusCompanionOff: "Társ mód: ki",
  tStatusCompanionLive: "Társ mód: be (vezetés aktív)",
  tStatusCompanionPaused: "Társ mód: be (vezetés szünetel)",

  tEnergyLensFooter: [
    "",
    "Nézőpont:",
    "/energy trading · /energy body · /energy emotion · /energy work"
  ].join("\n"),

  tProfileMissionLine: "Küldetés (training):",
  tProfileTrainingStyle: "Training stílus:",

  compSlotMorning: [
    "Reggeli mód.",
    "Először: stabilizálás.",
    "Azután: sáv választás.",
    "Végül: egy tiszta tett."
  ].join("\n"),
  compSlotMidday: [
    "Délutáni mód.",
    "Fókusz ellenőrzés.",
    "Egy korrekció.",
    "Egy látható lépés."
  ].join("\n"),
  compSlotEvening: [
    "Esti mód.",
    "Nincs több bizonyítás.",
    "Áttekintés, elengedés, visszatérés."
  ].join("\n"),
  compSlotLate: [
    "Késő éjszakai mód.",
    "Kevesebb inger.",
    "Mély döntés nélkül.",
    "Csak pihenő protokoll."
  ].join("\n"),

  compModeOn: "⚔️ Aktív KaiZen társ — bekapcsolva.",
  compModeOff:
    "Aktív mód ki.\n\nA parancsok megmaradnak, ha struktúrát akarsz.\nVissza az vezetéshez: /mode",
  compPausedMsg: "Vezetés szünetel.\n\nKövetkező: /resume",
  compResumeMsg: "Vezetés folytatódik.\n\nEgy lépés egyszerre.",
  compNotActiveWhere: "Az aktív mód ki van kapcsolva.\n\nBekapcsolás: /mode",
  compNotActivePause: "Az aktív mód nincs bekapcsolva.\n\nIndítás: /mode",
  compNotActiveResume: "Az aktív mód nincs bekapcsolva.\n\nIndítás: /mode",

  compFlowWeStart: "Egyszerűen kezdünk.",
  compFlowAskBody: "1. Test állapot — 1-től 10-ig?",
  compFlowBadBody: "Egy szám. 1–10.",
  compFlowAfterBody: "Elég jó.",
  compFlowAskMind: "2. Elmeállapot — calm, scattered, heavy vagy sharp? (egy szó)",
  compFlowBadMind: "Válassz egyet: calm, scattered, heavy, sharp.",
  compFlowAfterMind: "Rögzítve.\nEgy sáv.",
  compFlowAskMission: "3. A mai küldetés — egy sorban?",
  compMissionTooShort: "Túl rövid.\nEgy őszinte küldetéssor.",
  compFlowMissionClose: "Küldetés megvan.\nNem nyitunk széles tervet, amíg ez nincs kint.",
  compNextPrefix: "Következő:",
  compAgreement: [
    "Ez beleegyezésnek hangzik, de nincs mögötte vállalás.",
    "Egy sávot válassz:",
    "• /pulse — folytatás",
    "• /trade — trading sáv",
    "• /reset — spirál stop"
  ].join("\n"),
  compNyOpen: [
    "A session idő nem trade tétel.",
    "Előbb a setup: irány, likviditás, kockázat, belépő trigger.",
    "Ha bármelyik homályos: nincs trade."
  ].join("\n"),
  compTradingImpulse: [
    "Az impulzus drága.",
    "Hűtsd a történetet. Kockázat előtt méret.",
    "Nincs hős trade."
  ].join("\n"),
  compStartParalysis: [
    "A kezdés bénítása valós.",
    "Zsugorítsd a napot egy látható lépésre — tíz perc.",
    "Ha kész vagy, egy sorban nevezd meg a küldetést."
  ].join("\n"),
  compProcrastinate: [
    "A halogatás ellenállás álarcban.",
    "Az első lépés legyen csúnya és kicsi — öt perc.",
    "Utána jelents: /done"
  ].join("\n"),
  compCasualTalk: [
    "A beszélgetés megengedett.",
    "A training ettől még egy őszinte sávot kér.",
    "Mondd meg, mit kerülsz valójában."
  ].join("\n"),
  compTiredPush: [
    "Fáradt test, kemény elvárás.",
    "Ma ne mély döntés, ha nem muszáj.",
    "Előbb stabilizálás: víz, lassú légzés, egy kicsi blokk."
  ].join("\n"),
  compScattered: [
    "Szétesett elme, szétesett eredmény.",
    "Nincs széles terv.",
    "Egy sáv. Egy következő blokk."
  ].join("\n"),
  compOverload: [
    "A túlterhelés nyer, ha még inputot adsz hozzá.",
    "Vágj csatornákat. Egy lélegzet. Egy feladat.",
    "Zsugorítsd, amíg belefér."
  ].join("\n"),
  compMissionDrift: [
    "Küldetés elcsúszás.",
    "Zárd újra a mai sort — nem az egész jövőt.",
    "Egy mondatos küldetés."
  ].join("\n"),
  compSeekingPermission: [
    "Engedélyt kérsz ahhoz, hogy teljes méretben légy.",
    "Az engedély nem kint van.",
    "Válassz egy keretet ma — és abban cselekedj."
  ].join("\n"),
  compSeekingClarity: [
    "A tisztánlátás mozgásból jön, nem újabb gondolatból.",
    "Egy kísérlet. Egy megfigyelhető eredmény.",
    "Tartsd kicsiben a kérdést."
  ].join("\n"),
  compOverthink: [
    "A túlgondolás második munka fizetés nélkül.",
    "Korlátozd az elemzést. Mozdulj tíz percet.",
    "Hagyj szavazni a valóságot."
  ].join("\n"),
  compEmotional: [
    "Az érzelem adat, nem parancs.",
    "Nevezd meg egyszer. Aztán egy stabilizáló tett.",
    "Nincs spirál próba."
  ].join("\n"),
  compBodyNeglect: [
    "A test az alapréteg.",
    "Üzemanyag, víz, mozgás — a unalmas nyer.",
    "Egy fizikai reset a több elme előtt."
  ].join("\n"),

  compDefaultMorning: [
    "Reggeli igazítás.",
    "Mantra → energia → egy küldetés → test horgony.",
    "Ha lehet, csend az első órában."
  ].join("\n"),
  compDefaultMidday: [
    "Déli korrekció.",
    "Egy fókusz ellenőrzés. Egy ellenállás név. Egy javítás.",
    "Új sáv nélkül."
  ].join("\n"),
  compDefaultEvening: [
    "Esti tükör.",
    "Áttekintés ítélet nélkül. Egy súly elengedése.",
    "Zárd a kört."
  ].join("\n"),
  compDefaultLate: [
    "Késő ablak.",
    "Csökkentsd az ingereket. Nagy ígéretek nélkül.",
    "A pihenés is training."
  ].join("\n"),

  compWhereTitle: "Hol vagy",
  compWherePausedYes: "Szünet: igen",
  compWherePausedNo: "Szünet: nem",
  compWhereTimeBand: "Napsáv",
  compWhereBandMorning: "reggel",
  compWhereBandMidday: "délután",
  compWhereBandEvening: "este",
  compWhereBandLate: "késő éjszaka",
  compWhereAwaiting: "Várakozás",
  compWhereWaitingInput: "Folyamat: üres (coach útvonal)",
  compWhereBody: "Test pont",
  compWhereMind: "Elme címke",
  compWhereLastProtocol: "Utolsó protokoll",
  compWhereHint: "/pause · /resume · /off"
};
