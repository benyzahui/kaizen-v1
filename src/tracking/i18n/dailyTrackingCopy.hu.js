module.exports = {
  morningTitle: "⚔ Reggeli aktiválás",
  morningPrompt: [
    "Energia: 1–10?",
    "Alvás: 1–10?",
    "Mai fő küldetés?",
    "Testi horgony: víz / mozgás / légzés?"
  ].join("\n"),
  morningHint: "Válaszolhatsz egy üzenetben is. Pl.: 7 8 landing víz légzés",
  middayTitle: "☀ Délközi stabilizálás",
  middayPrompt: [
    "Fókusz sodródott? (igen/nem)",
    "Víz megvan?",
    "Mozgás megvan?",
    "Képernyő zaj: alacsony / közepes / magas?",
    "Egy korrekciós lépés most?"
  ].join("\n"),
  middayHint: "Pl.: nem igen igen közepes 10 perc séta",
  eveningTitle: "🌙 Esti elengedés",
  eveningPrompt: [
    "Mi készült el ma?",
    "Hol folyt el az energia?",
    "Mit engedsz el ma éjjel?",
    "Recovery lépés alvás előtt?"
  ].join("\n"),
  eveningHint: "Válaszolhatsz egy sorban, pontosvesszővel elválasztva.",
  statusTitle: "🐉 Mai állapot",
  labels: {
    energy: "Energia",
    discipline: "Fókusz",
    body: "Test",
    focus: "Fókusz",
    recovery: "Recovery",
    mission: "Küldetés",
    next: "Következő lépés"
  },
  energyLabels: {
    unknown: "nincs adat",
    low: "alacsony",
    stable: "stabil",
    high: "magas",
    depleted: "kimerült"
  },
  disciplineLabels: {
    unknown: "nincs adat",
    drifting: "szétszórt",
    focused: "zárolt",
    inconsistent: "ingadozó"
  },
  bodyLabels: {
    ok: "horgonyok rendben",
    hydration_missing: "víz hiányzik",
    movement_missing: "mozgás hiányzik",
    breath_missing: "légzés hiányzik",
    anchors_missing: "testi horgony hiányzik"
  },
  screenLabels: {
    high: "magas képernyő zaj",
    medium: "közepes zaj",
    low: "alacsony zaj",
    unknown: "képernyő nincs jelölve"
  },
  steps: {
    morning_energy: "Energia 1–10?",
    morning_sleep: "Alvás 1–10?",
    morning_mission: "Mai fő küldetés?",
    morning_anchors: "Testi horgony: víz / mozgás / légzés?",
    midday_focus: "Fókusz sodródott? (igen/nem)",
    midday_hydration: "Víz megvan? (igen/nem)",
    midday_movement: "Mozgás megvan? (igen/nem)",
    midday_screen: "Képernyő zaj: alacsony / közepes / magas?",
    midday_correction: "Egy korrekciós lépés most?",
    evening_completed: "Mi készült el ma?",
    evening_leak: "Hol folyt el az energia?",
    evening_release: "Mit engedsz el ma éjjel?",
    evening_recovery: "Recovery lépés alvás előtt?"
  },
  saved: {
    morning: "Reggeli check-in mentve.",
    midday: "Délközi check-in mentve.",
    evening: "Esti check-in mentve.",
    partial: "Mentve. Folytatás:"
  },
  adapt: {
    stabilization: "Stabilizálás: víz, légzés, séta — nincs warrior push.",
    recovery: "Recovery mód: rövid lépések, korai pihenés.",
    discipline: "Fegyelem mód: egy tiszta blokk elég.",
    warrior: "Warrior csak ha test nyugodt — egy irány.",
    movement_first: "10 perc mozgás, aztán döntés.",
    digital_detox: "15 perc képernyő off + egy feladat zár.",
    fasting_hydrate: "Böjt aktív: víz és figyelés, ne erőltetés.",
    evening_recovery: "Képernyő csökkentés + 3 lassú légzés."
  }
};
