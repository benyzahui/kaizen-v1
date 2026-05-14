const rituals = require("./rituals.ro");

module.exports = {
  start:
    "KaiZen online. Alinierea zilnică mică aduce transformare mare în timp.",

  help: [
    "Căi KaiZen:",
    "",
    "Zilnic:",
    "/pulse /focus /reset /mirror",
    "",
    "Energie:",
    "/energy /ground /breathe /recenter /recovery /detach",
    "",
    "Trading:",
    "/trade /check /risk /notrade /cooldown",
    "",
    "Creștere:",
    "/discipline /habit /identity /pattern /shadow",
    "",
    "Corp:",
    "/body /walk /train /sleep",
    "",
    "Cale:",
    "/clarity /question /vision /path",
    "",
    "Plan:",
    "/plan /today /next /done",
    "",
    "Snapshot:",
    "/status"
  ].join("\n"),

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
    "Suprasolicitare, nu eșec — ai nevoie de mai puțin input, nu de mai multă judecată.",
    "Un downgrade mic: apă, lumină mai joasă la ecran, sau zece minute liniște.",
    "Care e următoarea mișcare fizică blândă în două minute?"
  ].join("\n\n"),

  openHintEmotional: "\n\nDacă vrei structură: /reset",

  reflectivePrompts: [
    "Numeste tensiunea într-o linie — fără reparat încă.\nCe te-ar costa claritatea, onest?",
    "Ce decizie ocolești pentru că următorul pas ar deveni evident?",
    "Dacă te-ai crede 60 de secunde, ce ai lăsa să nu mai negociezi?"
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
      "Sună greu — contează.",
      "Nu trebuie explicat perfect — o propoziție adevărată e suficientă.",
      "Care e sentimentul din spatele cuvintelor (un cuvânt)?"
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
      "Ce ar spune un prieten stabil, fără dramă?",
      "Care e un mic pas care nu înrăutățește?"
    ].join("\n\n"),

    unknown: [
      "Sunt aici — spune direct, chiar dezordonat.",
      "Ce mic gest de stabilizare poți face în două minute?",
      "Ce te-ar ajuta acum: claritate, odihnă sau un singur task blocat?"
    ].join("\n\n")
  }
};
