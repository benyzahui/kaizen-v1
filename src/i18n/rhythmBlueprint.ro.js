/** Dragon Blueprint — daily rhythm pools (RO). */

const mantras = {
  default: [
    "O bandă.",
    "Disciplina creează claritate.",
    "Protejează prima oră.",
    "Momentumul vine din mișcare.",
    "Stabilizează, apoi împinge.",
    "O acțiune curată.",
    "Structura bate starea."
  ],
  stabilization: ["Ancorează-te. Apoi mișcă.", "Stabilitate înainte de intensitate.", "O ancoră azi."],
  discipline: ["Închide un cerc.", "Fără negociere cu planul.", "Execută o linie."],
  warrior: ["Antrenează muchia.", "Rep greu, minte liniștită.", "Forță fără zgomot."],
  recovery: ["Odihna e structură.", "Recuperarea protejează mâine.", "Coborâre intenționată."],
  energy: ["Ritm = energie reală.", "Mișcă-te o dată, apoi scală.", "Energia vine din onestitate."],
  trading: ["Reguli înainte de entry.", "Risc înainte de recompensă.", "Cooldown peste impuls."],
  exhausted: ["Mai puțin scope, mai multă odihnă.", "Combustibil înainte de output.", "Oprește-te înainte să te minți."]
};

const openersDefault = [
  "Activare de dimineață.",
  "Prima oră e sacră.",
  "Start liniștit. Bandă clară.",
  "Ziua se deschide — protejeaz-o.",
  "Înainte de zgomot: ancoră.",
  "Poarta de dimineață.",
  "Începe lent. Sincer."
];
const openersExhausted = [
  "Dimineață blândă.",
  "Combustibil scăzut — cerere mică.",
  "Doar intrare ușoară.",
  "Fără eroism la răsărit.",
  "Dimineață de recuperare.",
  "Începe cu odihna în minte.",
  "Intrare ușoară azi."
];
const openersWarrior = [
  "Dimineață warrior.",
  "Antrenamentul începe acum.",
  "Intrare ascuțită.",
  "Disciplină la răsărit.",
  "Primul rep: atenție.",
  "Dimineață warrior — fără drift.",
  "Start greu, minte curată."
];

