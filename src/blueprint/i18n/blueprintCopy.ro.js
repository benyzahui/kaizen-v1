/**
 * Dragon Blueprint protocol copy — RO.
 */

const labels = {
  step: "Pas",
  next: "Următor",
  safety: "Notă: aceasta e conștientizare, nu pedeapsă. Începe încet; observă corpul."
};

const stateLines = {
  energy_low: "Stare: energie scăzută.",
  energy_high: "Stare: energie clară, focusată.",
  energy_stable: "Stare: energie stabilă, atentă.",
  energy_exhausted: "Stare: sistem epuizat.",
  energy_overstimulated: "Stare: prea multe bucle deschise.",
  ns_overloaded: "Stare: sistem nervos suprasolicitat.",
  ns_anxious: "Stare: neliniște, dispersie.",
  ns_calm: "Stare: bază calmă.",
  ns_grounded: "Stare: ancorat.",
  disc_drifting: "Stare: focus care derivă.",
  disc_locked: "Stare: o sarcină blocată.",
  disc_inconsistent: "Stare: ritm inconstant."
};

const pillars = {
  energy_awareness: {
    title: "Conștientizare energie",
    icon: "⚡",
    purpose: "Nu motivație — observație: unde se pierde energia.",
    explain: {
      default: "Dragon Blueprint nu grăbește aici. Doar vezi unde curge.",
      low: "Nu e lene. Sistemul e gol — reîncarcă mai întâi.",
      high: "Ai capacitate — nu dispersa; o direcție.",
      overloaded: "Prea multe bucle deschise. Închide un canal."
    },
    actions: {
      beginner: ["Bea un pahar cu apă.", "Ridică-te 60 de secunde.", "5 respirații lente."],
      intermediate: ["10 min mers fără telefon.", "O masă lentă, conștient.", "Jurnal energie: o linie."],
      advanced: ["20 min tăcere — doar observi.", "O decizie: ce nu deschizi azi.", "Scan corp: picioare, burta, umeri."]
    },
    warnings: "Amețeală sau oboseală puternică: odihnă, nu forțare.",
    reset: "Apă + respirație + 15 min fără ecran."
  },
  fasting_reset: {
    title: "Post & reset",
    icon: "🌙",
    purpose: "Spațiu pentru digestie — dacă e confortabil și familiar.",
    explain: {
      default: "Nu post extrem. Reset când corpul cunoaște deja ritmul.",
      low: "La energie scăzută: fereastră scurtă, nu post lung.",
      high: "Dacă ești stabil: fereastră curată, apă, atenție."
    },
    actions: {
      beginner: ["3 ore înainte de ultima masă: doar apă.", "Următoarea masă: simplă, lentă.", "Observă: foame sau obișnuință?"],
      intermediate: ["Fereastră 12–14 h — dacă e deja obișnuit.", "Electroliți / apă.", "Fără gândire punitivă."],
      advanced: ["14–16 h doar dacă ești adaptat.", "Duș rece opțional — dacă e confortabil.", "Dimineață: activare ușoară."]
    },
    warnings: "Amețeală, slăbiciune, durere de cap: mănâncă; nu forța.",
    reset: "Masă normală + mers + somn prioritar."
  },
  movement_training: {
    title: "Mișcare & antrenament",
    icon: "🏃",
    purpose: "Corpul = suport. Mișcarea stabilizează, nu pedepsește.",
    explain: {
      default: "Nu concurs de performanță — întreținere sistem.",
      low: "Fără push warrior. Mișcare ușoară, revenire.",
      high: "Ai combustibil — un bloc focusat e suficient."
    },
    actions: {
      beginner: ["10 min mers sau mobilitate.", "20 genuflexiuni lente dacă e confortabil.", "Stretch umeri + șold."],
      intermediate: ["20–30 min alergare sau mers puternic.", "10 min mobilitate înainte.", "O sesiune — gata."],
      advanced: ["Intervale sau forță — dacă ești recuperat.", "Expunere la frig doar adaptat.", "Odihna contează la fel."]
    },
    warnings: "Durere, amețeală: oprește, hidratează.",
    reset: "Mers + respirație; antrenament mâine."
  },
  nervous_stabilization: {
    title: "Stabilizare",
    icon: "🫀",
    purpose: "Sistem nervos înapoi în corp — nu spirală de gânduri.",
    explain: {
      default: "Nu e lene. Prea multe bucle deschise.",
      overloaded: "Sistemul e prea zgomotos. Tăcere înainte de decizii.",
      anxious: "Corpul mai rapid decât mintea. Încetinește respirația."
    },
    actions: {
      beginner: ["Bea apă.", "Ridică-te.", "5 respirații lente — 4 ieșire, 6 intrare."],
      intermediate: ["10 min mers fără fereastră.", "O cameră, o sarcină.", "Umeri jos, maxilar relaxat."],
      advanced: ["15 min tăcere sau body-scan.", "30 min fără ecran.", "O propoziție: ce lași acum."]
    },
    warnings: "Panică sau anxietate severă: sprijin uman e opțiune.",
    reset: "Repetă: apă, respirație, mers."
  },
  discipline_focus: {
    title: "Disciplină & focus",
    icon: "🎯",
    purpose: "Blochează o sarcină — nu altă listă.",
    explain: {
      default: "Dispersia nu e slăbiciune — prea multe porți.",
      drifting: "Focusul derivă. Punem o singură încuietoare.",
      locked: "Blocat. Nu deschide altă poartă."
    },
    actions: {
      beginner: ["Scrie: o sarcină 60 minute.", "Telefon în altă cameră.", "Pornește timer."],
      intermediate: ["45 min deep work — notificări off.", "Apoi: /focus <sarcină>", "După: 5 min mers."],
      advanced: ["90 min o direcție.", "2 min reset mediu.", "Seară: pregătire detox digital."]
    },
    warnings: "Dacă ești epuizat: /reset mai întâi.",
    reset: "/reset apoi o sarcină scurtă."
  },
  digital_detox: {
    title: "Detox digital",
    icon: "📵",
    purpose: "Ecran = încărcare nervoasă. Redu cu intenție.",
    explain: {
      default: "Nu interdicție — limită.",
      drifting: "Scroll = derivă. O limită acum."
    },
    actions: {
      beginner: ["15 min fără telefon.", "Notificări off 1 oră.", "Închide o aplicație — gata."],
      intermediate: ["60 min mod deep work.", "Seară: ritm ecran după 21:00.", "Carte sau mers în loc."],
      advanced: ["2 h detox seară.", "Dimineață: primele 30 min fără feed.", "Încărcător în altă cameră."]
    },
    warnings: "Muncă/trade necesită ecran: blocuri scurte, pauze.",
    reset: "/reset + 10 min mers."
  },
  morning_activation: {
    title: "Activare dimineață",
    icon: "🌅",
    purpose: "Nu grabă — direcție și trezire corp.",
    explain: {
      default: "Primul protocol: apă, respirație, o direcție.",
      low: "Activare blândă — fără warrior dimineața."
    },
    actions: {
      beginner: ["Apă.", "5 respirații.", "O linie: direcția unică azi?"],
      intermediate: ["10 min mișcare.", "Mic dejun conștient.", "Blochează o sarcină."],
      advanced: ["Apă rece pe față — dacă e confortabil.", "20 min mișcare sau mobilitate.", "Înainte de trade: /trade check."]
    },
    warnings: "Lipsă somn: protocol scurt, nu extrem.",
    reset: "/energy dacă nu ești sigur."
  },
  midday_stabilization: {
    title: "Stabilizare amiază",
    icon: "☀️",
    purpose: "Mijloc de zi — nu lăsa ziua să se dispersaze.",
    explain: {
      default: "La jumătate: respirație, apă, un blocaj.",
      overloaded: "Zgomot la amiază — reset scurt."
    },
    actions: {
      beginner: ["Apă.", "5 min mers.", "Continuă o sarcină — alta nu."],
      intermediate: ["10 min tăcere.", "Masă ușoară dacă trebuie.", "Reîmprospătează /focus."],
      advanced: ["20 min mers fără telefon.", "Check energie: sus/jos?", "Pregătește recovery seară."]
    },
    warnings: "Prăbușire după-amiază: mișcare ușoară, nu cofeină exces.",
    reset: "/reset"
  },
  evening_recovery: {
    title: "Recovery seară",
    icon: "🌙",
    purpose: "Eliberare — nu altă luptă.",
    explain: {
      default: "Închide ziua: corp, nu liste noi.",
      low: "Protocol odihnă timpurie — construiești mâine."
    },
    actions: {
      beginner: ["Reduce ecranele.", "3 respirații lente.", "O linie: ce lași."],
      intermediate: ["10 min mers sau stretch.", "Mâine o direcție — o propoziție.", "Fără revenge trade seara."],
      advanced: ["Meditație 10–20 min — dacă e obișnuit.", "Jurnal 3 linii.", "5 min tăcere completă."]
    },
    warnings: "Nu învârti sistemul nervos înainte de somn.",
    reset: "Apă + respirație + direcție cameră întunecată."
  },
  trading_psychology: {
    title: "Psihologie trading",
    icon: "📊",
    purpose: "Trading = stăpânire sistem nervos. Nu cursă de setup.",
    explain: {
      default: "Dacă corpul nu e calm, chartul minte.",
      overloaded: "Fără trade. Reset mai întâi.",
      anxious: "Trade din panică = pierdere. Oprește."
    },
    actions: {
      beginner: ["5 verificări: calm? plan? fără revenge? obosit? risk fix?", "Dacă nu la vreuna: fără trade.", "/reset"],
      intermediate: ["Setup pe hârtie, nu în cap.", "Risk % scris.", "Stop înainte — nu după."],
      advanced: ["Doar setup A+ când ești calm.", "Limită sesiune respectată.", "După: mers, nu scroll."]
    },
    warnings: "Nu e sfat financiar — protocol de conștientizare.",
    reset: "/reset — fără trade."
  },
  daily_state: {
    title: "Stare zilnică",
    icon: "📋",
    purpose: "Oglindă — energie, sistem nervos, disciplină.",
    explain: {
      default: "Nu judecată — date pentru protocolul de azi."
    },
    actions: {
      beginner: ["Citește liniile de stare.", "Alege o comandă pentru azi.", "Apă acum."],
      intermediate: ["Din stare: dimineață sau reset?", "Blochează o comandă.", "Planifică /evening."],
      advanced: ["Un pas advanced — dacă e confortabil.", "Fără protocoale paralele.", "Mâine /morning."]
    },
    warnings: "Zi proastă ≠ persoană proastă. Protocol reset.",
    reset: "/reset"
  }
};

const tradeBlock = {
  stateNoTrade: "Stare: fără trade — reset mai întâi.",
  stateReady: "Stare: bază calmă — rulează verificări.",
  stateCheck: "Stare: verificare pre-trade.",
  noTrade: "Fără trade acum. Chartul nu e primul — corpul e primul."
};

module.exports = { labels, stateLines, pillars, tradeBlock };
