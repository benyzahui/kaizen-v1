/** Phase 2 conversation copy — HU */

module.exports = {
  modeBeats: {
    MODE_STABLE: ["Stabil sáv.", "Itt vagyok.", "Ma egyszerűen."],
    MODE_OVERLOADED: ["Túl sok input.", "A test előbb.", "Csökkentsd a mezőt."],
    MODE_FOCUSED: ["Egy tab. Egy sor.", "Vágd a scope-ot.", "Egy blokk."],
    MODE_REFLECTIVE: ["Az igazság megérkezett.", "Tartsd — ne fulladj.", "Egy sor elég."],
    MODE_DISCIPLINE: ["Tudod a lépést.", "Ne alkudozz.", "Öt perc. Hajrá."],
    MODE_RECOVERY: ["Lefelé.", "Nincs mit bizonyítani.", "Víz. Légzés."],
    MODE_TRADING: ["Szabály előbb.", "Nincs sztoritrade.", "Várj tisztánlátásra."]
  },
  modeCloses: {
    MODE_STABLE: ["Maradj a sávban.", "Egy őszinte lépés."],
    MODE_OVERLOADED: ["Tíz csendes perc.", "Aztán egy kis mozdulat."],
    MODE_FOCUSED: ["Huszonöt perc. Egy cél.", "Mozogj."],
    MODE_REFLECTIVE: ["Stabilizálj. Aztán válassz.", "Nincs ítélet."],
    MODE_DISCIPLINE: ["A legkisebb valódi lépés.", "Most."],
    MODE_RECOVERY: ["A pihenés taktikai.", "Zárd a zajt."],
    MODE_TRADING: ["Ha nincs a tervben, kihagyod.", "Egy sor napló."]
  },
  patternAcks: [
    "Megint öt életet akarsz egyszerre megoldani.",
    "Az agyad intenzitást akar. A rendszered stabilitást.",
    "Ugyanaz a kör — más jelmezben.",
    "Teljesítmény mód be. Az őszinte mód jobban működik."
  ],
  loopPhraseAlts: {
    "one fact. one intent": "Egy igaz sor. Aztán cselekvés.",
    "hold. then step": "Mozogj. Egy centit.",
    "stay in the lane": "Tartsd a nap gerincét."
  }
};
