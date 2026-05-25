module.exports = {
  close: {
    morning: "⚔ Morning round closed.",
    midday: "☀ Midday round closed.",
    evening: "🌙 Evening round closed."
  },
  streakLine: (n) => `Streak: ${n} days`,
  reinforce: {
    low: "Repetition builds stability.",
    mid: "4 days of steady rhythm.",
    high: "Momentum is forming."
  },
  recovery: {
    gap: "You do not need to restart everything.\nJust return to the rhythm.",
    broken: "Direction matters more than a perfect run."
  },
  weeklyTitle: "🐉 Weekly summary",
  weeklyLabels: {
    morning: "Morning rhythm",
    midday: "Midday rhythm",
    evening: "Evening rhythm",
    hydration: "Hydration",
    movement: "Movement",
    meditation: "Breath / silence",
    focus: "Focus",
    fasting: "Fasting / reset",
    regeneration: "Recovery",
    strongest: "Strongest area",
    weakest: "Weakest area",
    nextFocus: "Next focus"
  },
  weeklyQual: {
    strong: "strong",
    stable: "stable",
    weak: "weak",
    scattered: "scattered",
    missing: "incomplete",
    unknown: "no data"
  },
  weeklySuggest: {
    stabilization: "stabilization + water + breath",
    lessNoise: "less noise + better sleep",
    movement: "10 min movement daily",
    focusLock: "one locked task per day",
    recovery: "earlier rest, no warrior push"
  },
  titles: {
    initiate: "Initiate",
    builder: "Builder",
    stabilizer: "Stabilizer",
    warrior: "Warrior",
    guardian: "Guardian"
  },
  titleLine: (t) => `Level: ${t}`,
  adaptive: {
    growing: "Rhythm holds. One step is enough today.",
    collapse: "Stabilize first today. Short round.",
    overload: "Reduce pressure. Water, breath, walk."
  }
};
