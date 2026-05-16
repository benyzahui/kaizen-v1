/** Napi protokoll — /today /morning /reset /mirror (HU) */

module.exports = {
  protocolTodayTitle: "Mai út (egyszerű):",
  protocolTodaySteps: (missionLine, bodyAnchor) =>
    [
      "1. /morning — nap nyitása",
      "2. /energy — mai hangulat",
      missionLine,
      bodyAnchor,
      "5. /mirror — tiszta zárás"
    ].join("\n"),
  protocolTodayMissionSet: (m) => `3. Küldetés — ${m}`,
  protocolTodayMissionOpen: "3. Küldetés — /mission egy sorral",
  protocolTodayBody: (b) => `4. Test horgony — ${b}`,
  protocolTodayFooter: "Egy sáv. Ma nem alkuszik a szétfolyással.",

  protocolMorningTitle: "Reggel",
  protocolMissionQuestion: "Mi a mai fő küldetésed?",
  protocolMorningFooter: "Rögzítés: /mission a te egy sorod",

  protocolBodyDefault: "víz + egyszer felállás",
  protocolBodyByPath: {
    emotional: "három lassú légzés képernyő előtt",
    physical: "tíz perc mozgás vagy mobilitás",
    spiritual: "két perc csend bemenet előtt",
    trading: "kezek le a billentyűzetről, amíg nincs terv",
    business: "egy tab zárva az első blokk előtt",
    mixed: "víz, felállás, egy perc mozdulatlanság"
  },

  protocolToneLines: [
    "Mai hang: stabil — egy dolog, aztán a következő.",
    "Mai hang: éles — a figyelmet úgy védd, mint a tőkét.",
    "Mai hang: nehéz — rövid lista, egy őszinte blokk.",
    "Mai hang: szétesett — egy horgony, aztán egy feladat.",
    "Mai hang: tiszta — a legkisebb látható lépés először."
  ],

  protocolResetVariants: [
    [
      "Szünet. Egyszerűsíts.",
      "",
      "Most: víz. Láb a földön. Öt lassú légzés.",
      "",
      "Következő: /energy — vagy egy sor /mission."
    ].join("\n"),
    [
      "Ne adj hozzá bemenetet.",
      "",
      "Most: állj fel. Két perc a képernyőtől távol.",
      "",
      "Következő: /today ha stabil vagy."
    ].join("\n"),
    [
      "Nem beszéd kell — kevesebb zaj.",
      "",
      "Most: állkapocs lazítás. Kilégzés hosszabb, háromszor.",
      "",
      "Következő: /mirror ha kész a nap — különben holnap /morning."
    ].join("\n")
  ],

  protocolMirrorVariants: [
    [
      "Esti tükör:",
      "",
      "• Mit fejeztél be? (egy sor)",
      "• Hol szivárgott az energia? (egy szó)",
      "• Mit engedsz el alvás előtt? (nevezd meg)",
      "• Egy finomítás holnapra (egy mondat)",
      "",
      "Nincs ítélet. Zárás."
    ].join("\n"),
    [
      "Napi zárás:",
      "",
      "• Ma kiment:",
      "• Energia-szivárgás:",
      "• Elengedés:",
      "• Holnapi egy lépés:",
      "",
      "Őszinte. Rövid. Kész."
    ].join("\n"),
    [
      "Esti check:",
      "",
      "1) Kész:",
      "2) Szivárgás:",
      "3) Elengedés:",
      "4) Holnapi igazítás:",
      "",
      "Aztán lefelé — kevesebb fény, lassabb légzés."
    ].join("\n")
  ]
};