module.exports = {
  rhythmBlueprint: {
    mantras,
    morning: {
      opener: { default: openersDefault, exhausted: openersExhausted, warrior: openersWarrior, overloaded: openersExhausted },
      energy: {
        default: [
          "Hidratează înainte de stimulare.",
          "Calibrează combustibilul — nu hype.",
          "Energie: linie de bază onestă.",
          "Apă înainte de cofeină.",
          "Verifică combustibilul, apoi ritmul.",
          "Output = energie reală.",
          "Combustibil stabil, ritm stabil."
        ],
        exhausted: [
          "Combustibil și odihnă înainte de push.",
          "Cerere minimă dimineața.",
          "Mănâncă sau odihnește — apoi un pas.",
          "Energie scăzută — scope mic.",
          "Combustibil de recuperare întâi.",
          "Fără deficit eroic.",
          "Calibrare blândă."
        ],
        warrior: [
          "Combustibil pentru muncă, nu dramă.",
          "Hidratează. Apoi antrenează.",
          "Energie pentru execuție.",
          "Combustibil puternic, minte ascuțită.",
          "Pregătește corpul — apoi împinge.",
          "Pregătit, nu hyped.",
          "Putere fără suprastimulare."
        ]
      },
      focus: {
        default: [
          "O direcție azi.",
          "O țintă principală.",
          "O bandă până la prânz.",
          "Un bloc înainte de scatter.",
          "Direcție înainte de zgomot.",
          "Un angajament vizibil.",
          "Focus: un cerc deschis."
        ],
        exhausted: [
          "O mică victorie.",
          "Cel mai mic task suficient.",
          "O direcție blândă.",
          "Micro-focus azi.",
          "O linie, apoi stop.",
          "Țintă mică — suficient.",
          "Un task ancoră."
        ],
        warrior: [
          "O țintă grea.",
          "Domina o bandă.",
          "Doar misiunea principală.",
          "Fără side quest-uri.",
          "Un focus de execuție.",
          "Țintă ascuțită — prezență totală.",
          "O bătălie azi."
        ]
      },
      body: {
        default: [
          "Mișcare înainte de scroll.",
          "Stai, respiră, mișcă-te o dată.",
          "Corpul pornit — mintea urmează.",
          "Două minute de mișcare.",
          "Reset postură înainte de birou.",
          "Plimbare înainte de feed.",
          "Trezire fizică întâi."
        ],
        exhausted: [
          "Doar mișcare blândă.",
          "Întindere, nu sprint.",
          "Mers lent sau respirație.",
          "Start corp ușor.",
          "Mobilitate, nu intensitate.",
          "Mișcare ușoară — suficient.",
          "Recuperare înainte de sarcină."
        ],
        warrior: [
          "Încălzește corpul devreme.",
          "Mișcă-te cu intenție.",
          "Prep fizic înainte de muncă.",
          "Antrenează corpul — scurt și greu.",
          "Activare prin mișcare.",
          "Postură puternică, zi puternică.",
          "Corp gata — mintea urmează."
        ]
      },
      discipline: {
        default: [
          "Disciplina creează claritate.",
          "Structură înainte de stare.",
          "O regulă: începe urât.",
          "Execută înainte să dezbati.",
          "Disciplina = o acțiune vizibilă.",
          "Închide un cerc devreme.",
          "Responsabilitatea începe acum."
        ],
        warrior: [
          "Fără negociere la răsărit.",
          "Disciplina nu e opțională.",
          "Standard greu, ton liniștit.",
          "Execută — fără poveste.",
          "Muchie prin consistență.",
          "Un rep pe caracter.",
          "Standarde înainte de confort."
        ]
      }
    },
    midday: {
      attention: {
        default: [
          "Nu pierde energia în zgomot.",
          "Unde e atenția acum?",
          "Prânz: încă pe bandă?",
          "Audit de atenție.",
          "Zgomotul e scump.",
          "Protejează mijlocul zilei.",
          "Derapezi?"
        ],
        warrior: [
          "Check muchie la prânz.",
          "Încă execuți?",
          "Fără drift la amiază.",
          "Ține standardul.",
          "Focus sau reset.",
          "Punct ascuțit la prânz.",
          "Disciplină la amiază."
        ]
      },
      nervous: {
        default: [
          "Relaxează maxilarul.",
          "Încetinește respirația.",
          "Desprinde umerii.",
          "Sistem nervos: coborâre.",
          "Expirație mai lungă.",
          "Înmoaie fața.",
          "Calmează corpul la prânz."
        ],
        overloaded: [
          "Expirație lungă. Acum.",
          "Picioare pe podea. Respirație lentă.",
          "Suprasolicitare — reduce scope.",
          "Un minut de liniște.",
          "Calmează-te înainte să continui.",
          "Fără presiune nouă.",
          "Respiră mai lent decât vrei."
        ]
      },
      bodyCue: {
        default: [
          "Apă. Postură. Respirație.",
          "Hidratare. Ridică-te. Expiră.",
          "Reset postură + apă.",
          "Bea. Aliniază coloana. Respiră.",
          "Semnal corp: apă și respirație.",
          "Stai, sorbi, respiră.",
          "Reset fizic — 60 sec."
        ]
      },
      focusFix: {
        default: [
          "Înapoi la task.",
          "O bandă.",
          "Înapoi la munca principală.",
          "Închide tab-ul distractor.",
          "Reia cercul deschis.",
          "Corecție prânz: un task.",
          "Execută linia următoare."
        ],
        warrior: ["Înapoi la misiune.", "Fără benzi laterale.", "Execută — acum.", "Ține linia.", "Prânz: revenire ascuțită.", "O țintă — prezență totală.", "Reset disciplină."]
      }
    },
    evening: {
      release: {
        default: [
          "Nu trebuie să rezolvi totul diseară.",
          "Eliberează ce nu închizi azi.",
          "Presiune jos.",
          "Ziua se închide — nu valoarea ta.",
          "Nefinisitul poate aștepta.",
          "Seară: permisiune de stop.",
          "Nu totul e pentru diseară."
        ],
        exhausted: ["Stop rezolvare. Start așezare.", "Suprasolicitarea se termină cu mai puțin input.", "Liniște acum.", "Fără sarcină mentală.", "Închidere blândă.", "Eliberează tensiunea.", "Close calm."]
      },
      screen: {
        default: [
          "Reduce zgomotul.",
          "Ecrane jos — minte jos.",
          "Mai puțină stimulare.",
          "Input redus după întuneric.",
          "Mai puțin scroll, mai multă liniște.",
          "Apus digital.",
          "Liniștește feedul."
        ]
      },
      reflection: {
        default: [
          "Ce te-a întărit azi?",
          "O victorie adevărată azi.",
          "Ce a rămas stabil?",
          "Ce ai repeta mâine?",
          "O linie onestă despre azi.",
          "Ce a contat azi?",
          "Numește un moment solid."
        ]
      },
      recovery: {
        default: [
          "Recuperarea protejează mâine.",
          "Somnul e structură.",
          "Mâine are nevoie de sistem odihnit.",
          "Protejează noaptea.",
          "Odihnă înainte să revină push-ul.",
          "Coborâre pentru răsărit.",
          "Recuperarea e disciplină."
        ],
        exhausted: ["Prioritizează somnul diseară.", "Mod recuperare complet.", "Mâine începe cu odihnă.", "Fără push târziu.", "Somnul nu se negociază.", "Vindecă diseară.", "Protocol blând de noapte."]
      }
    },
    late_night: {
      release: { default: ["Târziu — nu al doilea sprint.", "Închide ziua fără vinovăție.", "Destul pentru diseară.", "Stop. Respiră. Somn curând.", "Nimic mai mult acum.", "Noapte târzie: minimum.", "Închidere liniștită."] },
      screen: { default: ["Ecrane off.", "Fără input nou.", "Mod întunecat pentru minte.", "Pune telefonul jos.", "Dispozitive tăcute.", "Stop scroll.", "Mai puțină lumină, mai puțin zgomot."] },
      reflection: { default: ["O linie onestă — apoi somn.", "Ce poate aștepta dimineața?", "Fără review complet acum.", "Notă scurtă, apoi odihnă.", "Ține reflexia mică.", "Planul e pentru mâine.", "O propoziție, nu jurnal."] },
      recovery: { default: ["Somnul bate planificarea.", "Odihnă peste ruminație.", "Mâine are nevoie de tine odihnit.", "Închide ochii curând.", "Recuperarea începe cu somn.", "Protocol noapte: odihnă.", "Protejează răsăritul cu somn."] }
    }
  }
};
