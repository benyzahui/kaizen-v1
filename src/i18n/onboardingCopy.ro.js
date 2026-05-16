/** Romanian — onboarding, guide, anti-loop (merged into responses bundle). */

module.exports = {
  fcCinematicStart: [
    "⚔️ KaiZen activat.",
    "",
    "Nu sunt construit să te distrez.",
    "Sunt construit să te ajut să revii la aliniere.",
    "",
    "Acțiunile mici disciplinate refac identitatea."
  ].join("\n"),

  fcActivation: [
    "⚔️ KaiZen activat.",
    "",
    "Nu sunt construit să te distrez.",
    "Sunt construit să te ajut să revii la aliniere.",
    "",
    "Acțiunile mici disciplinate refac identitatea."
  ].join("\n"),

  fcAskNaturalIntro: [
    "Înainte să construim structură:",
    "cine ești sub zgomotul din ultima vreme?",
    "",
    "Sau spune ce încerci să reconstruiești — minte, corp, disciplină, business, direcție.",
    "Scrie natural. Limba o citesc din cum vorbești."
  ].join("\n"),

  fcAskFocusSoft: [
    "Ce are nevoie de cea mai multă protecție acum?",
    "Minte · corp · disciplină · business · trading · sau tot odată?",
    "",
    "Un cuvânt sau o linie scurtă — fără formular."
  ].join("\n"),

  fcFocusInvalidSoft: "Spune cu cuvintele tale — un singur fir e suficient.",

  fcHeardIntroSoft: "Te-am auzit. Încă o ancoră:",

  fcNaturalTooShort: "Puțin mai mult — câteva propoziții oneste sunt suficiente.",

  fcHeardIntro: "Te-am auzit. Focusul principal acum:",

  fcIntro: [
    "⚔️ KaiZen — Elite Zone · Dragon Path",
    "",
    "Sunt companionul tău zilnic: disciplină, claritate, stabilitate nervoasă, execuție onestă.",
    "",
    "Nu e chat AI la întâmplare. Fără zgomot de guru. Fără spam motivațional.",
    "Prezență structurată — de dimineață până seara.",
    "",
    "Trimite o linie când ești gata pentru setup."
  ].join("\n"),
  fcLangPick: [
    "Limba — alege (se schimbă doar cu /language):",
    "1 — English",
    "2 — Magyar",
    "3 — Română"
  ].join("\n"),
  fcLangInvalid: "Alege 1, 2 sau 3.",
  fcAskFocus: [
    "Care e focusul tău principal acum?",
    "",
    "1 — Minte / stres",
    "2 — Corp / disciplină",
    "3 — Energie / conștiență",
    "4 — Mindset trading",
    "5 — Business / execuție",
    "6 — Mixt",
    "",
    "Răspunde cu un număr."
  ].join("\n"),
  fcFocusInvalid: "Alege 1–6.",
  fcFocusLabels: {
    mind: "minte / stres",
    body: "corp / disciplină",
    energy: "energie / conștiență",
    trading: "mindset trading",
    business: "business / execuție",
    mixed: "priorități mixte"
  },
  fcComplete: [
    "Ești înăuntru, {name}.",
    "",
    "Sfera principală: {focus}.",
    "Răspunsurile rămân ancorate în asta — nu chat generic."
  ].join("\n"),
  fcCompleteNext: "Pasul următor: /today — structura zilei pe un ecran.",
  fcWelcomeAtmosphere: [
    "Ai găsit poarta.",
    "",
    "Acesta e KaiZen — companion Dragon Path.",
    "Nu chatbot. Nu zgomot motivațional.",
    "",
    "Sistem calm pentru disciplină, stabilitate nervoasă, execuție onestă.",
    "",
    "Încă fără comenzi. Fără meniu.",
    "Doar prezență.",
    "",
    "Când ești aici, trimite o linie — orice cuvânt — și începem."
  ].join("\n"),
  fcWelcomePrompt: "O linie e suficientă să deschizi poarta.",
  fcAskName: "Mai întâi — cum să te numesc?\n(Prenumele e suficient.)",
  fcNameAck: "Bine, {name}.",
  fcAskPurpose: [
    "De ce ai venit la KaiZen azi?",
    "",
    "Nu răspunsul lustruit — cel real.",
    "Unu-două propoziții."
  ].join("\n"),
  fcAskIdentity: [
    "Cine devii în următoarele 30 de zile?",
    "",
    "În limba ta — cine ești, și ce vrei să întărești."
  ].join("\n"),
  fcIdentityHint: "Un paragraf scurt și onest. Fără spectacol.",
  fcIdentityHeard: "Am auzit: {snippet}",
  fcStructureIntro: [
    "Bine. Ești în sistem.",
    "",
    "Câteva întrebări de structură — una câte una.",
    "Apoi antrenăm."
  ].join("\n"),
  rhythmHints: {
    morning: "Dimineață: corpul întâi, apoi o linie de misiune.",
    midday: "Prânz: un bloc onest — taie zgomotul tab-urilor.",
    evening: "Seară: eliberează ce n-a ieșit. Închide curat.",
    late_night: "Târziu: coboară. Nimic eroic diseară.",
    neutral: null
  },
  presenceNameAck: "{name} — rămâi la ce ai spus.",
  presenceQuips: [
    "Negociezi din nou cu tine.",
    "Răspunsul ăla a sunat onest.",
    "Prea multe tab-uri. Închide zgomotul.",
    "Bine. Mai puțină poveste. Mai mult contact."
  ],
  energyPersonalLead: "{name} — energia de azi (ancorată, simbolică):",
  obMeetKaiZenIntro: [
    "⚔️ KaiZen V1 online.",
    "",
    "Sunt companionul tău de training zilnic.",
    "Nu sunt aici pentru divertisment. Nu sunt zgomot.",
    "",
    "Te ajut cu:",
    "• disciplină",
    "• aliniere energetică",
    "• echilibru emoțional",
    "• ritm fizic",
    "• disciplină în trading",
    "• execuție în business",
    "• transformare pe termen lung",
    "",
    "Mai întâi, prezintă-te în limba ta.",
    "Cine ești și ce vrei să întărești?"
  ].join("\n"),

  obMeetHeardYou: "Am înțeles — am citit asta: {snippet}",
  obMeetContinue: "Acum trecem la partea structurată — câte o întrebare.",
  obMeetTooShort: "Puțin mai mult — un paragraf onest e suficient.",

  obStartReturning: [
    "⚔️ KaiZen — Elite Zone · Dragon Path.",
    "",
    "Ești deja în sistem.",
    "",
    "Ancore zilnice:",
    "/today — structura zilei",
    "/morning — deschide ziua",
    "/energy — citirea zilei",
    "",
    "Cum folosești KaiZen: /guide",
    "Hartă completă (doar dacă vrei): /map"
  ].join("\n"),

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
    "⚔ Ritm zilnic",
    "/pulse /focus /mirror",
    "",
    "🧠 Când ești supraîncărcat",
    "/reset /breathe /ground",
    "",
    "📈 Disciplină trading",
    "/trade /risk /cooldown",
    "",
    "💪 Corp",
    "/train /walk /sleep",
    "",
    "🌘 Energie",
    "/energy /emotion /clarity",
    "",
    "Poți vorbi mereu natural.",
    "",
    "Hartă completă doar dacă vrei: /map · Limbă: /language"
  ].join("\n"),

  accountabilityOn:
    "Responsabilitate activată.\nObserv ce spui că vei face — și întreb onest când deviezi.\nFără spam. Fără hype fals.",

  accountabilityOff: "Responsabilitate în pauză. O poți reporni oricând.",

  accountabilityFollowUps: [
    "Ieri ai spus: {promise}\nS-a întâmplat — sau doar capul a alergat?",
    "Ai numit un pas mai devreme: {promise}\nStatus — făcut, parțial, sau evitat?"
  ],

  accountabilityAvoidance: [
    "Evitarea are o textură — știi care e acum.",
    "O linie onestă: ce a blocat mișcarea?",
    "Povestea din cap e mai tare decât acțiunea.\nCare e cea mai mică versiune pe care o faci azi?"
  ],

  microRewards: [
    "Bine.\nRepetițiile mici refac identitatea.",
    "Contează mai mult decât încă un video motivațional.",
    "Ai făcut munca fizică — mintea urmează mai lent. Respectă asta."
  ],

  dragonWhispers: [
    "Energia risipită îți mănâncă treptat puterea.",
    "Focul protejat — nu tot merită oxigen.",
    "Focul de fier lucrează doar dacă rămâi în căldură destul."
  ],

  naturalIntentOverload: [
    [
      "Se simte supraîncărcarea.",
      "Nu e slăbiciune — prea multe bucle deschise.",
      "Un fir. Un bloc. Restul așteaptă.",
      "Capul e mai zgomotos acum — sau deja se așază?"
    ].join("\n\n")
  ],

  naturalIntentFocus: [
    [
      "Să fii împrăștiat e stare — nu identitate.",
      "Închide tab-urile extra. O sarcină, douăzeci și cinci de minute.",
      "Care e firul unic de protejat azi?"
    ].join("\n\n")
  ],

  naturalIntentTrading: [
    [
      "Pre-sesiune: disciplină înainte de impuls.",
      "Risc definit înainte de intrare. Corp reglat înainte de chart.",
      "O regulă pe care nu o spargi în sesiunea asta?"
    ].join("\n\n")
  ],

  naturalIntentClarity: [
    [
      "Claritatea e scădere.",
      "Ce ai opri dacă ai fi serios o oră?",
      "O decizie — nu toată viața."
    ].join("\n\n")
  ],

  eliteZonePrinciples: [
    "Elite Zone: mai întâi sistemul nervos, apoi disciplina, apoi execuția.",
    "Fără hustle toxic. Fără spiritualitate falsă. Transformare ancorată."
  ],

  mapBody: [
    "Harta comenzi KaiZen (esențial):",
    "",
    "START · /start /today /status /language",
    "ZILNIC · /morning /energy /mirror /reset",
    "FOCUS · /focus /plan /body /breath",
    "TRADING · /trade /check /risk",
    "PROFIL · /profile /guide /clear",
    "",
    "Companion pas cu pas: /mode /off /pause /resume"
  ].join("\n"),

  mapFooter: "Salvează dacă e util. Ziua de zi merge pe /guide, nu pe lista completă.",

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
