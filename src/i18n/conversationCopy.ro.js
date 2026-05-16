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
  }
};
