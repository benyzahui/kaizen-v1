/** Hungarian onboarding copy. */

module.exports = {
  obIntro:
    "KaiZen — struktúra zaj nélkül. Pár gyors válasz, hogy passzoljak a sávodhoz.\nLépésről lépésre. Bármikor: a parancsok továbbra is működnek, vagy írd: skip, ha később fejeznéd be.",

  obQ1: [
    "1) Miben támogassalak elsősorban?",
    "",
    "1 — Trading fegyelem",
    "2 — Üzlet / munka fókusz",
    "3 — Testi fegyelem",
    "4 — Érzelmi egyensúly",
    "5 — Önfejlesztés",
    "6 — Energia / spirituális igazítás (földelve, nem jóslás)",
    "7 — Egyéb (egy sorban)",
    "",
    "Szám vagy rövid címke."
  ].join("\n"),

  obQ2: "2) Fő cél a következő 30 napra — egy-két mondatban:",

  obQ3: [
    "3) Mi ránt el legtöbbször a sínről?",
    "",
    "1 — Túlgondolás",
    "2 — Impulzus",
    "3 — Lustaság / halogatás",
    "4 — Érzelmi káosz",
    "5 — Struktúra hiánya",
    "6 — Kiégés",
    "7 — Rossz szokások",
    "8 — Trading érzelmek",
    "9 — Egyéb (egy sor)",
    "",
    "Szám vagy rövid címke."
  ].join("\n"),

  obQ4: [
    "4) Milyen közvetlen legyek?",
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
  obInvalidObstacle: "Válassz 1–9 közül, vagy egy rövid címkét.",
  obInvalidIntensity: "1 (finoman), 2 (kiegyensúlyozott), 3 (közvetlen).",
  obInvalidLanguage: "1–4 a nyelvhez.",

  obSkip:
    "Rendben — a beállítás szünetel. A profil marad könnyű, amíg /setup vagy /start nem fut.",

  obNoted: "Értem.",

  obContinueSetup: "Vissza a beállításhoz:",

  obSummaryHead: "Rendben. Így leszek jelen:",
  obSummaryPath: "Fókusz",
  obSummaryGoal: "30 napos cél",
  obSummaryObstacle: "Fő elcsúszás",
  obSummaryTone: "Hangnem",
  obSummaryLang: "Nyelv",
  obSummaryFooter: "Ha kész vagy: /pulse egy napi rögzítéshez.",

  obPathLabels: {
    trading: "trading fegyelem és érzelmi kontroll a kockázat körül",
    business: "munkafókusz, végrehajtás, döntéstisztaság",
    physical: "test, rutin, edzés, regenerálódás",
    emotional: "földelés, tükröződés, idegrendszer-stabilitás",
    spiritual: "energia, ciklusok, identitás — földelve, jóslás nélkül",
    selfdev: "önfejlesztés és fegyelmezett növekedés",
    other: "általad megadott sáv"
  },

  obObstacleLabels: {
    overthinking: "túlgondolás",
    impulse: "impulzus",
    avoidance: "halogatás",
    emotional_chaos: "érzelmi káosz",
    structure: "struktúra hiánya",
    burnout: "kiégés",
    habits: "rossz szokások",
    trading_emotions: "trading érzelmek",
    other: "általad leírt minta"
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

  statusNextPathTrading: "Következő javaslat (sáv): /check vagy /trade",
  statusNextPathBusiness: "Következő javaslat (sáv): /focus vagy /plan",
  statusNextPathPhysical: "Következő javaslat (sáv): /body vagy /walk",
  statusNextPathEmotional: "Következő javaslat (sáv): /reset vagy /mirror",
  statusNextPathSpiritual: "Következő javaslat (sáv): /energy vagy /path",
  statusNextPathSelfdev: "Következő javaslat (sáv): /plan vagy /discipline",
  statusNextPathOther: "Következő javaslat: /pulse vagy /help",

  helpTipOnboarding:
    "Beállítás folyamatban — válaszolj az utolsó kérdésre, skip a szünethez, vagy bármikor parancs."
};
