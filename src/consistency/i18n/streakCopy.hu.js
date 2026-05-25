module.exports = {
  close: {
    morning: "⚔ Reggeli kör lezárva.",
    midday: "☀ Délközi kör lezárva.",
    evening: "🌙 Esti kör lezárva."
  },
  streakLine: (n) => `Streak: ${n} nap`,
  reinforce: {
    low: "Az ismétlés épít stabilitást.",
    mid: "4 nap stabil ritmus.",
    high: "Momentum kezd kialakulni."
  },
  recovery: {
    gap: "Nem kell újrakezdeni mindent.\nCsak térj vissza a ritmusba.",
    broken: "Az irány fontosabb mint a tökéletes sorozat."
  },
  weeklyTitle: "🐉 Heti összegzés",
  weeklyLabels: {
    morning: "Reggeli ritmus",
    midday: "Délközi ritmus",
    evening: "Esti ritmus",
    hydration: "Hidrátálás",
    movement: "Mozgás",
    meditation: "Légzés / csend",
    focus: "Fókusz",
    fasting: "Böjt / reset",
    regeneration: "Regeneráció",
    strongest: "Erős oldal",
    weakest: "Gyenge oldal",
    nextFocus: "Következő fókusz"
  },
  weeklyQual: {
    strong: "erős",
    stable: "stabil",
    weak: "gyenge",
    scattered: "szétszóródott",
    missing: "hiányos",
    unknown: "nincs adat"
  },
  weeklySuggest: {
    stabilization: "stabilizálás + víz + légzés",
    lessNoise: "kevesebb zaj + jobb alvás",
    movement: "10 perc mozgás naponta",
    focusLock: "egy zárolt feladat / nap",
    recovery: "korai pihenés, nincs warrior push"
  },
  titles: {
    initiate: "Initiate",
    builder: "Builder",
    stabilizer: "Stabilizer",
    warrior: "Warrior",
    guardian: "Guardian"
  },
  titleLine: (t) => `Szint: ${t}`,
  adaptive: {
    growing: "A ritmus tart. Egy lépés elég ma is.",
    collapse: "Ma stabilizálás előbb. Rövid kör.",
    overload: "Nyomás le. Víz, légzés, séta."
  }
};
