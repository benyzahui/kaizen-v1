module.exports = {
  morningTitle: "⚔ Morning activation",
  morningPrompt: [
    "Energy: 1–10?",
    "Sleep: 1–10?",
    "Main mission today?",
    "Body anchors: water / movement / breath?"
  ].join("\n"),
  morningHint: "You can answer in one message. e.g. 7 8 landing water breath",
  middayTitle: "☀ Midday stabilization",
  middayPrompt: [
    "Did focus drift? (yes/no)",
    "Hydration done?",
    "Movement done?",
    "Screen noise: low / medium / high?",
    "One correction step now?"
  ].join("\n"),
  middayHint: "e.g. no yes yes medium 10 min walk",
  eveningTitle: "🌙 Evening release",
  eveningPrompt: [
    "What was completed today?",
    "Where did energy leak?",
    "What do you release tonight?",
    "Recovery action before sleep?"
  ].join("\n"),
  eveningHint: "One line per answer, separated by semicolons.",
  statusTitle: "🐉 Today's state",
  labels: {
    energy: "Energy",
    discipline: "Focus",
    body: "Body",
    focus: "Focus",
    recovery: "Recovery",
    mission: "Mission",
    next: "Next step"
  },
  energyLabels: {
    unknown: "no data",
    low: "low",
    stable: "stable",
    high: "high",
    depleted: "depleted"
  },
  disciplineLabels: {
    unknown: "no data",
    drifting: "scattered",
    focused: "locked",
    inconsistent: "uneven"
  },
  bodyLabels: {
    ok: "anchors on track",
    hydration_missing: "hydration missing",
    movement_missing: "movement missing",
    breath_missing: "breath missing",
    anchors_missing: "body anchors missing"
  },
  screenLabels: {
    high: "high screen noise",
    medium: "medium noise",
    low: "low noise",
    unknown: "screen not logged"
  },
  steps: {
    morning_energy: "Energy 1–10?",
    morning_sleep: "Sleep 1–10?",
    morning_mission: "Main mission today?",
    morning_anchors: "Body anchors: water / movement / breath?",
    midday_focus: "Did focus drift? (yes/no)",
    midday_hydration: "Hydration done? (yes/no)",
    midday_movement: "Movement done? (yes/no)",
    midday_screen: "Screen noise: low / medium / high?",
    midday_correction: "One correction step now?",
    evening_completed: "What was completed today?",
    evening_leak: "Where did energy leak?",
    evening_release: "What do you release tonight?",
    evening_recovery: "Recovery action before sleep?"
  },
  saved: {
    morning: "Morning check-in saved.",
    midday: "Midday check-in saved.",
    evening: "Evening check-in saved.",
    partial: "Saved. Continue:"
  },
  adapt: {
    stabilization: "Stabilization: water, breath, walk — no warrior push.",
    recovery: "Recovery mode: short steps, earlier rest.",
    discipline: "Discipline mode: one clean block is enough.",
    warrior: "Warrior only if body is calm — one direction.",
    movement_first: "10 min movement, then decide.",
    digital_detox: "15 min screen off + lock one task.",
    fasting_hydrate: "Fasting active: hydrate and observe, do not force.",
    evening_recovery: "Reduce screens + 3 slow breaths."
  }
};
