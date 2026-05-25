/** Protocol engine + discipline onboarding (HU). */

module.exports = {
  protocolStabilizeLead: "Először stabilizálj.",
  protocolCommandsList: [
    "Parancsok:",
    "/morning /midday /evening",
    "/energy /reset /focus",
    "/fasting /training /trade",
    "/status"
  ].join("\n"),
  protocolCommandBlocked:
    "Ez a parancs nincs aktív. Használd:\n/morning /midday /evening /energy /reset /focus /fasting /training /trade /status",
  protocolOnboarding: {
    startReturning: [
      "KaiZen.",
      "A ritmus aktív.",
      "",
      "/morning /midday /evening",
      "/energy /reset /status"
    ].join("\n"),
    start: [
      "KaiZen.",
      "Digitális fegyelem-társ.",
      "",
      "Nyelv:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n"),
    askLanguage: [
      "Nyelv:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n"),
    askName: "A neved — egy szó vagy rövid sor.",
    nameAck: "{name}.",
    askPath: [
      "Elsődleges út:",
      "1 — Stabilizáció",
      "2 — Fegyelem",
      "3 — Energia",
      "4 — Harcos",
      "5 — Felépülés",
      "6 — Trading fókusz"
    ].join("\n"),
    pathInvalid: "Válassz 1–6-ot, vagy írd le egy sorban.",
    pathLabels: {
      stabilization: "Stabilizáció",
      discipline: "Fegyelem",
      energy: "Energia",
      warrior: "Harcos",
      recovery: "Felépülés",
      trading: "Trading fókusz"
    },
    complete: [
      "{name} — {path}.",
      "Mód: {mode}.",
      "",
      "Védd a figyelmed ma.",
      "/morning, ha kész vagy."
    ].join("\n")
  },
  protocolGuidance: {
    general: [
      "Védd a figyelmed ma.",
      "Egy tiszta lépés.",
      "A lendület mozgásból jön vissza.",
      "Először stabilizálj. Utána nyomás."
    ],
    stabilization: [
      "Testet földölj, utána terv.",
      "Kevesebb input. Egy horgony feladat.",
      "Stabilitás az intenzitás előtt."
    ],
    discipline: [
      "Egy ígéret. Nincs alkudozás.",
      "Zárd le a legkisebb nyitott kört.",
      "A fegyelem egy látható cselekvés."
    ],
    energy: [
      "A kimenet illeszkedjen a valós energiához.",
      "Először mozgás — utána skála.",
      "Az energia őszinte pihenésből jön."
    ],
    warrior: [
      "Az élt edzd — ne a történetet.",
      "Egy kemény ismétlés vagy egy kemény perc.",
      "Erő dráma nélkül."
    ],
    recovery: [
      "A felépülés aktív, nem passzív.",
      "Alvás, étel, csend — ebben a sorrendben.",
      "A lefelé is része az útnak."
    ],
    trading: [
      "Kockázat a jutalom előtt.",
      "Nincs trade írott szabály nélkül.",
      "Lépj ki, ha az impulzus beszél."
    ],
    modes: {
      stabilization: [
        "Először stabilizálj. Utána nyomás.",
        "Egy horgony. Kevesebb zaj."
      ],
      discipline: ["Egy tiszta lépés.", "Egy kört zársz, mielőtt újat nyitsz."],
      warrior: ["Egy kemény perc.", "Testet edzd — csendes fej."],
      recovery: ["A pihenés szerkezet.", "Üzemanyag és alvás a kimenet előtt."],
      energy: ["Mozogj egyszer. Utána skála.", "Tempó = valós energia."],
      trading: ["Szabály az entry előtt.", "A cooldown jobb, mint a bosszú."]
    },
    energy_low: [
      "Üzemanyag és pihenés a push előtt.",
      "Egy kis fizikai reset.",
      "Kevesebb terhelés az idegrendszeren."
    ],
    energy_overstimulated: [
      "Vágd az inputot. Lassú légzés.",
      "Ma nincs új ígéret.",
      "Földölj, mielőtt döntesz."
    ],
    discipline_drift: [
      "Egy feladat. Csúnya start is jó.",
      "A fegyelem egy látható befejezés.",
      "Ne böngészd a tervet — futtasd egy sort."
    ],
    discipline_locked: [
      "Tartsd a sávot. Nincs extra cél.",
      "Amit nyitva hagytál — azt zárd.",
      "Mélység az új ötletek helyett."
    ],
    nervous_overload: [
      "Túlterhelés — most csökkentsd a scope-ot.",
      "Csend és légzés a szó előtt.",
      "/reset, ha kemény stop kell."
    ],
    emergency_short: ["Lélegezz. Egy lépés.", "Stabilizálj. Utána beszélj."],
    grounded: ["Jó alap. Egy cselekvéssel védd.", "Maradj a sávban."],
    recovery: ["Felépülés mód — nincs hősködés.", "A pihenés is munka."],
    asked_help: [
      "Ha kész vagy, protocol parancs:",
      "/morning /energy /reset /status"
    ],
    silence: ["Értem.", "Itt vagyok, ha mozogsz.", "Egy sor elég."],
    fallback: ["Először stabilizálj. Utána nyomás.", "Egy tiszta lépés."]
  },
  rituals: {
    fasting: [
      "Böjt protocol:",
      "Hidratálás. Nincs hősies deficit.",
      "Szédülésnél — enni. A fegyelem őszinteség is."
    ].join("\n"),
    training: [
      "Edzés protocol:",
      "Bemelegítés. Egy fő blokk.",
      "Állj meg, mielőtt a forma esik — holnap a lendület."
    ].join("\n")
  }
};
