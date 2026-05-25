/** Protocol engine + discipline onboarding (RO). */

module.exports = {
  protocolStabilizeLead: "Stabilizează mai întâi.",
  protocolCommandsList: [
    "Comenzi:",
    "/morning /midday /evening",
    "/energy /reset /focus",
    "/fasting /training /trade",
    "/status"
  ].join("\n"),
  protocolCommandBlocked:
    "Comanda nu e activă. Folosește:\n/morning /midday /evening /energy /reset /focus /fasting /training /trade /status",
  protocolOnboarding: {
    startReturning: [
      "KaiZen.",
      "Ritmul e activ.",
      "",
      "/morning /midday /evening",
      "/energy /reset /status"
    ].join("\n"),
    start: [
      "KaiZen.",
      "Companion de disciplină digitală.",
      "",
      "Limbă:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n"),
    askLanguage: [
      "Limbă:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n"),
    askName: "Numele tău — un cuvânt sau o linie scurtă.",
    nameAck: "{name}.",
    askPath: [
      "Cale principală:",
      "1 — Stabilizare",
      "2 — Disciplină",
      "3 — Energie",
      "4 — Warrior",
      "5 — Recuperare",
      "6 — Trading Focus"
    ].join("\n"),
    pathInvalid: "Alege 1–6 sau scrie calea într-o linie.",
    pathLabels: {
      stabilization: "Stabilizare",
      discipline: "Disciplină",
      energy: "Energie",
      warrior: "Warrior",
      recovery: "Recuperare",
      trading: "Trading Focus"
    },
    complete: [
      "{name} — {path}.",
      "Mod: {mode}.",
      "",
      "Protejează atenția azi.",
      "/morning când ești gata."
    ].join("\n")
  },
  protocolGuidance: {
    general: [
      "Protejează atenția azi.",
      "O acțiune curată.",
      "Momentul revine prin mișcare.",
      "Stabilizează mai întâi. Apoi presiune."
    ],
    stabilization: [
      "Înainte de plan — ancorare în corp.",
      "Mai puțin input. Un task ancoră.",
      "Stabilitate înainte de intensitate."
    ],
    discipline: [
      "Un angajament. Fără negociere.",
      "Închide cel mai mic cerc deschis.",
      "Disciplina e o acțiune vizibilă."
    ],
    energy: [
      "Potrivire output–energie reală.",
      "Mișcare întâi — apoi scală.",
      "Energia vine din recuperare onestă."
    ],
    warrior: [
      "Antrenează muchia — nu povestea.",
      "O rep grea sau un minut greu.",
      "Forță fără dramă."
    ],
    recovery: [
      "Recuperarea e activă.",
      "Somn, hrană, liniște — în ordinea asta.",
      "Coborârea face parte din drum."
    ],
    trading: [
      "Risc înainte de recompensă.",
      "Fără trade fără regulă scrisă.",
      "Ieși când vorbește impulsul."
    ],
    modes: {
      stabilization: [
        "Stabilizează mai întâi. Apoi presiune.",
        "O ancoră. Mai puțin zgomot."
      ],
      discipline: ["O acțiune curată.", "Închizi un cerc înainte să deschizi altul."],
      warrior: ["Un minut greu.", "Corp antrenat — minte liniștită."],
      recovery: ["Odihna e structură.", "Combustibil și somn înainte de output."],
      energy: ["Mișcă-te o dată. Apoi scală.", "Ritm = energie reală."],
      trading: ["Reguli înainte de entry.", "Cooldown bate răzbunarea."]
    },
    energy_low: [
      "Combustibil și odihnă înainte de push.",
      "Un reset fizic mic.",
      "Mai puțină presiune pe sistemul nervos."
    ],
    energy_overstimulated: [
      "Taie inputul. Respirație lentă.",
      "Fără angajamente noi azi.",
      "Ancorează-te înainte de decizie."
    ],
    discipline_drift: [
      "Un task. Start urât e ok.",
      "Disciplina = un finish vizibil.",
      "Nu răsfoi planul — execută o linie."
    ],
    discipline_locked: [
      "Ține banda. Fără ținte extra.",
      "Execută ce e deja deschis.",
      "Adâncime, nu idei noi."
    ],
    nervous_overload: [
      "Suprasolicitare — reduce scope acum.",
      "Liniște și respirație înainte de vorbă.",
      "/reset dacă vrei stop dur."
    ],
    emergency_short: ["Respiră. Un pas.", "Stabilizează. Apoi vorbește."],
    grounded: ["Bază bună. Protejeaz-o cu o acțiune.", "Rămâi pe bandă."],
    recovery: ["Mod recuperare — fără eroism.", "Odihna e munca."],
    asked_help: [
      "Comandă protocol când ești gata:",
      "/morning /energy /reset /status"
    ],
    silence: ["Notat.", "Aici când te miști.", "O linie e suficient."],
    fallback: ["Stabilizează mai întâi. Apoi presiune.", "O acțiune curată."]
  },
  rituals: {
    fasting: [
      "Protocol post:",
      "Hidratare. Fără deficit eroic.",
      "Amețeală — mănâncă. Disciplina include onestitate."
    ].join("\n"),
    training: [
      "Protocol antrenament:",
      "Încălzire. Un bloc principal.",
      "Oprește înainte să cadă forma — momentum mâine."
    ].join("\n")
  }
};
