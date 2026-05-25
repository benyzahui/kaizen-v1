/** Manual protocol library — HU */

const folders = {
  discipline: {
    title: "⚔ Fegyelem",
    purpose: "Energia visszatér a struktúrába.",
    beginner: "Egy feladat, 25 perc, telefon nélkül.",
    intermediate: "90 perc mélymunka blokk.",
    advanced: "Csendes végrehajtási ablak.",
    today: "Válassz egy feladatot és zárd le."
  },
  stabilization: {
    title: "🫀 Stabilizálás",
    purpose: "Idegrendszer leterhelés csökkentése nyomás előtt.",
    beginner: "Víz. Lassú kilélegzés ×5. Állj fel egyszer.",
    intermediate: "10 perc séta. Nincs input.",
    advanced: "20 perc idegrendszer-lecsengés, aztán egy sáv.",
    today: "Egy horgony: légzés vagy séta — aztán stop."
  },
  training: {
    title: "🔥 Edzés",
    purpose: "A test hordozza a fókuszt — mozgás dráma nélkül.",
    beginner: "15 perc séta vagy mobilitás.",
    intermediate: "Erő blokk — tiszta kezdés és vége.",
    advanced: "Teljes edzés — telefon nélkül a szettek között.",
    today: "Mozogj egyszer. Jegyezd. Kész."
  },
  lettinggo: {
    title: "🌘 Elengedés",
    purpose: "Nyitott körök engedése — nem mindent ma éjjel.",
    beginner: "Írj egy nyitott kört papírra. Zárd a listát.",
    intermediate: "Képernyő ki 30 perccel alvás előtt.",
    advanced: "Esti lezárás — új feladat nélkül.",
    today: "Zárj egy kört. A többit hagyd."
  },
  recovery: {
    title: "🌊 Felépülés",
    purpose: "Kapacitás vissza — nem átgörgetés.",
    beginner: "Folyadék. Étkezés. 20 perc pihenő.",
    intermediate: "Könnyű mozgás + korai alvás.",
    advanced: "Teljes recovery nap — nincs warrior mód.",
    today: "Védd az alvást. Minimum győzelem."
  },
  energy: {
    title: "🌙 Energia",
    purpose: "Szimbolikus mező — tisztánlátás zaj helyett.",
    beginner: "Nevezd meg: alacsony / stabil / magas.",
    intermediate: "Egy csatorna nyitva. A többi zárva.",
    advanced: "Energia-audit — input, alvás, fókusz-szivárgás.",
    today: "Olvasd a mezőt. Egy finomhangolás."
  },
  trading: {
    title: "📈 Trading",
    purpose: "Pszichológia belépés előtt — szabály impulzus helyett.",
    beginner: "Nincs trade, amíg nincs terv.",
    intermediate: "Kockázati limit. Egy session max.",
    advanced: "Teljes pre-market protokoll — nincs bosszú trade.",
    today: "Szabály először. Képernyő másodszor."
  },
  fasting: {
    title: "💧 Hidratálás / Böjt",
    purpose: "Reset büntetés nélkül — idegrendszer előbb.",
    beginner: "Víz + elektrolit. Nincs extrém böjt.",
    intermediate: "Strukturált étkezési ablak.",
    advanced: "Tervezett reset nap — szükség esetén felügyelet.",
    today: "Hidratálj. Egyszer tiszta étkezés. Ennyi."
  },
  breath: {
    title: "🧘 Légzés / Meditáció",
    purpose: "Közvetlen szabályozás — rövid, ismételhető.",
    beginner: "4 lassú kilélegzés. Váll le.",
    intermediate: "5 perc légzés — időzítő.",
    advanced: "15 perc ülés — ugyanaz a hely naponta.",
    today: "Három perc. Aztán megyünk tovább."
  }
};

module.exports = {
  panelTitle: "KaiZen — Protokoll panel",
  panelIntro: "Ma válassz egy mappát:",
  panelFooter: "Ritmus: /morning /midday /evening · Állapot: /status",
  labels: {
    purpose: "Cél",
    beginner: "Kezdő",
    intermediate: "Közép",
    advanced: "Haladó",
    today: "Ma"
  },
  tooManyLanes: "Túl sok sáv.\nMa válassz egy protokollt.",
  folders,
  lightPresence: [
    "Jó. Itt vagyok.\nNem kell túlbonyolítani.",
    "Egy protokoll elég mára.",
    "Ma ne új rendszert keress.\nTartsd a ritmust.",
    "Lassan. Stabilan."
  ],
  lightRedirect: {
    stabilization: "Ez stabilizálás.\nIndítsd: /stabilization",
    discipline: "Ez fegyelem.\nIndítsd: /discipline",
    recovery: "Ez felépülés.\nIndítsd: /recovery",
    lettinggo: "Ma elengedés.\nIndítsd: /lettinggo",
    energy: "Energia mező.\nIndítsd: /energy",
    training: "Mozgás kell.\nIndítsd: /training"
  },
  folderCommands: [
    { cmd: "/discipline", label: "⚔ Fegyelem" },
    { cmd: "/stabilization", label: "🫀 Stabilizálás" },
    { cmd: "/training", label: "🔥 Edzés" },
    { cmd: "/lettinggo", label: "🌘 Elengedés" },
    { cmd: "/recovery", label: "🌊 Felépülés" },
    { cmd: "/energy", label: "🌙 Energia" },
    { cmd: "/trading", label: "📈 Trading" },
    { cmd: "/fasting", label: "💧 Hidratálás / Böjt" },
    { cmd: "/breath", label: "🧘 Légzés / Meditáció" }
  ]
};
