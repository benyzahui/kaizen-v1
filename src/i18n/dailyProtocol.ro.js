/** Protocol zilnic — /today /morning /reset /mirror (RO) */

module.exports = {
  protocolTodayTitle: "Traseul zilei (simplu):",
  protocolTodaySteps: (missionLine, bodyAnchor) =>
    [
      "1. /morning — deschide ziua",
      "2. /energy — citește ziua",
      missionLine,
      bodyAnchor,
      "5. /mirror — închide curat"
    ].join("\n"),
  protocolTodayMissionSet: (m) => `3. Misiune — ${m}`,
  protocolTodayMissionOpen: "3. Misiune — /mission o linie",
  protocolTodayBody: (b) => `4. Ancoră corporală — ${b}`,
  protocolTodayFooter: "O singură bandă. Fără negociere cu dispersia.",

  protocolMorningTitle: "Dimineață",
  protocolMissionQuestion: "Care e misiunea principală de azi?",
  protocolMorningFooter: "Fixează: /mission linia ta",

  protocolBodyDefault: "apă + ridică-te o dată",
  protocolBodyByPath: {
    emotional: "trei respirații lente înainte de ecran",
    physical: "zece minute mișcare sau mobilitate",
    spiritual: "două minute liniște înainte de input",
    trading: "mâinile departe de tastatură până ai plan scris",
    business: "un tab închis înainte de primul bloc",
    mixed: "apă, ridicare, un minut de stillness"
  },

  protocolToneLines: [
    "Tonul zilei: stabil — un lucru, apoi următorul.",
    "Tonul zilei: ascuțit — protejează atenția ca pe capital.",
    "Tonul zilei: greu — listă scurtă, un bloc onest.",
    "Tonul zilei: dispersat — o ancoră, apoi o sarcină.",
    "Tonul zilei: clar — cel mai mic pas vizibil primul."
  ],

  protocolResetVariants: [
    [
      "Pauză. Simplifică.",
      "",
      "Acum: apă. Picioarele pe podea. Cinci respirații lente.",
      "",
      "Următorul: /energy — sau o linie cu /mission."
    ].join("\n"),
    [
      "Nu mai adăuga input.",
      "",
      "Acum: ridică-te. Două minute departe de ecran.",
      "",
      "Următorul: /today când ești stabil."
    ].join("\n"),
    [
      "Nu ai nevoie de discurs — ai nevoie de mai puțin zgomot.",
      "",
      "Acum: relaxează maxilarul. Expirație mai lungă, de trei ori.",
      "",
      "Următorul: /mirror dacă ziua s-a încheiat — altfel /morning mâine."
    ].join("\n")
  ],

  protocolMirrorVariants: [
    [
      "Oglinda de seară:",
      "",
      "• Ce ai terminat? (o linie)",
      "• Unde ai pierdut energie? (un cuvânt)",
      "• Ce eliberezi înainte de somn? (numește)",
      "• O ajustare pentru mâine (o propoziție)",
      "",
      "Fără proces. Închide ziua."
    ].join("\n"),
    [
      "Închiderea zilei:",
      "",
      "• Livrat azi:",
      "• Scurgere de energie:",
      "• Eliberare:",
      "• Un pas pentru mâine:",
      "",
      "Onest. Scurt. Gata."
    ].join("\n"),
    [
      "Check de seară:",
      "",
      "1) Completat:",
      "2) Scurgere:",
      "3) Eliberare:",
      "4) Ajustare mâine:",
      "",
      "Apoi coboară — ecran mai slab, respirație mai lentă."
    ].join("\n")
  ]
};
