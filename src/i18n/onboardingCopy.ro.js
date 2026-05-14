/** Romanian — onboarding, guide, anti-loop (merged into responses bundle). */

module.exports = {
  obIntro: [
    "KaiZen V1 online.",
    "",
    "Nu sunt aici să te distrez.",
    "Sunt aici să te ajut să rămâi aliniat când viața e zgomotoasă.",
    "",
    "Pot merge alături de tine pe:",
    "",
    "1 — Focus muncă / business",
    "2 — Disciplină trading",
    "3 — Disciplină fizică",
    "4 — Echilibru emoțional",
    "5 — Auto-dezvoltare",
    "6 — Aliniere energie (ancorat — fără ghicit)",
    "7 — Mixt / mai multe benzi",
    "",
    "Mai întâi te înțeleg.",
    "Unde vrei să te sprijin KaiZen cel mai mult acum?",
    "Răspunde cu un număr sau o propoziție scurtă.",
    "",
    "Comenzile merg oricând. Pentru pauză la setup: skip."
  ].join("\n"),

  obQ1: [
    "1) Cale principală — alege una:",
    "",
    "1 — Muncă / business",
    "2 — Trading",
    "3 — Corp / disciplină fizică",
    "4 — Echilibru emoțional",
    "5 — Auto-dezvoltare",
    "6 — Aliniere energie",
    "7 — Mixt",
    "",
    "Număr sau etichetă scurtă."
  ].join("\n"),

  obQ2: "2) Obiectivul principal pentru următoarele 30 de zile — una-două propoziții:",

  obQ3: [
    "3) Ce te scoate cel mai des din șină?",
    "",
    "1 — Gândire excesivă",
    "2 — Impuls",
    "3 — Lipsă de structură",
    "4 — Burnout",
    "5 — Haos emoțional",
    "6 — Obiceiuri proaste",
    "7 — Emoții de trading",
    "8 — Altceva (o linie)",
    "",
    "Număr sau etichetă scurtă."
  ].join("\n"),

  obQ4: [
    "4) Ton preferat:",
    "",
    "1 — Blând",
    "2 — Echilibrat",
    "3 — Direct",
    "",
    "1–3."
  ].join("\n"),

  obQ5: [
    "5) Limba preferată:",
    "",
    "1 — Engleză",
    "2 — Maghiară",
    "3 — Română",
    "4 — Auto (după mesajele tale)",
    "",
    "1–4."
  ].join("\n"),

  obInvalidPath: "Alege 1–7 sau o linie scurtă.",
  obInvalidObstacle: "Alege 1–8 sau o etichetă scurtă.",
  obInvalidIntensity: "1 (blând), 2 (echilibrat) sau 3 (direct).",
  obInvalidLanguage: "1–4 pentru limbă.",

  obSkip:
    "Am înțeles — configurarea e în pauză. Profilul rămâne ușor până la /setup sau /start.",

  obNoted: "Am notat.",

  obContinueSetup: "Înapoi la configurare:",

  obProfileCreated: "Profil creat.",
  obSummaryPath: "Cale",
  obSummaryGoal: "Obiectiv",
  obSummaryObstacle: "Obstacol",
  obSummaryTone: "Ton",
  obSummaryLang: "Limbă",
  obSummaryFooter:
    "Începe cu /pulse pentru aliniere zilnică sau /help pentru întregul sistem.",

  obPathLabels: {
    trading: "disciplină trading",
    business: "muncă / business",
    physical: "disciplină fizică",
    emotional: "echilibru emoțional",
    spiritual: "aliniere energie",
    selfdev: "auto-dezvoltare",
    mixed: "priorități mixte",
    other: "fila ta descrisă"
  },

  obObstacleLabels: {
    overthinking: "gândire excesivă",
    impulse: "impuls",
    structure: "lipsă de structură",
    burnout: "burnout",
    emotional_chaos: "haos emoțional",
    habits: "obiceiuri proaste",
    trading_emotions: "emoții de trading",
    other: "tiparul tău",
    avoidance: "evitare / amânare"
  },

  obIntensityLabels: {
    gentle: "blând",
    balanced: "echilibrat",
    direct: "direct"
  },

  obLangLabels: {
    en: "engleză",
    hu: "maghiară",
    ro: "română",
    auto: "auto din mesaje"
  },

  profileTitle: "Profil KaiZen",
  profileEmpty:
    "Încă nu e configurat. /start pentru personalizare sau /setup de la capăt.",
  profilePath: "Cale",
  profileGoal: "Țintă 30 zile",
  profileObstacle: "Pattern deriva",
  profileTone: "Ton",
  profileLangPref: "Preferință limbă",
  profileOnboarding: "Configurare",
  profileOnboardingDone: "completă",
  profileOnboardingPending: "în curs",
  profileOnboardingSkipped: "sărită / minimală",
  profileNotSet: "—",

  guideBody: [
    "Harta sistemului KaiZen:",
    "",
    "Ritm zilnic:",
    "/pulse /focus /mirror",
    "",
    "Când e prea mult:",
    "/reset /ground /breathe",
    "",
    "Trading:",
    "/trade /check /risk /cooldown",
    "",
    "Corp:",
    "/body /walk /train /sleep",
    "",
    "Direcție:",
    "/plan /clarity /path /question",
    "",
    "Profil:",
    "/setup /profile /guide /status",
    "",
    "Poți vorbi și natural.",
    "Te aduc înapoi la structură când e nevoie."
  ].join("\n"),

  helpIntentReply: [
    "Ai scris help fără slash — harta rapidă.",
    "Zilnic: /pulse · Dispersie: /focus · Supraîncărcare: /reset · Trading: /trade",
    "Tot layout-ul: /guide"
  ].join("\n"),

  energyIntentReply:
    "Sună a întrebare de energie, nu a spirală emoțională.\n/energy dă citirea zilnică structurată — practică, nu ezoterică.",

  clarityIntentReply: [
    "Pass claritate:",
    "O decizie care ar simplifica totul — o linie.",
    "Apoi un pas fizic în următoarele 25 de minute.",
    "Ritual complet: /clarity"
  ].join("\n"),

  creatorEasterReply:
    "Atunci testează-mă onest. Împinge sistemul. Îți arăt unde sunt încă slab.",

  antiLoopRewrite:
    "Aceeași formă din nou — nu repet același script.\nScrie un fapt nou de la ultimul mesaj sau alege: /focus /reset /guide",

  bannedPhraseAltComfort:
    "A doua oară aceeași alinare pierde timpul — spune direct, chiar dur. Un fapt pe care să nu-l ratez?",

  bannedPhraseAltSmallStep:
    "Sar peste aceeași întrebare — numește un pas de zece minute, fără spectacol.",

  adaptTiredTrading:
    "Energia mică nu e voie să forțeze trade-uri. Protejează contul. Dacă tot tranzacționezi azi: /check primul.",

  adaptTiredPhysical:
    "Energia mică cere mai puțină fricțiune: apă, mâncare, zece minute mișcare. /body rapid.",

  adaptTiredBusiness:
    "Micșorează ziua la un bloc util — impulsul bate volumul. /focus o linie.",

  adaptTiredEmotional:
    "Respectă coborâșul fără criză narativă. Stabilizare mică, apoi cuvinte. /reset e structură opțională.",

  adaptTiredSpiritual:
    "Ciclurile au și faze liniștite — rămâi ancorat, fără predicții. /energy pentru un cadru ușor.",

  adaptTiredDefault:
    "Mai întâi un pas fizic mic (apă, mâncare, plimbare scurtă), apoi o propoziție onestă despre ce contează azi.",

  adaptTiredMixed:
    "Zile mixte: un ancoraj — /pulse o linie, apoi o bandă pentru următoarea oră.",

  statusNextPathTrading: "Pas recomandat (filă): /check sau /trade",
  statusNextPathBusiness: "Pas recomandat (filă): /focus sau /plan",
  statusNextPathPhysical: "Pas recomandat (filă): /body sau /walk",
  statusNextPathEmotional: "Pas recomandat (filă): /reset sau /mirror",
  statusNextPathSpiritual: "Pas recomandat (filă): /energy sau /path",
  statusNextPathSelfdev: "Pas recomandat (filă): /plan sau /discipline",
  statusNextPathMixed: "Pas recomandat (mixt): /pulse apoi /plan o linie",
  statusNextPathOther: "Pas recomandat: /pulse sau /help",

  statusNextGuide: "/guide pentru hartă sau /pulse ca ancoră zilnică.",
  statusNextEnergyAsk: "/energy pentru citirea structurată completă.",
  statusNextClarity: "/clarity pentru pass-ul ritual complet.",
  statusNextCreator: "/guide — dacă mă construiești, testează slăbiciunile.",

  helpTipOnboarding:
    "Configurare în curs — răspunde la ultima întrebare, skip pentru pauză, sau orice comandă oricând."
};
