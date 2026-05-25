/** Dragon Blueprint — daily rhythm pools (HU). */

const mantras = {
  default: [
    "Egy sáv.",
    "A fegyelem tisztánlátást ad.",
    "Védd az első órát.",
    "A lendület mozgásból jön.",
    "Stabilizálj, utána nyomás.",
    "Egy tiszta lépés.",
    "A szerkezet legyőzi a hangulatot."
  ],
  stabilization: ["Először földölj. Aztán mozogj.", "Stabilitás az intenzitás előtt.", "Egy horgony ma."],
  discipline: ["Zárj egy kört.", "Nincs alkudozás a tervvel.", "Futtass egy sort."],
  warrior: ["Az élt edzd.", "Kemény rep, csendes fej.", "Erő zaj nélkül."],
  recovery: ["A pihenés szerkezet.", "A felépülés védi a holnapot.", "Szándékos lefelé."],
  energy: ["Tempó = valós energia.", "Mozogj egyszer, utána skála.", "Energia őszinteségből."],
  trading: ["Szabály az entry előtt.", "Kockázat a jutalom előtt.", "Cooldown az impulzus felett."],
  exhausted: ["Kevesebb scope, több pihenés.", "Üzemanyag a kimenet előtt.", "Állj meg, mielőt hazudsz magadnak."]
};

const openersDefault = [
  "Reggeli aktiválás.",
  "Az első óra szent.",
  "Csendes start. Tiszta sáv.",
  "A nap nyílik — védd.",
  "Zaj előtt: horgony.",
  "Reggeli kapu.",
  "Lassan indulj. Őszintén."
];
const openersExhausted = [
  "Lágy reggel.",
  "Alacsony üzemanyag — alacsony igény.",
  "Csak finom start.",
  "Nincs hősködés hajnalban.",
  "Felépüléses reggel.",
  "Pihenéssel indíts.",
  "Könnyű belépés ma."
];
const openersWarrior = [
  "Harcos reggel.",
  "Az edzés most indul.",
  "Éles belépés.",
  "Fegyelem hajnalban.",
  "Első rep: figyelem.",
  "Harcos reggel — nincs sodródás.",
  "Kemény start, tiszta fej."
];

