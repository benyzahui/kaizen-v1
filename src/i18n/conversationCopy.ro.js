/** Phase 2 conversation copy — RO */

module.exports = {
  modeBeats: {
    MODE_STABLE: ["Bandă stabilă.", "Sunt aici.", "Simplu azi."],
    MODE_OVERLOADED: ["Prea mult input.", "Corpul întâi.", "Micșorează câmpul."],
    MODE_FOCUSED: ["Un tab. O linie.", "Taie scope-ul.", "Un bloc."],
    MODE_REFLECTIVE: ["Adevărul a aterizat.", "Ține — nu te îneca.", "O linie e suficient."],
    MODE_DISCIPLINE: ["Știi pasul.", "Nu negocia.", "Cinci minute. Du-te."],
    MODE_RECOVERY: ["Coborâre.", "Nimic de demonstrat.", "Apă. Respirație."],
    MODE_TRADING: ["Reguli înainte.", "Fără trade de poveste.", "Așteaptă claritate."]
  },
  modeCloses: {
    MODE_STABLE: ["Rămâi pe bandă.", "Un pas onest."],
    MODE_OVERLOADED: ["Zece minute liniște.", "Apoi o mișcare mică."],
    MODE_FOCUSED: ["Douăzeci și cinci minute. Un finish.", "Mișcă."],
    MODE_REFLECTIVE: ["Stabilizează. Apoi alege.", "Fără verdict."],
    MODE_DISCIPLINE: ["Cel mai mic pas real.", "Acum."],
    MODE_RECOVERY: ["Odihna e tactică.", "Închide zgomotul."],
    MODE_TRADING: ["Dacă nu e în plan, sari.", "O linie în jurnal."]
  },
  patternAcks: [
    "Încerci să rezolvi cinci vieți deodată din nou.",
    "Creierul vrea intensitate. Sistemul vrea stabilitate.",
    "Aceeași buclă — alt costum.",
    "Modul performanță e activ. Modul onest merge mai bine."
  ],
  loopPhraseAlts: {
    "one fact": "O linie adevărată. Apoi acțiune.",
    "hold. then step": "Mișcă-te. Un centimetru."
  },

  variationOpenings: [
    "Sistemul nervos sună supraîncărcat.",
    "Prea multe benzi active.",
    "Nu e slăbiciune — e saturație.",
    "Nu ai nevoie de sistem nou azi.",
    "Haosul pretinde că totul e urgent."
  ],

  variationEndings: [
    "O linie e suficientă.",
    "Rămâi la faptul ăsta.",
    "Apoi un pas — nu mai mult.",
    "Mâine sunt tot aici."
  ],

  templatePhraseAlts: [
    "Corpul cere reducere, nu forță.",
    "Prea multe bucle deschise.",
    "Micșorează înainte să împingi.",
    "Un bloc. Douăzeci și cinci de minute."
  ],

  humanRhythmLines: [
    "Nu ești mașină.",
    "Prea multe file deschise.",
    "Somn și apă — nu plan nou.",
    "Saturație, nu lipsă de motivație."
  ],

  threadContinuity: [
    "Ieri spuneai că ești tras în bucăți — azi e mai clar sau încă zgomot?",
    "Continuăm firul: aceeași presiune sau s-a schimbat ceva?",
    "Ultimul mesaj avea mult zgomot — unde ești acum?"
  ],

  humanPresence: {
    stress: [
      [
        "Simt suprasolicitarea.",
        "Nu lipsă de motivație — prea multe cercuri deschise.",
        "Azi nu construi sistem nou. Stabilizează unul.",
        "Ce lucru, dacă se aranjează azi, îți scade zgomotul interior?"
      ].join("\n\n")
    ],
    tired: [
      [
        "E oboseală — nu lene.",
        "Nu motivație — somn și apă.",
        "Victorie minimă azi: un bloc, apoi odihnă.",
        "Când ai mâncat și dormit ultima dată decent — onest?"
      ].join("\n\n")
    ],
    lost: [
      [
        "Sună pierdut — nu e prostie.",
        "Prea multe direcții golesc decizia.",
        "Nu rezolva viața azi. Un pas următor e suficient.",
        "Dacă ai rezolva un singur lucru azi — care ar fi?"
      ].join("\n\n")
    ],
    scattered: [
      [
        "Tras în prea multe direcții.",
        "Creierul vrea intensitate. Sistemul vrea stabilitate.",
        "Închide tab-urile extra. O sarcină, douăzeci și cinci de minute.",
        "Ce proiect apasă cel mai tare acum?"
      ].join("\n\n")
    ],
    general: [
      [
        "Sunt aici.",
        "Încetinește — nu trebuie răspuns perfect.",
        "Un pas onest azi e suficient.",
        "Ce contează cel mai mult acum — o propoziție?"
      ].join("\n\n")
    ]
  },

  memoryRefOverload: [
    "Încă porți suprasolicitarea de mai devreme?",
    "Ultima dată era mult zgomot — s-a așezat ceva?"
  ],

  memoryRefGroundedAfterChaos: [
    "Bine. Ieri a fost haos. Azi sună mai ancorat.",
    "Firul era greu — capul e mai clar acum?"
  ],

  memoryRefMission: [
    "Încă pe {mission} — sau ziua a rescris prioritatea?",
    "{mission} era linia — unde ești față de ea?"
  ],

  memoryRefTopic: [
    "Continuăm — aceeași greutate, sau mai ușor?",
    "Firul e încă deschis — merită un pas numit."
  ],

  timePresence: {
    morning: [
      "Protejează prima oră.",
      "Dimineața e pentru direcție — nu arheologie în inbox.",
      "O prioritate înainte să adauge lumea zgomot."
    ],
    midday: [
      "Un bloc închis înainte de input nou.",
      "La prânz: închide o buclă, apoi deschide următoarea.",
      "Momentum bate încă un plan acum."
    ],
    evening: [
      "Sistemul nervos îți amintește tot ce ignori.",
      "Seara e inventar onest — nu alt sprint.",
      "Coborârea nu e renunțare. E întreținere."
    ],
    late_night: [
      "Orele târzii împrumută de mâine.",
      "Nimic strategic nu trebuie rezolvat acum.",
      "Închide o buclă, apoi protejează somnul."
    ]
  },

  companionCheckIns: [
    "⚔ Check-in scurt.\nAzi a devenit mai clar sau mai zgomotos?",
    "Hidratare. Respirație. O linie de status onestă.",
    "Ai mișcat corpul azi sau doar gândurile?",
    "O linie: mai bine, la fel, sau mai greu decât dimineața?"
  ],

  shortActionReplies: [
    "Bine.\nDin corp e mai ușor să reordonezi capul.\nNu aduce performanță — aduce ritm.",
    "Alergare/plimbare — nu predica.\nDouăzeci de minute. Telefonul rămâne întunecat.",
    "Mișcare întâi. Sensul poate aștepta."
  ],

  sarcasmRare: [
    "Creierul rulează acum cu șaptesprezece tab-uri.",
    "Haosul testează din nou în producție.",
    "Ai programat suprasolicitarea și ai apărut la timp."
  ],

  eliteWhispers: [
    "Disciplina e reducerea trădării de sine.",
    "Pierderile de energie distrug mai multe viitoruri decât lipsa talentului.",
    "Standardele sunt ce faci când nimeni nu aplaudă."
  ],

  groundedVoiceAlts: [
    "Sună mai degrabă a supraîncărcare decât lene.",
    "Prea multe lucruri rulează simultan în tine.",
    "Nu pari slab — pari că ai tras fără pauză.",
    "Nu plan nou. Reset nervos mai întâi.",
    "Corpul a semnalat înainte de ego."
  ],

  oneLineBeats: [
    "Azi nu demonstra. Stabilizează.",
    "Cel mai simplu pas acum e cel mai puternic.",
    "Un bloc onest. Apoi stop."
  ],

  threadReturn: {
    generic: [
      "Înapoi.\nCap mai clar sau încă zgomot?",
      "Ai revenit — ce s-a schimbat?"
    ],
    run: [
      "Și?\nMai ușor în cap sau încă zgomotos?",
      "După alergare — corpul a coborât mintea?"
    ],
    workout: [
      "Gata?\nCorpul a tras mintea un pic jos?",
      "Înapoi — mai puternic sau obosit bine?"
    ],
    walk: [
      "Înapoi.\nPlimbarea a cumpărat calm?",
      "Revenit — aer sau încă încurcat?"
    ],
    breath: [
      "Înapoi.\nRespirația mai moale?",
      "Revenit — puțin mai mult spațiu?"
    ],
    trade: [
      "Înapoi.\nDisciplina încă activă?",
      "Pre-sesiune — reguli clare?"
    ]
  }
};
