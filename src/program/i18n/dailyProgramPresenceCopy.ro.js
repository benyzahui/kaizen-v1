/** Dragon Blueprint daily program presence — RO (native, grounded) */

module.exports = {
  programTag: "🐉 Dragon Blueprint — ritm zilnic.",
  programIdentity: [
    "Azi ești în program.",
    "Nu vânăm motivație.\nConstruim ritm.",
    "Un pas mic contează.",
    "⚔ Sistemul se ridică din pași mici.",
    "Mai puțin zgomot.\nMai multă claritate."
  ],
  labels: {
    mantra: "Mantra",
    body: "Corp",
    mission: "Misiune",
    now: "Acum",
    question: "Întrebare",
    todayAction: "Azi"
  },
  morning: {
    title: "⚔ Activare dimineață",
    lines: [
      "Ziua de azi contează.",
      "Nu trebuie start perfect.\nDoar prezent.",
      "O direcție — nu zece."
    ],
    bodyAnchor: "apă + 5 expirații lente.",
    missionQuestion: "Care e singurul lucru pe care îl duci până la capăt azi?",
    fallbackMantra: "Claritate înainte de zgomot."
  },
  midday: {
    title: "☀ Corecție la prânz",
    lines: [
      "Încă în ritmul tău,",
      "sau zgomotul conduce deja?",
      "Prea multe cercuri deschise — închide unul."
    ],
    fallbackMantra: "Mai puțin zgomot. Mai multă claritate.",
    nowLines: ["apă", "postură", "un focus"]
  },
  evening: {
    title: "🌘 Recuperare seară",
    lines: [
      "Nu trebuie să repari tot în seara asta.",
      "Nu mai trebuie să duci ziua.",
      "Recuperarea e parte din program."
    ],
    fallbackMantra: "Odihna e și disciplină.",
    releaseQuestion: "Ce lași în urmă diseară?"
  },
  actions: {
    morning: [
      "bea apă acum.",
      "5 expirații lente.",
      "alege un task și închide-l.",
      "mers 5 minute.",
      "un rând sincer despre azi."
    ],
    midday: [
      "bea apă.",
      "ridică-te — postură dreaptă.",
      "închide un focus deschis.",
      "mai puțin ecran 10 minute.",
      "mers 5 minute."
    ],
    evening: [
      "reduce zgomotul de ecran.",
      "5 expirații lente.",
      "stretch 3 minute.",
      "scrie un rând sincer despre eliberare.",
      "pregătește somnul — lumină jos."
    ]
  },
  checkInFooter: {
    morning: "Răspuns scurt: energie 1–10, somn, misiune, ancore.",
    midday: "Răspuns scurt: focus, apă, mișcare, ecran, corecție.",
    evening: "Răspuns scurt: terminat, scurgere, eliberare, recovery."
  }
};
