const rituals = require("./rituals.hu");
const onboardingStrings = require("./onboardingCopy.hu");

module.exports = {
  start:
    "KaiZen elérhető. A napi kis igazítás hosszú távon mély változást hoz.",

  help: [
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
    "/setup /profile /guide /status",
    "",
    "Természetesen is írhatsz.",
    "Szükség esetén visszavezetlek a struktúrához."
  ].join("\n"),

  unknown: "Nem értettem a parancsot. Nyugodtan: /help",

  recoveryTimeoutReply:
    "Ez az üzenet túl sokáig formálódott. Írj egy rövid sort, vagy később /status.",

  recoveryGenericReply:
    "Elveszett a fonal. Írj egy sort — vagy /help — és folytatjuk.",

  recoverySendFailed:
    "A válasz nem ért el a Telegramon. Nézd a kapcsolatot, majd pár másodperc múlva újra.",

  helpTipDefault:
    "Tipp: nyílt chat a tükröződéshez; parancsok, ha struktúrát akarsz (/focus, /plan).",

  helpTipOverload:
    "Tipp: túlterhelés → előbb /reset vagy /body, aztán szöveg.",

  helpTipEmotional:
    "Tipp: nehéz érzés → /reset vagy /mirror — opcionális, nem parancs.",

  helpTipTrade:
    "Tipp: impulzus → /trade, aztán szünet a cselekedet előtt.",

  helpTipFocus:
    "Tipp: szétszórtság → /focus egy sor, egy blokk.",

  helpTipPlan:
    "Tipp: köd a prioritásokon → /plan egy mező csak.",

  helpTipBody:
    "Tipp: test le → /body vagy /walk nagy döntés előtt.",

  continuityLine: "Ugyanaz a szál — egy kicsit mélyebben:",

  variationNudge: "Adj egy új részletet, amit még nem mondtál (akár aprót).",

  pulse: [
    "Reggeli Pulzus:",
    "- Mennyire stabil vagy most? (1–10)",
    "- Mi a legfontosabb ma?",
    "- Egy földelt tett, amit ma befejezel"
  ].join("\n"),

  trade: [
    "Kereskedési fegyelem:",
    "1) A tervben van a szituáció?",
    "2) A kockázat kimérhető és elfogadható?",
    "3) Nyugodt, tiszta, türelmes az állapotod?",
    "Ha nem: állj félre. A tőke a tisztánlátást követi."
  ].join("\n"),

  mirror: [
    "Esti tükör:",
    "- Mi tartott ma földön?",
    "- Hol vette át a káosz vagy az impulzus?",
    "- Egy nyugodt finomítás holnapra"
  ].join("\n"),

  energyHeader: "A nap energiája:",
  watchHeader: "Figyelj erre:",
  actionHeader: "Legjobban illeszkedő lépés:",
  reminderHeader: "Emlékeztető:",

  boundaryCooldown: [
    "Még a reset időszakodban vagy. Tartsd tiszteletben.",
    "Gyere vissza, ha az élesség engedett — akár egy kicsit is."
  ].join("\n\n"),

  recoveryPause:
    "Szünet. Ez most zaj-sebesség, nem döntés-sebesség.",

  recoveryProtocolTitle: "Sorrend, ami tart:",

  recoveryProtocolBody: [
    "Víz.",
    "Lépj el a képernyőtől — akár egy szobányit.",
    "Öt lassú lélegzet vagy tíz perc kint, ha mehet.",
    "Nincs trade, nincs nagy életdöntés két óráig.",
    "Ha enged az él: /mirror egy őszinte bekezdésben."
  ].join("\n"),

  recoveryLoopIntro: [
    "Ugyanaz a spirál, hangosabban. Nem vitázlak itt nyugalomba.",
    "Futtasd az alábbi sorrendet — nem produkció, csak sorrend."
  ].join("\n\n"),

  tradingGuardrail: [
    "Impulzusnak hangzik, terv-jelmezben.",
    "Érvényes a felállás? Fix a kockázat? Nyugodt a tested?",
    "Ha bármi ingatag: állj félre. A tőke a türelmet szereti."
  ].join("\n\n"),

  disclaimerHeavy:
    "Nem terápia és nem pénzügyi tanácsadás — földelés és struktúra.",

  planIntro:
    "Egyszerű térkép (csak ebben a sessionben — még nincs hosszú távú tárolás):",

  planEmpty: "—",

  focusPrompt:
    "Egy prioritás a következő 60 percre.\n\nÍrj egy sort válaszként, vagy: /focus a mondatod",

  focusSaved: (line) =>
    `60 percre lezárva (szándék, nem időzítő):\n${line}\n\nEgy blokk. Fölösleges fülek nélkül.`,

  planFieldWork: "Munka",
  planFieldSelf: "Önfejlesztés",
  planFieldBody: "Test / energia",
  planFieldTrading: "Trading",
  planFieldFocus: "Aktuális 60 perces fókusz",

  chaosSoftReply: [
    "Túlterhelés, nem kudarc — kevesebb bemenet kell, nem több ítélet.",
    "Apró downgrade: víz, halványabb kép, vagy tíz csendes perc.",
    "Mi a legközelebbi gyengéd fizikai lépés két percen belül?"
  ].join("\n\n"),

  openHintEmotional: "\n\nHa struktúrát kérsz: /reset",

  reflectivePrompts: [
    "Nevezd meg a feszültséget egy sorban — még ne javítás.\nMit keresnél a tisztánlátással őszintén?",
    "Melyik döntés körül mész, mert attól lenne egyértelmű a következő lépés?",
    "Ha hatvan másodpercre megbízhatnál magadban, mit hagynál abba alkudozni?"
  ],

  emotionalTripleGrounding: [
    "Ugyanaz a sor, háromszor — hiszek a fájdalomnak.",
    "Több gépelés itt nem halkít.",
    "Víz, képernyő távol, tíz perc csend vagy lassú séta.",
    "Visszatérve: /reset vagy /mirror — vagy pihenés címke nélkül. Az is számít."
  ].join("\n\n"),

  statusTitle: "KaiZen állapot",
  statusLanguage: "Nyelv",
  statusMode: "Mód",
  statusModeStructured: "Strukturált (parancsok)",
  statusModeOpen: "Nyílt beszélgetés (vezetett)",
  statusLastCommand: "Utolsó parancs",
  statusLastCategory: "Utolsó téma",
  statusSessionTurns: "Utóbbi fordulók (memóriában)",
  statusIntensity: "Intenzitás (becslés)",
  statusIntensityLow: "alacsony / stabil",
  statusIntensityMedium: "emelkedett",
  statusIntensityHigh: "magas — protokollok",
  statusNext: "Javasolt következő",
  statusNextRecovery: "Recovery lépések, majd nyugodtan /mirror.",
  statusNextTrade: "Nézd át a /trade-t, és állj félre, ha ingatag az állapot.",
  statusNextEmotional: "/reset vagy /ground, majd egy apró fizikai lépés.",
  statusNextPlan: "/plan — csak egy konkrét következő sor.",
  statusNextDrift: "/focus — egy sor, egy 25 perces blokk.",
  statusNextBody: "/body gyors ellenőrzés, majd a legkisebb fizikai mozdulat.",
  statusNextReflect: "/clarity vagy maradj egy igaz mondattal.",
  statusNextLastCommand: "Folytasd az utolsó rituálét, vagy /help a struktúrához.",
  statusNextDefault: "/pulse vagy /focus — egy kis blokk.",
  statusCommandsHint:
    "A nyílt chat vezet; a parancsok tartják a struktúrát. Használd mindkettőt.",

  statusLastSuggested: "Utolsó javaslat",

  sessionLoopBoundary: [
    "Kör észlelve — több szó nem vesz most biztonságot.",
    "Víz, távolság a képernyőtől, tíz perc kint, ha lehet.",
    "Nincs nagy hívás két óráig.",
    "Később /mirror egy őszinte bekezdésben — nem ítélet."
  ].join("\n\n"),

  rituals,

  categories: {
    focus_drift: [
      "Szétszórtság normális, ha sok a terhelés.",
      "Szűkíts: egy lap, egy feladat, huszonöt perc.",
      "Mi a legkisebb célvonal, amit most átlépsz?"
    ].join("\n\n"),

    body_energy: [
      "Állapot: üzemanyag, víz, alvás, mozgás — néha ezek mozdítják a hangulatot az értekezés előtt.",
      "Válassz egyet — víz, étel, öt perc mozgás, vagy képernyő-távolság.",
      "Melyik a legőszibb most?"
    ].join("\n\n"),

    emotional_reflection: [
      "Nehéznek hangzik, és számít.",
      "Nem kell tökéletesen magyarázni — egy igaz mondat elég.",
      "Mi az érzés a szavak alatt (egy szó)?"
    ].join("\n\n"),

    work_focus: [
      "A munkanyomás szereti a homályos hősködést.",
      "Nevezz meg egy blokkot (≤25 perc) egy látható eredménnyel.",
      "Mi a legkisebb darab, amit először lezársz?"
    ].join("\n\n"),

    self_development: [
      "Fejlődés: ismétlés vitakör nélkül.",
      "Válassz egy szokás-méretű lépést ma, alkudozás nélkül.",
      "Mit tenne a nyugodtabb éned tíz percig?"
    ].join("\n\n"),

    plan_tracking: [
      "Nagy útiterv bénít.",
      "Nyisd meg a /plan-t, és írj egy sort a mai sávhoz.",
      "Mi a következő konkrét lépés — nem az egész térkép?"
    ].join("\n\n"),

    general_curiosity: [
      "Mondd egy őszinte sorban a súlyt.",
      "Mit mondana egy stabil barát dráma nélkül?",
      "Mi egy kis lépés, ami nem ront?"
    ].join("\n\n"),

    unknown: [
      "Itt vagyok — mondd ki nyíltan, akár rendetlenül.",
      "Mi egy stabilizáló mozdulat két perc alatt?",
      "Mi segítene most: tisztánlátás, pihenés, vagy egy zárt feladat?"
    ].join("\n\n"),

    unknown_alt: [
      "Rövid jel — ehhez igazítom a hangerőt.",
      "Egy tény, egy szándék. Ritmus: /pulse.",
      "Vagy maradj: egy rendetlen igaz mondat is elég."
    ].join("\n\n")
  },

  ...onboardingStrings
};
