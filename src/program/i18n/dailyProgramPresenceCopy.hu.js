/** Dragon Blueprint daily program presence — HU */

module.exports = {
  programTag: "🐉 Dragon Blueprint — napi ritmus.",
  programIdentity: [
    "Ma is a rendszer része vagy.",
    "Nem motivációt keresünk.\nRitmust építünk.",
    "Egy kis lépés is a program része."
  ],
  labels: {
    mantra: "Mantra",
    body: "Test",
    mission: "Küldetés",
    now: "Most",
    question: "Kérdés",
    todayAction: "Ma"
  },
  morning: {
    title: "⚔ Reggeli aktiválás",
    lines: [
      "A mai nap is a program része.",
      "Nem tökéletesen kell kezdeni.\nCsak tudatosan."
    ],
    bodyAnchor: "víz + 5 lassú légzés.",
    missionQuestion: "Mi az egy dolog, amit ma végigviszel?",
    fallbackMantra: "Egy irány. Nem tíz."
  },
  midday: {
    title: "☀ Délközi visszahúzás",
    lines: [
      "Még a saját ritmusodban vagy,\nvagy már a zaj vezet?"
    ],
    fallbackMantra: "Ne szivárogjon el az energiád.",
    nowLines: ["víz", "testtartás", "egy fókusz"]
  },
  evening: {
    title: "🌘 Esti elengedés",
    lines: [
      "A napot nem kell tovább cipelned.",
      "A regeneráció is a program része."
    ],
    fallbackMantra: "A pihenés is fegyelem.",
    releaseQuestion: "Mit engedsz el ma estére?"
  },
  actions: {
    morning: [
      "igyál vizet most.",
      "5 lassú kilélegzés.",
      "válassz egy feladatot és zárd le.",
      "5 perc séta.",
      "egy őszinte sort írj a napról."
    ],
    midday: [
      "igyál vizet.",
      "állj fel és egyenesítsd a testtartást.",
      "zárj egy nyitott fókuszt.",
      "csökkentsd a képernyő zajt 10 percre.",
      "5 perc séta."
    ],
    evening: [
      "csökkentsd a képernyő zajt.",
      "5 lassú kilélegzés.",
      "nyújtás 3 perc.",
      "írj egy őszinte sort, mit engedsz el.",
      "készítsd elő az alvást — fény le."
    ]
  },
  checkInFooter: {
    morning: "Rövid válasz mentéshez: energia 1–10, alvás, küldetés, horgony.",
    midday: "Rövid válasz: fókusz, víz, mozgás, képernyő, korrekció.",
    evening: "Rövid válasz: készült, szivárgás, elengedés, recovery."
  }
};
