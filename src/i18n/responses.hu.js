const rituals = require("./rituals.hu");
const protocolCopy = require("./protocolCopy.hu");
const rhythmBlueprint = require("./rhythmBlueprint.hu");
const { rituals: protocolRituals, ...protocolStrings } = protocolCopy;
const onboardingStrings = require("./onboardingCopy.hu");
const trainingProtocol = require("./trainingProtocol.hu");
const presenceCopy = require("./presenceCopy.hu");
const moodCopy = require("./moodCopy.hu");
const conversationCopy = require("./conversationCopy.hu");
const rhythmCompact = require("./rhythmCompact.hu");
const dailyProtocol = require("./dailyProtocol.hu");

module.exports = {
  start:
    "KaiZen elérhető. Strukturált training társ — napi igazítás, fegyelem, hosszú távú változás.",

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
    "/setup /profile /guide /status /language /clear",
    "",
    "Természetesen is írhatsz.",
    "Szükség esetén visszavezetlek a struktúrához."
  ].join("\n"),

  helpGrouped: [
    "KaiZen — parancsok csoportosítva",
    "",
    "Napi ritmus:",
    "/pulse /focus /mirror",
    "",
    "Túlterhelés:",
    "/reset /ground /breathe /recovery",
    "",
    "Trading:",
    "/trade /check /risk /cooldown /notrade",
    "",
    "Test & mozgás:",
    "/body /walk /train /sleep",
    "",
    "Irány & elme:",
    "/plan /clarity /path /question /lockin /review",
    "",
    "Energia (gyakorlati):",
    "/energy · /energy trading · /energy body · /energy emotion · /energy work",
    "",
    "Profil & térkép:",
    "/setup /profile /guide /status /skip /language /clear",
    "",
    "Írhatsz természetesen is. Én tartom a keretet."
  ].join("\n"),

  helpSuggestedLabel: "Javasolt következő (utolsó forduló alapján):",
  helpSuggestedOverload: "/reset vagy /ground — aztán egy órára kevesebb bemenet.",
  helpSuggestedTrading: "/trade vagy /risk — méret csak tiszta állapotban.",
  helpSuggestedFocus: "/focus — egy sor, egy 25 perces blokk.",
  helpSuggestedEnergy: "/energy a teljes strukturált olvasathoz.",
  helpSuggestedDefault: "/pulse vagy /guide — előbb horgony, aztán bővítés.",

  casualGreetingLines: [
    "Jó reggelt.\nVédd korán a fókuszt ma.",
    "Reggel.\nEgy kis győzelem délig elég.",
    "Szia.\nHa lehet, csendes első óra."
  ],

  casualThanksLines: [
    "Értem.\nMaradj a struktúrádnál, ha visszajössz.",
    "Oké.\nNincs produkció — csak következetesség.",
    "Köszi a jelet.\nVissza a sávodhoz, ha kész vagy."
  ],

  lightConversationLines: [
    "Na.\nMi van most?",
    "Értem.\nNem kell nagy szöveg.",
    "Jó.\nMaradj a saját tempódban.",
    "Hallom.\nEgy sor elég, ha van."
  ],

  pacingReflectiveShortlines: [
    "Túl sok nyitott ciklus egyszerre.",
    "Nem döntési pillanat — egy órára kevesebb bemenet.",
    "Víz. Mozgás. Aztán újraértékelés.",
    "Szűkíts: egy lap, egy eredmény."
  ],

  tradingContextBodies: [
    "A várakozás is munka — az unalom nem jel, hogy kényszeríts trade-et.\nHa mégis: előbb /check.",
    "Pre-open gyakorlás, nem bizonyíték.\nKockázat leírva? Ha nem, állj félre.\nA csengőnél: /trade",
    "Átmenetekben a türelem fizet.\nÍrj egy sort: mi érvénytelenítené az ötletet?",
    "Előbb chart, aztán narratíva.\nHa a történet hangosabb a tervnél: szünet.\nMéret előtt: /risk"
  ],

  focusDriftVariants: [
    [
      "Túl sok nyitott ciklus egyszerre.",
      "Zárj egyet, mielőtt újat nyitsz.",
      "Következő 25 perc: egy lap, egy célvonal."
    ].join("\n\n"),
    [
      "Szétszórtság terhelés-kérdés, nem jellemhiba.",
      "Válassz egy látható kimenetet a következő blokkra.",
      "Ha zárod egy sorba, egy blokk elég."
    ].join("\n\n"),
    [
      "Zaj gyakran alul-táplált testből vagy túl ingerből jön.",
      "Víz, öt perc mozgás, aztán egy feladat.",
      "Mi a legkisebb célvonal, amit most átlépsz?"
    ].join("\n\n"),
    [
      "Nem mélység — hatókör.",
      "Vágd félbe az óra hatókörét.",
      "Mi az egy blokk, ami őszintévé teszi a napot?"
    ].join("\n\n")
  ],

  emotionalReflectionVariants: [
    [
      "Nehéznek hangzik.",
      "Egy földelt mondat elég — nem kell tökéletes magyarázat.",
      "Mi maradt meg ebből benned?"
    ].join("\n\n"),
    [
      "Értem.",
      "Egyszerű szavak: helyzet, nem ítélet.",
      "Ha később struktúra: /reset opcionális."
    ].join("\n\n"),
    [
      "Intenzitás konténer nélkül zaj lesz.",
      "Kis konténer: tíz perc, egy szoba, nincs scroll.",
      "Aztán egy őszinte sor arról, mire van szükség."
    ].join("\n\n")
  ],

  energyFramedIntros: [
    "Ma az egyszerűsítés kap több teret, mint a bővítés.",
    "Mai olvasat: előbb szűkíts, aztán nyújtasz."
  ],

  energyFramedGoodBad: [
    "Jó ehhez:",
    "• rendezés",
    "• tervezés",
    "• meglévő rendszerek finomítása",
    "",
    "Kerülendő:",
    "• érzelmi döntés",
    "• impulzív trade",
    "• túlingerelés"
  ].join("\n"),

  energyFramedAngles:
    "Élesebb szög? Írj egy szót: trading · érzelmi · gyakorlati",

  cmdClearReply: [
    "Session törölve.",
    "A profilod megmarad.",
    "Innen tiszta lappal folytatjuk."
  ].join("\n"),

  cmdLanguageMenu: [
    "Nyelvzár — minden válasz ehhez igazodik:",
    "",
    "1 — angol",
    "2 — magyar",
    "3 — román",
    "4 — auto (üzenetekből; setup után nem ajánlott)",
    "",
    "Beállítás: /language 2",
    "Onboardingnál a 1–3 választás azonnal rögzít."
  ].join("\n"),

  cmdLanguageInvalid: "Írd: /language majd 1–4 (példa: /language 2).",

  cmdLanguageConfirm: (code) => {
    const label =
      code === "en"
        ? "angol"
        : code === "hu"
          ? "magyar"
          : code === "ro"
            ? "román"
            : "auto";
    return `Mentve: ${label}. Ezután ehhez igazítom a válaszokat.`;
  },

  pipelineEmptyText: "Írj, amikor készen állsz.",
  langAlreadyActive: "Már magyarul beszélünk. Váltás: /language",
  langChangeViaCommand: "A nyelv a profilodhoz van rögzítve. Váltás:",

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

  helpTipLight:
    "Tipp: könnyű beszélgetés oké — teljes térképhez /guide.",

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
    "Gyere vissza, ha az élesség engedett — akár egy kicsit is.",
    "Most pihenés. Nem kell most bizonyítani."
  ],

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
    "Túlterhelés sávszélesség kérdés — nem ítélet.",
    "Csökkents bemenetet: víz, halványabb kép, tíz csendes perc.",
    "Következő: egy fizikai mozdulat gondolkodás nélkül."
  ].join("\n\n"),

  openHintEmotional: "\n\nOpcionális: /reset",

  reflectivePrompts: [
    "Nevezd meg a feszültséget egy sorban — még ne javítás.",
    "Melyik döntés tenné egyértelművé a következő lépést?",
    "Ha hatvan másodpercre abbahagynád az alkudozást, mit választanál?"
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
  statusNextResume: "/resume — a társ mód vezetése szünetel.",
  statusNextCompanionContinue: "/whereami — aztán csak egy parancs.",
  statusCommandsHint:
    "A nyílt chat vezet; a parancsok tartják a struktúrát. Használd mindkettőt.",

  statusLastSuggested: "Utolsó javaslat",

  sessionLoopBoundary: [
    "Kör észlelve — több szó nem vesz most biztonságot.",
    "Víz, távolság a képernyőtől, tíz perc kint, ha lehet.",
    "Nincs nagy hívás két óráig.",
    "Később /mirror egy őszinte bekezdésben — nem ítélet."
  ].join("\n\n"),

  rituals: { ...rituals, ...protocolRituals },

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
      "Nehéznek hangzik.",
      "Egy földelt mondat elég.",
      "Mi maradt meg ebből benned?"
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
      "Mi lenne egy nyugodt olvasata ennek a helyzetnek?",
      "Mi egy kis lépés, ami nem ront?"
    ].join("\n\n"),

    unknown: [
      "Hallom.",
      "Egy mondat is elég — nem kell rendben lenni.",
      "Itt vagyok."
    ].join("\n\n"),

    unknown_alt: [
      "Értem.",
      "Ha van benned egy sor — elég az is.",
      "Nem kell most tökéletes válasz."
    ].join("\n\n")
  },

  ...presenceCopy,
  ...moodCopy,
  ...conversationCopy,
  ...rhythmCompact,
  ...dailyProtocol,
  ...trainingProtocol,
  ...onboardingStrings,
  ...protocolStrings,
  ...rhythmBlueprint
};
