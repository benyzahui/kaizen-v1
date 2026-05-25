/** Dragon Blueprint daily program presence — EN */

module.exports = {
  programTag: "🐉 Dragon Blueprint — daily rhythm.",
  programIdentity: [
    "You are inside the system today.",
    "We are not hunting motivation.\nWe build rhythm.",
    "One small step still counts in the program."
  ],
  labels: {
    mantra: "Mantra",
    body: "Body",
    mission: "Mission",
    now: "Now",
    question: "Question",
    todayAction: "Today"
  },
  morning: {
    title: "⚔ Morning activation",
    lines: [
      "Today is part of the program.",
      "You do not need a perfect start.\nOnly a conscious one."
    ],
    bodyAnchor: "water + 5 slow exhales.",
    missionQuestion: "What is the one thing you will carry through today?",
    fallbackMantra: "One direction. Not ten."
  },
  midday: {
    title: "☀ Midday pull-back",
    lines: ["Still in your rhythm,\nor is noise leading now?"],
    fallbackMantra: "Do not leak energy into noise.",
    nowLines: ["water", "posture", "one focus"]
  },
  evening: {
    title: "🌘 Evening release",
    lines: [
      "You do not need to carry the day further.",
      "Recovery is part of the program."
    ],
    fallbackMantra: "Rest is discipline too.",
    releaseQuestion: "What do you release tonight?"
  },
  actions: {
    morning: [
      "drink water now.",
      "5 slow exhales.",
      "choose one task and finish it.",
      "walk 5 minutes.",
      "write one honest line about today."
    ],
    midday: [
      "drink water.",
      "stand and reset posture.",
      "close one open focus loop.",
      "reduce screen noise for 10 minutes.",
      "walk 5 minutes."
    ],
    evening: [
      "reduce screen noise.",
      "5 slow exhales.",
      "stretch for 3 minutes.",
      "write one honest release line.",
      "prepare sleep — dim the light."
    ]
  },
  checkInFooter: {
    morning: "Short reply to save: energy 1–10, sleep, mission, anchors.",
    midday: "Short reply: focus, water, movement, screen, correction.",
    evening: "Short reply: completed, leak, release, recovery."
  }
};
