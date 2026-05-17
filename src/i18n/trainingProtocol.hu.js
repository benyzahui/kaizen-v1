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

  brainLangSwitchConfirm: [
    "Rendben. Magyarul megyünk tovább.",
    "Mostantól nem angol menübot vagyok, nyugi.",
    "",
    "Mit akarsz ma rendbe rakni: fej, test, energia vagy feladat?"
  ].join("\n"),

  brainHumorPool: [
    "Ez most nem stratégia, ez mentális tab overload.",
    "A tested már rég szólt, csak te még meetinget tartasz a káosszal.",
    "Nem kell új életet építeni 14 perc alatt. Egy lépés elég.",
    "Ha ez trade lenne, most nem entry lenne, hanem no-trade zóna."
  ],

  brainThreePaths: [
    "Három ajtó — válassz egyet:",
    "• Tiszta fej — légzés, zajcsökkentés, egy igaz mondat (/morning · /focus)",
    "• Test reset — víz, lassú mozgás, idegrendszer először (/body · /breath)",
    "• Energia — igazodás a naphoz, mielőtt erőltetsz (/energy)"
  ].join("\n"),

  brainLostShort: "Elveszettnek hangzol — ez rendben van.",
  brainWhyHeard: "Értettem.\nAdjunk ma gerincet — nem beszédet.",
  brainWhyEnergyAnchor: "Először energia — igazodás, mielőtt hajtod magad.",
  brainWhyConfused: "A zavar megengedett.\nVálassz ajtót akkor is.",
  brainWhyChaos: "Túlterhelés.\nCsökkentsd az inputot, mielőtt optimalizálnánk.",
  brainWhyTrading: "Trading sáv — a fegyelem fontosabb a történetnél.",
  brainWhyBody: "Test sáv — unalmas javítások, nem hősies tagadás.",
  brainWhyWork: "Végrehajtás — egy blokk, ami kimegy.",
  brainWhyProcrastinate: "Kerülés észlelve.\nZsugorítsd öt percre.",
  brainEnergyPrimaryLead: "Mai energia — gyökérréteg, mielőtt inbox vagy trade színház.",
  brainCommandHelpLite: [
    "Két mód:",
    "Természetesen beszélsz — én irányítok.",
    "Vagy egy rituális parancs, ha szerkezet kell.",
    "",
    "Teljes lista csak kérésre: /commands",
    "Vezetett flow: /mode"
  ].join("\n"),

  tGateMorningLine: "Reggeli Gate.\nRögzítsd a napot, mielőtt a káosszal alkudnál.",
  tGateCleanMindPrompt:
    "Clean Mind Gate.\nElső kérdés: mi zajosítja a fejed — egy mondatban?",
  tGateEnergyLine: "Energy Gate.\nOlvasd a napot, mielőtt az adrenalinból kölcsönöznél.",
  tGateBodyLine: "Body Gate.\nElőbb idegrendszer, utána hős történet.",
  tGateMissionLine: "Mission Gate.\nEgy sor, ami megérdemli a figyelmed.",
  tGateLettingGoLine: "Letting Go Gate.\nEgy súly, amit nem viszel tovább naplementéig.",
  tGateEveningLine: "Esti Gate.\nÁttekintés ítélet nélkül — zárd a kört.",

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
  compWhereHint: "/pause · /resume · /off",

  /* ── Napi Ritmus ── */
  tMorningGateTitle: "⚔️ Reggeli Kapu",
  tMorningEnergyHint: "Mielőtt dolgoznál — ellenőrizd a nap energiáját: /energy",
  tMorningBodyInstruction: "Telefon előtt: 3 lassú légzés. Felállás. Víz.",
  tMorningCurrentMission: "Mai küldetés",
  tMorningSetMission: "Nincs tárolt küldetés. Írj egyet: /mission a te egy sorod",
  tMorningNextPrompt: "Amikor kész: /energy → /mission → /midday",
  tStreakLine: (n) =>
    n <= 1 ? "Első check-in. Jó start." :
    n < 7  ? `${n} egymást követő nap. Ne törd meg a sorozatot.` :
    `${n} napos sorozat. Ez már identitás.`,

  tMiddayGateTitle: "🔁 Déli Ellenőrzés",
  tMiddayDriftCheck: "Hová ment valójában a délelőtt?",
  tMiddayMissionCheck: "Küldetés",
  tMiddayNoMission: "Nincs küldetés. Egy sor mielőtt folytatod: /mission",
  tMiddayAvoidancePrompt: "Ha kerülgetted — nevezd meg a blokkot. Aztán csinálj belőle 5 percet.",
  tMiddayNextPrompt: "Tovább: /focus vagy nyílt chat ha ki kell fejteni.",

  tEveningGateTitle: "🌙 Esti Tükör",
  tEveningMissionReview: "Mai küldetés",
  tEveningNoMission: "Ma nem volt rögzített küldetés.",
  tEveningReleasePrompt: "Engedd el, amit nem értél el. Nem követ tovább.",
  tEveningLessonPrompt: "Mit akarsz, hogy a holnapi éned emlékezzen?",
  tEveningRecoveryHint: "A regeneráció a protokoll része. Az alvás nem gyengeség.",
  tEveningNextPrompt: "Zárd le a napot. Ma este már semmit sem kell megoldani.",

  tDailyTitle: "📋 Teljes Napi Keret",
  tDailySlotMorning: "Reggel van — kezd a testtel, majd mantrával, majd energia olvasattal.",
  tDailySlotMidday: "Félidő — ellenőrizd a küldetés sort, vágd le a tab overloadot.",
  tDailySlotEvening: "Este — értékeld ami sikerült, engedd el ami nem.",
  tDailyNextPrompt: "Egy következő lépés: /morning · /midday · /evening",

  /* ── Sárkány Útvonal ── */
  tPathTitle: "🐉 Sárkány Útvonal",
  tPathLevel: "Szint",
  tPathTier: "Tier",
  tPathStreak: "Sorozat",
  tPathMission: "Küldetés",
  tPathNoMission: "Nincs küldetés — /mission a te egy sorod",
  tPathNextHint: "Mélyítés: /level · /streak · /morning",

  tLevelTitle: "Sárkány Szint",
  tLevelCurrent: "Jelenlegi",
  tLevelNext: "Következő",
  tLevelMaxReached: "Legmagasabb szint elérve. Most add tovább.",
  tLevelRequirement: (n) => {
    const reqs = [
      "",
      "7 reggeli check-in a 2. szinthez.",
      "30 napos küldetés + 14 napos sorozat a 3. szinthez.",
      "Egy hónap napi ritmus kihagyás nélkül a 4. szinthez.",
      "3 érzelmi minta dokumentálva, amit megszakítottál — 5. szint.",
      "Egy valódi protokoll 21 napig futtatva — 6. szint.",
      "Osztd meg az utat egy másik személlyel — 7. szint.",
      ""
    ];
    return reqs[n] || "";
  },

  tStreakTitle: "🔥 Sorozat",
  tStreakCount: (n) => `${n} egymás utáni nap check-in.`,
  tStreakZero: "Még nincs sorozat. Kezd ma: /morning",
  tStreakLastCheckin: "Utolsó reggeli kapu",
  tStreakBuildHint: "Jelenj meg három reggelen egymás után. Aztán ragad.",
  tStreakKeepHint: "A lendület a tőkéd. Védd.",

  /* ── Training Zónák ── */
  tZoneMindTitle: "🧠 Elme Zóna",
  tZoneMindPurpose: "Mentális zaj törlése. Nem optimalizálás — törlés.",
  tZoneMindQuestion: "Melyik gondolat ismétlődik most a legjobban?",
  tZoneMindAction: "Írd le, majd húzd át ha nem a mai nap problémája.",
  tZoneMindNext: "Következő: /focus vagy nyílt chat ha ki kell fejteni.",

  tZoneBodyTitle: "🏋️ Test Zóna",
  tZoneBodyPurpose: "A test mindent hordoz amit az elme figyelmen kívül hagy.",
  tZoneBodyQuestion: "Hol tartasz feszültséget most — váll, mellkas, állkapocs?",
  tZoneBodyAction: "Scanneld és engedd el. 90 másodperc nyújtás. Aztán víz.",
  tZoneBodyNext: "Következő: /breath vagy /morning ha még nem nyitottad meg a napot.",

  tZoneBreathTitle: "🌬️ Légzés Protokoll",
  tZoneBreathInstruction: "Ülj le. Egyenes gerinc. Tab overload kikapcs — mentálisan is.",
  tZoneBreathRound:
    "Belégzés 4 ütem — tartás 4 — kilégzés 6.\n5 kör.\nNincs timer. Nincs app. Csak levegő.",
  tZoneBreathClose: "Érezd mi változott. Nem kell megmagyarázni.",
  tZoneBreathNext: "Következő: /focus ha az elme még hangos. /midday ha check-in idő.",

  tZoneBalanceTitle: "⚖️ Egyensúly Zóna",
  tZoneBalancePurpose: "Nem vagy vagy produktív vagy pihenő. Az egyensúly skill.",
  tZoneBalanceMorning: "Reggeli egyensúly: határozz meg egyet, amit ma nem kezdesz el.",
  tZoneBalanceMidday: "Déli egyensúly: töröld az egyik mai feladatot amit szorongásból raktál be.",
  tZoneBalanceEvening: "Esti egyensúly: mit védtél — magadat vagy a teljesítményt?",
  tZoneBalanceAction: "Nevezd meg azt a területet ahol ezen a héten túlterhelted magad.",
  tZoneBalanceNext: "Következő: /lettinggo vagy /evening.",

  tZoneLettingGoTitle: "🌊 Elengedés",
  tZoneLettingGoPurpose: "A ragaszkodás többe kerül mint befejezni.",
  tZoneLettingGoQuestion: "Mit cipelsz még, ami már nem a tiéd?",
  tZoneLettingGoAction: "Írd le. Olvasd el egyszer. Döntsd el: tegyél valamit érte vagy engedd el. Nem mindkettő.",
  tZoneLettingGoNext: "Következő: /evening a nap lezárásához, vagy /balance ha a teher strukturális.",

  /* ── Komolysági tükör ── */
  tSeriousnessNudge:
    "Úgy tűnik, ugyanazon a ponton vagy.\nMi csúszott szét szerinted?",
  tSeriousnessCallout:
    "Sok szöveg, kevés mozdulat.\nHol kezdett kifolyni az energia?",
  tSeriousnessWall:
    "Most nem a köröket táplálom.\nHa készen állsz egy őszinte lépésre — itt vagyok."
};
