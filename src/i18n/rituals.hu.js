/** Rövid rituálék — magyar */
module.exports = {
  ground: [
    "Földelés:",
    "Talaj a láb alatt.",
    "Lassú lélegzet.",
    "Nevezz meg 3 dolgot, amit látsz.",
    "Ebből az állapotból nincs nagy döntés.",
    "",
    "Következő: /focus ha kész vagy."
  ].join("\n"),

  breathe: [
    "Légzés:",
    "Belégzés 4, kilégzés 6 — hat kör.",
    "Váll le. Állkapocs laza.",
    "",
    "Következő: /recenter vagy /walk."
  ].join("\n"),

  recenter: [
    "Újraközpontosítás:",
    "Egy valódi prioritás a következő 25 percre.",
    "Egy lap. Egy eredmény.",
    "",
    "Következő: /focus"
  ].join("\n"),

  recovery: [
    "Recovery (rövid):",
    "Víz. Képernyő le 10 perc. Lassú séta, ha megy.",
    "Nincs trade. Nincs életítélet erre az órára.",
    "",
    "Teljes reset: /reset"
  ].join("\n"),

  detach: [
    "Leválasztás:",
    "Lépj egy métert hátra a történettől.",
    "Mi tény, mi félelem?",
    "",
    "Következő: /mirror vagy /pattern"
  ].join("\n"),

  check: [
    "Trade ellenőrzés:",
    "Még mindig érvényes a felállás?",
    "A kockázat még fix és elfogadható?",
    "Nyugodtan is vinnéd?",
    "",
    "Ha nem: /notrade"
  ].join("\n"),

  risk: [
    "Kockázat:",
    "Max veszteség egy mondatban — előbb minden másnál.",
    "Ha nem mondható ki: nincs pozíció.",
    "",
    "Következő: /trade"
  ].join("\n"),

  notrade: [
    "Nincs trade.",
    "Állj félre. Védd a tőkét és a tisztánlátást.",
    "",
    "Cooldown: /cooldown"
  ].join("\n"),

  cooldown: [
    "Cooldown aktív.",
    "Nincs trade. Nincs hajsza. Nincs bosszú.",
    "20 percre lépj el a képernyőtől.",
    "",
    "Csak akkor /check, ha a setup még mindig él."
  ].join("\n"),

  discipline: [
    "Fegyelem:",
    "Egy szabály ma — beállítás után nincs alkudozás.",
    "",
    "Következő: /habit vagy /plan"
  ].join("\n"),

  habit: [
    "Szokás:",
    "Egy apró ismétlés, ugyanabban az időablakban.",
    "",
    "Következő: /today"
  ].join("\n"),

  identity: [
    "Identitás:",
    "Ne azt kérdezd, mi könnyű.",
    "Hanem: mit választana az, akivé válsz?",
    "",
    "Egy tiszta lépés most."
  ].join("\n"),

  pattern: [
    "Minta:",
    "Milyen kör jön vissza új néven?",
    "Nevezd meg egyszer, dráma nélkül.",
    "",
    "Következő: /shadow vagy hangos esetén /reset"
  ].join("\n"),

  shadow: [
    "Árnyék (finoman):",
    "Melyik részedet zártad ki, hogy szeressenek?",
    "Csak észlelj.",
    "",
    "Következő: /mirror"
  ].join("\n"),

  body: [
    "Test gyors ellenőrzés:",
    "Volt víz az utóbbi órában?",
    "Szilárd étel mostanában?",
    "Alvás: nagyjából rendben vagy rövid?",
    "30–60 mp mozgás — lépcső, váll, bármi.",
    "",
    "Ha mehet kint: /walk"
  ].join("\n"),

  walk: [
    "Séta:",
    "10 perc kint.",
    "Telefon inger nélkül.",
    "A test dolgozza fel, amit az elme nem old meg egyből."
  ].join("\n"),

  train: [
    "Edzés:",
    "Szándék egy mondatban.",
    "Bemelegítés először. Állj meg, mielőtt az ego vezet.",
    "",
    "Ha fáradt vagy: /sleep"
  ].join("\n"),

  sleep: [
    "Alvás:",
    "Holnap ugyanaz az ébredés.",
    "Ha lehet: képernyő le 60 perccel lefekvés előtt.",
    "",
    "Egy levezető rituálé csak."
  ].join("\n"),

  clarity: [
    "Tisztánlátás:",
    "Melyik egy döntés egyszerűsítené a többit?",
    "",
    "Írj egy sort. Aztán: /next"
  ].join("\n"),

  question: [
    "Kérdés:",
    "Mit nem mondasz ki, mert akkor nyilvánvaló lenne a következő lépés?",
    "",
    "Válasz egy mondatban."
  ].join("\n"),

  vision: [
    "Látás:",
    "Három év múlva mi számítana taps nélkül is?",
    "",
    "Egy lépés erre a hétre: /today"
  ].join("\n"),

  path: [
    "Út:",
    "Északi csillag egy mondatban.",
    "Következő legkisebb lépés egy sorban.",
    "",
    "Aztán: /next"
  ].join("\n"),

  today: [
    "Ma:",
    "Egy eredmény, ami győzelmet ad ma.",
    "Nem tíz. Egy.",
    "",
    "Rögzítsd: /plan"
  ].join("\n"),

  next: [
    "Következő:",
    "Legkisebb fizikai lépés a következő 25 percben.",
    "Indítás alkudozás nélkül.",
    "",
    "Ha kész: /done"
  ].join("\n"),

  done: [
    "Kész:",
    "Nevezd meg, mit zártál le — akár kicsit is.",
    "Egy lélegzetnyi elismerés, produkció nélkül.",
    "",
    "Aztán: /next vagy /mirror"
  ].join("\n"),

  lockin: [
    "Lock-in:",
    "Egy felület a következő 45 percre.",
    "Telefon lefelé. Egy lap, ha lehet.",
    "Egy látható darab — aztán /done",
    "",
    "Ha ma trade: előbb /check."
  ].join("\n"),

  review: [
    "Mikro-értékelés:",
    "Mi működött az előző blokkban — egy sor?",
    "Mi lopta az időt — egy szó?",
    "Következő blokk kisebb: /focus"
  ].join("\n")
};
