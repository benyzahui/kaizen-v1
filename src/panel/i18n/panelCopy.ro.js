/** Manual protocol library — RO (native) */

const folders = {
  discipline: {
    title: "⚔ Disciplină",
    purpose: "Energia revine în structură.",
    beginner: "Un task, 25 minute, fără telefon.",
    intermediate: "Bloc 90 min de lucru profund.",
    advanced: "Fereastră de execuție în liniște.",
    today: "Alege un task și închide-l."
  },
  stabilization: {
    title: "🫀 Stabilizare",
    purpose: "Scade încărcarea nervoasă înainte de presiune.",
    beginner: "Apă. Expirație lentă ×5. Ridică-te o dată.",
    intermediate: "10 min de mers. Fără input.",
    advanced: "20 min de coborâre nervoasă, apoi o bandă.",
    today: "O ancoră: respirație sau mers — apoi stop."
  },
  training: {
    title: "🔥 Antrenament",
    purpose: "Corpul poartă focusul — mișcare fără dramă.",
    beginner: "15 min mers sau mobilitate.",
    intermediate: "Bloc de forță — start și final clare.",
    advanced: "Sesiune completă — fără telefon între seturi.",
    today: "Mișcă-te o dată. Notează. Gata."
  },
  lettinggo: {
    title: "🌘 Eliberare",
    purpose: "Lasă buclele — nu rezolva totul diseară.",
    beginner: "Scrie o buclă deschisă pe hârtie. Închide lista.",
    intermediate: "Ecran off cu 30 min înainte de somn.",
    advanced: "Ritual de închidere seară — fără taskuri noi.",
    today: "Închide o buclă. Restul așteaptă."
  },
  recovery: {
    title: "🌊 Recuperare",
    purpose: "Reconstruiește capacitatea — nu împinge prin colaps.",
    beginner: "Hidratare. Masă. 20 min odihnă.",
    intermediate: "Mișcare ușoară + fereastră de somn devreme.",
    advanced: "Zi completă de recuperare — fără mod warrior.",
    today: "Protejează somnul. Doar victorie minimă."
  },
  energy: {
    title: "🌙 Energie",
    purpose: "Conștientizare simbolică — claritate peste zgomot.",
    beginner: "Numește energia: scăzută / stabilă / ridicată.",
    intermediate: "Un canal deschis. Restul închise.",
    advanced: "Audit energetic — input, somn, scurgeri de focus.",
    today: "Citește câmpul. O ajustare."
  },
  trading: {
    title: "📈 Trading",
    purpose: "Psihologie înainte de intrări — reguli peste impuls.",
    beginner: "Fără trade până nu e planul scris.",
    intermediate: "Plafon de risc setat. O sesiune max.",
    advanced: "Protocol pre-market complet — fără trade de răzbunare.",
    today: "Reguli întâi. Ecranul după."
  },
  fasting: {
    title: "💧 Hidratare / Post",
    purpose: "Reset fără pedeapsă — sistemul nervos întâi.",
    beginner: "Apă + electroliți. Fără post extrem.",
    intermediate: "Fereastră de masă structurată.",
    advanced: "Zi de reset planificată — supraveghere dacă e nevoie.",
    today: "Hidratează. O masă curată. Stop acolo."
  },
  breath: {
    title: "🧘 Respirație / Meditație",
    purpose: "Reglare directă — scurt, repetabil.",
    beginner: "4 expirații lente. Umerii jos.",
    intermediate: "5 min respirație — timer pornit.",
    advanced: "15 min șezut — același loc zilnic.",
    today: "Trei minute. Apoi continui."
  }
};

module.exports = {
  panelTitle: "KaiZen — Panou protocoale",
  panelIntro: "Alege un folder pentru azi:",
  panelFooter: "Ritm: /morning /midday /evening · Status: /status",
  labels: {
    purpose: "Scop",
    beginner: "Începător",
    intermediate: "Intermediar",
    advanced: "Avansat",
    today: "Azi"
  },
  tooManyLanes: "Prea multe benzi.\nAlege un protocol pentru azi.",
  folders,
  lightPresence: [
    "Bine. Sunt aici.\nNu trebuie să complici.",
    "Un protocol e suficient pentru azi.",
    "Azi nu căuta un sistem nou.\nȚine ritmul.",
    "Încet. Stabil."
  ],
  lightRedirect: {
    stabilization: "Acum e stabilizare.\nPornește: /stabilization",
    discipline: "Structură întâi.\nDeschide: /discipline",
    recovery: "Mod recuperare.\nDeschide: /recovery",
    lettinggo: "Eliberare diseară.\nDeschide: /lettinggo",
    energy: "Câmp energetic.\nDeschide: /energy",
    training: "Mișcă corpul.\nDeschide: /training"
  },
  folderCommands: [
    { cmd: "/discipline", label: "⚔ Disciplină" },
    { cmd: "/stabilization", label: "🫀 Stabilizare" },
    { cmd: "/training", label: "🔥 Antrenament" },
    { cmd: "/lettinggo", label: "🌘 Eliberare" },
    { cmd: "/recovery", label: "🌊 Recuperare" },
    { cmd: "/energy", label: "🌙 Energie" },
    { cmd: "/trading", label: "📈 Trading" },
    { cmd: "/fasting", label: "💧 Hidratare / Post" },
    { cmd: "/breath", label: "🧘 Respirație / Meditație" }
  ]
};
