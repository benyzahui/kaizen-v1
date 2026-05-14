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
    "S-a atins limita de timp la procesare. Nu ești ignorat — încearcă un mesaj mai scurt, /status sau /help.",

  recoveryGenericReply:
    "Ceva nu a mers bine la noi. Încearcă /help sau un mesaj scurt din nou peste un moment.",

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
    "Pauză.\n\nAsta nu mai e claritate. E zgomot de sistem nervos.",

  recoveryProtocolTitle: "Recovery Balance Protocol:",

  recoveryProtocolBody: [
    "1. Apă.",
    "2. Depărtează-te de ecran.",
    "3. 5–10 minute de respirație lentă.",
    "4. Plimbare scurtă sau mișcare ușoară.",
    "5. Fără trade, fără decizii majore 2 ore.",
    "6. Reduce stimularea ecranului.",
    "7. Revino cu /mirror când ești calm."
  ].join("\n"),

  recoveryLoopIntro: [
    "Aud aceeași buclă amplificându-se. Nu voi continua să hrănesc spirala aici.",
    "Folosește protocolul de mai jos. Nimic nu cere un verdict instant."
  ].join("\n\n"),

  tradingGuardrail: [
    "Încetinește. Sună a impuls, nu a plan.",
    "",
    "Întreabă direct:",
    "- Setup-ul e valid?",
    "- Riscul e fix?",
    "- Ești calm?",
    "- Ai lua acest trade dacă nu ai fi emoțional?",
    "",
    "Dacă vreun răspuns e slab: fără trade. Protejează contul. Protejează mintea."
  ].join("\n"),

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
    "Sună a suprasolicitare, nu a slăbiciune.",
    "",
    "Apă. Cinci respirații lente. Fără decizii majore în următoarea oră.",
    "",
    "Care e o acțiune mică care te-ar ancora acum?"
  ].join("\n"),

  openHintEmotional: "\n\nDacă e greu: /reset sau /ground",

  curiosity: [
    "Spune-o într-o propoziție onestă: care e greutatea acum?",
    "Ce ți-ar spune un prieten stabil — fără dramă?",
    "Care e următorul mic pas care nu înrăutățește lucrurile?"
  ],

  emotionalTripleGrounding: [
    "Ai trimis de mai multe ori același mesaj emoțional.",
    "Te aud — repetarea nu adaugă siguranță acum.",
    "",
    "Mod ancorare:",
    "Apă. Respirații lente. Departe de ecran zece minute.",
    "Fără decizii mari până nu se potolește muchia.",
    "",
    "Când ești gata: /reset sau /mirror. Sau o pauză reală — contează."
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
  statusNextLastCommand: "Continuă ultimul ritual sau /help pentru structură.",
  statusNextDefault: "/pulse sau /focus — un bloc mic.",
  statusCommandsHint:
    "Chatul deschis te ghidează; comenzile păstrează structura. Folosește ambele.",

  sessionLoopBoundary: [
    "Ești într-o buclă acum.",
    "Mai mult text nu aduce claritate.",
    "",
    "Protocol recovery:",
    "Apă.",
    "Departe de ecran.",
    "Plimbare 10 minute.",
    "Fără decizii mari 2 ore.",
    "",
    "Revino mai târziu cu /mirror."
  ].join("\n\n"),

  rituals,

  categories: {
    emotional_reflection: [
      "Nu ai nevoie de mai multă presiune acum.",
      "Ai nevoie de un punct clar de focus.",
      "",
      "Alege o sarcină care face următoarea oră utilă.",
      "",
      "Care e sentimentul din spatele poveștii — un cuvânt?"
    ].join("\n"),

    work_focus: [
      "Munca cere claritate, nu eroism.",
      "",
      "Numeste următorul bloc de 25 de minute. Începe. Un tab, un rezultat.",
      "",
      "Care e cea mai mică bucată finisabilă?"
    ].join("\n"),

    self_development: [
      "Creșterea e repetiție liniștită, nu spectacol.",
      "",
      "Alege o acțiune cât un obicei, pe care o faci azi fără dezbateri.",
      "",
      "Ce ar face „tu mai calm” timp de zece minute?"
    ].join("\n"),

    plan_tracking: [
      "Planurile merg când sunt suficient de mici ca să le atingi.",
      "",
      "Folosește /plan. Scrie un rând pentru zona care contează acum.",
      "",
      "Care e următorul pas concret — nu întregul roadmap?"
    ].join("\n"),

    general_curiosity: [
      "Sunt aici pentru disciplină, echilibru și reflecție onestă.",
      "",
      "Dacă e greu, spune-o într-o propoziție simplă.",
      "",
      "Ce ar face următoarea oră puțin mai ancorată?"
    ].join("\n"),

    unknown: [
      "Te ascult.",
      "",
      "Spune cel mai adevărat rând despre ce se întâmplă.",
      "",
      "Care e un pas mic următor care nu înrăutățește lucrurile?"
    ].join("\n")
  }
};
