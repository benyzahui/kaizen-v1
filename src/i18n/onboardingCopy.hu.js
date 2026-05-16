/** Hungarian — onboarding, guide, anti-loop (merged into responses bundle). */

module.exports = {
  fcActivation: [
    "⚔️ KaiZen aktiválva.",
    "",
    "Elite Zone · Dragon Path társ — fegyelem, test, elme, energia, üzlet, trading.",
    "Nem véletlen AI chat. Nem motivációs zaj.",
    "",
    "Küldj egy sort, ha készen állsz."
  ].join("\n"),

  fcIntro: [
    "⚔️ KaiZen — Elite Zone · Dragon Path",
    "",
    "Napi társad vagyok: fegyelem, tisztánlátás, idegrendszer-stabilitás, őszinte végrehajtás.",
    "",
    "Ez nem véletlen AI chat. Nincs guru-zaj. Nincs motivációs spam.",
    "Strukturárt jelenlét — reggeltől estig.",
    "",
    "Küldj egy sort, ha készen állsz a beállításra."
  ].join("\n"),

  fcAskNaturalIntro: [
    "Mutatkozz be természetesen — nem űrlap.",
    "",
    "Ki vagy, mi hozott ide, min dolgozol most?",
    "A nyelvet is innen érzékelem (magyar / english / română)."
  ].join("\n"),

  fcNaturalTooShort: "Egy kicsit több — pár őszinte mondat elég.",

  fcHeardIntro: "Hallottalak. Most a fő fókusz:",

  fcLangPick: [
    "Nyelv — válassz (csak /language változtatja):",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  ].join("\n"),
  fcLangInvalid: "Válassz: 1, 2 vagy 3.",
  fcAskFocus: [
    "Mi a fő fókuszod most?",
    "",
    "1 — Elme / stressz",
    "2 — Test / fegyelem",
    "3 — Energia / tudatosság",
    "4 — Trading szemlélet",
    "5 — Üzlet / végrehajtás",
    "6 — Vegyes",
    "",
    "Válasz: szám."
  ].join("\n"),
  fcFocusInvalid: "Válassz 1–6 közül.",
  fcFocusLabels: {
    mind: "elme / stressz",
    body: "test / fegyelem",
    energy: "energia / tudatosság",
    trading: "trading szemlélet",
    business: "üzlet / végrehajtás",
    mixed: "vegyes prioritások"
  },
  fcComplete: [
    "Bent vagy, {name}.",
    "",
    "Fő sáv: {focus}.",
    "Ehhez igazítom a válaszokat — nem általános chat."
  ].join("\n"),
  fcCompleteNext: "Következő lépés: /today — a napod egy képernyőn.",
  fcWelcomeAtmosphere: [
    "Megtaláltad a kaput.",
    "",
    "Ez KaiZen — Dragon Path training társ.",
    "Nem chatbot. Nem motivációs zaj.",
    "",
    "Nyugodt rendszer fegyelemre, idegrendszer-stabilitásra, őszinte végrehajtásra.",
    "",
    "Még nincs parancs. Nincs menü.",
    "Csak jelenlét.",
    "",
    "Ha itt vagy, küldj egy sort — bármilyen szót — és kezdünk."
  ].join("\n"),
  fcWelcomePrompt: "Egy sor elég a kapu megnyitásához.",
  fcAskName: "Először — hogyan szólítsalak?\n(Elég a keresztnév.)",
  fcNameAck: "Rendben, {name}.",
  fcAskPurpose: [
    "Miért jöttél ma KaiZenhez?",
    "",
    "Ne a csiszolt válasz — a valódi.",
    "Egy-két mondat."
  ].join("\n"),
  fcAskIdentity: [
    "Ki leszel a következő 30 napban?",
    "",
    "A saját nyelveden — ki vagy, és mit akarsz megerősíteni."
  ].join("\n"),
  fcIdentityHint: "Egy rövid őszinte bekezdés. Nincs előadás.",
  fcIdentityHeard: "Hallottam: {snippet}",
  fcStructureIntro: [
    "Jó. Bent vagy a rendszerben.",
    "",
    "Pár szerkezeti kérdés — egyenként.",
    "Aztán edzünk."
  ].join("\n"),
  rhythmHints: {
    morning: "Reggeli sáv: test először, aztán egy küldetés sor.",
    midday: "Déli check: egy őszinte blokk — vágd a tab zajt.",
    evening: "Este: engedd el ami nem ment ki. Tiszta zárás.",
    late_night: "Késői ablak: lefelé. Ma nincs hőség.",
    neutral: null
  },
  presenceNameAck: "{name} — maradj annál amit mondtál.",
  presenceQuips: [
    "Megint alkuszik magával.",
    "Ez a válasz őszintén hangzott.",
    "Túl sok tab. Zárd le a zajt.",
    "Jó. Kevesebb sztori. Több kapcsolat."
  ],
  energyPersonalLead: "{name} — mai energia (földelt, szimbolikus):",
  obMeetKaiZenIntro: [
    "⚔️ KaiZen V1 online.",
    "",
    "Én vagyok a napi training társad.",
    "Nem szórakoztatásra vagyok itt. Nem zajnak.",
    "",
    "Ebben segítek:",
    "• fegyelem",
    "• energiahangolás",
    "• érzelmi egyensúly",
    "• testi ritmus",
    "• trading fegyelem",
    "• üzleti végrehajtás",
    "• hosszú távú átalakulás",
    "",
    "Először mutatkozz be a saját nyelveden.",
    "Ki vagy, és mit akarsz megerősíteni?"
  ].join("\n"),

  obMeetHeardYou: "Értettem — ezt olvastam ki belőle: {snippet}",
  obMeetContinue: "Most jön a szerkezetes rész — egy kérdés egyszerre.",
  obMeetTooShort: "Egy kicsit több kell — egy őszinte bekezdés elég.",

  obStartReturning: [
    "⚔️ KaiZen — Elite Zone · Dragon Path.",
    "",
    "Már bent vagy a rendszerben.",
    "",
    "Napi horgonyok:",
    "/today — napi struktúra",
    "/morning — nap nyitása",
    "/energy — napi olvasat",
    "",
    "Használat: /guide",
    "Teljes parancstérkép (ha kell): /map"
  ].join("\n"),

  obIntro: [
    "KaiZen V1 online.",
    "",
    "Nem azért vagyok itt, hogy szórakoztassalak.",
    "Azért, hogy zajban is tudj igazodni.",
    "",
    "Ezeken az utakon tudok veled menni:",
    "",
    "1 — Munka / üzleti fókusz",
    "2 — Trading fegyelem",
    "3 — Testi fegyelem",
    "4 — Érzelmi egyensúly",
    "5 — Önfejlesztés",
    "6 — Energia-igazítás (földelve — nem jóslás)",
    "7 — Vegyes / több sáv egyszerre",
    "",
    "Először értelek meg.",
    "Hol szeretnéd most a legjobban, hogy KaiZen támogasson?",
    "Írj egy számot vagy egy rövid mondatot.",
    "",
    "A parancsok bármikor működnek. A beállítás szüneteltetéséhez: skip."
  ].join("\n"),

  obQ1: [
    "1) Fő sáv — válassz egyet:",
    "",
    "1 — Munka / üzleti fókusz",
    "2 — Trading fegyelem",
    "3 — Testi fegyelem",
    "4 — Érzelmi egyensúly",
    "5 — Önfejlesztés",
    "6 — Energia-igazítás",
    "7 — Vegyes",
    "",
    "Szám vagy rövid címke."
  ].join("\n"),

  obQ2: "2) Fő cél a következő 30 napra — egy-két mondatban:",

  obQ3: [
    "3) Mi ránt el legtöbbször a sínről?",
    "",
    "1 — Túlgondolás",
    "2 — Impulzus",
    "3 — Struktúra hiánya",
    "4 — Kiégés",
    "5 — Érzelmi káosz",
    "6 — Rossz szokások",
    "7 — Trading érzelmek",
    "8 — Egyéb (egy sor)",
    "",
    "Szám vagy rövid címke."
  ].join("\n"),

  obQ4: [
    "4) Milyen hangnem:",
    "",
    "1 — Finoman",
    "2 — Kiegyensúlyozottan",
    "3 — Közvetlenül",
    "",
    "1–3."
  ].join("\n"),

  obQ5: [
    "5) Nyelvi preferencia:",
    "",
    "1 — Angol",
    "2 — Magyar",
    "3 — Román",
    "4 — Auto (követem az üzeneteidet)",
    "",
    "1–4."
  ].join("\n"),

  obInvalidPath: "Válassz 1–7 közül, vagy egy rövid sort a sávhoz.",
  obInvalidObstacle: "Válassz 1–8 közül, vagy egy rövid címkét.",
  obInvalidIntensity: "1 (finoman), 2 (kiegyensúlyozott), 3 (közvetlen).",
  obInvalidLanguage: "1–4 a nyelvhez.",

  obSkip:
    "Rendben — a beállítás szünetel. A profil marad könnyű, amíg /setup vagy /start nem fut.",

  obNoted: "Értem.",

  obContinueSetup: "Vissza a beállításhoz:",

  obProfileCreated: "Profil kész.",
  obSummaryPath: "Sáv",
  obSummaryGoal: "Cél",
  obSummaryObstacle: "Akadály",
  obSummaryTone: "Hangnem",
  obSummaryLang: "Nyelv",
  obSummaryFooter:
    "Kezdés: /pulse napi igazításhoz vagy /help a teljes rendszerhez.",

  obPathLabels: {
    trading: "trading fegyelem",
    business: "munka / üzleti fókusz",
    physical: "testi fegyelem",
    emotional: "érzelmi egyensúly",
    spiritual: "energia-igazítás",
    selfdev: "önfejlesztés",
    mixed: "vegyes prioritások",
    other: "általad megadott sáv"
  },

  obObstacleLabels: {
    overthinking: "túlgondolás",
    impulse: "impulzus",
    structure: "struktúra hiánya",
    burnout: "kiégés",
    emotional_chaos: "érzelmi káosz",
    habits: "rossz szokások",
    trading_emotions: "trading érzelmek",
    other: "általad leírt minta",
    avoidance: "halogatás / elkerülés"
  },

  obIntensityLabels: {
    gentle: "finom",
    balanced: "kiegyensúlyozott",
    direct: "közvetlen"
  },

  obLangLabels: {
    en: "angol",
    hu: "magyar",
    ro: "román",
    auto: "auto (az üzeneteidből)"
  },

  profileTitle: "KaiZen profil",
  profileEmpty:
    "Még nincs kész beállítás. /start a személyre szabáshoz, /setup az újrakezdéshez.",
  profilePath: "Sáv",
  profileGoal: "30 napos cél",
  profileObstacle: "Elcsúszás minta",
  profileTone: "Hangnem",
  profileLangPref: "Nyelvi preferencia",
  profileOnboarding: "Beállítás",
  profileOnboardingDone: "kész",
  profileOnboardingPending: "folyamatban",
  profileOnboardingSkipped: "kihagyva / minimál",
  profileNotSet: "—",

  guideBody: [
    "Hogyan használd KaiZent (egyszerűen):",
    "",
    "Reggel — nap nyitása:",
    "/morning",
    "",
    "Napi struktúra — egy képernyő:",
    "/today",
    "",
    "Energia — gyakorlati, nem misztikus:",
    "/energy",
    "",
    "Túlterhelés — idegrendszer reset:",
    "/reset",
    "",
    "Este — tiszta zárás:",
    "/mirror",
    "",
    "Írhatsz természetesen is. Coach hang, nem menü.",
    "Teljes parancslista csak kérésre: /map",
    "Nyelv: /language"
  ].join("\n"),

  mapBody: [
    "KaiZen parancstérkép (lényeg):",
    "",
    "START · /start /today /status /language",
    "NAPI · /morning /energy /mirror /reset",
    "FOKUSZ · /focus /plan /body /breath",
    "TRADING · /trade /check /risk",
    "PROFIL · /profile /guide /clear",
    "",
    "Companion lépések: /mode /off /pause /resume"
  ].join("\n"),

  mapFooter: "Mentsd el ha kell. A mindennap a /guide körül megy, nem ez a teljes lista.",

  helpIntentReply: [
    "Segítség perjel nélkül — gyors térkép.",
    "Napi: /pulse · Szétszórtság: /focus · Túlterhelés: /reset · Trading: /trade",
    "Teljes felosztás: /guide"
  ].join("\n"),

  energyIntentReply:
    "Ez energia-kérdésnek hangzik, nem érzelmi spirálnak.\nA /energy ad strukturált napi keretet — gyakorlati, nem misztikus.",

  clarityIntentReply: [
    "Clarity passz:",
    "Egy döntés, ami mindent egyszerűsítene — írj egy sort.",
    "Aztán egy fizikai következő lépés a következő 25 percben.",
    "Teljes rituálé: /clarity"
  ].join("\n"),

  creatorEasterReply:
    "Akkor tesztelj őszintén. Nyomd a rendszert. Megmutatom, hol vagyok még gyenge.",

  antiLoopRewrite:
    "Ugyanaz a forma újra — nem ismétlem ugyanazt a szkriptet.\nÍrj egy új tényt az előző üzenet óta, vagy válassz parancsot: /focus /reset /guide",

  bannedPhraseAltComfort:
    "Kétszer ugyanaz a vigasztalás időpocsékolás — mondd ki nyersen is. Egy tény, amit ne hagyjak ki?",

  bannedPhraseAltSmallStep:
    "Nem ismétlem a kérdést — nevezz meg egy tízperces mozdulatot, előadás nélkül.",

  adaptTiredTrading:
    "Alacsony energia nem indok a kényszer-tradereknél. Előbb védd a számlát. Ha mégis: előbb /check.",

  adaptTiredPhysical:
    "Alacsony energia = kevesebb súrlódás: víz, étel, tíz perc mozgás. Gyors: /body.",

  adaptTiredBusiness:
    "Egyszerűsítsd a napot egy hasznos blokkra — a lendület fontosabb a mennyiségnél. /focus egy sorral.",

  adaptTiredEmotional:
    "Tiszteld a mélypontot dráma nélkül. Apró stabilizálás, aztán szavak. /reset opcionális struktúra.",

  adaptTiredSpiritual:
    "Ciklusokban van csend is — maradj földelve, jóslás nélkül. /energy ha kapsz egy könnyű keretet.",

  adaptTiredDefault:
    "Előbb apró fizikai lépés (víz, étel, rövid séta), aztán egy őszinte mondat arról, mi számít ma.",

  adaptTiredMixed:
    "Vegyes sáv: egy horgony kell — /pulse egy sor, aztán egy sáv egy órára.",

  statusNextPathTrading: "Következő javaslat (sáv): /check vagy /trade",
  statusNextPathBusiness: "Következő javaslat (sáv): /focus vagy /plan",
  statusNextPathPhysical: "Következő javaslat (sáv): /body vagy /walk",
  statusNextPathEmotional: "Következő javaslat (sáv): /reset vagy /mirror",
  statusNextPathSpiritual: "Következő javaslat (sáv): /energy vagy /path",
  statusNextPathSelfdev: "Következő javaslat (sáv): /plan vagy /discipline",
  statusNextPathMixed: "Következő javaslat (vegyes): /pulse, aztán /plan egy sor",
  statusNextPathOther: "Következő javaslat: /pulse vagy /help",

  statusNextGuide: "/guide a térképhez, vagy /pulse napi horgonyhoz.",
  statusNextEnergyAsk: "/energy a teljes strukturált olvasathoz.",
  statusNextClarity: "/clarity a teljes rituálé passzhoz.",
  statusNextCreator: "/guide — ha formálsz, nyomd a gyenge pontokat.",

  helpTipOnboarding:
    "Beállítás folyamatban — válaszolj az utolsó kérdésre, skip a szünethez, vagy bármikor parancs."
};
