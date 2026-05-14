/** Romanian onboarding copy. */

module.exports = {
  obIntro:
    "KaiZen — structură fără zgomot. Câteva răspunsuri ca să mă aliniez pe banda ta.\nPas cu pas. Orice moment: comenzile merg la fel, sau scrie skip pentru mai târziu.",

  obQ1: [
    "1) Pe ce mă concentrez cu tine?",
    "",
    "1 — Disciplină trading",
    "2 — Business / focus la muncă",
    "3 — Disciplină fizică",
    "4 — Echilibru emoțional",
    "5 — Auto-dezvoltare",
    "6 — Energie / aliniere spirituală (ancorat, fără ghicit)",
    "7 — Altceva (o linie)",
    "",
    "Număr sau etichetă scurtă."
  ].join("\n"),

  obQ2: "2) Obiectivul principal pentru următoarele 30 de zile — una-două propoziții:",

  obQ3: [
    "3) Ce te scoate cel mai des din șină?",
    "",
    "1 — Gândire excesivă",
    "2 — Impuls",
    "3 — Lene / evitare",
    "4 — Haos emoțional",
    "5 — Lipsă de structură",
    "6 — Burnout",
    "7 — Obiceiuri proaste",
    "8 — Emoții de trading",
    "9 — Altceva (o linie)",
    "",
    "Număr sau etichetă."
  ].join("\n"),

  obQ4: [
    "4) Cât de direct să fiu?",
    "",
    "1 — Blând",
    "2 — Echilibrat",
    "3 — Direct",
    "",
    "1–3."
  ].join("\n"),

  obQ5: [
    "5) Limba preferată pentru mesaje:",
    "",
    "1 — Engleză",
    "2 — Maghiară",
    "3 — Română",
    "4 — Auto (după mesajele tale)",
    "",
    "1–4."
  ].join("\n"),

  obInvalidPath: "Alege 1–7 sau o linie scurtă.",
  obInvalidObstacle: "Alege 1–9 sau o etichetă scurtă.",
  obInvalidIntensity: "1 (blând), 2 (echilibrat) sau 3 (direct).",
  obInvalidLanguage: "1–4 pentru limbă.",

  obSkip:
    "Am înțeles — configurarea e în pauză. Profilul rămâne minimal până la /setup sau /start.",

  obNoted: "Am notat.",

  obContinueSetup: "Înapoi la configurare:",

  obSummaryHead: "Bine. Așa voi fi prezent:",
  obSummaryPath: "Focus",
  obSummaryGoal: "Ținta 30 zile",
  obSummaryObstacle: "Deriva principală",
  obSummaryTone: "Ton",
  obSummaryLang: "Limbă",
  obSummaryFooter: "Începe cu /pulse când vrei un pulscheck zilnic.",

  obPathLabels: {
    trading: "disciplină trading și control emoțional pe risc",
    business: "focus la muncă, execuție, claritate la decizii",
    physical: "corp, rutină, antrenament, recuperare",
    emotional: "ancorare, reflecție, stabilitate sistem nervos",
    spiritual: "energie, cicluri, identitate — ancorat, fără ghicit",
    selfdev: "auto-dezvoltare și creștere disciplinată",
    other: "fila ta descrisă"
  },

  obObstacleLabels: {
    overthinking: "gândire excesivă",
    impulse: "impuls",
    avoidance: "evitare",
    emotional_chaos: "haos emoțional",
    structure: "lipsă de structură",
    burnout: "burnout",
    habits: "obiceiuri proaste",
    trading_emotions: "emoții de trading",
    other: "tiparul tău"
  },

  obIntensityLabels: {
    gentle: "blând",
    balanced: "echilibrat",
    direct: "direct"
  },

  obLangLabels: {
    en: "engleză",
    hu: "maghiară",
    ro: "română",
    auto: "auto din mesaje"
  },

  profileTitle: "Profil KaiZen",
  profileEmpty:
    "Încă nu e configurat. /start pentru personalizare sau /setup de la capăt.",
  profilePath: "Filă",
  profileGoal: "Țintă 30 zile",
  profileObstacle: "Pattern deriva",
  profileTone: "Ton",
  profileLangPref: "Preferință limbă",
  profileOnboarding: "Configurare",
  profileOnboardingDone: "completă",
  profileOnboardingPending: "în curs",
  profileOnboardingSkipped: "sărită / minimală",
  profileNotSet: "—",

  adaptTiredTrading:
    "Energia mică nu e voie să forțeze trade-uri. Protejează contul. Dacă tot tranzacționezi azi: /check primul.",

  adaptTiredPhysical:
    "Energia mică cere mai puțină fricțiune: apă, mâncare, zece minute mișcare. /body rapid.",

  adaptTiredBusiness:
    "Micșorează ziua la un bloc util — impulsul bate volumul. /focus o linie.",

  adaptTiredEmotional:
    "Respectă coborâșul fără criză narativă. Stabilizare mică, apoi cuvinte. /reset e structură opțională.",

  adaptTiredSpiritual:
    "Ciclurile au și faze liniștite — rămâi ancorat, fără predicții. /energy pentru un cadru ușor.",

  adaptTiredDefault:
    "Mai întâi un pas fizic mic (apă, mâncare, plimbare scurtă), apoi o propoziție onestă despre ce contează azi.",

  statusNextPathTrading: "Pas recomandat (filă): /check sau /trade",
  statusNextPathBusiness: "Pas recomandat (filă): /focus sau /plan",
  statusNextPathPhysical: "Pas recomandat (filă): /body sau /walk",
  statusNextPathEmotional: "Pas recomandat (filă): /reset sau /mirror",
  statusNextPathSpiritual: "Pas recomandat (filă): /energy sau /path",
  statusNextPathSelfdev: "Pas recomandat (filă): /plan sau /discipline",
  statusNextPathOther: "Pas recomandat: /pulse sau /help",

  helpTipOnboarding:
    "Configurare în curs — răspunde la ultima întrebare, skip pentru pauză, sau orice comandă oricând."
};
