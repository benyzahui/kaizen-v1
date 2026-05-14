const rituals = require("./rituals.ro");
const onboardingStrings = require("./onboardingCopy.ro");

module.exports = {
  start:
    "KaiZen online. Alinierea zilnică mică aduce transformare mare în timp.",

  help: [
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
    "/setup /profile /guide /status /language /clear",
    "",
    "Poți vorbi și natural.",
    "Te aduc la structură când e nevoie."
  ].join("\n"),

  helpGrouped: [
    "KaiZen — comenzi pe grupe",
    "",
    "Ritm zilnic:",
    "/pulse /focus /mirror",
    "",
    "Supraîncărcare:",
    "/reset /ground /breathe /recovery",
    "",
    "Trading:",
    "/trade /check /risk /cooldown /notrade",
    "",
    "Corp & mișcare:",
    "/body /walk /train /sleep",
    "",
    "Direcție & minte:",
    "/plan /clarity /path /question /lockin /review",
    "",
    "Energie (ancorată, practică):",
    "/energy",
    "",
    "Profil & hartă:",
    "/setup /profile /guide /status /skip /language /clear",
    "",
    "Poți vorbi natural. Eu țin cadrul."
  ].join("\n"),

  helpSuggestedLabel: "Pas recomandat (după ultima tură):",
  helpSuggestedOverload: "/reset sau /ground — apoi mai puțin input o oră.",
  helpSuggestedTrading: "/trade sau /risk — mărime doar când e clar.",
  helpSuggestedFocus: "/focus — o linie, un bloc de 25 de minute.",
  helpSuggestedEnergy: "/energy pentru citirea structurată completă.",
  helpSuggestedDefault: "/pulse sau /guide — ancoră înainte să lărgești.",

  casualGreetingLines: [
    "Bună dimineața.\nProtejează devreme focusul azi.",
    "Dimineață.\nO mică victorie până la prânz e suficientă.",
    "Salut.\nPrima oră liniștită, dacă poți."
  ],

  casualThanksLines: [
    "Am înțeles.\nRămâi pe structura ta când revii.",
    "Ok.\nFără spectacol — doar consecvență.",
    "Mulțumesc pentru semnal.\nÎnapoi pe banda ta când ești gata."
  ],

  lightConversationLines: [
    "Disciplina devine mai ușoară când identitatea e clară — voința pură se consumă repede.",
    "Obiceiurile prind când mediul scoate fricțiunea, nu când crește motivația.",
    "Focusul e mai mult scădere: mai puține intrări, același standard.",
    "Identitatea înaintea intensității — altfel negociezi la infinit."
  ],

  pacingReflectiveShortlines: [
    "Prea multe bucle deschise deodată.",
    "Nu e moment de decizie — mai puțin input o oră.",
    "Apă. Mișcare. Apoi reevaluare.",
    "Micșorează: un tab, un rezultat."
  ],

  tradingContextBodies: [
    "Așteptarea face parte din job — plictiseala nu e semnal să forțezi un trade.\nDacă intri: /check mai întâi.",
    "Pre-open e repetiție, nu dovadă.\nRisc definit? Dacă nu, stai pe margine.\nLa deschidere: /trade",
    "Tranzițiile de sesiune plătesc răbdarea.\nScrie o linie: ce ar invalida ideea?",
    "Întâi chart, apoi narațiune.\nDacă povestea e mai tare decât planul: pauză.\nÎnainte de mărime: /risk"
  ],

  focusDriftVariants: [
    [
      "Prea multe bucle deschise deodată.",
      "Închide una înainte să deschizi alta.",
      "Următoarele 25 min: un tab, o linie de finish."
    ].join("\n\n"),
    [
      "Dispersia e despre sarcină, nu despre caracter.",
      "Alege un output vizibil pentru următorul bloc.",
      "Dacă vrei fixat într-o linie: /focus"
    ].join("\n\n"),
    [
      "Zgomotul vine adesea din corp sub-alimentat sau supra-stimulat.",
      "Apă, cinci minute mișcare, apoi o sarcină.",
      "Care e cea mai mică linie de finish acum?"
    ].join("\n\n"),
    [
      "Nu e problemă de adâncime — e de scop.",
      "Taie scopul la jumătate pentru următoarea oră.",
      "Care bloc face ziua onestă?"
    ].join("\n\n")
  ],

  emotionalReflectionVariants: [
    [
      "Sună greu.",
      "O propoziție ancorată e suficientă — fără explicație perfectă.",
      "Care e următorul pas de stabilizare (mic e ok)?"
    ].join("\n\n"),
    [
      "Am înțeles.",
      "Limba simplă: situația, nu verdictul.",
      "Structură mai târziu: /reset e opțional."
    ].join("\n\n"),
    [
      "Intensitate fără container devine zgomot.",
      "Container mic: zece minute, o cameră, fără scroll.",
      "Apoi o linie onestă despre ce ai nevoie."
    ].join("\n\n")
  ],

  energyFramedIntros: [
    "Azi simplificarea bate expansiunea.",
    "Citirea zilei: strânge înainte să întinzi."
  ],

  energyFramedGoodBad: [
    "Bine pentru:",
    "• organizare",
    "• planificare",
    "• rafinarea sistemelor existente",
    "",
    "Evită:",
    "• decizii emoționale",
    "• trade-uri impulsive",
    "• supra-stimulare"
  ].join("\n"),

  energyFramedAngles:
    "Vrei unghi mai clar? Scrie un cuvânt: trading · emoțional · practic",

  cmdClearReply: [
    "Sesiunea a fost ștearsă.",
    "Profilul rămâne activ.",
    "Continuăm de la zero."
  ].join("\n"),

  cmdLanguageMenu: [
    "/language — limba răspunsurilor",
    "1 — engleză",
    "2 — maghiară",
    "3 — română",
    "4 — auto (detectare din mesaje)",
    "",
    "Exemplu: /language 3"
  ].join("\n"),

  cmdLanguageInvalid: "Scrie /language apoi 1–4 (exemplu: /language 3).",

  cmdLanguageConfirm: (code) => {
    const label =
      code === "en"
        ? "engleză"
        : code === "hu"
          ? "maghiară"
          : code === "ro"
            ? "română"
            : "auto";
    return `Salvat: ${label}. Răspunsurile urmează această setare.`;
  },

  unknown: "Nu am înțeles comanda. Scrie /help, fără grabă.",

  recoveryTimeoutReply:
    "Mesajul a cerut prea mult timp să prindă formă. Trimite o linie scurtă sau /status mai târziu.",

  recoveryGenericReply:
    "Mi-am pierdut firul acolo. Trimite o linie — sau /help — și continuăm.",

  recoverySendFailed:
    "Răspunsul nu a ajuns în Telegram. Verifică conexiunea și reîncearcă în câteva secunde.",

  helpTipDefault:
    "Sfat: chat deschis pentru reflecție; comenzi când vrei structură (/focus, /plan).",

  helpTipOverload:
    "Sfat: suprasolicitare → /reset sau /body întâi, apoi text.",

  helpTipEmotional:
    "Sfat: încărcare emoțională → /reset sau /mirror — opțional, nu ordin.",

  helpTipTrade:
    "Sfat: margine de impuls → /trade, apoi pauză înainte de acțiune.",

  helpTipFocus:
    "Sfat: minte împrăștiată → /focus o linie, un bloc.",

  helpTipPlan:
    "Sfat: ceață la priorități → /plan un singur câmp.",

  helpTipBody:
    "Sfat: corp jos → /body sau /walk înainte de decizii mari.",

  helpTipLight:
    "Sfat: conversație ușoară e ok — harta completă: /guide.",

  continuityLine: "Același fir — mergem puțin mai adânc:",

  variationNudge: "Adaugă un detaliu nou pe care nu l-ai spus încă (chiar mic).",

  pulse: [
    "Puls de dimineață:",
    "- Cât de stabil te simți acum? (1–10)",
    "- Ce contează cel mai mult azi?",
    "- O acțiune ancorată pe care o vei duce la capăt"
  ].join("\n"),

  trade: [
    "Verificare disciplină trading:",
    "1) E în planul tău?",
    "2) Riscul e definit și acceptabil?",
    "3) Starea e calmă, clară, răbdătoare?",
    "Dacă nu: stai pe margine. Capitalul urmează claritatea."
  ].join("\n"),

  mirror: [
    "Oglindă de seară:",
    "- Ce te-a ținut ancorat azi?",
    "- Unde a preluat haosul sau impulsul?",
    "- O ajustare calmă pentru mâine"
  ].join("\n"),

  energyHeader: "Energia zilei:",
  watchHeader: "Ai grijă la:",
  actionHeader: "Acțiune aliniată:",
  reminderHeader: "Memento:",

  boundaryCooldown: [
    "Încă ești în fereastra de reset. Respect-o.",
    "Revino când muchia s-a înmuiat — chiar puțin."
  ].join("\n\n"),

  recoveryPause:
    "Pauză. Acum e viteza de zgomot, nu viteza de decizie.",

  recoveryProtocolTitle: "Secvență stabilă:",

  recoveryProtocolBody: [
    "Apă.",
    "Departe de ecran — măcar o cameră.",
    "Cinci respirații lente sau zece minute afară dacă poți.",
    "Fără trade, fără apeluri mari de viață două ore.",
    "Când muchia scade: /mirror într-un paragraf onest."
  ].join("\n"),

  recoveryLoopIntro: [
    "Aceeași spirală, mai tare. Nu te conving aici în calm.",
    "Rulează secvența de mai jos — fără spectacol, doar pași."
  ].join("\n\n"),

  tradingGuardrail: [
    "Sună a impuls cu costum de plan.",
    "Setup valid? Risc fix? Corp calm?",
    "Dacă ceva e șubred: stai pe margine. Capitalul apreciază răbdarea."
  ].join("\n\n"),

  disclaimerHeavy:
    "Nu e terapie sau sfat financiar — doar ancorare și structură.",

  planIntro:
    "Hartă simplă (doar în această sesiune — încă fără stocare lungă):",

  planEmpty: "—",

  focusPrompt:
    "O singură prioritate pentru următoarele 60 de minute.\n\nRăspunde cu o propoziție sau: /focus propoziția ta aici",

  focusSaved: (line) =>
    `Blocat 60 de minute (intenție, nu cronometru):\n${line}\n\nUn singur bloc. Fără tab-uri inutile.`,

  planFieldWork: "Muncă",
  planFieldSelf: "Auto-dezvoltare",
  planFieldBody: "Corp / energie",
  planFieldTrading: "Trading",
  planFieldFocus: "Focus curent 60 minute",

  chaosSoftReply: [
    "Supraîncărcarea e semnal de lățime de bandă — nu verdict.",
    "Reduce input: apă, lumină mai joasă, zece minute liniște.",
    "Următorul pas: o mișcare fizică fără gândire."
  ].join("\n\n"),

  openHintEmotional: "\n\nOpțional: /reset",

  reflectivePrompts: [
    "Numeste tensiunea într-o linie — fără reparat încă.",
    "Ce decizie ar face următorul pas evident?",
    "Dacă ai opri negocierile 60 de secunde, ce ai alege?"
  ],

  emotionalTripleGrounding: [
    "Același mesaj, de trei ori — cred că e real.",
    "Mai mult text aici nu coboară volumul.",
    "Apă, ecran la distanță, zece minute liniște sau plimbare lentă.",
    "La întoarcere: /reset sau /mirror — sau pauză fără etichetă. Contează."
  ].join("\n\n"),

  statusTitle: "Status KaiZen",
  statusLanguage: "Limbă",
  statusMode: "Mod",
  statusModeStructured: "Structurat (comenzi)",
  statusModeOpen: "Conversație deschisă (ghidată)",
  statusLastCommand: "Ultima comandă",
  statusLastCategory: "Ultima temă",
  statusSessionTurns: "Ture recente (în memorie)",
  statusIntensity: "Intensitate (estimare)",
  statusIntensityLow: "scăzută / stabilă",
  statusIntensityMedium: "ridicată",
  statusIntensityHigh: "mare — folosește protocoale",
  statusNext: "Pas recomandat",
  statusNextRecovery: "Pași recovery, apoi /mirror când ești calm.",
  statusNextTrade: "Revizuiește /trade și stai pe margine dacă starea e șubredă.",
  statusNextEmotional: "/reset sau /ground, apoi o mică acțiune fizică.",
  statusNextPlan: "/plan — o singură linie concretă următoare.",
  statusNextDrift: "/focus — o linie, un bloc de 25 de minute.",
  statusNextBody: "/body verificare rapidă, apoi cea mai mică mișcare fizică.",
  statusNextReflect: "/clarity sau rămâi aici cu o propoziție adevărată.",
  statusNextLastCommand: "Continuă ultimul ritual sau /help pentru structură.",
  statusNextDefault: "/pulse sau /focus — un bloc mic.",
  statusCommandsHint:
    "Chatul deschis te ghidează; comenzile păstrează structura. Folosește ambele.",

  statusLastSuggested: "Ultimul sfat",

  sessionLoopBoundary: [
    "Buclă detectată — mai multe cuvinte nu cumpără siguranță acum.",
    "Apă, distanță de ecran, zece minute afară dacă poți.",
    "Fără apeluri mari două ore.",
    "Mai târziu /mirror într-un paragraf onest — nu verdict."
  ].join("\n\n"),

  rituals,

  categories: {
    focus_drift: [
      "Împrăștierea e normală când sarcina e mare.",
      "Micșorează câmpul: un tab, o sarcină, 25 de minute.",
      "Care e cea mai mică linie de finish pe care o treci acum?"
    ].join("\n\n"),

    body_energy: [
      "Stare: combustibil, apă, somn, mișcare — uneori astea mută starea înaintea mindsetului.",
      "Alege una — apă, mâncare, cinci minute de mișcare sau un pas înapoi de la ecran.",
      "Care e cea mai onestă acum?"
    ].join("\n\n"),

    emotional_reflection: [
      "Sună greu.",
      "O propoziție ancorată e suficientă.",
      "Care e următorul pas de stabilizare (mic e ok)?"
    ].join("\n\n"),

    work_focus: [
      "Presiunea de muncă iubește eroismul vag.",
      "Numeste un bloc (≤25 minute) cu un output vizibil.",
      "Care e cea mai mică bucată pe care o livrezi primul?"
    ].join("\n\n"),

    self_development: [
      "Creștere = repetiție fără buclă de dezbateri.",
      "Alege o acțiune cât un obicei pentru azi, fără negocieri.",
      "Ce ar face „tu mai calm” zece minute?"
    ].join("\n\n"),

    plan_tracking: [
      "Roadmap-urile mari paralizează.",
      "Deschide /plan și scrie un rând pentru banda care contează azi.",
      "Care e următorul pas concret — nu harta întreagă?"
    ].join("\n\n"),

    general_curiosity: [
      "Spune greutatea într-o linie onestă.",
      "Care ar fi o citire calmă a situației?",
      "Care e un mic pas care nu înrăutățește?"
    ].join("\n\n"),

    unknown: [
      "Semnal scurt primit.",
      "Un fapt, un intent — sau ritual: /pulse",
      "Pentru hartă: /guide"
    ].join("\n\n"),

    unknown_alt: [
      "Semnal scurt — mă aliniez la volum.",
      "Un fapt, un intent. Ritm: /pulse.",
      "Sau rămâi: o linie adevărată dezordonată e suficientă."
    ].join("\n\n")
  },

  ...onboardingStrings
};
