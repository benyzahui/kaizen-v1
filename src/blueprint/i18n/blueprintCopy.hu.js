/**
 * Dragon Blueprint protocol copy — HU.
 */

const labels = {
  step: "Lépés",
  next: "Következő",
  safety: "Figyelem: ez tudatosság, nem büntetés. Kezdd lassan, figyeld a tested."
};

const stateLines = {
  energy_low: "Állapot: alacsony energia.",
  energy_high: "Állapot: tiszta, fókuszált energia.",
  energy_stable: "Állapot: stabil, figyelő energia.",
  energy_exhausted: "Állapot: kimerült rendszer.",
  energy_overstimulated: "Állapot: túl sok ingerek.",
  ns_overloaded: "Állapot: idegrendszer túlterhelt.",
  ns_anxious: "Állapot: nyugtalan, szétszórt.",
  ns_calm: "Állapot: nyugodt alap.",
  ns_grounded: "Állapot: földölt.",
  disc_drifting: "Állapot: fókusz sodródik.",
  disc_locked: "Állapot: egy feladat zárolva.",
  disc_inconsistent: "Állapot: ingadozó ritmus."
};

const pillars = {
  energy_awareness: {
    title: "Energia-tudatosság",
    icon: "⚡",
    purpose: "Nem motiváció — megfigyelés: hol megy el az energia.",
    explain: {
      default: "A Dragon Blueprint itt nem sürget. Csak látni akarod, merre folyik.",
      low: "Ez most nem lustaság. A rendszer üres — előbb feltöltés.",
      high: "Van kapacitás — ne szóródj, egy irány.",
      overloaded: "Túl sok nyitott kör. Előbb zárj egy csatornát."
    },
    actions: {
      beginner: ["Igyál egy pohár vizet.", "Állj fel 60 másodpercre.", "5 lassú légzés."],
      intermediate: ["10 perc séta telefon nélkül.", "Egy étkezés tudatosan, lassan.", "Energia napló: 1 sor."],
      advanced: ["20 perc csend — csak megfigyelés.", "Egy döntés: mit nem nyitsz meg ma.", "Test-scan: láb, has, váll."]
    },
    warnings: "Ha szédülés vagy erős fáradtság: pihenés, nem erőltetés.",
    reset: "Víz + légzés + képernyő 15 perc off."
  },
  fasting_reset: {
    title: "Böjt és reset",
    icon: "🌙",
    purpose: "Tér a emésztőrendszernek — ha kényelmes és szokott.",
    explain: {
      default: "Ez nem extrém böjt. Ez reset, ha a tested már ismeri.",
      low: "Alacsony energiánál: rövid étkezési ablak, ne hosszú böjt.",
      high: "Ha stabil vagy: tiszta ablak, víz, figyelem."
    },
    actions: {
      beginner: ["Utolsó étkezés előtt 3 óra: csak víz.", "Következő étkezés: egyszerű, lassú.", "Figyeld: éhség vagy szokás?"],
      intermediate: ["12–14 óra ablak — ha már szokás.", "Elektrolit / víz.", "Nincs büntető gondolkodás."],
      advanced: ["14–16 óra csak ha adaptált vagy.", "Hideg zuhany opcionális — ha kényelmes.", "Reggel: könnyű aktiválás, nem harc."]
    },
    warnings: "Szédülés, gyengeség, fejfájás: étkezz, ne erőltess.",
    reset: "Normál étkezés + séta + alvás prioritás."
  },
  movement_training: {
    title: "Mozgás és edzés",
    icon: "🏃",
    purpose: "Test = hordozó. Mozgás stabilizál, nem büntet.",
    explain: {
      default: "Nem teljesítményverseny — rendszer karbantartás.",
      low: "Nem warrior push. Könnyű mozgás, visszatérés.",
      high: "Van üzemanyag — egy fókuszált blokk elég."
    },
    actions: {
      beginner: ["10 perc séta vagy mobilitás.", "20 guggolás lassan, ha kényelmes.", "Nyújtás váll + csípő."],
      intermediate: ["20–30 perc futás vagy erős séta.", "Mobilitás 10 perc edzés előtt.", "Egy edzés — kész."],
      advanced: ["Intervall vagy erő blokk — ha regenerált vagy.", "Hideg expozíció csak adaptáltan.", "Pihenés ugyanolyan fontos."]
    },
    warnings: "Fájdalom, szédülés: állj meg, hidratálj.",
    reset: "Séta + légzés, edzés holnap."
  },
  nervous_stabilization: {
    title: "Stabilizálás",
    icon: "🫀",
    purpose: "Idegrendszer vissza a testbe — nem gondolkodás spirál.",
    explain: {
      default: "Ez most nem lustaság. Ez túl sok nyitott kör.",
      overloaded: "A rendszer túl hangos. Előbb csend, nem döntés.",
      anxious: "A test gyorsabb, mint a fej. Lassítsd a légzést."
    },
    actions: {
      beginner: ["Igyál vizet.", "Állj fel.", "5 lassú légzés — 4 mp ki, 6 mp be."],
      intermediate: ["10 perc séta ablak nélkül.", "Egy szoba, egy feladat.", "Váll le, állkapocs lazítás."],
      advanced: ["15 perc csend vagy body-scan.", "Képernyő 30 perc off.", "Egy mondat: mit engedsz el most."]
    },
    warnings: "Pánik vagy extrém szorongás: emberi segítség is opció.",
    reset: "Ismételd: víz, légzés, séta."
  },
  discipline_focus: {
    title: "Fókusz és fegyelem",
    icon: "🎯",
    purpose: "Egy feladat zárolása — nem több lista.",
    explain: {
      default: "A szétszórtság nem gyengeség — túl sok kapu.",
      drifting: "Fókusz sodródik. Egy zárat teszünk.",
      locked: "Zárva. Ne nyiss új kaput."
    },
    actions: {
      beginner: ["Írd le: egy feladat 60 percre.", "Telefon másik szobában.", "Timer indít."],
      intermediate: ["Deep work 45 perc — értesítés off.", "Következő parancs: /focus <feladat>", "Zárás után 5 perc séta."],
      advanced: ["90 perc egy irány.", "Környezet rendezés 2 perc.", "Estére: digitális detox előkészítés."]
    },
    warnings: "Ha kimerült vagy: /reset előbb.",
    reset: "/reset majd egy rövid feladat."
  },
  digital_detox: {
    title: "Digitális detox",
    icon: "📵",
    purpose: "Képernyő = idegrendszer terhelés. Csökkentsd tudatosan.",
    explain: {
      default: "Nem tiltás — határ.",
      drifting: "Görgetés = sodródás. Egy határ most."
    },
    actions: {
      beginner: ["15 perc telefon nélkül.", "Értesítések off 1 órára.", "Egy app bezár — kész."],
      intermediate: ["60 perc deep work mód.", "Estére: képernyő 21:00 után csak ritmus.", "Könyv vagy séta helyette."],
      advanced: ["Esti 2 óra teljes detox.", "Reggel: első 30 perc nincs feed.", "Környezet: töltő másik szobában."]
    },
    warnings: "Munka/trade miatt kell képernyő: rövid blokkok, szünet.",
    reset: "/reset + 10 perc séta."
  },
  morning_activation: {
    title: "Reggeli aktiválás",
    icon: "🌅",
    purpose: "Nem sürgetés — irány és test ébresztés.",
    explain: {
      default: "A nap első protokollja: víz, légzés, egy irány.",
      low: "Lágy aktiválás — nincs warrior reggel."
    },
    actions: {
      beginner: ["Víz.", "5 légzés.", "Egy mondat: mi a mai egy irány?"],
      intermediate: ["10 perc mozgás.", "Reggeli étkezés tudatosan.", "Egy feladat zárolása."],
      advanced: ["Hideg arc/víz — ha kényelmes.", "20 perc mozgás vagy mobilitás.", "Trade előtt: /trade check."]
    },
    warnings: "Alvás hiány: rövid protokoll, ne extrém.",
    reset: "/energy ha bizonytalan."
  },
  midday_stabilization: {
    title: "Délközi stabilizálás",
    icon: "☀️",
    purpose: "Középső pont — ne hagyd szétszórni a napot.",
    explain: {
      default: "Félúton: légzés, víz, egy zár.",
      overloaded: "Délben is túl sok zaj — rövid reset."
    },
    actions: {
      beginner: ["Víz.", "5 perc séta.", "Egy feladat folytatása — másik nem."],
      intermediate: ["10 perc csend.", "Könnyű étkezés ha kell.", "/focus frissítés."],
      advanced: ["20 perc séta telefon nélkül.", "Energia check: magas/alacsony?", "Esti recovery előkészítés gondolat."]
    },
    warnings: "Délutáni összeomlás: könnyű mozgás, ne koffein túl.",
    reset: "/reset"
  },
  evening_recovery: {
    title: "Esti recovery",
    icon: "🌙",
    purpose: "Elengedés — nem még egy harc.",
    explain: {
      default: "A nap lezárása: test, nem több lista.",
      low: "Korai pihenés protokoll — holnap épít."
    },
    actions: {
      beginner: ["Képernyő csökkentés.", "3 lassú légzés.", "Egy sor: mit engedsz el."],
      intermediate: ["10 perc séta vagy nyújtás.", "Holnap egy irány — egy mondat.", "Nincs revenge trade este."],
      advanced: ["Meditáció 10–20 perc — ha szokás.", "Napló 3 sor.", "Csend 5 perc teljes."]
    },
    warnings: "Alvás előtt ne pörgesd az idegrendszert.",
    reset: "Víz + légzés + sötét szoba irány."
  },
  trading_psychology: {
    title: "Trade pszichológia",
    icon: "📊",
    purpose: "Trade = idegrendszer mesterség. Nem setup verseny.",
    explain: {
      default: "Ha a test nem nyugodt, a chart hazudik neked.",
      overloaded: "Nincs trade. Előbb reset.",
      anxious: "Pánik trade = veszteség. Állj."
    },
    actions: {
      beginner: ["5 kérdés: nyugodt? terv? nincs revenge? fáradt? risk fix?", "Ha bármelyik nem: nincs trade.", "/reset"],
      intermediate: ["Setup papíron, nem fejben.", "Risk % írva.", "Stop előre — nem utólag."],
      advanced: ["Csak A+ setup nyugodt állapotban.", "Session limit betartva.", "Után: séta, nem görgetés."]
    },
    warnings: "Ez nem pénzügyi tanács — önismeret protokoll.",
    reset: "/reset — trade nélkül."
  },
  daily_state: {
    title: "Napi állapot",
    icon: "📋",
    purpose: "Tükör — energia, idegrendszer, fegyelem.",
    explain: {
      default: "Nem értékelés — adat a mai protokollhoz."
    },
    actions: {
      beginner: ["Nézd meg az állapot sorokat.", "Válassz egy parancsot ma.", "Víz most."],
      intermediate: ["Állapot alapján: reggel vagy reset?", "Egy parancs zárolása.", "Esti /evening terv."],
      advanced: ["Szinted szerint egy advanced lépés — ha kényelmes.", "Nincs több párhuzamos protokoll.", "Holnap reggel /morning."]
    },
    warnings: "Rossz nap ≠ rossz ember. Reset protokoll.",
    reset: "/reset"
  }
};

const tradeBlock = {
  stateNoTrade: "Állapot: nincs trade — előbb reset.",
  stateReady: "Állapot: nyugodt alap — ellenőrzés kell.",
  stateCheck: "Állapot: trade előtti check.",
  noTrade: "Nincs trade most. A chart nem első — a test az első."
};

module.exports = { labels, stateLines, pillars, tradeBlock };
