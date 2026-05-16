/** Daily protocol copy — /today /morning /reset /mirror (EN) */

module.exports = {
  protocolTodayTitle: "Today's path (simple):",
  protocolTodaySteps: (missionLine, bodyAnchor) =>
    [
      "1. /morning — open the day",
      "2. /energy — read the day",
      missionLine,
      bodyAnchor,
      "5. /mirror — close clean"
    ].join("\n"),
  protocolTodayMissionSet: (m) => `3. Mission — ${m}`,
  protocolTodayMissionOpen: "3. Mission — set with /mission (one line)",
  protocolTodayBody: (b) => `4. Body anchor — ${b}`,
  protocolTodayFooter: "One lane. No drift negotiation.",

  protocolMorningTitle: "Morning",
  protocolMissionQuestion: "What is today's main mission?",
  protocolMorningFooter: "Lock it: /mission your one line",

  protocolBodyDefault: "water + stand up once",
  protocolBodyByPath: {
    emotional: "three slow breaths before screens",
    physical: "ten minutes movement or mobility",
    spiritual: "two minutes quiet before input",
    trading: "hands off keyboard until plan is written",
    business: "one closed tab before the first block",
    mixed: "water, stand, one minute stillness"
  },

  protocolToneLines: [
    "Tone today: steady — finish one thing before you open another.",
    "Tone today: sharp — protect attention like capital.",
    "Tone today: heavy — shrink the list, keep one honest block.",
    "Tone today: scattered — one anchor, then one task.",
    "Tone today: clear — ship the smallest visible win first."
  ],

  protocolResetVariants: [
    [
      "Pause. Simplify.",
      "",
      "Now: water. Feet on the floor. Five slow breaths.",
      "",
      "Next: /energy — or one line with /mission."
    ].join("\n"),
    [
      "Stop adding input.",
      "",
      "Now: stand up. One room away from the screen for two minutes.",
      "",
      "Next: /today when you are steady."
    ].join("\n"),
    [
      "You do not need a speech — you need less noise.",
      "",
      "Now: unclench jaw. Exhale longer than you inhale, three times.",
      "",
      "Next: /mirror only if the day is done — otherwise /morning tomorrow."
    ].join("\n")
  ],

  protocolMirrorVariants: [
    [
      "Evening mirror:",
      "",
      "• What did you complete? (one line)",
      "• Where did you leak energy? (one word)",
      "• What do you release before sleep? (name it)",
      "• One adjustment for tomorrow (one sentence)",
      "",
      "No trial. Close the day."
    ].join("\n"),
    [
      "Close the loop:",
      "",
      "• Shipped today:",
      "• Energy leak:",
      "• Let go:",
      "• Tomorrow's one tweak:",
      "",
      "Honest. Short. Done."
    ].join("\n"),
    [
      "Evening check:",
      "",
      "1) Completed:",
      "2) Leak:",
      "3) Release:",
      "4) Tomorrow adjustment:",
      "",
      "Then downshift — screen dim, breath slower."
    ].join("\n")
  ]
};
