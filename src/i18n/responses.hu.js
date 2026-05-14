const rituals = require("./rituals.hu");

module.exports = {
  start:
    "KaiZen elérhető. A napi kis igazítás hosszú távon mély változást hoz.",

  help: [
    "KaiZen utak:",
    "",
    "Napi:",
    "/pulse /focus /reset /mirror",
    "",
    "Energia:",
    "/energy /ground /breathe /recenter /recovery /detach",
    "",
    "Trading:",
    "/trade /check /risk /notrade /cooldown",
    "",
    "Növekedés:",
    "/discipline /habit /identity /pattern /shadow",
    "",
    "Test:",
    "/body /walk /train /sleep",
    "",
    "Út:",
    "/clarity /question /vision /path",
    "",
    "Terv:",
    "/plan /today /next /done"
  ].join("\n"),

  unknown: "Nem értettem a parancsot. Nyugodtan: /help",

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
    "Szünet.\n\nEz már nem tisztánlátás. Ez idegrendszeri zaj.",

  recoveryProtocolTitle: "Recovery Balance Protocol:",

  recoveryProtocolBody: [
    "1. Víz.",
    "2. Lépj el a képernyőtől.",
    "3. 5–10 perc lassú légzés.",
    "4. Rövid séta vagy könnyű mozgás.",
    "5. Nincs trade, nincs nagy döntés 2 óráig.",
    "6. Csökkentsd a képernyő ingerét.",
    "7. Térj vissza /mirror-ral, ha már nyugodtabb vagy."
  ].join("\n"),

  recoveryLoopIntro: [
    "Hallom, hogy ugyanaz a kör forog. Nem táplálom tovább itt a spirált.",
    "Használd az alábbi protokollt. Semmi nem kíván azonnali ítéletet."
  ].join("\n\n"),

  tradingGuardrail: [
    "Lassíts. Ez impulzusnak hangzik, nem tervnek.",
    "",
    "Kérdezd meg őszintén:",
    "- Érvényes a felállás?",
    "- Fix a kockázat?",
    "- Nyugodt vagy?",
    "- Vinéd ezt a tradet, ha nem lennél érzelmi állapotban?",
    "",
    "Ha bármelyik gyenge: nincs trade. Védd a számlát. Védd az elmét."
  ].join("\n"),

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
    "Ez túlterhelésnek hangzik, nem gyengeségnek.",
    "",
    "Víz. Öt lassú lélegzet. Nincs nagy döntés a következő órában.",
    "",
    "Mi lenne egy apró lépés, ami most földel?"
  ].join("\n"),

  openHintEmotional: "\n\nHa nehéz: /reset vagy /ground",

  curiosity: [
    "Mondd egy őszinte mondatban: mi a súly most?",
    "Mit mondana egy stabil barát — dráma nélkül?",
    "Mi a következő kis lépés, ami nem ront el semmit?"
  ],

  sessionLoopBoundary: [
    "Most körben vagy.",
    "Több szöveg nem hoz tisztánlátást.",
    "",
    "Recovery protokoll:",
    "Víz.",
    "Lépj el.",
    "10 perc séta.",
    "2 óráig nincs nagy döntés.",
    "",
    "Térj vissza később /mirror-ral."
  ].join("\n\n"),

  rituals,

  categories: {
    emotional_reflection: [
      "Most nem kell több nyomás.",
      "Egy tiszta fókuszpont kell.",
      "",
      "Válassz egy feladatot, ami a következő órát hasznossá teszi.",
      "",
      "Mi az érzés a történet alatt — egy szóban?"
    ].join("\n"),

    work_focus: [
      "A munka tisztánlátást kér, nem hősködést.",
      "",
      "Nevezd meg a következő 25 perces blokkot. Indítsd. Egy lap, egy eredmény.",
      "",
      "Mi a legkisebb befejezhető darab?"
    ].join("\n"),

    self_development: [
      "A fejlődés csendes ismétlés, nem produkció.",
      "",
      "Válassz egy szokás-méretű lépést, amit ma vitázás nélkül megteszel.",
      "",
      "Mit tenne a nyugodtabb éned tíz percig?"
    ].join("\n"),

    plan_tracking: [
      "A terv akkor működik, ha elég kicsi ahhoz, hogy megérintsd.",
      "",
      "Használd a /plan-t. Írj egy sort arra a területre, ami most számít.",
      "",
      "Mi a következő konkrét lépés — nem az egész útiterv?"
    ].join("\n"),

    general_curiosity: [
      "Fegyelemhez, egyensúlyhoz és őszinte tükröződéshez vagyok itt.",
      "",
      "Ha nehéz, mondd egy mondatban, nyíltan.",
      "",
      "Mi tenné a következő órát egy kicsit földeltebbé?"
    ].join("\n"),

    unknown: [
      "Figyelek.",
      "",
      "Mondd ki a legigazabb sort arról, mi történik.",
      "",
      "Mi az egy kicsi következő lépés, ami nem ront el semmit?"
    ].join("\n")
  }
};
