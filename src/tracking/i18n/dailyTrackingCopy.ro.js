module.exports = {
  morningTitle: "⚔ Activare dimineață",
  morningPrompt: [
    "Energie: 1–10?",
    "Somn: 1–10?",
    "Misiunea principală azi?",
    "Ancore corporale: apă / mișcare / respirație?"
  ].join("\n"),
  morningHint: "Poți răspunde într-un mesaj. ex: 7 8 landing apă respirație",
  middayTitle: "☀ Stabilizare amiază",
  middayPrompt: [
    "Focusul a derivat? (da/nu)",
    "Hidratare făcută?",
    "Mișcare făcută?",
    "Zgomot ecran: scăzut / mediu / ridicat?",
    "Un pas de corecție acum?"
  ].join("\n"),
  middayHint: "ex: nu da da mediu 10 min mers",
  eveningTitle: "🌙 Eliberare seară",
  eveningPrompt: [
    "Ce s-a terminat azi?",
    "Unde s-a pierdut energia?",
    "Ce lași diseară?",
    "Pas recovery înainte de somn?"
  ].join("\n"),
  eveningHint: "Răspunsuri pe o linie, separate prin punct și virgulă.",
  statusTitle: "🐉 Starea de azi",
  labels: {
    energy: "Energie",
    discipline: "Focus",
    body: "Corp",
    focus: "Focus",
    recovery: "Recovery",
    mission: "Misiune",
    next: "Pas următor"
  },
  energyLabels: {
    unknown: "fără date",
    low: "scăzută",
    stable: "stabilă",
    high: "ridicată",
    depleted: "epuizată"
  },
  disciplineLabels: {
    unknown: "fără date",
    drifting: "dispersat",
    focused: "blocat",
    inconsistent: "inconstant"
  },
  bodyLabels: {
    ok: "ancore ok",
    hydration_missing: "lipsește hidratarea",
    movement_missing: "lipsește mișcarea",
    breath_missing: "lipsește respirația",
    anchors_missing: "ancore corporale lipsă"
  },
  screenLabels: {
    high: "zgomot ecran ridicat",
    medium: "zgomot mediu",
    low: "zgomot scăzut",
    unknown: "ecran neînregistrat"
  },
  steps: {
    morning_energy: "Energie 1–10?",
    morning_sleep: "Somn 1–10?",
    morning_mission: "Misiunea principală azi?",
    morning_anchors: "Ancore: apă / mișcare / respirație?",
    midday_focus: "Focus derivat? (da/nu)",
    midday_hydration: "Hidratare făcută? (da/nu)",
    midday_movement: "Mișcare făcută? (da/nu)",
    midday_screen: "Zgomot ecran: scăzut / mediu / ridicat?",
    midday_correction: "Un pas de corecție acum?",
    evening_completed: "Ce s-a terminat azi?",
    evening_leak: "Unde s-a pierdut energia?",
    evening_release: "Ce lași diseară?",
    evening_recovery: "Pas recovery înainte de somn?"
  },
  saved: {
    morning: "Check-in dimineață salvat.",
    midday: "Check-in amiază salvat.",
    evening: "Check-in seară salvat.",
    partial: "Salvat. Continuă:"
  },
  adapt: {
    stabilization: "Stabilizare: apă, respirație, mers — fără push warrior.",
    recovery: "Mod recovery: pași scurți, odihnă mai devreme.",
    discipline: "Mod disciplină: un bloc curat e suficient.",
    warrior: "Warrior doar dacă corpul e calm — o direcție.",
    movement_first: "10 min mișcare, apoi decizie.",
    digital_detox: "15 min fără ecran + blochează o sarcină.",
    fasting_hydrate: "Post activ: hidratare și observare, fără forțare.",
    evening_recovery: "Reduce ecranele + 3 respirații lente."
  }
};
