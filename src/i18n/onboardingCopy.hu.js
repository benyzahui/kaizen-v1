/** Hungarian — onboarding, guide, anti-loop (merged into responses bundle). */

module.exports = {
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
    "KaiZen térkép:",
    "",
    "Napi ritmus:",
    "/pulse /focus /mirror",
    "",
    "Túlterhelésnél:",
    "/reset /ground /breathe",
    "",
    "Trading:",
    "/trade /check /risk /cooldown",
    "",
    "Test:",
    "/body /walk /train /sleep",
    "",
    "Irány:",
    "/plan /clarity /path /question",
    "",
    "Profil:",
    "/setup /profile /guide /status /language /clear",
    "",
    "Természetesen is írhatsz.",
    "Ha elkalandozunk, visszavezetlek a struktúrához."
  ].join("\n"),

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