module.exports = {
  rhythmBlueprint: {
    mantras,
    morning: {
      opener: { default: openersDefault, exhausted: openersExhausted, warrior: openersWarrior, overloaded: openersExhausted },
      energy: {
        default: [
          "Hidratálás stimuláció előtt.",
          "Kalibráld az üzemanyagot — ne a hype-ot.",
          "Energia: őszinte alapvonal.",
          "Víz koffein előtt.",
          "Üzemanyag, aztán tempó.",
          "Kimenet = valós energia.",
          "Steady fuel, steady pace."
        ],
        exhausted: [
          "Üzemanyag és pihenés push előtt.",
          "Minimum igény reggel.",
          "Enni vagy pihenni — aztán egy lépés.",
          "Alacsony energia — alacsony scope.",
          "Felépüléses üzemanyag először.",
          "Nincs hősies deficit.",
          "Finom kalibrálás."
        ],
        warrior: [
          "Üzemanyag munkához, nem drámához.",
          "Hidratálás. Aztán edzés.",
          "Energia végrehajtáshoz.",
          "Erős üzemanyag, éles fej.",
          "Test előkészítés — utána nyomás.",
          "Kész, nem hype.",
          "Erő túlstimuláció nélkül."
        ]
      },
      focus: {
        default: [
          "Egy irány ma.",
          "Egy elsődleges cél.",
          "Egy sáv délig.",
          "Egy blokk szétszórás előtt.",
          "Irány a zaj előtt.",
          "Egy látható ígéret.",
          "Fókusz: egy nyitott kör."
        ],
        exhausted: [
          "Egy kis győzelem.",
          "Legkisebb elég feladat.",
          "Egy finom irány.",
          "Mikro-fókusz ma.",
          "Egy sor, aztán stop.",
          "Apró cél — elég.",
          "Egy horgony feladat."
        ],
        warrior: [
          "Egy kemény cél.",
          "Egy sáv dominanciája.",
          "Csak elsődleges misszió.",
          "Nincs mellékküldetés.",
          "Egy végrehajtási fókusz.",
          "Éles cél — teljes jelenlét.",
          "Egy csata ma."
        ]
      },
      body: {
        default: [
          "Mozgás scroll előtt.",
          "Állj fel, lélegezz, mozogj egyszer.",
          "Test be — fej követ.",
          "Két perc mozgás.",
          "Testtartás reset asztal előtt.",
          "Séta feed előtt.",
          "Fizikai ébresztés először."
        ],
        exhausted: [
          "Finom mozgás csak.",
          "Nyújtás, ne sprint.",
          "Lassú séta vagy légzés.",
          "Test lágy start.",
          "Mobilitás, nem intenzitás.",
          "Könnyű mozgás — elég.",
          "Felépülés terhelés előtt."
        ],
        warrior: [
          "Melegítsd a testet korán.",
          "Mozogj szándékkal.",
          "Fizikai prep munka előtt.",
          "Test edzés — rövid és kemény.",
          "Aktiválás mozgással.",
          "Erős tartás, erős nap.",
          "Test kész — fej következik."
        ]
      },
      discipline: {
        default: [
          "A fegyelem tisztánlátást ad.",
          "Szerkezet hangulat előtt.",
          "Egy szabály: csúnya start is jó.",
          "Futtasd, mielőtt vitatkozol.",
          "Fegyelem = egy látható cselekvés.",
          "Zárj egy kört korán.",
          "Az elszámoltathatóság most indul."
        ],
        warrior: [
          "Nincs alkudozás hajnalban.",
          "A fegyelem nem opcionális.",
          "Kemény standard, csendes hang.",
          "Végrehajtás — nincs történet.",
          "Él konzisztencián.",
          "Egy rep a karakteren.",
          "Standard a komfort előtt."
        ]
      }
    },
    midday: {
      attention: {
        default: [
          "Ne szivárogjon az energia a zajba.",
          "Hol a figyelmed most?",
          "Dél: még a sávon vagy?",
          "Figyelem audit.",
          "A zaj drága.",
          "Védd a nap közepét.",
          "Sodródsz?"
        ],
        warrior: [
          "Déli él ellenőrzés.",
          "Még végrehajtasz?",
          "Nincs sodródás délben.",
          "Tartsd a standardot.",
          "Fókusz vagy reset.",
          "Éles déli pont.",
          "Fegyelem délben."
        ]
      },
      nervous: {
        default: [
          "Lazítsd az állkapcsot.",
          "Lassítsd a légzést.",
          "Engedd a vállat.",
          "Idegrendszer: lefelé.",
          "Kifelé hosszabb, mint befelé.",
          "Lágyítsd az arcot.",
          "Nyugtasd a testet délben."
        ],
        overloaded: [
          "Hosszú kifelé. Most.",
          "Láb a földön. Lassú légzés.",
          "Túlterhelés — csökkentsd a scope-ot.",
          "Egy perc csend.",
          "Nyugodj, mielőtt folytatod.",
          "Nincs új nyomás.",
          "Lélegezz lassabban, mint akarod."
        ]
      },
      bodyCue: {
        default: [
          "Víz. Testtartás. Légzés.",
          "Hidratálás. Állás. Kilélegzés.",
          "Testtartás reset + víz.",
          "Igyál. Gerinc. Lélegezz.",
          "Test jel: víz és légzés.",
          "Állj, igyál, lélegezz.",
          "Fizikai reset — 60 mp."
        ]
      },
      focusFix: {
        default: [
          "Vissza a feladathoz.",
          "Egy sáv.",
          "Vissza az elsődleges munkához.",
          "Zárd a zavaró tabot.",
          "Folytasd a nyitott kört.",
          "Déli korrekció: egy task.",
          "Futtasd a következő sort."
        ],
        warrior: ["Vissza a misszióhoz.", "Nincs melléksáv.", "Végrehajtás — most.", "Tartsd a vonalat.", "Dél: éles visszatérés.", "Egy cél — teljes jelenlét.", "Fegyelem reset."]
      }
    },
    evening: {
      release: {
        default: [
          "Nem kell ma mindent megoldanod.",
          "Engedd el, amit ma nem zársz.",
          "Nyomás le.",
          "A nap zár — nem az értéked.",
          "A befejezetlen várhat.",
          "Este: engedély a stopra.",
          "Nem minden ma estére való."
        ],
        exhausted: ["A megoldás helyett leeresztés.", "A túlterhelés kevesebb inputtal ér véget.", "Csend most.", "Nincs több mentális teher.", "Finom zárás.", "Engedd el a feszültséget.", "Nyugodt close."]
      },
      screen: {
        default: [
          "Csökkentsd a zajt.",
          "Képernyő le — elme le.",
          "Kevesebb stimuláció.",
          "Input csökkentés sötétben.",
          "Kevesebb scroll, több csend.",
          "Digitális naplemente.",
          "Csendesítsd a feedet."
        ]
      },
      reflection: {
        default: [
          "Mi erősített ma?",
          "Egy igazi győzelem mára.",
          "Mi maradt stabil?",
          "Mit ismételnél holnap?",
          "Egy őszinte sor a mai napról.",
          "Mi számított ma?",
          "Nevezz meg egy szilárd pillanatot."
        ]
      },
      recovery: {
        default: [
          "A felépülés védi a holnapot.",
          "Az alvás szerkezet.",
          "A holnap pihent rendszert kér.",
          "Védd az éjszakát.",
          "Pihenés, mielőtt a push visszajön.",
          "Lefelé a hajnalért.",
          "A felépülés is fegyelem."
        ],
        exhausted: ["Alvás prioritás ma éjjel.", "Teljes recovery mód.", "A holnap pihenéssel indul.", "Nincs késői push.", "Az alvás nem alkudozható.", "Gyógyulj ma éjjel.", "Finom éjszakai protocol."]
      }
    },
    late_night: {
      release: { default: ["Késő — nem második sprint.", "Zárd a napot bűntudat nélkül.", "Elég ma éjjelre.", "Stop. Lélegezz. Hamarosan alvás.", "Most semmi több nem kell.", "Késő éjjel: minimum.", "Csendes zárás."] },
      screen: { default: ["Képernyők le.", "Nincs új input.", "Sötét mód az elmének.", "Tedd le a telefont.", "Eszközök csendben.", "Stop scroll.", "Kevesebb fény, kevesebb zaj."] },
      reflection: { default: ["Egy őszinte sor — aztán alvás.", "Mi várhat reggelig?", "Nincs teljes review most.", "Rövid jegyzet, aztán pihenés.", "Tartsd kicsiben a reflexiót.", "A terv holnapra vár.", "Egy mondat, nem napló."] },
      recovery: { default: ["Az alvás most győz a tervezés felett.", "Pihenés a rumináció felett.", "A holnap pihent emberre számít.", "Hamarosan csukd be a szemed.", "A felépülés alvással indul.", "Éjszakai protocol: pihenés.", "Védd a hajnalt alvással."] }
    }
  }
};
