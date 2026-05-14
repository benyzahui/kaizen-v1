/**
 * Dragon Training OS — protocol copy (RO).
 */

module.exports = {
  tMorningHeader: "Mantra de dimineață:",
  tMorningFooter: "Apoi: /energy → un pas de misiune → /evening",

  tProgramTitle: "Dragon Training — structură zilnică",
  tProgramBody: [
    "Dragon Training — structură zilnică",
    "",
    "1. Mantra de dimineață — /morning",
    "2. Verificare energie — /energy",
    "3. O sarcină de misiune — /mission",
    "4. Disciplină corporală — /body sau /breath",
    "5. Oglindă de seară — /evening",
    "",
    "Azi nu e despre a face totul.",
    "E despre a rămâne în proces.",
    "",
    "Start: /morning"
  ].join("\n"),

  tTodayBody: [
    "Azi (cadru training):",
    "",
    "• Mantra: /morning",
    "• Energie: /energy",
    "• Linie misiune: /mission",
    "• Un ancor corporal: /breath sau /walk",
    "• Închidere: /evening",
    "",
    "O singură bandă. O zi. Fără negociat cu derivarea."
  ].join("\n"),

  tMissionEmpty: [
    "Misiune (training):",
    "Nu e încă salvată o linie de misiune.",
    "",
    "Setează una:",
    "/mission misiunea ta într-o propoziție",
    "",
    "Sau mai întâi țel 30 zile: /setup"
  ].join("\n"),

  tMissionStored: (line) =>
    [
      "Misiune fixată:",
      line,
      "",
      "Regulă: un pas vizibil spre asta înainte să deschizi fire noi.",
      "Închide: /done"
    ].join("\n"),

  tMissionUpdateHint: "Actualizare: /mission misiunea nouă într-o propoziție",

  tDoneBody: [
    "Gata (training):",
    "Numeste ce ai închis — chiar mic.",
    "Credit fără spectacol.",
    "",
    "Dacă rezistența a câștigat azi: /procrastination",
    "Dacă trebuie eliberat ceva înainte de mâine: /lettinggo",
    "",
    "Apoi: /evening sau /mirror"
  ].join("\n"),

  tEveningMirror: [
    "Oglindă de seară:",
    "",
    "1) Ce ai terminat — o linie?",
    "2) Unde a apărut rezistența — un cuvânt?",
    "3) Ce ai învățat — o propoziție?",
    "4) Ce trebuie eliberat înainte de mâine — o respirație, un nume?",
    "",
    "Fără judecată. Doar închidere onestă.",
    "Mâine: /morning"
  ].join("\n"),

  tProcrastinationProtocol: [
    "Protocol amânare:",
    "",
    "Amânarea nu e lene.",
    "E rezistență, frică sau energie fără direcție.",
    "",
    "1. Numeste taskul evitat.",
    "2. Fă-l mai mic.",
    "3. Începe 5 minute.",
    "4. Raportează cu /done."
  ].join("\n"),

  tLettingGoProtocol: [
    "Protocol eliberare:",
    "",
    "1. Respiră — expirație mai lungă, trei runde.",
    "2. Numeste ce eliberezi — o frază.",
    "3. Simte în corp — cinci secunde, fără poveste.",
    "4. Fără supra-gândire — un gest simbolic.",
    "5. Înapoi la prezent — picioare, respirație, un pas fizic.",
    "",
    "Apoi: /mission sau /focus"
  ].join("\n"),

  tFocusLaneNudge: [
    "Schimbi banda.",
    "Asta nu e claritate. E evitare.",
    "",
    "Înapoi la misiunea aleasă.",
    "Folosește /focus sau /clear."
  ].join("\n"),

  tResistanceProtocol: [
    "Rezistență (training):",
    "Rezistența e informație — nu verdict de caracter.",
    "",
    "Numeste pasul evitat într-o linie.",
    "Micșorează până încape în 5 minute.",
    "Începe urât. Termină vizibil.",
    "",
    "Dacă corpul e zgomotos: /breath",
    "Dacă povestea e tare: /mirror"
  ].join("\n"),

  tBusinessMenu: [
    "Arenă business — ce bandă azi?",
    "",
    "1. Administrație",
    "2. Vânzări",
    "3. Analitică",
    "4. Trading (disciplină business, nu hype)",
    "",
    "Comenzi: /business admin | /business sales | /business analytics | /business trading",
    "Sau: /admin /sales /analytics — execuție: /trade /check /risk"
  ].join("\n"),

  tBusinessAdmin: [
    "Bandă admin:",
    "Organizează. Documentează. Închide un cerc.",
    "",
    "Gata: /done"
  ].join("\n"),

  tBusinessSales: [
    "Bandă vânzări:",
    "Outreach, ofertă clară, follow-up onest dacă valoarea e reală.",
    "O conversație sau un mesaj — trimis.",
    "",
    "Gata: /done"
  ].join("\n"),

  tBusinessAnalytics: [
    "Bandă analitică:",
    "Date și comportament — tipare, nu vibrații.",
    "Un grafic, o ipoteză, o decizie.",
    "",
    "Apoi: /focus pe metrica care contează azi."
  ].join("\n"),

  tBusinessTrading: [
    "Trading (disciplină business):",
    "Risc primul. Fără trade-uri eroice. Procesul bate povestea.",
    "",
    "Lanț: /check → /risk → /trade",
    "Dacă ești obosit: /notrade"
  ].join("\n"),

  tMoonPortal: [
    "Lună (training):",
    "Nu inventăm fază exactă fără API live.",
    "Citire zilnică onestă + acțiune: /energy",
    "",
    "Ancoră scurtă: încetinește inputurile; corpul conduce înaintea deciziei."
  ].join("\n"),

  tNumerologyPortal: [
    "Numerologie (training):",
    "Vibrația zilei e context — nu soartă.",
    "Citire structurată completă: /energy",
    "",
    "O acțiune: închide o buclă deschisă înainte de una nouă."
  ].join("\n"),

  tAstroPortal: [
    "Astrologie (training):",
    "Calitate de sezon — fără teatru de hartă, fără profeție.",
    "Cadru zilnic ancorat: /energy",
    "",
    "O acțiune: aliniază sarcina cu cererea sezonului."
  ].join("\n"),

  tMantraSameAsMorning:
    "Mantra stă în /morning — scurtă, rostită, repetabilă. Rulează /morning.",

  tMorningMantras: {
    trading: [
      "Azi nu negociez cu impulsul.\nRiscul primul.\nZero trade-uri care au nevoie de poveste ca alibi.",
      "Azi piața nu îmi datorează claritate.\nAștept setup-ul meu — sau stau pe margine.",
      "Azi protejez capitalul ca oxigenul.\nRăbdarea e execuție."
    ],
    business: [
      "Azi nu negociez cu haosul.\nAleg o cale.\nTermin o acțiune curată.",
      "Azi adâncimea bate vizibilitatea.\nO livrare în loc de zece ciorne.",
      "Azi conduc cu structură — două ore de calendar sacru."
    ],
    physical: [
      "Azi corpul conduce.\nSomn, combustibil, mișcare — în ordinea asta.",
      "Azi forța e repetiție plictisitoare.\nUn set onest.",
      "Azi recuperarea e parte din antrenament.\nMă opresc înainte să mint."
    ],
    emotional: [
      "Azi numesc emoția fără să îi dau ordine.\nCalmul nu e amorțeală — e direcționat.",
      "Azi nu spiralez pentru entertainment.\nUn adevăr, o limită, o respirație.",
      "Azi compasiunea include fermitate — față de mine primul."
    ],
    spiritual: [
      "Azi energia primește direcție.\nInsight fără acțiune e derivă — un pas ancorat.",
      "Azi citesc cicluri fără fatalism.\nSimplific inputurile; ascult corpul.",
      "Azi spiritul e disciplina în lucruri mici."
    ],
    selfdev: [
      "Azi creșterea e o repetiție.\nFără dezbatere după regulă.",
      "Azi schimb drama pe repetiții.\nZece minute, o dovadă.",
      "Azi identitatea urmează acțiunea."
    ],
    mixed: [
      "Azi nu negociez cu haosul.\nO cale.\nO acțiune curată.",
      "Azi o bandă odată.\nAdâncimea e arma.",
      "Azi disciplina e dragoste cu dinți — îmi țin cuvântul."
    ],
    default: [
      "Azi nu negociez cu haosul.\nO cale.\nO acțiune curată.",
      "Azi revin la proces — nu la stare.",
      "Azi un pas curat bate un plan perfect."
    ]
  },

  tHelpTrainingMap: [
    "Hartă training KaiZen",
    "",
    "Zilnic:",
    "/program /morning /pulse /focus /mirror /evening /today",
    "",
    "Transformare:",
    "/discipline /resistance /procrastination /shadow /lettinggo /identity /lockin",
    "",
    "Corp:",
    "/body /breath /walk /train /sleep /recovery",
    "",
    "Energie:",
    "/energy /moon /numerology /astro /ground /recenter",
    "",
    "Business:",
    "/business /admin /sales /analytics",
    "",
    "Trading:",
    "/trade /check /risk /cooldown /notrade",
    "",
    "Profil:",
    "/setup /profile /mission /clear /status /language"
  ].join("\n"),

  tProgramActivated: [
    "⚔️ Dragon Training — activ.",
    "",
    "Structura zilnică e live: mantra → energie → misiune → corp → oglindă.",
    "",
    "Pasul 1: /morning",
    "",
    "Hartă completă (salveaz-o): /map"
  ].join("\n"),

  tProgramStep2Energy: "Pasul următor: /energy",
  tProgramStep3Mission: "Pasul următor: /mission",
  tProgramStep4Body: "Pasul următor: /body sau /breath",
  tProgramStep5Evening: "Pasul următor: /evening sau /mirror",
  tProgramCycleClosed: "Ciclul de azi s-a închis.\n\nSeara: /mirror — mâine: /program",

  tProgramWanderOpenChat: [
    "Chat liber e ok.",
    "Dar banda programului e încă activă.",
    "",
    "Continuă: următoarea comandă din /program",
    "Refocus: /focus",
    "Șterge sesiunea (profilul rămâne): /clear"
  ].join("\n"),

  tCommandsCategorized: [
    "KaiZen — hartă comenzi",
    "",
    "START",
    "/start /setup /program /mission /today /focus /done /clear",
    "",
    "ZILNIC",
    "/morning /mantra /pulse /evening /mirror /review",
    "",
    "TRANSFORMARE",
    "/discipline /resistance /procrastination /shadow /lettinggo /identity /lockin",
    "",
    "CORP",
    "/body /breath /walk /train /sleep /recovery",
    "",
    "ENERGIE",
    "/energy /moon /numerology /astro /ground /recenter",
    "",
    "BUSINESS",
    "/business /admin /sales /analytics",
    "",
    "TRADING",
    "/trade /check /risk /cooldown /notrade",
    "",
    "PROFIL",
    "/profile /status /language /help /guide /commands /map"
  ].join("\n"),

  tMapFooter: "Salvează acest mesaj. E harta ta de training.",

  helpV19Simple: [
    "KaiZen se folosește în două moduri:",
    "",
    "1) Natural — reflecție și claritate.",
    "2) Comenzi — structură și training.",
    "",
    "Începe cadrul zilei:",
    "/program",
    "",
    "Ritm zilnic:",
    "/morning /energy /mission /body /mirror",
    "",
    "Listă completă:",
    "/commands sau /map"
  ].join("\n"),

  tStatusProgram: "Program",
  tStatusProgramStep: "Pasul următor",
  tStatusProgramIdle: "liber (fără pas activ)",
  tStatusNextProgram: "Sugest (program)",

  tEnergyLensFooter: [
    "",
    "Lentile:",
    "/energy trading · /energy body · /energy emotion · /energy work"
  ].join("\n"),

  tProfileMissionLine: "Misiune (training):",
  tProfileTrainingStyle: "Stil training:"
};
