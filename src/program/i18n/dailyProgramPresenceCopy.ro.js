/** Dragon Blueprint daily program presence — RO (native) */

module.exports = {
  programTag: "🐉 Dragon Blueprint — ritm zilnic.",
  programIdentity: [
    "Azi ești în program.",
    "Nu vânăm motivație.\nConstruim ritm.",
    "Un pas mic contează.",
    "⚔ Sistemul se ridică din pași mici."
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
      "Nu trebuie start perfect.\nDoar prezent."
    ],
    bodyAnchor: "apă + 5 expirații lente.",
    missionQuestion: "Care e singurul lucru pe care îl duci până la capăt azi?",
    fallbackMantra: "O direcție. Nu zece."
  },
  midday: {
    title: "☀ Revenire la prânz",
    lines: ["Încă în ritmul tău,", "sau zgomotul conduce deja?"],
    fallbackMantra: "Nu lăsa energia să se scurgă.",
    nowLines: ["apă", "postură", "un focus"]
  },
  evening: {
    title: "🌘 Eliberare seară",
    lines: [
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
      "ridică-te — postura dreaptă.",
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
